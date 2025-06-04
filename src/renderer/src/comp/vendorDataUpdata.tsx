import React from 'react'

import { useForm, useFieldArray } from 'react-hook-form'
import { Button } from '@mui/material';
import '../css/setting.css'





type FormValues = {
  rows: {
    id: string
    vendor: string
  }[]
}






export default function VendorDataUpDate({ vendorData }) {

  const NumberOfStores = vendorData.length

  const StoreDataDefaultSet = () => {
    const result = vendorData.map(item => {
      const resultdata = {
        id: item[0],
        vendor: item[1]
      }
      return resultdata
    })
    return result
  }

  const { control, register, getValues } =
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
      id: '',
      vendor: '',
    })
  }

  const sendData = () => {
    const data = getValues().rows
    console.log(data)
    const senddata = data.map(item => {
      const result = [
        item.id,
        item.vendor
      ]
      return result
    })
    console.log(senddata)
    storedataUpdate(senddata)
  }

  
  const storedataUpdate = (storedata) => {
    window.myInventoryAPI.DataInsert({
      sheetName: '業者一覧',
      action: 'ListcellUpdate',
      updataValue: storedata,
      clearNumber: NumberOfStores,
      updataColumnNumber: 1,
      updataColumnNums: 2,
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
                <input
                  style={{ height: 32, width: 40, textAlign: 'right' }}
                  {...register(`rows.${index}.id`)}
                  placeholder='ID'
                />
                <input
                  style={{ height: 32, width: 200 }}
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