import React from 'react'
import { useLoaderData } from "react-router-dom"

import LinkBaner from '../../comp/Linkbanar'
import '../../css/setting.css'

import StoreDataUpDate from '../../comp/storeDataUpdate'
import VendorDataUpDate from '../../comp/vendorDataUpdata'
import TypeDataUpDate from '../../comp/productType'


import { Button } from '@mui/material'




export const loader = async () => {
  const Vendors = await window.myInventoryAPI.ListGet({
    sheetName: '業者一覧',
    action: 'ListGet',
    ranges: 'A2:B'
  })

  const Types = await window.myInventoryAPI.ListGet({
    sheetName: '商品タイプ一覧',
    action: 'ListGet',
    ranges: 'A2:B'
  })

  const Stores = await window.myInventoryAPI.ListGet({
    sheetName: '店舗一覧',
    action: 'ListGet',
    ranges: 'A2:C'
  })

  const storeData = Stores?.filter(item => item[0] !== "")
  const vendorData = Vendors?.filter(item => item[0] !== "")

  const typeData = Types?.filter(item => item[0] !== "")
  return { storeData, vendorData, typeData }
}

export default function SettingPage() {
  const { storeData, vendorData, typeData } = useLoaderData<typeof loader>()


  const test = async() => {
    const result = await window.myInventoryAPI.storeGet('')
    console.log(result)
  }

  return (
    <>
      <div>
        <LinkBaner id="zaiko" />
      </div>
      <div style={{color: 'white', paddingTop: 60, paddingLeft: 20}}>
        <div>
          在庫管理設定ページ
        </div>
        <div style={{display: 'flex'}} className="setting-area">
          <div>
            <StoreDataUpDate
              storeData={storeData}
            />
          </div>
          <div>
            <VendorDataUpDate
              vendorData={vendorData}
            /> 
          </div>
          <div>
            <TypeDataUpDate
              typeData={typeData}
            />
          </div>
          <div>
            <Button variant="outlined" onClick={test}>test</Button>
          </div>
        </div>
      </div>
    </>
  )
}
