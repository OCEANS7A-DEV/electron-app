
import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useLoaderData } from "react-router-dom"
import LinkBaner from '../comp/Linkbanar'

import { Select, MenuItem, Tooltip } from '@mui/material'

import '../css/ProductsEdit.css'
import { Button } from '@mui/material'
import Switch from '@mui/material/Switch'
import { LinearProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';


import { FixedSizeList as List } from 'react-window';

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

  const vendorSelect = vendorData.filter(row => row[0] !== "").map(item => {
    const result = {value: item[0], label: item[0]}
    return result
  })

  const types = etcList
  .filter(item => item[5] && item[5] !== "")
  .map(item => ({ value: item[5], label: item[5] }));

  return { vendorSelect, Lists, types }
}


export default function ProductDetailChangePage() {
  const { vendorSelect, Lists, types } = useLoaderData<typeof loader>()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const defListsLength = Lists.length

  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const updateHeight = () => {
      const vh = window.innerHeight;
      setHeight(vh - 160);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

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

  const { control, register, getValues, reset } =
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

  const RowAppend = () => {
    append({
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
    //console.log(newData)
    await window.myInventoryAPI.DataInsert({
      sheetName: '在庫一覧',
      action: 'ListcellUpdate',
      updataValue: newData,
      clearNumber: defListsLength,
      updataColumnNumber: 1,
      updataColumnNums: 12,
      formulaConfig: {
        targetCol: 5,
        formula: `=IF(XLOOKUP(RC2,'最新単価'!C1,'最新単価'!C2,RC4)="", RC4, XLOOKUP(RC2,'最新単価'!C1,'最新単価'!C2,RC4))`
      }
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
        <div className="productRow-header">
          <div className="virtual-table-cell cell-vendor">業者</div>
          <div className="virtual-table-cell cell-code">商品コード</div>
          <div className="virtual-table-cell cell-name">商品名</div>
          <div className="virtual-table-cell cell-price">最新価格</div>
          <div className="virtual-table-cell cell-type">商品タイプ</div>
          <div className="virtual-table-cell cell-switch">可否</div>
          <div className="virtual-table-cell cell-dialog">詳細</div>
          <div className="virtual-table-cell cell-actions">行の編集</div>
        </div>
        <div>
          <List
            height={height}
            itemCount={fields.length}
            itemSize={48}
            width="1200px"
          >
            {({ index, style }) => {
              const field = fields[index]
              return (
                <div key={field.id} style={style} className="virtual-table-row">
                  <div className="virtual-table-cell cell-vendor">
                    <Controller
                      name={`rows.${index}.vendor`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          value={field.value?.value || ''}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            const selectedOption = vendorSelect.find(v => v.value === selectedValue) || null;
                            field.onChange(selectedOption);
                          }}
                          displayEmpty
                          size="small"
                          style={{ width: 160, backgroundColor: 'white' }}
                        >
                          <MenuItem value="">
                            <em>業者なし</em>
                          </MenuItem>
                          {vendorSelect.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </div>
                  <div className="virtual-table-cell cell-code">
                    <input
                      style={{ height: 32, width: '100%', textAlign: 'right' }}
                      {...register(`rows.${index}.code`)}
                    />
                  </div>
                  <div className="virtual-table-cell cell-name">
                    <input
                      style={{ height: 32, width: '100%', textAlign: 'left' }}
                      {...register(`rows.${index}.name`)}
                    />
                  </div>
                  <div className="virtual-table-cell cell-price">
                    <Tooltip title="最新価格は自動反映されます" arrow children={undefined}>
                      <div className="new-price" style={{display: 'flex'}}>
                        <LockOutlinedIcon fontSize="small" style={{ marginLeft: 2, color: '#aaa' }} />
                        <div>
                          {getValues(`rows.${index}.newPrice`).toLocaleString()}
                        </div>
                      </div>
                    </Tooltip>
                  </div>
                  <div className="virtual-table-cell cell-type">
                    <Controller
                      name={`rows.${index}.type`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          value={field.value?.value || ''}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            const selectedOption = types.find(t => t.value === selectedValue) || null;
                            field.onChange(selectedOption);
                          }}
                          displayEmpty
                          size="small"
                          style={{ width: 160, backgroundColor: 'white' }}
                        >
                          <MenuItem value="">
                            <em>タイプなし</em>
                          </MenuItem>
                          {types.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </div>
                  <div className="virtual-table-cell cell-switch">
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
                  </div>
                  <div className="virtual-table-cell cell-dialog">
                    <Button variant="outlined" onClick={() => dialogOpen(index)}>編集</Button>
                  </div>
                  <div className="virtual-table-cell cell-actions">
                    <div style={{ whiteSpace: 'nowrap' }}>
                      <Button variant="outlined" onClick={() => NewRowInsert(index)}>追加</Button>
                      <Button variant="outlined" onClick={() => remove(index)}>削除</Button>
                    </div>
                  </div>
                </div>
              )
            }}
          </List>
        </div>
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
                <label style={{ display: 'flex', alignItems: 'center', padding: '0px 10px' }}>
                  最新価格
                </label>
                <div className="detail-newprice">
                  <Tooltip title="最新価格は自動反映されます" arrow children={undefined}>
                    <div className="new-price" style={{display: 'flex'}}>
                      <LockOutlinedIcon fontSize="small" style={{ marginLeft: 2, color: '#aaa' }} />
                      <div>
                        {getValues(`rows.${selectedRowIndex}.newPrice`).toLocaleString()}
                      </div>
                    </div>
                  </Tooltip>
                </div>
                
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
          <Button variant='outlined' onClick={() => RowAppend()}>
            最終行追加
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

