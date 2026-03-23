import { useEffect, useState } from 'react'
import { PrintFormat, ProStepExtraction } from './logic'
import { UseLogicType, AddressType, VendorsDataType, ProStepType } from './types'

export const useLogic = (): UseLogicType => {
  const [VendorOrderData, setVendorOrderData] = useState<VendorsDataType[]>([])
  const [Address, setAddress] = useState<AddressType[]>([])
  const [ProStepDatas, setProStepDatas] = useState<ProStepType[]>([])

  const first = async () => {
    const resultData = await window.myInventoryAPI.ListGet({
      sheetName: '一覧',
      action: 'TotallingGet'
    })
    const alllist = await window.myInventoryAPI.ListGet({
      sheetName: 'その他データ',
      action: 'ListGet',
      ranges: 'A2:H'
    })
    const Order = await window.myInventoryAPI.ListGet({
      sheetName: '店舗注文履歴',
      action: 'InputDataGet',
      ranges: 'A2:M'
    })
    const vendors = alllist.filter((item) => item[7] !== 'オーシャン').map((row) => row[0])
    const data: VendorsDataType[] = await PrintFormat(vendors, resultData, Order)
    if (data.length !== 0) {
      setVendorOrderData(data)
    }

    const ProStepData = await ProStepExtraction(Order)
    setProStepDatas(ProStepData)
    setAddress(alllist)
  }

  useEffect(() => {
    first()
  }, [])

  return {
    VendorOrderData,
    Address,
    ProStepDatas
  }
}
