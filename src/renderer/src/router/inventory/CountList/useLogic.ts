import { useLoaderData } from 'react-router-dom'
import { productType } from './types'


export const loader = async (): Promise<any> => {
  const ordersGet = await window.myInventoryAPI.ListGet({
    sheetName: '店舗へ',
    action: 'InputDataGet',
    ranges: 'A2:M'
  })
  const stores = await window.myInventoryAPI.storeGet('storeList')
  const types = await window.myInventoryAPI.storeGet('types')
  const products = await window.myInventoryAPI.storeGet('data')
  const now = new Date()
  let CountListDate = ''

  if (now.getMonth() == 0) {
    CountListDate = `${now.getFullYear() - 1}/1/1`
  } else {
    CountListDate = `${now.getFullYear()}/1/1`
  }

  const resultData = stores.map((store) => {
    const filterd = ordersGet.filter(
      (row) =>
        row[1] == store[1] &&
        new Date(row[0]).toLocaleDateString() <= CountListDate &&
        typeof row[3] == 'number'
    )
    const mappingData = filterd.map((item) => {
      return item[3]
    })
    const ListData = [...new Set(mappingData)]
    const UsedProducts: productType[] = []
    ListData.forEach((item) => {
      const data = products.find((Pitem) => Pitem.code == item)
      if (data) {
        UsedProducts.push(data)
      }
    })
    const resultList = types.map((item) => {
      const datas = UsedProducts.filter((row) => row.type == item[1])
      const result = division(datas, 20)
      return result
    })


    return {
      storeName: store[1],
      productCodes: resultList
    }
  })
  return { resultData }
}

export const useLogic = () => {
  const { resultData } = useLoaderData<typeof loader>()
  return { resultData }
}

const division = (arr: productType[], size: number): productType[][] =>
  arr.flatMap((_, i, a) => (i % size ? [] : [a.slice(i, i + size)]))