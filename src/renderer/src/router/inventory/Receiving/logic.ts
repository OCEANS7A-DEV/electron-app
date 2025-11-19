import {
  FormValues
} from './types'


const defaultRowData = {
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
