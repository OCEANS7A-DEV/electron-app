// React
import { useState, useEffect, useRef } from 'react'

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
      sheetName: '店舗へ',
      action: 'InputDataGet',
      ranges: 'A2:M'
    })
    const MissingData = await MissingItemsDataGet(InsertDate, storeSelect, ordersGet)
    let count = 0
    MissingData.forEach(async (item) => {
      const OutStockStr = item[11].split('、')
      const OutStocktargetData = OutStockStr.find(
        (item: string) =>
          (item.includes('欠品') && !item.includes('前回欠品分')) || item.includes('前回欠品分欠品')
      )
      const OutStockNum = String(OutStocktargetData).replace(/[^0-9]/g, '')
      const result = await productGet(item[3], true)
      const detail = { value: item[5], label: item[5] }
      setValue(`rows.${count}.vendor`, item[2])
      setValue(`rows.${count}.code`, String(item[3]))
      setValue(`rows.${count}.detailList`, result.detailsData)
      setValue(`rows.${count}.detail`, detail)
      setValue(`rows.${count}.name`, item[4])
      setValue(`rows.${count}.quantity`, OutStockNum)
      setValue(`rows.${count}.person`, item[10])
      setValue(`rows.${count}.price`, String(item[8]))
      setValue(`rows.${count}.remarks`, '前回欠品分')
      count++
    })

    const targetDateStr = new Date(InsertDate).toDateString()
    const filtered = ordersGet.filter(
      (item: OrderGetTypes) =>
        new Date(item[0]).toDateString() == targetDateStr &&
        item[1] == storeSelect &&
        item[11] !== '前回欠品分'
    )
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
        setValue(`rows.${count}.person`, item[10])
        setValue(`rows.${count}.price`, String(item[8]))
        setValue(`rows.${count}.remarks`, item[11])
        count++
      })
    }
    DeleteRowNumRef.current = getValues().rows.filter((item) => item.name !== '').length
    BeforeDataRef.current = filtered
    return filtered
  }

  const addNewForm = (): void => {
    for (let i = 0; i < 20; i++) {
      append(defaultRowData, { shouldFocus: false })
    }
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
          addNewForm()
        }
      }
    }
  }

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
      if (insertData.length >= 1) {
        await window.myInventoryAPI.DataInsert({
          sheetName: '店舗へ',
          action: 'Orderinsert',
          sub_action: 'insert',
          insert_action: InsertActionRef.current,
          data: insertData,
          formulaConfig: {
            targetCol: 10,
            formula: '=RC[-3]*RC[-1]'
          },
          deleteNum: DeleteRowNumRef.current
        })
        DeleteRowNumRef.current = insertData.length
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
    if (code == '' && index !== 0) {
      code = getValues('rows')[index - 1].code
      setValue(`rows.${index}.code`, code)
    }
    const result = await productGet(code, true)
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
