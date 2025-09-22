import React, { useEffect } from 'react'
import '../../../css/taiyoPrint.css'
import { useLoaderData } from 'react-router-dom'
import type { JSX } from 'react'


export const loader = async () => {
  const data = await window.myInventoryAPI.shortageGet()
  const shortage = data.filter((item) => item[13] < 0 && item[0] !== 'タムラ' && item[0] !== '三久')
  return shortage
}


export default function NetEtcPrint(): JSX.Element {
  const loaderData = useLoaderData<typeof loader>()
  useEffect(() => {
    window.myInventoryAPI.PrintReady()
  }, [])
  return(
    <div className="NetEtcPrintW">
      <div className="NetEtcPrint">
        <table style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>業者</th>
              <th>商品コード</th>
              <th>商品名</th>
              <th>不足数</th>
            </tr>
          </thead>
          <tbody>
            {loaderData.map((row, index) => (
              <tr key={index}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[13]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  )
}
