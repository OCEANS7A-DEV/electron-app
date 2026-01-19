import { useLoaderData } from 'react-router-dom'

import {
  SelectOption,
  DateSelectOption,
  FCInventoryTypes,
  FormValues,
  DataTypes,
  productType,
  LoaderData
} from './types'

import { useState, useEffect, useRef, useCallback } from 'react'

import { SelectChangeEvent } from '@mui/material/Select'

import { defaultFormDataFormat, defaultRowData, InsertDataFormat } from './logic'

import { productGet } from '../../../Util/util'

import toast from 'react-hot-toast'

// フォーム管理
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form'

export const loader = async (): Promise<LoaderData> => {
  const stores = await window.myInventoryAPI.storeGet('storeList')
  const storenames: SelectOption[] = stores
    .filter((row: [number, string, string]) => row[2] !== '')
    .map((item: [number, string, string]) => ({
      id: item[0],
      value: item[1],
      label: item[1],
      type: item[2]
    }))
  const now = new Date()
  const year = now.getFullYear()
  const yearList: DateSelectOption[] = [
    { value: year + 1, label: `${year + 1}年` },
    { value: year, label: `${year}年` },
    { value: year - 1, label: `${year - 1}年` }
  ]
  const monthList: DateSelectOption[] = []
  for (let i = 0; i < 12; i++) {
    monthList.push({ value: i + 1, label: `${i + 1}月` })
  }

  const typeDatas = await window.myInventoryAPI.ListGet({
    sheetName: '商品タイプ一覧',
    action: 'ListGet',
    ranges: 'B2:B'
  })

  const types = typeDatas.map((item) => item[0]).filter((row) => row !== '')
  return { storenames, yearList, monthList, types }
}

export const useLogic = (): FCInventoryTypes => {
  const { storenames, yearList, monthList, types } = useLoaderData<typeof loader>()
  const [storeValue, setStoreSelect] = useState<string>('')
  const [yearValue, setYear] = useState<number>(new Date().getFullYear())
  const [monthValue, setMonth] = useState<number>(new Date().getMonth() + 1)
  const [DialogOpen, setDialogOpen] = useState(false)
  const DeleteRowsRef = useRef(0)
  const typeRef = useRef('')
  const StoreIDRef = useRef(0)
  const SubActionRef = useRef('')

  const { control, register, handleSubmit, getValues, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      rows: defaultFormDataFormat()
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rows'
  })

  const InventoryData = async (): Promise<void> => {
    if (storeValue == '') return
    const storeData = storenames.find((row) => row.value == storeValue)
    if (!storeData) return
    const datas = await window.myInventoryAPI.ListGet({
      sheetName: '在庫履歴',
      action: 'FCInventoryGet',
      ranges: 'A2:E'
    })

    const filterDate = new Date(yearValue, monthValue, 0).toLocaleDateString()
    const filtered = datas.filter(
      (row: DataTypes) =>
        new Date(row[0]).toLocaleDateString() == filterDate && row[1] == storeData.id
    )
    DeleteRowsRef.current = filtered.length
    if (filtered.length !== 0) {
      SubActionRef.current = 'update'
    } else {
      SubActionRef.current = 'append'
    }
    for (let i = 0; i < filtered.length; i++) {
      const product = await productGet(filtered[i][2])
      setValue(`rows.${i}.code`, String(product.productData.code))
      setValue(`rows.${i}.name`, String(product.productData.name))
      setValue(`rows.${i}.quantity`, String(filtered[i][3]))
      setValue(`rows.${i}.price`, String(product.productData.newPrice))
    }
  }

  useEffect(() => {
    InventoryData()
  }, [storeValue, yearValue, monthValue])

  const RegisterData = (data: productType): void => {
    const RowsData = getValues('rows')
    const findData = RowsData.filter((row) => row.code !== '')
    if (findData.length !== 0) {
      for (let i = RowsData.length - 1; i >= 0; i--) {
        const row = RowsData[i]
        if (row.code !== '') {
          const setRow = i + 1
          if (typeRef.current !== 'VC') {
            setValue(`rows.${setRow}.price`, String(data.newPrice))
          } else {
            setValue(`rows.${setRow}.price`, String(data.VC))
          }
          setValue(`rows.${setRow}.code`, String(data.code))
          setValue(`rows.${setRow}.name`, data.name)
          break
        }
      }
    } else {
      if (typeRef.current !== 'VC') {
        setValue(`rows.0.price`, String(data.newPrice))
      } else {
        setValue(`rows.0.price`, String(data.VC))
      }
      setValue(`rows.0.code`, String(data.code))
      setValue(`rows.0.name`, data.name)
    }
  }

  const handleYearChange = (e: SelectChangeEvent<number>): void => {
    setYear(e.target.value)
    InventoryData()
  }

  const handleMonthChange = (e: SelectChangeEvent<number>): void => {
    setMonth(e.target.value)
    InventoryData()
  }

  const handleStoreChange = (e: SelectChangeEvent<string>): void => {
    const select = e.target.value
    setStoreSelect(select)
    const storeData = storenames.find((item) => item.value == select)
    typeRef.current = storeData?.type ?? ''
    StoreIDRef.current = storeData?.id ?? 0
    InventoryData()
  }

  const addNewForm = (): void => {
    for (let i = 0; i < 20; i++) {
      append(defaultRowData)
    }
  }

  const productCodeSearch = useCallback(
    async (index: number): Promise<void> => {
      let code = getValues('rows')[index].code
      if (code == '' && index == 0) {
        return
      }
      if (code == '' && index !== 0) {
        code = getValues('rows')[index - 1].code
        setValue(`rows.${index}.code`, code)
      }
      const result = await productGet(code, true)
      if (result) {
        const product = result.productData
        setValue(`rows.${index}.name`, product.name)
        if (typeRef.current !== 'VC') {
          setValue(`rows.${index}.price`, product.newPrice)
        } else {
          setValue(`rows.${index}.price`, product.VC)
        }
      }
    },
    [getValues, setValue, productGet]
  )

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
          const columnName = (before as HTMLInputElement).name
          if (columnName.includes('code')) {
            const rowNum = Number(columnName.replace(/[^0-9]/g, ''))
            productCodeSearch(rowNum)
          }
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
    [getValues, addNewForm, productCodeSearch]
  )

  const onSubmit: SubmitHandler<FormValues> = async () => {
    const storeId = storenames.find((item) => item.value == storeValue)?.id
    if (!storeId) {
      toast.error('店舗が選択されていません')
      return
    }
    setDialogOpen(true)
  }

  const insertPost = (): void => {
    const DataSubmit = async (): Promise<void> => {
      const data = getValues('rows')
      const storeId = storenames.find((item) => item.value == storeValue)?.id
      if (!storeId) {
        return
      }
      const formData = await InsertDataFormat(data, storeValue, storenames, yearValue, monthValue)
      const insertData = {
        sheetName: '在庫履歴',
        action: 'FCInventory',
        sub_action: 'insert',
        insert_date: formData[0][0],
        data: formData,
        storeid: StoreIDRef.current,
        deleteNum: DeleteRowsRef.current,
        sub: SubActionRef.current
      }
      if (formData.length >= 1) {
        await window.myInventoryAPI.DataInsert(insertData)
      }
    }
    toast.promise(DataSubmit(), {
      loading: 'データ送信中...',
      success: () => {
        reset({
          rows: defaultFormDataFormat()
        })
        return 'データ送信完了'
      },
      error: 'データ送信失敗'
    })
  }

  const handleRowDelete = useCallback(
    async (index: number) => {
      remove(index)
    },
    [remove]
  )

  const Reget = async () => {
    const DataGets = async () => {
      const data = await window.myInventoryAPI.ListGet({
        sheetName: '在庫履歴',
        action: 'FCInventoryGet',
        ranges: 'A2:D'
      })
      const storeId = storenames.find((item) => item.value == storeValue)
      const date = new Date(yearValue, monthValue, 0)
      const searchDate = date.toLocaleDateString()
      date.setDate(date.getDate() - 1)
      const filter = data.filter(
        (item) => item[1] == storeId?.id && new Date(item[0]).toLocaleDateString() == searchDate
      )
      const List = await window.myInventoryAPI.ListData()
      const inventorys: any[] = []
      for (let i = 0; i < types.length; i++) {
        const targets = List.filter((item) => item.type.includes(i + 1))
        const pushData = targets
          .map((item) => {
            const findData = filter.find((row) => row[2] == item.code)
            const result = [item.code, item.name, findData ? findData[3] : 0, item.newPrice]
            return result
          })
          .filter((row) => row[2] !== 0)
        inventorys.push({ type: types[i], data: pushData })
      }
      const PrintData = {
        printDate: date.toLocaleDateString(),
        printStore: storeValue,
        printData: JSON.stringify(inventorys)
      }
      await window.myInventoryAPI.storeSet('inventoryPrint', JSON.stringify(PrintData))
      window.myInventoryAPI.orderPrint('FCPrintContent')
    }

    toast.promise(DataGets(), {
      loading: '読み込み中',
      success: () => '終了',
      error: () => `エラーが発生しました`
    })
  }

  return {
    RegisterData,
    storenames,
    storeValue,
    handleStoreChange,
    yearList,
    yearValue,
    handleYearChange,
    monthList,
    monthValue,
    handleMonthChange,
    fields,
    register,
    handleEnterFocusNext,
    handleSubmit,
    onSubmit,
    handleRowDelete,
    DialogOpen,
    setDialogOpen,
    insertPost,
    getValues,
    addNewForm,
    Reget
  }
}
