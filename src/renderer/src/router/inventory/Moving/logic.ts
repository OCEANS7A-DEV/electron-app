import { FormValues, InsertTypes, SelectOption } from './types'

const NullData = {
  id: 0,
  value: '',
  label: ''
}

const defaultRowData = {
  date: null,
  outStore: NullData,
  inputStore: NullData,
  vendor: '',
  code: '',
  name: '',
  detail: null,
  detailList: [],
  quantity: '',
  person: '',
  remarks: '',
  price: ''
}

export const defaultDataFormat = (): FormValues['rows'] => {
  const result: FormValues['rows'] = []
  for (let i = 0; i < 20; i++) {
    result.push(defaultRowData)
  }
  return result
}

export const formatStoreData = (data: [number, string, string | null][]): SelectOption[] => {
  const result = data.map((item: [number, string, string | null]) => {
    return {
      id: item[0],
      value: item[1],
      label: item[1]
    }
  })
  return result
}

export const insertDataFormat = async (data: FormValues['rows']): Promise<InsertTypes[]> => {
  const Now = await window.myInventoryAPI.NowGet()
  const formData = data.map((item) => {
    const outStore = String(item.outStore?.value ?? '')
    const inStore = String(item.inputStore?.value ?? '')
    const result = [
      String(item.date?.format('YYYY-MM-DD')),
      outStore,
      inStore,
      Number(item.code),
      String(item.name),
      Number(item.quantity),
      Number(item.price),
      null,
      String(item.remarks),
      Now[0],
      Now[1]
    ] as InsertTypes
    return result
  })
  return formData
}
