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
  number | string,
  number | string,
  string,
  string,
  string,
  string,
  string,
]

export interface LoaderData {
  printDate: string
  resultdata: ForMatType[]
}

export interface ForMatType {
  storeName: string
  printData: PrintRowType[][]
  total: number
}

export interface StoreCompType {
  printDate: string
  storeData: ForMatType
}

export interface RowCompType {
  printData: PrintRowType[]
}

export interface UseLogicType {
  printDate: string
  resultdata: ForMatType[]
}
