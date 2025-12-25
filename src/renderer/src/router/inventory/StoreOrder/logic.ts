import { SelectOption, FormValues, storeTypes, InsertDataType, OrderGetTypes } from './types'

export const defaultRowData = {
  vendor: '',
  code: '',
  name: '',
  detail: null,
  detailList: [],
  quantity: '',
  person: '',
  remarks: '',
  price: '',
  persontype: null
}

export const defaultDataFormat = (): FormValues['rows'] => {
  const result: FormValues['rows'] = []
  for (let i = 0; i < 20; i++) {
    result.push(defaultRowData)
  }
  return result
}

export const storesGet = async (): Promise<SelectOption[]> => {
  const stores = await window.myInventoryAPI.storeGet('storeList')
  const result: SelectOption[] = stores.map((item: storeTypes[]) => {
    return {
      id: item[0],
      value: item[1],
      label: item[1],
      type: item[2]
    }
  })
  return result
}

export const insertDataFormat = async (
  data: FormValues['rows'],
  date: string,
  store: string
): Promise<InsertDataType[]> => {
  const Now = await window.myInventoryAPI.NowGet()
  const existFilter = data.filter((item) => item.name !== '')
  const format = existFilter.map((item) => {
    console.log(item.persontype)
    return [
      date,
      store,
      item.vendor,
      item.code,
      item.name,
      item.detail?.value ?? '',
      Number(item.quantity),
      null,
      Number(item.price),
      null,
      item.person,
      item.remarks,
      '未印刷',
      Now[0],
      Now[1]
    ] as InsertDataType
  })
  return format
}

export const MissingItemsDataGet = async (
  date: string,
  store: string,
  ordersGet: OrderGetTypes[]
): Promise<OrderGetTypes[]> => {
  const searchDate = new Date(date)
  const filtered = ordersGet.filter((item) => new Date(item[0]) < searchDate)
  const lastDate = new Date(filtered[filtered.length - 1][0]).toLocaleDateString()
  const beforeData = ordersGet.filter(
    (item) => new Date(item[0]).toLocaleDateString() == lastDate && item[1] == store
  )
  const beforeOutStock = beforeData.filter(
    (item) =>
      (item[11].includes('欠品') && !item[11].includes('前回欠品分')) ||
      item[11].includes('前回欠品分欠品') ||
      item[11].includes('送付漏')
  )
  return beforeOutStock
}
