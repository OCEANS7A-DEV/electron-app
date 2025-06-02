import React from 'react'
import Select from 'react-select'

import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Button } from '@mui/material'
import '../css/setting.css'



// interface SelectOption {
//   value: string
//   label: string
// }


type FormValues = {
  rows: {
    id: string
    store: string
    type: { value: string; label: string } | null
  }[]
}


export default function StoreDataUpDate({storeData}) {


  const NumberOfStores = storeData.length

  const StoreDataDefaultSet = () => {
    const result = storeData.map(item => {
      const resultdata = {
        id: item[0],
        store: item[1],
        type: {value: item[2], label: item[2]},
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
      id: '',
      store: '',
      type: null,
    })
  }

  const sendData = () => {
    const data = getValues().rows
    console.log(data)
    const senddata = data.map(item => {
      const result = [
        item.id,
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
      updataColumnNums: 3,
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
                <input
                  style={{ width: 40 }}
                  {...register(`rows.${index}.id`)}
                  placeholder='ID'
                />
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