import React, { useState, useEffect } from 'react';
import { useLoaderData, useNavigate } from "react-router-dom";
//import { getMonthString } from '../backend/utils'
//import { shortageGet, ListGet, orderGet } from '../backend/Server_end';
import '../css/kinbatoPrint.css';
import '../css/taiyoPrint.css';
//import { useLoaderData, useNavigate, useSearchParams, json } from "@remix-run/react";
//import { Print } from '../backend/utils';
import jaconv from 'jaconv';



interface SettingProps {
  setCurrentPage: (page: string) => void;
}


const isoToJstYMD = (isoString) => {
  const date = new Date(isoString);
  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const yyyy = jst.getFullYear();
  const mm = String(jst.getMonth() + 1).padStart(2, '0');
  const dd = String(jst.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}




export const loader =  async ({ request }: { request: Request }) => {
  const productData = await window.myInventoryAPI.ListGet({sheetName: '在庫一覧', action: 'TotallingGet', ranges: 'A2:O'})
  const orderData = await window.myInventoryAPI.ListGet({sheetName: '店舗へ', action: 'InputDataGet', ranges: 'A2:O'})
  const url = new URL(request.url);
  const date = url.searchParams.get("date") ?? '2025-03-24';
  const address = url.searchParams.get("address");
  const Addressdata = await window.myInventoryAPI.storeGet({gettitle: 'address'})
  const vendors = ['キンバト', 'ムラカミ', '三久', 'タムラ']

  const ShippingAddress = Addressdata.find(row => row[0] === address)





  const shortage = productData.filter(row => Number(row[12]) < 0 || (Number(row[14]) >= 1 && Number(row[12]) <= Number(row[14])) && !row[2].includes('eco') && !row[2].includes('ﾙﾍﾞﾙ') && row[1] !== 100001)

  let subData = []
  let subdata = []

  const resultdata = vendors.map(item => {
    const swKH = jaconv.toHan(item);
    const vendorfilter = shortage.filter(row => row[0] == item || row[0] == swKH)
    const mapData = vendorfilter.map(fitem => {
      if(fitem[11] !== ''){
        let shortage = fitem[12];
        let orderNum = 0
        let ordernumCount = Number(fitem[11])
        if(shortage < 0){
          while (shortage < 0){
            shortage += ordernumCount
            orderNum += ordernumCount
          }
        }else{
          orderNum += ordernumCount
        }
        return [fitem[2],orderNum]
      }else{
        return [fitem[2], -(fitem[12])]
      }
    })
    if(item == 'タムラ'){
      const addData = orderData.filter(item => item[4].includes('eco') && isoToJstYMD(item[0]) == date )
      addData.forEach(item => {
        const result = [`${item[4]} ${item[5]}`, item[6]]
        mapData.push(result)
      })
    }else if(item == 'ムラカミ'){
      const addData = orderData.filter(item => item[3] == 100001 && isoToJstYMD(item[0]) == date )
      subdata = [...new Set(addData.map(items => items[1]))]
      subData = addData
    }
    let calcD = 24 - mapData.length
    for (let i = 0; i < calcD; i ++){
      mapData.push(['',''])
    }
    const pushData = {vendor: item, data: mapData}
    return pushData

  })


  return {
    date,
    ShippingAddress,
    subData,
    subdata,
    vendors,
    Addressdata,
    resultdata
  };
  
}





export default function EtcPrint() {
  const { date, ShippingAddress, subData, subdata, vendors, Addressdata, resultdata } = useLoaderData<typeof loader>();


  





  useEffect(() => {
    window.myInventoryAPI.PrintReady()
  },[])

  const AddressFindData = async(data,col) => {
    const result = Addressdata.find(row => row[0] == data)
    console.log(result)
    return result[col]
  }
  


  return(
    <div>
      {vendors.map((item,index) => (
        <div>
          <div className="PrintbackGround">
            <div className="kinbato-top">
              <h1 className="H1">
                注文書
              </h1>
              <div className="address-area">
                <div className="kinbato-left">
                  <h2 className="taiyo-Data-name">株式会社　{item}　御中</h2>
                  {/* <div className="taiyo-Data-name"><div className="kinbato-date">{NowDay}</div></div> */}
                  <div className="taiyo-Data-name">TEL:{AddressFindData(item,3)}</div>
                  <div className="taiyo-Data-name">FAX:{AddressFindData(item,2)}</div>
                  <div className="taiyo-Data-name"><h3 className="order-message">お世話になります<br/>ご注文宜しくお願いします。</h3></div>
                </div>
                {item == 'タムラ' && 
                  <div className="tamura-manager-area">
                    <div>タムラ担当者</div>
                    <div className="tamura-manager">
                      <div>{AddressFindData(item,6)}</div>
                    </div>
                  </div>
                }
                <div className="kinbato-right">
                  <div className="ocean-area">
                    <div>{ShippingAddress[6]}</div>
                    <div>{ShippingAddress[5]}</div>
                    <div>TEL {ShippingAddress[3]}</div>
                    <div className="kinbato-tantou">担当</div>
                    <div>FAX {ShippingAddress[3]}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="taiyo-tableArea">
              <table className="taiyo-table">
                <thead>
                  <tr className="kinbato-header">
                    <th className="taiyo-name-data">商品名</th>
                    <th className="taiyo-num-data">個数</th>
                  </tr>
                </thead>
                <tbody>
                  {resultdata.find(frow => frow.vendor == item).data.map((row,index) => (
                    <tr key={index}>
                      <td className="murakami-name-data">{row[0]}</td>
                      <td className="murakami-num-data">{row[1]}</td>
                    </tr>
                  ))}
                  {item === 'ムラカミ' &&
                    <tr>
                      <td colSpan="2" className="murakami-last-data">プロステップは別紙です</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
      <div>
        <table className="taiyo-table">
          <thead>
            <tr className="kinbato-header">
              <th colSpan="2" className="murakami-top-data">プロステップヘアカラー</th>
            </tr>
          </thead>
        </table>
        {subdata.map((row, index) => {
          const matchdata = subData.filter(rowdata => rowdata[1] === row);
          return (
            <table className="taiyo-table">
              <thead>
                <tr className="murakami-header">
                  <th colSpan="2" className="murakami-store-data">{row}</th>
                </tr>
              </thead>
              <tbody>
                {matchdata.map((Idata, Iindex) => (
                  <tr key={Iindex}>
                    <td className="murakami-name-data">{Idata[5]}</td>
                    <td className="murakami-num-data">{Idata[6]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        })}
      </div>
    </div>
  );  
}