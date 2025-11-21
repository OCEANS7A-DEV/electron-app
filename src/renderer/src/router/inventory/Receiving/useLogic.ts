// React
import { useState, useEffect, useRef } from 'react'

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
    setValue(`rows.${index}.code`, String(code))
    setValue(`rows.${index}.vendor`, result.vendordata)
    setValue(`rows.${index}.name`, result.name)
    setValue(`rows.${index}.price`, result.newPrice)
  }

  const handleEnterFocusNext = (e: React.KeyboardEvent<HTMLElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const form = (
        e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement
      ).form
      if (form) {
        const elements = Array.from(form.elements) as HTMLElement[]
        const index = elements.indexOf(e.target as HTMLElement)
        let focused = false
        for (let i = index + 1; i < elements.length; i++) {
          const next = elements[i] as HTMLElement
          if (
            next &&
            typeof next.focus === 'function' &&
            !next.hasAttribute('disabled') &&
            next.getAttribute('tabindex') !== '-1' &&
            (next instanceof HTMLInputElement ||
              next instanceof HTMLSelectElement ||
              next instanceof HTMLTextAreaElement ||
              next instanceof HTMLButtonElement) &&
            next.type !== 'button'
          ) {
            next.focus()
            const headerHeight = 80
            const footerHeight = 60
            const buffer = 20
            const rect = next.getBoundingClientRect()
            const isOutOfViewTop = rect.top < headerHeight + buffer
            const isOutOfViewBottom = rect.bottom > window.innerHeight - footerHeight - buffer

            if (isOutOfViewTop || isOutOfViewBottom) {
              window.scrollBy({
                top: rect.top - headerHeight - buffer,
                behavior: 'smooth'
              })
            }
            focused = true
            break
          }
        }
        if (!focused) {
          AddNewForm(20)
        }
      }
    }
  }

  const onSubmit = (): void => {
    const filtered = getValues('rows').filter((item) => item.code !== '')
    if (filtered.length == 0) {
      toast.error('入庫するデータがありません')
      return
    }
    setDialogOpen(true)
  }

  const search = async (index: number): Promise<void> => {
    const values = getValues()
    const code = values.rows[index].code
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
  }

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

  const RowRemove = async (index: number): Promise<void> => {
    remove(index)
    AddNewForm(1)
  }

  const InsertRow = (index: number): void => {
    insert(index, defaultRowData)
  }

  const AddNewForm = (num: number): void => {
    for (let i = 0; i < num; i++) {
      append(defaultRowData)
    }
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
