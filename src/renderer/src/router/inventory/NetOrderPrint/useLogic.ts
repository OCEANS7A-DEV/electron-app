import { useLoaderData } from 'react-router-dom'

import { OrderType, detailsTypes, shortageType, UseLogicType, resultType } from './types'

export const loader = async (): Promise<UseLogicType> => {
  const ordersGet = await window.myInventoryAPI.ListGet({
    sheetName: '店舗注文履歴',
    action: 'InputDataGet',
    ranges: 'A2:M'
  })

  const detailCodes: number[] = []

  const shortage = await window.myInventoryAPI.shortageGet()

  const printtargetdate = await window.myInventoryAPI.storeGet('printDate')
  const lastDate = new Date(printtargetdate).toLocaleDateString()

  const filteredData = ordersGet.filter(
    (row: OrderType) => new Date(row[0]).toLocaleDateString() == lastDate && row[5] !== ''
  )
  const details = await window.myInventoryAPI.storeGet('details')

  const Datas = details
    .map((item: [number, string]) => {
      const target = filteredData.filter((row: OrderType) => row[3] == item[0] && row[5] == item[1])
      if (target.length !== 0) {
        const name = target[0][4]
        let total = 0
        target.forEach((row: OrderType) => {
          total = total + Number(row[6])
        })
        const result = {
          vendor: target[0][2],
          code: item[0],
          productName: name,
          detailName: item[1],
          totalNum: total
        }
        detailCodes.push(Number(item[0]))
        return result
      } else {
        return
      }
    })
    .filter((row: detailsTypes | undefined) => row && row.code !== 100001)
  console.log(Datas)
  const Tida = shortage.filter((row: shortageType) => row[0] == 'TIDA' && Number(row[14]) < 0)
  Tida.forEach((row: shortageType) => {
    const result = {
      vendor: 'TIDA',
      code: row[1],
      productName: row[2],
      detailName: row[2],
      totalNum: Number(row[14]) * -1
    }
    detailCodes.push(Number(row[1]))
    Datas.push(result)
  })

  const vendorsMap = Datas.map((item: detailsTypes) => item.vendor)
  const vendors = [...new Set(vendorsMap)]
  const resultData = vendors
    .map((item) => {
      const filter = Datas.filter((row: detailsTypes) => row.vendor == item)
      if (filter.length !== 0) {
        return {
          vendor: item,
          data: filter
        } as resultType
      } else {
        return {
          vendor: '',
          data: []
        } as resultType
      }
    })
    .filter((item) => item.vendor !== '')

  const SetCodes = [...new Set(detailCodes)]

  const ETCDatas = shortage.filter(
    (row: shortageType) =>
      !SetCodes.includes(Number(row[1])) && Number(row[14]) < 0 && row[12] !== 'FAX'
  )
  return { resultData, ETCDatas }
}

export const useLogic = (): UseLogicType => {
  const { resultData, ETCDatas } = useLoaderData<typeof loader>()
  return {
    resultData,
    ETCDatas
  }
}
