import { useState, useRef, useEffect } from 'react'
import dayjs, { Dayjs } from 'dayjs'
dayjs.locale('ja')
//import { getNearestMonday } from '../../../Util/util'
import { SelectChangeEvent } from '@mui/material/Select'
import { SelectOption, StatusType } from './types'
import toast from 'react-hot-toast'

export const useLogic = () => {
  const [dateValue, setDateValue] = useState<Dayjs | null>(null)
  const selectDateRef = useRef('')
  const [OrderDataStatus, setOrderDataStatus] = useState<StatusType[]>([])
  const [storeSelect, setStoreSelect] = useState('')
  const [storeOptions, setStoreOptions] = useState<SelectOption[]>([])

  const OrderData = async () => {
    const ordersGet = await window.myInventoryAPI.ListGet({
      sheetName: '店舗注文履歴',
      sheetID: '1UK3huzFfa3lQnhqWylJU65IeF8z-L39zgj3bSKDMALI',
      action: 'DataGet'
    })
    return ordersGet
  }

  const NetOrderPrint = async() => {
    // const details = await window.myInventoryAPI.storeGet()
    // console.log(details)
    window.myInventoryAPI.orderPrint('NetOrderPrint')
  }

  const DataGet = async () => {
    const InsertDataCheck = async () => {
      const data = await OrderData()
      const SelectDate = selectDateRef.current
      const filtered = data.filter((row) => new Date(row[0]).toLocaleDateString() == SelectDate)
      const storeData = await window.myInventoryAPI.storeGet('storeList')
      const storeFilter = storeData.filter((row) => row[3] == '営業')
      const statusData = storeFilter.map((item) => {
        const checkData = filtered.filter((row) => row[1] == item[1])
        let status = '未注文'
        if (checkData.length >= 1) {
          status = '注文あり'
        }
        const result = {
          storeName: item[1],
          storetype: item[2],
          printStatus: status,
          data: checkData
        }
        return result
      })
      setOrderDataStatus(statusData)
    }
    toast.promise(InsertDataCheck(), {
      loading: 'データ取得中...',
      success: 'データ取得完了',
      error: 'データ取得失敗'
    })
  }

  const OrderPrintExe = async (status: boolean) => {
    const DataLength = OrderDataStatus.length
    if (DataLength == 0) {
      toast.error('印刷できるデータがありません')
      return
    }
    let PrintData
    if (status) {
      PrintData = OrderDataStatus.find((item) => item.storeName == storeSelect)?.data
    } else {
      const SelectData = OrderDataStatus.filter((item) => item.data.length !== 0)
      PrintData = SelectData.map((item) => {
        return item.data
      }).flat(1)
    }
    if (!PrintData || PrintData.length === 0) {
      toast.error('印刷できる注文データがありません')
      return
    }

    console.log(PrintData)
    await window.myInventoryAPI.storeSet('printData', JSON.stringify(PrintData))
    window.myInventoryAPI.orderPrint('PrintContent')
  }

  const handleDateChange = (date: Dayjs | null): void => {
    const value = date ? date.toDate() : new Date()
    const NewDate = value.toLocaleDateString()
    setDateValue(dayjs(date))
    selectDateRef.current = NewDate
    window.myInventoryAPI.storeSet('printDate', NewDate)
    sessionStorage.setItem('printDate', NewDate)
  }

  const handleStoreChange = (event: SelectChangeEvent): void => {
    const select = event.target.value as string
    setStoreSelect(select)
  }

  const StoreSelectsSet = async () => {
    const storeData = await window.myInventoryAPI.storeGet('storeList')
    const format = storeData.map((row) => {
      return { id: row[0], value: row[1], label: row[1] }
    })
    setStoreOptions(format)
  }

  const DefaultSet = async () => {
    StoreSelectsSet()
  }

  useEffect(() => {
    DefaultSet()
  }, [])

  useEffect(() => {
    if (selectDateRef.current == '') return
    DataGet()
  }, [selectDateRef.current])

  return {
    dateValue,
    handleDateChange,
    DataGet,
    OrderDataStatus,
    handleStoreChange,
    storeOptions,
    storeSelect,
    OrderPrintExe,
    NetOrderPrint
  }
}
