// React
import { useState, useEffect, useRef, useCallback } from 'react'

// Form関連コンポーネント
import { useForm, useFieldArray } from 'react-hook-form'

import toast from 'react-hot-toast'

import { SelectChangeEvent } from '@mui/material/Select'

import { productGet } from '../../../Util/util'

import { defaultDataFormat, defaultRowData, InsertDataFormat } from './logic'

import { FormValues, SelectOption, productType, VendorGet, UseLogicReturn } from './types'

import dayjs, { Dayjs } from 'dayjs'
dayjs.locale('ja')

const placeholderStyle = {
  '&::placeholder': {
    fontSize: '14px',
    opacity: 1,
    color: 'gray'
  }
}

const textFieldStyle = {
  backgroundColor: 'white',
  borderRadius: '4px',
  marginRight: '8px',
  height: '36px'
}

export const useLogic = (): UseLogicReturn => {
  const [VendorList, setVendorList] = useState<SelectOption[]>([])
  const [dateValue, setDateValue] = useState<Dayjs | null>(null)
  const validateMsg = useRef<string>('')
  const [DialogOpen, setDialogOpen] = useState(false)
  const insertDateRef = useRef('')

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      rows: defaultDataFormat()
    }
  })

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: 'rows'
  })

  const RegisterData = async (data: productType): Promise<void> => {
    const code = data.code
    const Values = getValues('rows')
    const index = Values.findLastIndex((item) => item.code !== '') + 1
    const result = await (await productGet(code, true)).productData
    const vendordata = {
      value: result.vendor,
      label: result.vendor,
      id: result.vendorid
    }
    setValue(`rows.${index}.code`, String(code))
    setValue(`rows.${index}.vendor`, vendordata)
    setValue(`rows.${index}.name`, result.name)
    setValue(`rows.${index}.price`, result.newPrice)
  }

  const onSubmit = (): void => {
    const filtered = getValues('rows').filter((item) => item.code !== '')
    if (filtered.length == 0) {
      toast.error('入庫するデータがありません')
      return
    }
    setDialogOpen(true)
  }

  const search = useCallback(
    async (index: number): Promise<void> => {
      const code = getValues('rows')[index].code
      const result = await productGet(code)
      if (result.productData) {
        const vendordata = {
          value: result.productData.vendor,
          label: result.productData.vendor,
          id: result.productData.vendorid
        }
        const name = result.productData.name
        const Price = result.productData.newPrice
        setValue(`rows.${index}.vendor`, vendordata)
        setValue(`rows.${index}.name`, name)
        setValue(`rows.${index}.price`, Price)
      }
    },
    [getValues, setValue]
  )

  const isHalfWidth = (value: string): boolean => /^[\x20-\x7E]*$/.test(value)

  const isHalfWidthNum = (value: string): boolean => /^[0-9]*$/.test(value)

  const validateCheck = (
    index: number,
    keyName: keyof FormValues['rows'][number],
    errormsg: string
  ): boolean => {
    let columnName = ''
    if (keyName == 'code') {
      columnName = '商品コード'
    } else if (keyName == 'quantity') {
      columnName = '数量'
    } else if (keyName == 'price') {
      columnName = '単価'
    } else {
      columnName = ''
    }
    const value = getValues('rows')[index][keyName]
    const errorstring = `${index + 1}行目 ${columnName} ${errormsg}`
    if (
      (keyName === 'code' || keyName === 'quantity' || keyName === 'price') &&
      typeof value === 'string' &&
      value !== '' &&
      !isNaN(Number(value))
    ) {
      const result = isHalfWidthNum(value)
      if (!result) {
        if (validateMsg.current == '') {
          validateMsg.current = errorstring
        } else {
          validateMsg.current = `${validateMsg.current}\n${errorstring}`
        }
        return false
      } else {
        return true
      }
    } else {
      const result = isHalfWidth(String(value))
      if (!result) {
        if (validateMsg.current == '') {
          validateMsg.current = errorstring
        } else {
          validateMsg.current = `${validateMsg.current}\n${errorstring}`
        }
        return false
      } else {
        return true
      }
    }
  }

  const VendorListGet = async (): Promise<void> => {
    const list = await window.myInventoryAPI.VendorData()
    const filtered = list.filter((item: VendorGet) => item[0] !== '')
    const result = filtered.map((item: VendorGet) => {
      const data = {
        value: item[1],
        label: item[1],
        id: item[0]
      }
      return data
    })
    setVendorList(result)
  }

  const defaultDate = (): void => {
    const value = new Date()
    const NewDate = value.toLocaleDateString()
    setDateValue(dayjs(value))
    insertDateRef.current = NewDate
  }

  const FirstSet = async (): Promise<void> => {
    VendorListGet()
    defaultDate()
  }

  const AddNewForm = (num: number): void => {
    for (let i = 0; i < num; i++) {
      append(defaultRowData)
    }
  }

  const handleEnterFocusNext = useCallback(
    (e: React.KeyboardEvent<HTMLElement>): void => {
      const maxRows = getValues().rows.length
      if (e.key === 'Enter') {
        e.preventDefault()
        const form = (
          e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement
        ).form
        if (form) {
          const elements = Array.from(form.elements) as HTMLElement[]
          const index = elements.indexOf(e.target as HTMLElement)
          const before = elements[index] as HTMLElement
          let next = elements[index + 2] as HTMLElement
          let nextType = next.tagName
          let count = 3
          while (nextType == 'BUTTON' || nextType == 'FIELDSET') {
            next = elements[index + count] as HTMLElement
            nextType = next.tagName
            count++
          }
          if ((before as HTMLInputElement).name == `rows.${maxRows - 1}.remarks`) {
            AddNewForm(20)
            return
          }
          next.focus()
        }
      }
    },
    [AddNewForm, getValues]
  )

  const RowRemove = useCallback(
    async (index: number): Promise<void> => {
      remove(index)
      append(defaultRowData, { shouldFocus: true })
    },
    [remove, append]
  )

  const InsertRow = (index: number): void => {
    insert(index, defaultRowData)
  }

  const insertPost = async (): Promise<void> => {
    const filtered = getValues('rows').filter((item) => item.code !== '')
    const formatData = InsertDataFormat(filtered, insertDateRef.current)
    if (formatData.length >= 1) {
      await window.myInventoryAPI.DataInsert({
        sheetName: '本部入庫',
        action: 'insert',
        sub_action: 'insert',
        data: formatData,
        formulaConfig: {
          targetCol: 7,
          formula: '=RC[-2]*RC[-1]'
        }
      })
    }
    reset({
      rows: defaultDataFormat()
    })
  }

  const handleDateChange = (date: Dayjs | null): void => {
    const value = date ? date.toDate() : new Date()
    const NewDate = value.toLocaleDateString()
    setDateValue(dayjs(date))
    insertDateRef.current = NewDate
  }

  const handleSelectChange = (e: SelectChangeEvent, index: number): void => {
    const selectedVendor = e.target.value as string
    const vendordata = VendorList.find((vendor) => vendor.value === selectedVendor) || null
    setValue(`rows.${index}.vendor`, vendordata)
  }

  useEffect(() => {
    FirstSet()
  }, [])

  return {
    control,
    RegisterData,
    errors,
    fields,
    register,
    handleSubmit,
    getValues,
    dateValue,
    onSubmit,
    handleEnterFocusNext,
    search,
    validateCheck,
    placeholderStyle,
    textFieldStyle,
    VendorList,
    RowRemove,
    InsertRow,
    AddNewForm,
    DialogOpen,
    setDialogOpen,
    insertPost,
    handleDateChange,
    handleSelectChange
  }
}
