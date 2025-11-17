export interface SelectOption {
  id: number
  value: string
  label: string
  type: string
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

export type storeTypes = [
  number,
  string,
  string
]
