import React, { useEffect, useState } from 'react'
import LinkBaner from '../comp/Linkbanar'
import '../css/HelloWork.css'
import { useLoaderData } from "react-router-dom"
//import puppeteer from "puppeteer"
import { Button } from '@mui/material'



export const loader = async() => {
  const data = await window.myInventoryAPI.ListGet({sheetName: 'ネット発注', action: 'ListGet', ranges: 'A2:B'})
  const URLs = data.filter(item => item[0] !== '')
  return URLs
};

export default function HelloWork() {
  const loaderData = useLoaderData()

  const [list, setList] = useState([])
  
  const [loading, setLoading] = React.useState(true);

  const start = async () => {
    const result = await window.myInventoryAPI.WorkGet()
    console.log(result)
    setList(result)
    setLoading(false)
  }

  const PDFGet = async() => {
    console.log(list)
    window.myInventoryAPI.HelloWorkPDFGet(list[0].求人票URL, `${list[0].求人番号}`)
    // list.forEach(item => {
    //   window.myInventoryAPI.HelloWorkPDFGet(item.求人票URL, `${item.求人番号}`)
    // })
  }

  //https://www.hellowork.mhlw.go.jp/kensaku/GECA110010.do?screenId=GECA110010&action=kyujinhyoBtn&kJNo=3401000325458&kJKbn=2&iNFTeikyoRiyoDtiID=&kSNo=
  //https://www.hellowork.mhlw.go.jp/GECA110010.do?screenId=GECA110010&action=kyujinhyoBtn&kJNo=3401000325458&kJKbn=2&iNFTeikyoRiyoDtiID
  //                   ./GECA110010.do?screenId=GECA110010&amp;action=kyujinhyoBtn&amp;kJNo=3401000325458&amp;kJKbn=2&amp;iNFTeikyoRiyoDtiID=&amp;kSNo=

  useEffect(() => {
    console.log(loaderData)
    start()
  },[])

  

  



  return(
    <div className="HelloWorkWindow">
      <div className="banner">
        <LinkBaner/>
      </div>
      <div className="HelloWorkMainArea">
        <div className="ButtonArea">
          <Button variant="outlined" onClick={() => PDFGet()} loading={loading}>PDFGet</Button>
        </div>
        
      </div>
    </div>
  )
}



