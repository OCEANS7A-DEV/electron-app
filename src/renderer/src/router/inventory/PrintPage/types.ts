
export interface SelectOption {
  id: number
  value: string
  label: string
}

export type OrderType = [
  string,
  string,
  string,
  number | string,
  string,
  string,
  number | string,
  string,
  number | string,
  number | string,
  string,
  string,
  string
]

export interface StatusType {
  storeName: string
  storetype: string
  printStatus: string
  data: OrderType[]
}
