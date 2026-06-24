import { useLoaderData } from 'react-router-dom'
import { PrintDataFlatMap } from './logic'
import { PrintRowType, LoaderData, UseLogicType } from './types'

export const loader = async (): Promise<LoaderData> => {
  const printDataObj = await window.myInventoryAPI.storeGet('printData')
  const printDate = await window.myInventoryAPI.storeGet('printDate')
  const storeList = await window.myInventoryAPI.storeGet('storeList')
  const ordersGet: PrintRowType[] = JSON.parse(printDataObj)
  //console.log(ordersGet)
  const stores = [...new Set(ordersGet.map((item) => item[1] as string))]
  const resultdata = await Promise.all(
    stores.map(async (storeName) => {
      const store = storeList.find((item: [number, string, string]) => item[1] === storeName)
      const storeData = ordersGet.filter((row) => row[1] === storeName)
      //console.log(storeData)
      const printdata = PrintDataFlatMap(storeData, store)
      //console.log(printdata)
      return printdata
    })
  )
  return { printDate, resultdata }
}

export const useLogic = (): UseLogicType => {
  const { printDate, resultdata } = useLoaderData<typeof loader>()
  return {
    printDate,
    resultdata
  }
}
