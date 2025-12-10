import { useEffect, useState } from 'react'
import { PrintFormat } from './logic'

export const useLogic = () => {
  const [VendorOrderData, setVendorOrderData] = useState<any[]>([])
  const [Address, setAddress] = useState<any[]>()

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
      sheetName: '店舗へ',
      action: 'InputDataGet',
      ranges: 'A2:M'
    })
    const vendors = alllist.filter((item) => item[7] !== 'オーシャン').map((row) => row[0])
    const data = await PrintFormat(vendors, resultData, Order)
    setVendorOrderData(data)
    setAddress(alllist)
  }

  useEffect(() => {
    first()
  }, [])

  return {
    VendorOrderData,
    Address
  }
}
