import React,{ useEffect } from 'react'
import '../../../css/taiyoPrint.css'
import { useLoaderData } from "react-router-dom"


export const loader = async () => {
  let result = []
  const printDataObj = await window.myInventoryAPI.storeGet('printData')
  const date = printDataObj.printDate
  const orderdata = JSON.parse(printDataObj.printData)
  const details = await window.myInventoryAPI.DetailsData()

  const datalist = await window.myInventoryAPI.ListData()

  const detailsfilter = details.filter(row => row[0] !== 100001 && row[0] !== '')


  const detailmap = detailsfilter.map(items => {
    const resultmap = datalist.find(row => row.code === items[0])
    const result = [items[0],resultmap.name,items[1]]
    return result
  })

  const filtered = orderdata.filter(row => row[5] !== '');

  const filteredData = filtered
  .filter((row: any) => {
    const utcDate = new Date(row[0]);
    const japanTime = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
    const formattedJapanDate = japanTime.toISOString().split('T')[0];
    return formattedJapanDate === date;
  });


  const totaldata = detailmap.map(maprow => {
    const datafilter = filteredData.filter(row => row[3] === maprow[0] && row[5] === maprow[2])
    const filtermap = datafilter.map(mrow => mrow[6])
    const total = filtermap.reduce((sum, item) => (sum += item), 0);
    const result = [...maprow, total]
    return result
  })

  result = totaldata.filter(item => item[3] !== 0)
  return result;
};


export default function NetDetailsPrint() {
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
              <th>商品コード</th>
              <th>商品名</th>
              <th>詳細名</th>
              <th>注文数</th>
            </tr>
          </thead>
          <tbody>
            {loaderData.map((row, index) => (
              <tr key={index}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
