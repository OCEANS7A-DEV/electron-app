import { useLoaderData } from 'react-router-dom'
import { productType, StoreType } from './types'
import { useRef } from 'react'

import toast from 'react-hot-toast'

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
  const resultData = stores
    .filter((store: StoreType) => store[2] == 'DM' && store[1] !== '会議室')
    .map((store: StoreType) => {
      const filterd = ordersGet.filter(
        (row: any[]) =>
          row[1] == store[1] &&
          new Date(row[0]).toLocaleDateString() >= CountListDate &&
          typeof row[3] == 'number'
      )
      const mappingData = filterd.map((item: any[]) => {
        return item[3]
      })
      const ListData = [...new Set(mappingData)]
      const UsedProducts: productType[] = []
      ListData.forEach((item) => {
        const data = products.find((Pitem: any[]) => Pitem.code == item)
        if (data) {
          UsedProducts.push(data)
        }
      })
      let maxPage = 0
      const resultList: { typeName: string; products: productType[] }[] = []

      types.forEach((item: any[]) => {
        const datas = UsedProducts.filter((row) => row.type == item[1])
        if (store[1] == 'SQ' && item[1].includes('8')) {
          const Push = products.filter((row: productType) => row.code >= 500000 && row.code < 600000)
          datas.push(...Push)
        }
        if (datas.length == 0) return
        const divData = division(datas, 20)
        divData.forEach((data) => {
          maxPage = maxPage + 1
          const result = {
            typeName: item[1],
            products: data,
            pageNum: maxPage
          }
          resultList.push(result)
        })
      })

      return {
        storeName: store[1],
        productCodes: resultList,
        maxPageNum: maxPage
      }
    })
  return { resultData }
}

export const useLogic = () => {
  const { resultData } = useLoaderData<typeof loader>()
  const PageNum = useRef(0)

  const PageNumReset = () => {
    PageNum.current = 0
  }

  const PageNumCount = () => {
    PageNum.current = PageNum.current + 1
  }

  const handlePrint = async (targetIndex: number, folderPath: string, filename: string) => {
    const style = document.createElement('style')
    let styleString = ''
    styleString += '@media print {'
    for (let i = 0; i < resultData.length; i++) {
      if (i == targetIndex) continue
      const targetElementId = `print-area-${i}`
      styleString =
        styleString +
        `
        #${targetElementId} {
          display: none;
        }
      `
    }
    styleString += '}'
    style.innerHTML = styleString
    document.head.appendChild(style)
    await window.myInventoryAPI.CountListPrint(filename, folderPath)
    document.head.removeChild(style)
  }

  const AllPDFPrint = async () => {
    const toastId = toast.loading('PDF印刷中...');
    try {
      const today = new Date()
      const year = today.getFullYear()
      const month = today.getMonth() + 1
      const LastDate = `${year}.${month}.全店カウントリスト`
      const result = await window.myInventoryAPI.FolderBuild(LastDate)
      for (let i = 0; i < resultData.length; i++) {
        const filename = `${resultData[i].storeName}_${year}年末棚卸カウントリスト.pdf`
        await handlePrint(i, result, filename)
      }
      toast.success('PDF印刷完了', { id: toastId })
    } catch (error) {
      console.error(error)
      toast.error('PDF印刷失敗', { id: toastId })
    }
  }

  return { resultData, PageNum, PageNumReset, PageNumCount, AllPDFPrint }
}

const division = (arr: productType[], size: number): productType[][] =>
  arr.flatMap((_, i, a) => (i % size ? [] : [a.slice(i, i + size)]))
