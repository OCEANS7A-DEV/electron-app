export type VendorDataType = [string, string, string | number]

export type AddressType = [string, string, string, string, string, string, string, string]

export interface VendorsDataType {
  vendor: string
  data: VendorDataType[]
}

export interface TaiyoOrderType {
  Data: VendorDataType[]
  Address: AddressType[]
}

export interface EtcOrderType {
  Data: VendorDataType[]
  Address: AddressType[]
  vendorName: string
}

export type proStepDataType = [string, string, number]

export interface ProStepType {
  storeName: string
  proStepData: proStepDataType[]
}

export interface ProStepOrderType {
  data: ProStepType
}

export interface UseLogicType {
  VendorOrderData: VendorsDataType[]
  Address: AddressType[]
  ProStepDatas: ProStepType[]
}
