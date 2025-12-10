export const PrintFormat = (vendors: string[], data: any[], Order: any[]) => {
  const codes = data.map((item) => item[1]).filter((item) => item[1] !== '')
  const lastDate = new Date(Order[Order.length - 1][0]).toLocaleDateString()
  const newDatas = Order.filter((item) => new Date(item[0]).toLocaleDateString() == lastDate)
  const EtcDatas = newDatas.filter((item) => !codes.includes(item[3]))

  const AminoCodes = [1001, 1002]
  const TioCodes = [1003, 1004]

  const result = vendors.map((item) => {
    let InsertData: any[][] = []
    const sData = data.filter(
      (row) =>
        row[0] == item && row[14] < 0 && !(Number(row[1]) > 300100 && Number(row[1]) < 400000)
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
    return {
      vendor: item,
      data: InsertData
    }
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
