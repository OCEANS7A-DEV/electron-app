import { FormValues } from './types'

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
