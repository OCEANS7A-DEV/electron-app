import { useLoaderData } from "react-router-dom"
import '../css/stocks.css'
import LinkBaner from '../comp/Linkbanar'
import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { Button } from '@mui/material'




export const loader = async () => {
  const data = await window.myInventoryAPI.shortageGet()
  return data
}

export default function HQStocks() {
  const loaderData = useLoaderData<typeof loader>();

  const [stockData, setStockData] = useState([])
  
  const URL = "https://docs.google.com/spreadsheets/d/1UK3huzFfa3lQnhqWylJU65IeF8z-L39zgj3bSKDMALI/edit?gid=0#gid=0"
  



  const dataset = async() => {
    const data = await window.myInventoryAPI.shortageGet()
    setStockData(data)
  }

  const dialog = async () => {
    Swal.fire({
      title: "本当に入力された現物数をすべて空にしますか？",
      text: "一度空にしたら元のデータには戻りません",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "実行する",
      cancelButtonText: "キャンセル",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "すべて空になりました!",
          text: "",
          icon: "success"
        });
        //AllClearCells
      }
    });
  }

  useEffect(() => {
    setStockData(loaderData)
  },[])

  return(
    <div>
      <div>
        <LinkBaner/>
      </div>
      <div className="stocksWindow">
        <div className="stocks-button-area">
          <Button variant="outlined" onClick={dataset}>在庫データ再取得</Button>
          <Button variant="outlined" onClick={dialog}>現物数オールクリア</Button>
          <Button variant="outlined" href={URL} target="_blank">入出庫等入力データへ</Button>
        </div>
        <table>
          <thead>
            <tr>
              <th>業者名</th>
              <th>商品コード</th>
              <th>商品名</th>
              <th>商品単価</th>
              <th>在庫数</th>
              <th>現物数</th>
            </tr>
          </thead>
          <tbody>
            {
              stockData.map((row,index) => (
                <tr key={index}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td className="stocksNum">{Number(row[4]).toLocaleString('ja-JP')}</td>
                  <td className="stocksNum">{row[12]}</td>
                  <td className="stocksNum" style={{color: row[12] === row[13] ? "black" : "red"}}>{row[13]}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

