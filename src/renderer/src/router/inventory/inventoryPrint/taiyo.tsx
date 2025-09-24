import React, { useEffect } from 'react'
import type { JSX } from 'react'
import '../../../css/taiyoPrint.css'
import { useLoaderData } from 'react-router-dom'
import { Button } from '@mui/material'



const isoToJstYMD = (isoString): string => {
  const date = new Date(isoString)
  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000)
  const yyyy = jst.getFullYear()
  const mm = String(jst.getMonth() + 1).padStart(2, '0')
  const dd = String(jst.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export const loader = async ({ request }: { request: Request }) => {
  let taiyoData: string[][] = []
  const addressData = await window.myInventoryAPI.storeGet('address')
  console.log(addressData)
  const url = new URL(request.url)
  const date = url.searchParams.get('date')
  const vendor = url.searchParams.get('vendor')
  const address = url.searchParams.get('address')
  if (address !== '会議室'){
    const resultData = await window.myInventoryAPI.ListGet({
      sheetName: '一覧',
      action: 'TotallingGet',
      ranges: 'A2:O'
    })
    const donotOrder = [2001, 2002, 2003]
    const codeList = resultData.map((item) => item[2])
    const filterd = resultData.filter(
      (row) => row[1] === vendor && row[14] < 0 && !donotOrder.includes(row[2])
    )
    const orderResult = filterd.map((item) => {
      let shortageNum = Number(item[14])
      let num = 0
      if (item[8] !== '' && Number(item[8]) > 0) {
        let up = Number(item[8])
        if (item[1] == 2002){
          up = up * 2
        }
        while (shortageNum < 0) {
          shortageNum = shortageNum + up
          num = num + up
        }
        return ['', item[3], num, '', '', '']
      } else {
        return ['', item[3], Number(item[14]) * -1, '', '', '']
      }
    })
    taiyoData = orderResult

    const Order = await window.myInventoryAPI.ListGet({
      sheetName: '店舗へ',
      action: 'InputDataGet',
      ranges: 'A2:M'
    })
    const filter = Order.filter((item) => isoToJstYMD(item[0]) == date)
    const Notlisted = filter.filter(
      (item) => item[2].includes('大洋') && !codeList.includes(item[3])
    )
    Notlisted.forEach((item) => {
      const result = [item[3], item[4], item[6], '', item[7], '']
      taiyoData.push(result)
    })
  } else {
    const data = await window.myInventoryAPI.ListGet({
      sheetName: '店舗へ',
      action: 'InputDataGet',
      ranges: 'A2:L'
    })
    const filtered = data.filter(
      (item) => isoToJstYMD(item[0]) == date && item[1] == address && item[2].includes('大洋')
    )
    const Inlist = filtered.map(item => {
      const result = ['', item[4], item[6] - item[7], '', '', '']
      return result
    })
    taiyoData = Inlist
  }

  const calcD = 16 - taiyoData.length
  for (let i = 0; i < calcD; i++){
    taiyoData.push(['', '', '', '', '', ''])
  }
  return { taiyoData, addressData, address }
}

export default function TaiyoPrint(): JSX.Element {
  const { taiyoData, addressData, address } = useLoaderData<typeof loader>()
  const ShippingAddress = addressData.find((item) => item[0] === address)
  const VendorData = addressData.find((item) => item[0] === '大洋商会')

  useEffect(() => {
    //window.myInventoryAPI.PrintReady()
  }, [])

  const Print = (): void => {
    window.myInventoryAPI.PrintReady()
  }

  return(
    <div className="taiyobackGround">
      <div className="PrintButton">
        <Button variant="outlined" onClick={Print}>
          印刷
        </Button>
      </div>
      <div className="taiyotop">
        <h1 className="taiyoH1">FAX注文書</h1>
      </div>
      <div className="sub_top">
        <div className="sub_top2">
          <h2 className="taiyo-Data"> </h2>
          <h2 className="taiyo-Data-name">㈱大洋商会  御中</h2>
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
              <th className="taiyo-number">
                カタログ
                <br />
                掲載番号
              </th>
              <th className="taiyo-name">商品名</th>
              <th className="taiyo-num">数量</th>
              <th className="taiyo-Dnum">
                ディーラー
                <br />
                価格
              </th>
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
                <td colSpan={6} className="special-row-saron">
                  <h2 className="sarontop">サロン直送</h2>
                  <div className="taiyo-saron-table">
                    <tr className="saronname">
                      <td className="sarontitle">サロン名</td>
                      <td className="saronData">{ShippingAddress[6]}</td>
                    </tr>
                    <tr className="saronname">
                      <td className="sarontitle">配送先</td>
                      <td className="saronData">
                        〒{ShippingAddress[4]} {ShippingAddress[5]}
                      </td>
                    </tr>
                    <tr className="saronname">
                      <td className="sarontitle">電話</td>
                      <td className="saronData">082-569-8401</td>
                    </tr>
                  </div>
                </td>
              </tr>
              <tr className="taiyo-saron-message">
                <td colSpan={6} className="special-row">
                  <h3 className="sarontop">
                    お世話になります。
                    <br />
                    ご注文よろしくお願いします
                  </h3>
                </td>
              </tr>
            </>
          </tbody>
        </table>
      </div>
    </div>
  )
};



