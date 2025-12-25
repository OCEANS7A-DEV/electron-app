import { VendorsDataType, ProStepType } from './types'

export const PrintFormat = (vendors: string[], data: any[], Order: any[]): VendorsDataType[] => {
  const codes = data.map((item) => item[1]).filter((item) => item[1] !== '')
  const lastDate = new Date(Order[Order.length - 1][0]).toLocaleDateString()
  const newDatas = Order.filter((item) => new Date(item[0]).toLocaleDateString() == lastDate)
  const EtcDatas = newDatas.filter((item) => !codes.includes(item[3]))
  const AminoCodes = [1001, 1002]
  const TioCodes = [1003, 1004]
  const result = vendors.map((item) => {
    let maxRow = 25
    if (item === '大洋商会') {
      maxRow = 16
    }
    let InsertData: any[][] = []
    const sData = data.filter(
      (row) =>
        row[0] == item &&
        row[14] < 0 &&
        !(Number(row[1]) > 300100 && Number(row[1]) < 400000) &&
        !String(row[2]).includes('ﾙﾍﾞﾙ')
    )
    sData.forEach((row) => {
      let num = row[14] * -1
      if (row[7] !== '' && Number(row[7]) !== 0) {
        let total = 0
        while (total <= num) {
          total = total + Number(row[7])
        }
        num = total
      }
      const result = [row[1], row[2], num]
      InsertData.push(result)
    })
    EtcDatas.forEach((row) => {
      if (item.includes(row[2])) {
        const result = [row[3], row[4], row[6]]
        InsertData.push(result)
      }
    })
    if (InsertData.find((row) => AminoCodes.includes(Number(row[0])))) {
      const NonAmino = InsertData.filter((row) => !AminoCodes.includes(Number(row[0])))
      NonAmino.push(['', 'ｱﾐﾉｱｼｯﾄﾞ', 20])
      InsertData = NonAmino
    } else if (InsertData.find((row) => TioCodes.includes(Number(row[0])))) {
      const NonTio = InsertData.filter((row) => !TioCodes.includes(Number(row[0])))
      NonTio.push(['', 'ﾈｽﾗｰﾁｵﾊｰﾄﾞ', 20])
      InsertData = NonTio
    }
    if (InsertData.length !== 0) {
      for (let i = InsertData.length; i < maxRow; i++) {
        InsertData.push(['', '', ''])
      }
    }

    return {
      vendor: item,
      data: InsertData
    } as VendorsDataType
  })
  return result
}

export const BoxHeader = {
  display: 'flex',
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  overFlow: 'hidden',
  whiteSpace: 'nowrap'
}

export const ProStepExtraction = (data): ProStepType[] => {
  const lastDate = new Date(data[data.length - 1][0]).toLocaleDateString()
  const newDatas = data.filter((item) => new Date(item[0]).toLocaleDateString() == lastDate)
  const prosteps = newDatas.filter((item) => item[3] == 100001)
  const storesMap = prosteps.map((item) => item[1])
  const stores = [...new Set(storesMap)]
  const result = stores.map((store) => {
    const filtered = prosteps.filter((row) => row[1] == store)
    const formatData = filtered.map((row) => {
      return [row[4], row[5], row[6]]
    })
    return {
      storeName: store,
      proStepData: formatData
    } as ProStepType
  })
  return result
}
