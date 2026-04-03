// React
import { useState, useEffect, useRef, useCallback } from 'react'

// Form関連コンポーネント
import { useForm, SubmitHandler, useFieldArray, useWatch, Control } from 'react-hook-form'

import toast from 'react-hot-toast'

import { SelectChangeEvent } from '@mui/material/Select'

import dayjs, { Dayjs } from 'dayjs'
dayjs.locale('ja')

import { productGet, getNearestMonday } from '../../../Util/util'

import {
  defaultRowData,
  defaultDataFormat,
  storesGet,
  insertDataFormat,
  MissingItemsDataGet
} from './logic'

import { FormValues, productType, SelectOption, OrderGetTypes, UseLogicReturn } from './types'

export const useLogic = (): UseLogicReturn => {
  const [storeSelect, setStoreSelect] = useState('')
  const [storeOptions, setStoreOptions] = useState<SelectOption[]>([])
  const [dateValue, setDateValue] = useState<Dayjs | null>(null)
  const [DialogOpen, setDialogOpen] = useState(false)
  const typeRef = useRef('')
  const insertDateRef = useRef('')
  const DeleteRowNumRef = useRef(0)
  const BeforeDataRef = useRef<OrderGetTypes[]>([])
  const InsertActionRef = useRef('')

  const { control, register, handleSubmit, getValues, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      rows: defaultDataFormat()
    }
  })

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: 'rows'
  })

  const storeSet = async (): Promise<void> => {
    const store: SelectOption[] = await storesGet()
    setStoreOptions(store)
  }

  const DateSet = async (): Promise<void> => {
    const date = getNearestMonday(new Date())
    setDateValue(dayjs(date))
    insertDateRef.current = new Date(date).toLocaleDateString()
  }

  const firstSet = async (): Promise<void> => {
    storeSet()
    DateSet()
  }

  const orderDataGetSelect = async (): Promise<OrderGetTypes[] | void> => {
    const InsertDate = insertDateRef.current
    if (InsertDate == '' || storeSelect == '') return
    const ordersGet = await window.myInventoryAPI.ListGet({
      sheetName: '店舗注文履歴',
      sheetID: '1UK3huzFfa3lQnhqWylJU65IeF8z-L39zgj3bSKDMALI',
      action: 'DataGet'
    })

    
    const MissingData = await MissingItemsDataGet(InsertDate, storeSelect, ordersGet)

    const targetDateStr = new Date(InsertDate).toDateString()
    const filtered = ordersGet.filter(
      (item: OrderGetTypes) =>
        new Date(item[0]).toDateString() == targetDateStr &&
        item[1] == storeSelect &&
        item[12] !== '前回欠品分'
    )
    let count = 0
    MissingData.forEach(async (item) => {
      const MissingNum = item[8]
      const result = await productGet(item[3], true)
      const detail = { value: item[5], label: item[5] }
      setValue(`rows.${count}.vendor`, item[2])
      setValue(`rows.${count}.code`, String(item[3]))
      setValue(`rows.${count}.detailList`, result.detailsData)
      setValue(`rows.${count}.detail`, detail)
      setValue(`rows.${count}.name`, item[4])
      setValue(`rows.${count}.quantity`, String(MissingNum))
      setValue(`rows.${count}.person`, item[11])
      setValue(`rows.${count}.price`, String(item[9]))
      setValue(`rows.${count}.remarks`, '前回欠品分')
      count++
    })

    
    const UpDataRowNum = filtered.length + MissingData.length
    if (filtered.length > 0) {
      if (filtered[0][12] == '注文無') {
        return filtered
      }
      if (UpDataRowNum > 20) {
        const diffcount = Math.ceil(UpDataRowNum / 20) - 1
        for (let i = 0; i < diffcount; i++) {
          await addNewForm()
        }
      }
      filtered.forEach(async (item: OrderGetTypes) => {
        const result = await productGet(item[3], true)
        setValue(`rows.${count}.vendor`, item[2])
        setValue(`rows.${count}.code`, String(item[3]))
        setValue(`rows.${count}.detailList`, result.detailsData)
        const detail = { value: item[5], label: item[5] }
        setValue(`rows.${count}.detail`, detail)
        setValue(`rows.${count}.name`, item[4])
        setValue(`rows.${count}.quantity`, String(item[6]))
        setValue(`rows.${count}.person`, item[11])
        setValue(`rows.${count}.price`, String(item[9]))
        setValue(`rows.${count}.remarks`, item[12])
        count++
      })
    }
    const data = ordersGet.filter(
      (item: OrderGetTypes) =>
        new Date(item[0]).toLocaleDateString() == InsertDate && item[1] == storeSelect
    )

    DeleteRowNumRef.current = data.length

    BeforeDataRef.current = filtered
    return filtered
  }

  const addNewForm = (): void => {
    const newRows = Array.from({ length: 20 }, () => ({ ...defaultRowData }))
    append(newRows, { shouldFocus: false })
  }

  const orderedData = (): void => {
    reset({
      rows: defaultDataFormat()
    })
    if (storeSelect == '') return
    toast.promise(orderDataGetSelect(), {
      loading: '注文データ読み込み中…',
      success: (data) => {
        const InsertDate = insertDateRef.current
        if (!data) {
          return '日付または店舗を指定していません'
        }
        if (data.length == 0) {
          InsertActionRef.current = 'append'
          return `${InsertDate}の${storeSelect}店は注文されていません`
        } else if (data.length == 1 && data[0][12]) {
          InsertActionRef.current = 'append'
          return `${InsertDate}の${storeSelect}店は注文無し`
        } else {
          InsertActionRef.current = 'update'
          return `${InsertDate}の${storeSelect}店の注文数${data.length}`
        }
      },
      error: () => {
        InsertActionRef.current = 'append'
        return `エラーが発生しました`
      }
    })
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
          if ((before as HTMLInputElement).name == `rows.${maxRows - 1}.remarks`) {
            addNewForm()
            return
          }
          let next = elements[index + 2] as HTMLElement
          let nextType = next.tagName
          let count = 3
          while (nextType == 'BUTTON' || nextType == 'FIELDSET') {
            next = elements[index + count] as HTMLElement
            nextType = next.tagName
            count++
          }
          next.focus()
        }
      }
    },
    [getValues, addNewForm]
  )

  const RegisterData = async (data: productType): Promise<void> => {
    const code = data.code
    const Values = getValues('rows')
    const index = Values.findLastIndex((item) => item.code !== '') + 1
    const result = await productGet(code, true)
    if (result) {
      const product = result.productData
      const detail = result.detailsData
      setValue(`rows.${index}.vendor`, product.vendor)
      setValue(`rows.${index}.name`, product.name)
      setValue(`rows.${index}.code`, String(code))
      setValue(`rows.${index}.detailList`, detail)
      if (typeRef.current !== 'VC') {
        setValue(`rows.${index}.price`, product.newPrice)
      } else {
        setValue(`rows.${index}.price`, product.VC)
      }
    }
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (storeSelect === '' || data.rows.length == 0) {
      return
    }
    setDialogOpen(true)
  }

  const insertPost = (): void => {
    const DataSubmit = async (): Promise<void> => {
      const data = getValues('rows')
      const insertData = await insertDataFormat(data, insertDateRef.current, storeSelect)
      const InsertDatas = {
        sheetName: '店舗注文履歴',
        action: 'Orderinsert',
        sub_action: 'insert',
        insert_action: InsertActionRef.current,
        data: insertData,
        formulaConfig: {
          targetCol: 11,
          formula: '=(RC[-4] - RC[-2])*RC[-1]'
        },
        deleteNum: DeleteRowNumRef.current
      }

      if (insertData.length >= 1) {
        await window.myInventoryAPI.DataInsert(InsertDatas)
        DeleteRowNumRef.current = insertData.length
        InsertActionRef.current = 'update'
      }
    }
    toast.promise(DataSubmit(), {
      loading: 'データ送信中...',
      success: 'データ送信完了',
      error: 'データ送信失敗'
    })
  }

  const handleStoreChange = (event: SelectChangeEvent): void => {
    const select = event.target.value as string
    setStoreSelect(select)
    const type = storeOptions.find((item) => item.value == select)?.type ?? ''
    console.log(type)
    typeRef.current = type
  }

  const handleDateChange = (date: Dayjs | null): void => {
    const value = date ? date.toDate() : new Date()
    const NewDate = value.toLocaleDateString()
    setDateValue(dayjs(date))
    insertDateRef.current = NewDate
  }

  const productCodeSearch = async (index: number): Promise<void> => {
    let code = getValues('rows')[index].code
    if (code == '' && index == 0) {
      return
    }
    if (code == '' && index !== 0) {
      code = getValues('rows')[index - 1].code
      setValue(`rows.${index}.code`, code)
    }
    const result = await productGet(code, true)
    console.log(result)
    if (result) {
      const product = result.productData
      const detail = result.detailsData
      setValue(`rows.${index}.vendor`, product.vendor)
      setValue(`rows.${index}.name`, product.name)
      setValue(`rows.${index}.detailList`, detail)
      if (typeRef.current !== 'VC') {
        setValue(`rows.${index}.price`, product.newPrice)
      } else {
        setValue(`rows.${index}.price`, product.VC)
      }
    }
  }

  const deleteRow = (index: number): void => {
    remove(index)
    append(defaultRowData, { shouldFocus: false })
  }

  const insertRow = (index: number): void => {
    insert(index, defaultRowData, { shouldFocus: false })
  }

  useEffect(() => {
    firstSet()
  }, [])

  useEffect(() => {
    orderedData()
  }, [storeSelect, insertDateRef.current])

  return {
    RegisterData,
    fields,
    register,
    onSubmit,
    handleSubmit,
    control,
    storeSelect,
    storeOptions,
    handleStoreChange,
    dateValue,
    handleDateChange,
    handleEnterFocusNext,
    productCodeSearch,
    deleteRow,
    insertRow,
    addNewForm,

    getValues,
    insertDateRef,
    DialogOpen,
    setDialogOpen,
    insertPost
  }
}

export const useDetailSelectBox = (
  control: Control<FormValues>,
  index: number
): {
  options: { value: string; label: string }[]
} => {
  const code = useWatch({
    control,
    name: `rows.${index}.code`
  })

  const [options, setOptions] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (!code) {
        setOptions([])
        return
      }

      try {
        const result = await productGet(code, true)
        if (result && result.detailsData) {
          setOptions(result.detailsData)
        } else {
          setOptions([])
        }
      } catch {
        setOptions([])
      }
    }

    fetchData()
  }, [code])

  return {
    options
  }
}
