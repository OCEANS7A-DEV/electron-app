import React from 'react'
//import Select from 'react-select'
import { useLoaderData } from "react-router-dom"

//import { useForm, useFieldArray, Controller } from 'react-hook-form'
import LinkBaner from '../comp/Linkbanar'
import '../css/setting.css'


import StoreDataUpDate from '../comp/storeDataUpdate'
import VendorDataUpDate from '@renderer/comp/vendorDataUpdata'



// interface SelectOption {
//   value: string
//   label: string
// }


// type FormValues = {
//   rows: {
//     vendor: { value: string; label: string } | null
//     code: string
//     name: string
//     quantity: string
//     price: string
//   }[]
// }



export const loader = async () => {
  const Lists = await window.myInventoryAPI.ListGet({
    sheetName: 'その他一覧',
    action: 'ListGet',
    ranges: 'A2:N'
  })
  const storeData = Lists.map(item => {
    const result = [item[0], item[1]]
    return result
  })
  const vendorData = Lists.map(item => item[3])
  //const storedata = await window.myInventoryAPI.shortageGet()
  return { Lists, storeData, vendorData }
}

export default function SettingPage() {
  const { Lists, storeData, vendorData } = useLoaderData<typeof loader>()
  console.log(Lists, storeData, vendorData)


  return (
    <>
      <div>
        <LinkBaner />
      </div>
      <div style={{color: 'white', paddingTop: 60, paddingLeft: 20}}>
        <div>
          設定ページ
        </div>
        <div style={{display: 'flex'}}>
          <StoreDataUpDate/>
          <VendorDataUpDate/>
        </div>
      </div>
    </>
  )
}