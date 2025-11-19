//logic.ts

import {
  SelectOption,
  FormValues,
  GetDataType,
  DateReturn,
  FormDataType,
  storeGetType,
  NowReturn
} from './types'

export const DateLists = (): DateReturn => {
  const now = new Date()
  const year = now.getFullYear()
  const yearList: SelectOption[] = [
    { value: year + 1, label: `${year + 1}年` },
    { value: year, label: `${year}年` },
    { value: year - 1, label: `${year - 1}年` }
  ]
  const monthList: SelectOption[] = []
  for (let i = 0; i < 12; i++) {
    monthList.push({ value: i + 1, label: `${i + 1}月` })
  }
  return { yearList, monthList }
}

export const DataGet = async (): Promise<GetDataType[]> => {
  const getData = await window.myInventoryAPI.ListGet({
    sheetName: '店舗在庫金額',
    action: 'InputDataGet',
    ranges: 'A3:F'
  })
  return getData
}

export const FormDataFormat = (data: FormValues['rows'], selectDate: string): FormDataType[] => {
  const formData = data.map((item) => {
    return [selectDate, item.store, null, item.used, null] as FormDataType
  })
  return formData
}

export const DateFormat = (date: string): string => {
  const dt = new Date(date)
  const result = `${dt.getFullYear()}/${dt.getMonth() + 1}`
  return result
}

export const defaultDataFormat = (data: storeGetType[]): FormValues['rows'] => {
  const result: FormValues['rows'] = data.map((item) => {
    return {
      store: item[1],
      stocking: '',
      used: '',
      inventoryamount: ''
    }
  })
  return result
}

export const NowYearMonth = (): NowReturn => {
  const defaultDate = new Date()
  defaultDate.setMonth(defaultDate.getMonth() - 1)
  const year = defaultDate.getFullYear()
  const month = defaultDate.getMonth() + 1
  return { year, month }
}

export const isHalfWidth = (value: string): boolean => /^[\x20-\x7E]*$/.test(value)
