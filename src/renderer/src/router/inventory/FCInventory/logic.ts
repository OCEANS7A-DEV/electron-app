import { FormValues, SelectOption, InsertDataTypes } from './types'

export const defaultRowData = {
  code: '',
  name: '',
  quantity: '',
  price: ''
}

export const defaultFormDataFormat = (): FormValues['rows'] => {
  const newRows = Array.from({ length: 20 }, () => ({ ...defaultRowData }))
  return newRows
}

export const InsertDataFormat = (
  data: FormValues['rows'],
  storeValue: string,
  storenames: SelectOption[],
  yearValue: number,
  monthValue: number
): InsertDataTypes[] => {
  const storeId = storenames.find((item) => item.value == storeValue)?.id
  const Selectdate = new Date(yearValue, monthValue - 1, 1)
  Selectdate.setMonth(Selectdate.getMonth() + 1, 0)
  const inputDate = Selectdate.toLocaleDateString()
  const datas = data.filter((row) => row.name !== '')
  const inSertData = datas.map((item) => {
    return [
      inputDate,
      storeId,
      Number(item.code),
      Number(item.quantity),
      Number(item.price)
    ] as InsertDataTypes
  })
  return inSertData
}
