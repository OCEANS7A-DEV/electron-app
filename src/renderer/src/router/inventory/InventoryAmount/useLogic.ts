// useLogic.ts

import { useState, useEffect, useRef } from 'react'

import { useLoaderData } from 'react-router-dom'

import { SelectChangeEvent } from '@mui/material/Select'

import {
  DateLists,
  DataGet,
  DateFormat,
  FormDataFormat,
  defaultDataFormat,
  NowYearMonth,
  isHalfWidth
} from './logic'

import { useForm, useFieldArray, SubmitHandler, useWatch } from 'react-hook-form'

import { storeGetType, FormValues, GetDataType, UseLogicReturn } from './types'

const defaultSet = (stores: storeGetType[], beforeData: GetDataType[]): FormValues['rows'] => {
  const result = defaultDataFormat(stores, beforeData)
  return result
}

export const loader = async (): Promise<{
  loaderData: GetDataType[]
  storenames: storeGetType[]
  beforeZaikoData: GetDataType[]
}> => {
  const loaderData = await window.myInventoryAPI.ListGet({
    sheetName: '店舗在庫金額履歴',
    action: 'InputDataGet',
    ranges: 'A2:F'
  })
  const stores = await window.myInventoryAPI.ListGet({
    sheetName: '店舗一覧',
    action: 'ListGet',
    ranges: 'A2:C'
  })
  const storenames: storeGetType[] = stores.filter(
    (row: [string | number, string, string]) =>
      row[0] !== '' && row[2] == 'DM' && row[1] !== '会議室'
  )

  const { year, month } = NowYearMonth()

  const selectDate = `${year}/${month}`
  const filter = loaderData.filter((item: GetDataType) => DateFormat(item[0]) == selectDate)
  let beforeZaikoData = filter
  if (filter.length == 0) {
    const beforeDate = new Date(selectDate)
    beforeDate.setMonth(beforeDate.getMonth() - 1)
    const beforeTarget = beforeDate.toLocaleDateString()
    beforeZaikoData = loaderData.filter(
      (item: GetDataType) => DateFormat(item[0]) == DateFormat(beforeTarget)
    )
  }

  return { loaderData, storenames, beforeZaikoData }
}

export const useLogic = (): UseLogicReturn => {
  const { loaderData, storenames, beforeZaikoData } = useLoaderData<typeof loader>()
  const { yearList, monthList } = DateLists()
  const [Year, setYear] = useState<number>(0)
  const [Month, setMonth] = useState<number>(0)
  const insertActionRef = useRef<string>('')
  const SelectDate = useRef<string>('')
  const [DATA, setDATA] = useState(loaderData)

  const { control, register, handleSubmit, getValues, setValue, watch, reset } =
    useForm<FormValues>({
      defaultValues: {
        rows: defaultSet(storenames, beforeZaikoData)
      }
    })

  const { fields } = useFieldArray({
    control,
    name: 'rows'
  })

  useEffect(() => {
    const { year, month } = NowYearMonth()
    setYear(year)
    setMonth(month)
  }, [])

  useEffect(() => {
    if (Year == 0 || Month == 0) {
      const today = new Date()
      SelectDate.current = `${today.getFullYear()}/${today.getMonth() + 1}`
      return
    }
    const selectDate = `${Year}/${Month}`
    SelectDate.current = selectDate
    const filter = DATA.filter((item: GetDataType) => DateFormat(item[0]) == selectDate)
    const beforeDate = new Date(selectDate)
    beforeDate.setMonth(beforeDate.getMonth() - 1)
    const beforeTarget = beforeDate.toLocaleDateString()

    const beforeData = DATA.filter((item: GetDataType) => DateFormat(item[0]) == DateFormat(beforeTarget))
    console.log(beforeData)
    if (filter.length == 0) {
      insertActionRef.current = 'insert'
      reset({
        rows: defaultSet(storenames, beforeData)
      })
    } else {
      insertActionRef.current = 'InventoryAmountUpdate'
      dataSet(filter)
    }
  }, [Year, Month, DATA])

  const handleYearChange = (e: SelectChangeEvent<number>): void => {
    setYear(e.target.value)
  }

  const handleMonthChange = (e: SelectChangeEvent<number>): void => {
    setMonth(e.target.value)
  }

  const dataSet = (data: GetDataType[]): void => {
    const fData = watch().rows
    data.forEach((item: GetDataType) => {
      const indexNum = fData.findIndex((row) => row.store == item[1])
      setValue(`rows.${indexNum}.before`, String(item[2]))
      setValue(`rows.${indexNum}.stocking`, String(item[3]))
      setValue(`rows.${indexNum}.used`, String(item[4]))
      setValue(`rows.${indexNum}.inventoryamount`, String(item[5]))
    })
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (insertActionRef.current == 'insert') {
      const getData = await DataGet()
      const result = getData.find((item) => DateFormat(item[0]) == SelectDate.current)
      if (result) {
        return
      }
    }
    DataSend(data.rows)
  }

  const DataSend = async (data: FormValues['rows']): Promise<void> => {
    const formData = FormDataFormat(data, SelectDate.current)
    const actionstring = insertActionRef.current
    if (formData.length >= 1) {
      await window.myInventoryAPI.DataInsert({
        sheetName: '店舗在庫金額履歴',
        sub_action: 'insert',
        action: actionstring,
        data: formData,
        date: SelectDate.current
      })
    }
  }

  const Reget = async (): Promise<void> => {
    const getData = await DataGet()
    setDATA(getData)
  }

  const rows = useWatch({ control, name: 'rows' })

  return {
    yearList,
    monthList,
    Year,
    Month,
    handleYearChange,
    handleMonthChange,
    getValues,
    Reget,
    fields,
    register,
    onSubmit,
    handleSubmit,
    isHalfWidth,
    rows
  }
}
