//logic.ts

export interface SelectOption {
  value: number
  label: string
}

export type FormValues = {
  rows: {
    store: string
    stocking: string
    used: string
    inventoryamount: string
  }[]
}

export const DateLists = () => {
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

export const DataGet = async (): Promise<[string, string, number, number, number, string]> => {
  const getData = await window.myInventoryAPI.ListGet({
    sheetName: '店舗在庫金額',
    action: 'InputDataGet',
    ranges: 'A3:F'
  })
  return getData
}

export const FormDataFormat = (data, selectDate) => {
  const formData = data.map((item) => {
    return [selectDate, item.store, null, item.used, null]
  })
  return formData
}

export const DateFormat = (date): string => {
  const dt = new Date(date)
  const result = `${dt.getFullYear()}/${dt.getMonth() + 1}`
  return result
}

export const defaultDataFormat = (data) => {
  const result: FormValues['rows'] =
    data.map((item) => {
      return {
        store: item[1],
        stocking: '',
        used: '',
        inventoryamount: ''
      }
    })
  return result
}

export const NowYearMonth = () => {
  const defaultDate = new Date()
  defaultDate.setMonth(defaultDate.getMonth() - 1)
  const year = defaultDate.getFullYear()
  const month = defaultDate.getMonth() + 1
  return { year, month}
}

export const isHalfWidth = (value: string): boolean => /^[\x20-\x7E]*$/.test(value)
