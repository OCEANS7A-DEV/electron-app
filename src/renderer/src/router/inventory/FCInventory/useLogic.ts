import { useLoaderData } from 'react-router-dom'

import { SelectOption, DateSelectOption } from './types'

import { useState, useEffect, useRef } from 'react'

import { SelectChangeEvent } from '@mui/material/Select'

import { defaultFormDataFormat } from './logic'

import { productGet } from '../../../Util/util'

// フォーム管理
import { useForm, useFieldArray } from 'react-hook-form'

import { FormValues } from './types'

export const loader = async () => {
  const types = await window.myInventoryAPI.storeGet('types')
  const stores = await window.myInventoryAPI.storeGet('storeList')

  const datas = await window.myInventoryAPI.ListGet({
    sheetName: '在庫履歴',
    action: 'FCInventoryGet',
    ranges: 'A2:D'
  })

  const storenames: SelectOption[] = stores
    .filter((row) => row[2] !== '')
    .map((item) => ({
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
  return { storenames, yearList, monthList, datas, types }
}

export const useLogic = () => {
  const { storenames, yearList, monthList, datas, types } = useLoaderData<typeof loader>()

  const [storeValue, setStoreSelect] = useState<string>('')
  const [yearValue, setYear] = useState<number>(new Date().getFullYear())
  const [monthValue, setMonth] = useState<number>(new Date().getMonth() + 1)

  const DeleteRowsRef = useRef(0)


  const { control, register, handleSubmit, getValues, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      rows: defaultFormDataFormat()
    }
  })


  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: 'rows'
  })


  const InventoryData = async () => {
    if (storeValue == '') return
    const storeData = storenames.find((row) => row.value == storeValue)
    if (!storeData) return
    const datas = await window.myInventoryAPI.ListGet({
      sheetName: '在庫履歴',
      action: 'FCInventoryGet',
      ranges: 'A2:E'
    })
    const filterDate = new Date(yearValue, monthValue, 0).toLocaleDateString()
    const filtered = datas.filter((row) => 
      new Date(row[0]).toLocaleDateString() == filterDate &&
      row[1] == storeData.id
    )
    DeleteRowsRef.current = filtered.length
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

  const RegisterData = (data) => {
    console.log(data)
  }

  const handleYearChange = (e: SelectChangeEvent<number>) => {
    setYear(e.target.value)
  }

  const handleMonthChange = (e: SelectChangeEvent<number>) => {
    setMonth(e.target.value)
  }

  const handleStoreChange = (e: SelectChangeEvent<string>) => {
    console.log(e.target.value)
    setStoreSelect(e.target.value)
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
    datas,
    types,
    fields,
    register
  }
}
