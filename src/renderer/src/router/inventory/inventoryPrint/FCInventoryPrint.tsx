import React, { useEffect } from 'react'
import type { JSX } from 'react'
import '../../../css/PrintContent.css'
import '../../../css/FCPrint.css'
//import '../../../css/orderPrint.css'
import { useLoaderData } from 'react-router-dom'
import { Button } from '@mui/material'



export const loader = async () => {
  const data = await window.myInventoryAPI.storeGet('inventoryPrint')
  const printData = JSON.parse(data)
  const printStore = printData.printStore
  const printDate = printData.printDate
  const PData = JSON.parse(printData.printData)
  const Data = PData.filter((item) => item.data.length !== 0)
  return { printStore, printDate, Data }
}


const FCPrintContent = (): JSX.Element => {
  const { printStore, printDate, Data } = useLoaderData<typeof loader>()

  const [AllAmount, setAllAmount] = React.useState('0')

  const [PageNum, setPageNum] = React.useState(0)

  const pageNums = () => {
    let totalPage = 0
    Data.forEach((item) => {
      const Num = Math.ceil(item.data.length / 22)
      totalPage += Num
    })
    setPageNum(totalPage)
  }

  useEffect(() => {
    pageNums()
    invetoryAmount()
  }, [])

  const invetoryAmount = () => {
    let total = 0
    Data.forEach((item: any) => {
      item.data.forEach((row: any) => {
        const num = Number(row[2])
        const price = Number(row[3])
        total += num * price
      })
    })
    setAllAmount(total.toLocaleString())
  }

  const typeRow = (item, pageIndex) => {

    // 元のデータを変更しないようにコピーを作成
    const localData = [...item.data];
    const rowNum = 22; // 1ページあたりの行数

    // 最終ページを22行で埋めるための空行を追加
    const pageNum = Math.ceil(localData.length / rowNum);
    const requiredEmptyRows = (pageNum * rowNum) - localData.length;

    if (requiredEmptyRows > 0) {
      const emptyRows = Array.from({ length: requiredEmptyRows }, () => ['', '', null, null]); // 数値部分はnullにする
      localData.push(...emptyRows);
    }

    

    return localData.map((row, index: number) => {
      // 分割代入で可読性を向上

      const [code, name, num, price] = row;

      return (
        <React.Fragment key={`row-fragment-${index}`}>
          <tr className="FCPrintItemRow">
            <td className="FC-Code">{code}</td>
            <td className="FC-Name">{name}</td>
            <td className="FC-Price">{price ? price.toLocaleString() : ''}</td>
            <td className="FC-Num">{num ? num.toLocaleString() : ''}</td>
          </tr>

          {(index + 1) % rowNum === 0 && (
            <tr className="FCPageBreakRow">
              <td colSpan={4} className="FCPageBreak">
                <div className="FCPageBreakText">{item.type}</div>
                <div>{Math.ceil(index / rowNum)}/{pageNum}</div>
                <div className="FC-test">{pageIndex + 1}/{PageNum}</div>
              </td>
            </tr>
          )}
          
        </React.Fragment>
      )
    })
  }

  const PrintExecution = async () => {
    await window.myInventoryAPI.PrintReady()
  }



  return (
    <div className="print-area">
      <div className="printButton">
        <Button variant="outlined" onClick={PrintExecution}>
          印刷
        </Button>
      </div>
      <div className="FC-total-amount">在庫金額:{AllAmount}円</div>
      <div className="FCprint-area">
        <table className="FCprintData">
          <thead>
            <tr className="FCPrintName">
              <th colSpan={4}>
                <div>
                  <h2>{printStore}店 年末在庫</h2>
                </div>
                <div className="FCPrintDate">
                  <h3>棚卸日:{printDate}</h3>
                  <h3>印刷日:{new Date().toLocaleDateString()}</h3>
                </div>
              </th>
            </tr>
            <tr className="DataColumn">
              <th>商品コード</th>
              <th>商品名</th>
              <th>単価</th>
              <th>在庫数</th>
            </tr>
          </thead>
          <tbody>
            {Data.map((item, pageIndex) => (
              typeRow(item, pageIndex)
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default FCPrintContent
