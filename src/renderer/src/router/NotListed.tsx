import React,{ useEffect } from 'react';
import '../css/taiyoPrint.css';
import { useLoaderData } from "react-router-dom";




const isoToJstYMD = (isoString) => {
  const date = new Date(isoString);
  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const yyyy = jst.getFullYear();
  const mm = String(jst.getMonth() + 1).padStart(2, '0');
  const dd = String(jst.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}


export const loader =  async ({ request }: { request: Request }) => {
  const data = await window.myInventoryAPI.ListGet({sheetName: '店舗へ', action: 'InputDataGet', ranges: 'A2:L'})
  
  const url = new URL(request.url);
  const date = url.searchParams.get("date") ?? '2025-06-09';
  console.log(date)
  const shortage = data.filter(item => item[2] !== '' && (isoToJstYMD(item[0]) == date) && typeof item[3] == 'string')
  return shortage
}


export default function NotListed() {
  const loaderData = useLoaderData<typeof loader>()
  console.log(loaderData)
  // useEffect(() => {
  //   window.myInventoryAPI.PrintReady()
  // }, [])
  return(
    <div className="NetEtcPrintW">
      <div className="NetEtcPrint">
        <table style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>店舗</th>
              <th>業者</th>
              <th>商品コード</th>
              <th>商品名</th>
              <th>数</th>
            </tr>
          </thead>
          <tbody>
            {loaderData.map((row, index) => (
              <tr key={index}>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
                <td>{row[4]}</td>
                <td>{row[6]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  )
}