
const defaultRowData = {
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

export type FormValues = {
  rows: {
    vendor: string
    code: string
    name: string
    detail: { value: string; label: string } | null
    detailList: { value: string; label: string }[] | []
    quantity: string
    person: string
    remarks: string
    price: string
  }[]
}

export const defaultDataFormat = (): FormValues["rows"] => {
  const result: FormValues["rows"] = []
  for (let i = 0; i < 20; i++) {
    result.push(defaultRowData)
  }
  return result
}
