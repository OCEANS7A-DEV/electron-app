import React from 'react'
import Select from 'react-select'
import { useLoaderData } from "react-router-dom"

import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Button } from '@mui/material'
import '../css/setting.css'



// interface SelectOption {
//   value: string
//   label: string
// }


type FormValues = {
  rows: {
    store: string
    type: { value: string; label: string } | null
  }[]
}




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
  return { Lists, storeData }
}

export default function StoreDataUpDate() {
  const { Lists, storeData } = useLoaderData<typeof loader>()
  console.log(Lists)

  const NumberOfStores = storeData.length

  const StoreDataDefaultSet = () => {
    const result = storeData.map(item => {
      const resultdata = {
        store: item[0],
        type: {value: item[1], label: item[1]},
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

  const storeSelect = [
    {value: 'DM', label: 'DM'},
    {value: 'FC', label: 'FC'},
    {value: 'VC', label: 'VC'}
  ]

  const appendStore = () => {
    append({
      store: '',
      type: null,
    })
  }

  const sendData = () => {
    const data = getValues().rows
    console.log(data)
    const senddata = data.map(item => {
      const result = [
        item.store,
        item.type?.value ?? ''
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
      updataColumnNumber: 1,
      updataColumnNums: 2,
    })
  }

  



  return (
    <div className="settingUpdateArea">
      <div>
        <div>
          <div>店舗データ設定</div>
          <div>現在のデータ上の店舗数:{NumberOfStores}</div>
          <div>
            {fields.map((field, index) => (
              <div key={field.id} className="storeupdateArea">
                <div style={{minWidth: 25, display: 'flex'}}>
                  <div className="setting-rowNumber">{index}</div>
                </div>
                <input
                  {...register(`rows.${index}.store`)}
                  placeholder="店舗名"
                />
                <Controller
                  name={`rows.${index}.type`}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={storeSelect}
                      placeholder="形態"
                      isClearable
                      className="insert_Select"
                      menuPlacement="auto"
                      menuPortalTarget={document.body}
                    />
                  )}
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