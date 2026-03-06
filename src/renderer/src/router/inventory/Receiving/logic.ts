import { FormValues, InsertTypes } from './types'

export const defaultRowData = {
  vendor: null,
  code: '',
  name: '',
  quantity: '',
  price: ''
}

export const defaultDataFormat = (): FormValues['rows'] => {
  const result: FormValues['rows'] = []
  for (let i = 0; i < 20; i++) {
    result.push(defaultRowData)
  }
  return result
}

export const InsertDataFormat = (
  insertData: FormValues['rows'],
  insertDate: string
): InsertTypes[] => {
  return insertData.map((item: FormValues['rows'][number]) => {
    return [
      insertDate,
      item.vendor?.value,
      Number(item.code),
      item.name,
      Number(item.quantity),
      Number(item.price),
      null,
      '',
      Number(item.vendor?.id),
      '未'
    ] as InsertTypes
  })
}
