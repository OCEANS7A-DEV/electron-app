import React, { useEffect } from 'react'
import type { JSX } from 'react'
import { useLoaderData } from 'react-router-dom'
import { Button } from '@mui/material'



export const loader = async () => {
  const data = await window.myInventoryAPI.storeGet('HQinventoryPrint')
  
  return { data }
}





const HQPrintContent = (): JSX.Element => {
  const { data } = useLoaderData<typeof loader>()

  const PrintExecution = async () => {
    await window.myInventoryAPI.PrintReady()
  }

  return (
    <div className="print-area">
      <div className="printData">
        <div className="printButton">
          <Button variant="contained" onClick={PrintExecution}>
            印刷
          </Button>
        </div>
        <table className="HQInventoryPrintTable">
          <thead>
            <tr>
              <th>業者</th>
              <th>商品コード</th>
              <th>商品名</th>
              <th>商品単価</th>
              <th>在庫数</th>
              <th>現物数</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td className="vendor">{row[0]}</td>
                <td className="code">{row[1]}</td>
                <td className="name">{row[2]}</td>
                <td className="price">{row[3]}</td>
                <td className="Num">{row[4]}</td>
                <td className="handwritten"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


export default HQPrintContent
