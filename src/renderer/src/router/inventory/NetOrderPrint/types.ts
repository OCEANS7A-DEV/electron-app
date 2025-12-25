
export type OrderType = [
  string,
  string,
  string,
  number,
  string,
  string,
  number,
  string | number,
  number,
  number,
  string,
  string,
  string
]

export interface detailsTypes {
  vendor: string
  code: number
  productName: string
  detailName: string
  totalNum: number
}

export type shortageType = [
  string,
  number | string,
  string,
  number | string,
  number | string,
  string,
  string,
  string,
  string,
  string,
  string,
  boolean | string,
  string,
  string,
  number | string
]

export interface resultType {
  vendor: string
  data: detailsTypes[]
}

export interface UseLogicType {
  resultData: resultType[]
  ETCDatas: shortageType[]
}

export interface ETCPrintProps {
  data: shortageType[]
}

export interface TIDAPrintProps {
  data: detailsTypes[]
  status: boolean
}
