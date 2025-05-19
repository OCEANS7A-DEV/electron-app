import React, { useState, ChangeEvent, useEffect } from 'react'
import Select from 'react-select'
import { useLoaderData } from "react-router-dom"

import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Button, IconButton } from '@mui/material';
import '../css/setting.css'
import { Height } from '@mui/icons-material';





type FormValues = {
  rows: {
    vendor: string
  }[]
}




export const loader = async () => {
  const Lists = await window.myInventoryAPI.ListGet({
    sheetName: 'その他一覧',
    action: 'ListGet',
    ranges: 'A2:N'
  })
  console.log(Lists)

  const vendorData = Lists.map(item => item[3])
  return { Lists, vendorData }
}

export default function VendorDataUpDate() {
  const { Lists, vendorData } = useLoaderData<typeof loader>()

  console.log(Lists)
  const test = Lists.map(item => item[3])
  console.log(test)
  const NumberOfStores = vendorData.length

  const StoreDataDefaultSet = () => {
    const result = vendorData.map(item => {
      const resultdata = {
        vendor: item
      }
      return resultdata
    })
    return result
  }

  const { control, register, handleSubmit, getValues, watch, setValue, reset } =
    useForm<FormValues>({
      defaultValues: {
        rows: StoreDataDefaultSet()
      }
    })
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rows'
  })


  const deleteRow = (index) => {
    remove(index)
  }



  const appendStore = () => {
    append({
      vendor: '',
    })
  }

  const sendData = () => {
    const data = getValues().rows
    console.log(data)
    const senddata = data.map(item => {
      const result = [
        item.vendor
      ]
      return result
    })
    console.log(senddata)
    storedataUpdate(senddata)
  }

  const storedataUpdate = (storedata) => {
    window.myInventoryAPI.DataInsert({
      sheetName: 'その他一覧',
      action: 'ListcellUpdate',
      updataValue: storedata,
      clearNumber: NumberOfStores,
      updataColumnNumber: 4,
      updataColumnNums: 1,
    })
  }




  return (
    <div className="settingUpdateArea">
      <div>
        <div>
          <div>業者データ設定</div>
          <div>現在のデータ上の業者数:{NumberOfStores}</div>
          <div>
            {fields.map((field, index) => (
              <div key={field.id} className="storeupdateArea">
                <div style={{minWidth: 25, display: 'flex'}}>
                  <div className="setting-rowNumber">{index}</div>
                </div>
                <input
                  style={{height: 32}}
                  {...register(`rows.${index}.vendor`)}
                  placeholder="業者名"
                />
                <Button variant='outlined' onClick={() => deleteRow(index)}>削除</Button>
              </div>
            ))}
          </div>
          <div className="buttonArea">
            <Button variant='outlined' onClick={() => appendStore()}>追加</Button>
            <Button variant='outlined' onClick={() => sendData()}>データ送信</Button>
          </div>
        </div>
      </div>
    </div>
  )
}