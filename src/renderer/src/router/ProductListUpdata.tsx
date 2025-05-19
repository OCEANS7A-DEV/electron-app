
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useLoaderData } from "react-router-dom";
import LinkBaner from '../comp/Linkbanar'
import Select from 'react-select'
import '../css/ProductsEdit.css'
import { Button } from '@mui/material'
import Switch from '@mui/material/Switch'
import { LinearProgress } from '@mui/material';


type FormValues = {
  rows: {
    vendor: { value: string; label: string } | null
    code: string
    name: string
    defPrice: string
    newPrice: string
    VCPrice: string
    valuePrice: string
    type: { value: string; label: string } | null
    remarks: string
    possibility: boolean
    service: string
    orderNum: string
  }[]
}


export const loader = async () => {
  const vendorData = await window.myInventoryAPI.VendorData() ?? []
  const Lists = await window.myInventoryAPI.ListGet({
    sheetName: '在庫一覧',
    action: 'ListGet',
    ranges: 'A2:L'
  })

  const etcList =  await window.myInventoryAPI.ListGet({
    sheetName: 'その他一覧',
    action: 'ListGet',
    ranges: 'A2:F'
  })

  const vendorSelect = vendorData.map(item => {
    const result = {value: item[0], label: item[0]}
    return result
  })

  const types = etcList
  .filter(item => item[5] && item[5] !== "")
  .map(item => ({ value: item[5], label: item[5] }));


  return {vendorSelect, Lists, types}
}


export default function ProductDetailChangePage() {
  const { vendorSelect, Lists, types } = useLoaderData<typeof loader>()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const defListsLength = Lists.length


  const StoreDataDefaultSet = () => {
    const result = Lists.map(item => {
      const resultdata = {
        vendor: {value: item[0], label: item[0]},
        code: item[1],
        name: item[2],
        defPrice: item[3],
        newPrice: item[4],
        VCPrice: item[5],
        valuePrice: item[6],
        type: {value: item[7], label: item[7]},
        remarks: item[8],
        possibility: item[9] === false ? false : true,
        service: item[10],
        orderNum: item[11]
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

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: 'rows'
  })

  const NewRowInsert = (row) => {
    insert(row, {
      vendor: null,
      code: '',
      name: '',
      defPrice: '',
      newPrice: '',
      VCPrice: '',
      valuePrice: '',
      type: null,
      remarks: '',
      possibility: false,
      service: '',
      orderNum: ''
    })
  }

  const dialogOpen = (index) => {
    setSelectedRowIndex(index)
    setModalOpen(true)
  }

  const ListReacquisition = async() => {
    setLoading(true)
    const Lists = await window.myInventoryAPI.ListGet({
      sheetName: '在庫一覧',
      action: 'ListGet',
      ranges: 'A2:L'
    })
    const result = Lists.map(item => {
      const resultdata = {
        vendor: {value: item[0], label: item[0]},
        code: item[1],
        name: item[2],
        defPrice: item[3],
        newPrice: item[4],
        VCPrice: item[5],
        valuePrice: item[6],
        type: {value: item[7], label: item[7]},
        remarks: item[8],
        possibility: item[9] === false ? false : true,
        service: item[10],
        orderNum: item[11]
      }
      return resultdata
    })
    reset({ rows: result })
    setLoading(false)
  }


  const ProductDataUpdata = async() => {
    const data = getValues().rows
    const newData = data.map(item => {
      const result = [
        item.vendor?.value,
        item.code,
        item.name,
        item.defPrice,
        null,
        item.VCPrice,
        item.valuePrice,
        item.type?.value,
        item.remarks,
        item.possibility ?? '',
        item.service,
        item.orderNum
      ]
      return result
    })
    console.log(newData)
    window.myInventoryAPI.DataInsert({
      sheetName: '在庫一覧テスト',
      action: 'ListcellUpdate',
      updataValue: newData,
      clearNumber: defListsLength,
      updataColumnNumber: 1,
      updataColumnNums: 12,
    })
  }


  return(
    <div>
      <div>
        <LinkBaner />
        {loading && (
          <div
            className="LinearProgress"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              zIndex: 300,
            }}
          >
            <LinearProgress sx={{ width: "100%", height: 2 }}/>
          </div>
        )}
      </div>
      <div style={{paddingLeft: 20}}>
        <table className="productRow">
          <thead>
            <tr style={{color: 'white', posision: 'sticky', top: 80}}>
              <th>業者</th>
              <th>商品コード</th>
              <th>商品名</th>
              <th>最新価格</th>
              <th>商品タイプ</th>
              <th>可否</th>
              <th>詳細</th>
              <th>行の編集</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((fields, index) => (
              <tr key={fields.id}>
                <td>
                  <Controller
                    name={`rows.${index}.vendor`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={vendorSelect}
                        placeholder="業者"
                        isClearable
                        className="insert_Select"
                        menuPlacement="auto"
                        menuPortalTarget={document.body}
                      />
                    )}
                  />
                </td>
                <td>
                  <input
                    style={{height: 32, width: 80, textAlign: 'right'}}
                    {...register(`rows.${index}.code`)}
                  />
                </td>
                <td>
                  <input
                    style={{height: 32, width: 300, textAlign: 'left'}}
                    {...register(`rows.${index}.name`)}
                  />
                </td>
                <td>
                  <input
                    style={{height: 32, width: 80, textAlign: 'right'}}
                    {...register(`rows.${index}.newPrice`)}
                  />
                </td>
                <td>
                  <Controller
                    name={`rows.${index}.type`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={types}
                        placeholder="タイプ"
                        isClearable
                        className="insert_Select"
                        menuPlacement="auto"
                        menuPortalTarget={document.body}
                      />
                    )}
                  />
                </td>
                <td>
                  <Controller
                    name={`rows.${index}.possibility`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Switch
                        checked={value}
                        onChange={onChange}
                        color="primary"
                      />
                    )}
                  />
                </td>
                <td>
                  <Button variant='outlined' onClick={() => dialogOpen(index)}>
                    編集
                  </Button>
                </td>
                <td>
                  <div style={{whiteSpace: 'nowrap'}}>
                    <Button variant='outlined' onClick={() => NewRowInsert(index)}>
                      追加
                    </Button>
                    <Button variant='outlined' onClick={() => remove(index)}>
                      削除
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={`modalOverlay ${modalOpen ? 'open' : ''}`}>
        {selectedRowIndex !== null && (
          <div className="modalContent">
            <h3>詳細編集</h3>
            <div style={{display: 'flex'}}>
              <label style={{display: 'flex', alignItems: 'center', padding: '0px 10px'}}>商品名:</label>
              <div style={{ padding: '6px 0', fontWeight: 'bold' }}>
                {getValues(`rows.${selectedRowIndex}.name`)}
              </div>
            </div>
            <div style={{display: 'flex'}}>
              <div className="price-div">
                <label style={{display: 'flex', alignItems: 'center', padding: '0px 10px'}}>初期価格</label>
                <input
                  style={{height: 32, width: 80, textAlign: 'right'}}
                  {...register(`rows.${selectedRowIndex}.defPrice`)}
                />
              </div>
              <div className="price-div">
                <label style={{display: 'flex', alignItems: 'center', padding: '0px 10px'}}>最新価格</label>
                <input
                  style={{height: 32, width: 80, textAlign: 'right'}}
                  {...register(`rows.${selectedRowIndex}.newPrice`)}
                />
              </div>
              <div className="price-div">
                <label style={{display: 'flex', alignItems: 'center', padding: '0px 10px'}}>VC価格</label>
                <input
                  style={{height: 32, width: 80, textAlign: 'right'}}
                  {...register(`rows.${selectedRowIndex}.VCPrice`)}
                />
              </div>
              <div className="price-div">
                <label style={{display: 'flex', alignItems: 'center', padding: '0px 10px'}}>店販価格</label>
                <input
                  style={{height: 32, width: 80, textAlign: 'right'}}
                  {...register(`rows.${selectedRowIndex}.valuePrice`)}
                />
              </div>
            </div>
            <div>
              <label style={{display: 'flex', alignItems: 'center', padding: '0px 10px'}}>備考:</label>
              <Controller
                name={`rows.${selectedRowIndex}.remarks`}
                control={control}
                render={({ field }) => (
                  <textarea {...field} style={{ width: '100%', height: 100 }} />
                )}
              />
            </div>
            <div style={{display: 'flex'}}>
              <label style={{display: 'flex', alignItems: 'center', padding: '0px 10px'}}>サービス:</label>
              <Controller
                name={`rows.${selectedRowIndex}.service`}
                control={control}
                render={({ field }) => (
                  <input {...field} />
                )}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <Button variant='outlined' onClick={() => setModalOpen(false)}>
                保存して閉じる
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="Product-Bottom-button-area">
        <div>
          <Button variant='outlined' onClick={() => ListReacquisition()}>
            再取得
          </Button>
        </div>
        <div>
          <Button variant='outlined' onClick={() => ProductDataUpdata()}>
            データ送信
          </Button>
        </div>
      </div>
    </div>
  )
}

