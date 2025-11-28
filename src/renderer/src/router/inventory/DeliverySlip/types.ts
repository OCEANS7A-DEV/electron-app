export type PrintRowType = [
  string,
  string,
  string,
  number | string,
  string,
  string,
  number | string,
  number | string,
  number | string,
  number | string,
  string,
  string,
  string
]

export interface LoaderData {
  printDate: string
  resultdata: ForMatType[]
  stores: string[]
}

export interface ForMatType {
  storeName: string
  printData: PrintRowType[][]
  total: number
}
