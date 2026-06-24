import { PrintRowType, ForMatType } from './types'

const NotDMRows = (item: PrintRowType): PrintRowType => {
  return [
    item[0],
    item[1],
    item[2],
    item[3],
    item[4],
    item[5],
    item[6],
    '',
    item[8],
    item[9],
    item[10],
    item[11],
    item[12]
  ] as PrintRowType
}

const ServiseRow = (item: PrintRowType, totalnum: number): PrintRowType[] => {
  console.log(totalnum)
  return [
    [
      item[0],
      item[1],
      item[2],
      item[3],
      item[4],
      item[5],
      totalnum,
      '',
      '',
      item[9],
      totalnum * Number(item[9]),
      item[11],
      item[12],
      item[12],
      '',
      '',
      '',
    ],
    [
      item[0],
      item[1],
      item[2],
      item[3],
      item[4],
      item[5],
      item[7],
      item[7],
      '',
      0,
      0,
      '',
      'サービス',
      '未',
      '',
      '',
      ''
    ]
  ]
}

const EmptyRow = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']

export const PrintDataFlatMap = (
  data: PrintRowType[],
  store: [number, string, string]
): ForMatType => {
  let totalAmount = 0
  const rowNum = 20
  const printdata = data.flatMap((item) => {
    if (item[7] === '') {
      totalAmount = totalAmount + Number(item[10])
      return [item]
    } else if (store[2] == 'FC' || store[2] == 'VC') {
      totalAmount = totalAmount + Number(item[10])
      return [NotDMRows(item)]
    } else {
      const totalnum = Number(item[6]) - Number(item[7]) - Number(item[8])
      totalAmount = totalAmount + Number(item[9]) * totalnum
      return ServiseRow(item, totalnum)
    }
  })
  const pushNum = rowNum - (printdata.length % rowNum)
  for (let i = pushNum; i--; ) {
    printdata.push([...EmptyRow] as PrintRowType)
  }
  const divisionData = division(printdata, rowNum)
  const resultData = {
    storeName: store[1],
    printData: divisionData as PrintRowType[][],
    total: totalAmount
  }
  return resultData as ForMatType
}

const division = (arr: PrintRowType[], size: number): PrintRowType[][] =>
  arr.flatMap((_, i, a) => (i % size ? [] : [a.slice(i, i + size)]))

export const BoxSxSetting = {
  backgroundColor: 'white',
  display: 'flex',
  alignItems: 'center'
}
export const ColumnSize = {
  gridTemplateColumns: '285px 70px 50px 60px 80px 80px 80px 80px'
}

export const Tax = (item) => {
  let result = ''
  if (item[4] == '開運手帳') {
    result = `¥${Number(item[10]).toLocaleString()}`
  } else {
    const price = Number(item[10])
    const tax = Math.ceil(price * 10 / 100)
    result = `¥${(price + tax).toLocaleString()}`
  }
  return result
}

export const DeliverNum = (item) => {
  return (Number(item[6]) - Number(item[8])).toLocaleString()
}

export const totalPrice = (item) => {
  const DeliverNum = Number(item[6]) - Number(item[8])
  const Price = Number(item[9])

  return (DeliverNum * Price).toLocaleString()
}

export const Missing = (item) => {
  let MissingNum = ''
  if (item[8] !== '') {
    MissingNum = `${item[8]}=欠品`
  }
  return MissingNum
}
