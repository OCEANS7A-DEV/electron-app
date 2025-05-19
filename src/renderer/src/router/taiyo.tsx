import React,{ useEffect, useState } from 'react';
//import { kaigisituOrder, taiyoOrder, shortageGet, stockList } from '../backend/Server_end';
import '../css/taiyoPrint.css';
import { useLoaderData } from "react-router-dom";
import LinkBaner from '../comp/Linkbanar'
//import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
//import { Print } from '../backend/utils';






const isoToJstYMD = (isoString) => {
  const date = new Date(isoString);
  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const yyyy = jst.getFullYear();
  const mm = String(jst.getMonth() + 1).padStart(2, '0');
  const dd = String(jst.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}









export const loader = async ({ request }: { request: Request }) => {
  let taiyoData = [];
  const addressData = await window.myInventoryAPI.storeGet({gettitle: 'address'})
  const url = new URL(request.url);
  const date = url.searchParams.get("date");
  const vendor = url.searchParams.get("vendor");
  const address = url.searchParams.get("address");
  let orderData = []
  if(address !== '会議室'){
    const resultData = await window.myInventoryAPI.ListGet({sheetName: '在庫一覧', action: 'TotallingGet', ranges: 'A2:M'})
    const codeList = resultData.map(item => item[1])
    const filterd = resultData.filter((row) => row[0] === vendor && row[12] < 0)
    const orderResult = filterd.map(item => {
      let shortageNum = Number(item[12]);
      let num = 0;
      if (item[11] !== "" && Number(item[11]) > 0) {
        let up = Number(item[11])
        if(item[1] == 2002){
          up = up * 2
        }
        while (shortageNum < 0) {
          shortageNum += up
          num += up
        }
        return ['', item[2], num, '', '', '']
      } else {
        return ['', item[2], -(Number(item[12])), '', '', '']
      }
    })
    taiyoData = orderResult

    const Order = await window.myInventoryAPI.ListGet({sheetName: '店舗へ', action: 'InputDataGet', ranges: 'A2:M'})
    const filter = Order.filter(item => isoToJstYMD(item[0]) == date)
    const Notlisted = filter.filter(item => item[2].includes('大洋') && !codeList.includes(item[3]))
    Notlisted.forEach(item => {
      const result = [item[3], item[4], item[6], '', item[11], '']
      taiyoData.push(result)
    })
    orderData = Notlisted
  }else{
    const data = await window.myInventoryAPI.ListGet({sheetName: '店舗へ', action: 'InputDataGet', ranges: 'A2:L'})
    const filtered = data.filter(item => isoToJstYMD(item[0]) == date && item[1] == address && item[2].includes('大洋'))
    const Inlist = filtered.map(item => {
      const result = ['', item[4], item[6] - item[7], '', '', '']
      return result
    })
    orderData = filtered
    taiyoData = Inlist
  }
  
  let calcD = 16 - taiyoData.length
  for (let i = 0; i < calcD; i ++){
    taiyoData.push(['','','','','',''])
  }
  return {taiyoData, addressData, address, orderData};
};


export default function TaiyoPrint() {
  const {taiyoData, addressData, address, orderData} = useLoaderData<typeof loader>();
  //const [searchParams] = useSearchParams();
  //const address = searchParams.get("address") || "";
  const [ShippingAddress, setShippingAddress] = useState(addressData.find(item => item[0] === address));
  const [VendorData, setVendorData] = useState(addressData.find(item => item[0] === '大洋商会'));
  //const navigate = useNavigate();
  console.log(address)
  console.log(taiyoData)
  console.log(addressData)
  console.log(VendorData)
  console.log(orderData)

  useEffect(() => {
    window.myInventoryAPI.PrintReady()
  },[])
  


  // useEffect(() => {
  //   Print();
  //   navigate(`/process_chack`)
  // },[taiyoData])
  
  return(
    <div className="taiyobackGround">
      {/* <LinkBaner /> */}
      <div className="taiyotop">
        <h1 className="taiyoH1">FAX注文書</h1>
      </div>
      <div className="sub_top">
        <div className="sub_top2">
          <h2 className="taiyo-Data">　</h2>
          <h2 className="taiyo-Data-name">㈱大洋商会　御中</h2>
        </div>
        <div className="sub_top2">
          <h2 className="taiyo-Data-number">FAX{VendorData[2]}</h2>
          <h2 className="taiyo-Data-number">TAL{VendorData[3]}</h2>
        </div>
      </div>
      <div className="taiyo-tableArea">
        <table className="taiyo-table">
          <thead>
            <tr className="taiyo-table-header">
              <th className="taiyo-number">カタログ<br/>掲載番号</th>
              <th className="taiyo-name">商品名</th>
              <th className="taiyo-num">数量</th>
              <th className="taiyo-Dnum">ディーラー<br/>価格</th>
              <th className="taiyo-Snum">サロン価格</th>
              <th className="taiyo-bikou">備考</th>
            </tr>
          </thead>
          <tbody>
            {taiyoData.map((row, index) => (
              <tr key={index}>
                <td className="taiyo-number-data">{row[0]}</td>
                <td className="taiyo-name-data">{row[1]}</td>
                <td className="taiyo-num-data">{row[2]}</td>
                <td className="etc"></td>
                <td className="etc"></td>
                <td className="etc">{row[4]}</td>
              </tr>
            ))}
            <>
              <tr className="taiyo-saron-last">
                <td colSpan="6" className="special-row-saron">
                  <h2 className="sarontop">サロン直送</h2>
                  <div className="taiyo-saron-table">
                    <tr className="saronname">
                      <td className="sarontitle">サロン名</td>
                      <td className="saronData">{ShippingAddress[6]}</td>
                    </tr>
                    <tr className="saronname">
                      <td className="sarontitle">配送先</td>
                      <td className="saronData">〒{ShippingAddress[4]}　{ShippingAddress[5]}</td>
                    </tr>
                    <tr className="saronname">
                      <td className="sarontitle">電話</td>
                      <td className="saronData">082-569-8401</td>
                    </tr>
                  </div>
                </td>
              </tr>
              <tr className="taiyo-saron-message">
                <td colSpan="6" className="special-row">
                  <h3 className="sarontop">お世話になります。<br/>ご注文よろしくお願いします</h3>
                </td>
              </tr>
            </>
          </tbody>
        </table>
      </div>
    </div>
  )
};



