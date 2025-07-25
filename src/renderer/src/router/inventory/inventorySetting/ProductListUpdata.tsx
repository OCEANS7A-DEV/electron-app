/* eslint-disable @typescript-eslint/ban-ts-comment */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useForm, useFieldArray, Controller, Control } from 'react-hook-form'
import { useLoaderData } from "react-router-dom"
import LinkBaner from '../../../comp/Linkbanar'

import { Select, MenuItem, Tooltip, Box } from '@mui/material'

import { FixedSizeList as List, ListChildComponentProps } from 'react-window'

import '../../../css/ProductsEdit.css'
import { Button } from '@mui/material'
import Switch from '@mui/material/Switch'
import { LinearProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import toast, { Toaster } from 'react-hot-toast';

import AddProductDialogTable from '../../../comp/NewProduct';
import SweetAlert2 from 'react-sweetalert2';


import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  //arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'





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

const defaultRowData = {
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
}

type RowData = {
  id: string
  vendor: { value: string; label: string } | null
  code: string
  name: string
  newPrice: string
  type: { value: string; label: string } | null
}

type RowItemData = {
  rows: RowData[];
  control: Control<FormValues>;
  dialogOpen: (index: number) => void;
  NewRowInsert: (index: number) => void;
  remove: (index: number) => void;
};

function Row({
  index,
  style,
  data: { rows, control, dialogOpen, NewRowInsert, remove }
}: ListChildComponentProps<RowItemData>)
{
  const item = rows[index]
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id })

  const combinedStyle: React.CSSProperties = {
    ...style,
    transform: CSS.Transform.toString(transform),
    transition,
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  }

  return (
    <div key={item.id} ref={setNodeRef} style={combinedStyle} {...attributes} {...listeners}>
      <div className="virtual-table-row">
        <div
          style={{
            cursor: 'grab',
            padding: '4px 8px',
            background: '#ddd',
            borderRadius: '4px',
            userSelect: 'none',
          }}
        >
          ::
        </div>
        <div className="virtual-table-cell cell-vendor">
          <div className="div-vendor">
            {item.vendor?.value}
          </div>
        </div>
        <div className="virtual-table-cell cell-code">
          <Controller
            name={`rows.${index}.code`}
            control={control}
            defaultValue={item.code}
            render={({ field }) => (
              <input
                {...field}
                style={{ height: 32, width: '100%', textAlign: 'right' }}
              />
            )}
          />
        </div>
        <div className="virtual-table-cell cell-name">
          <Box className="div-name" style={{ display: 'flex' }}>
            <LockOutlinedIcon fontSize="small" style={{ marginLeft: 2, color: '#aaa' }} />
            <div>
              {item.name}
            </div>
          </Box>
        </div>
        <div className="virtual-table-cell cell-price">
          {/* @ts-ignore */}
          <Tooltip title="最新価格は自動反映されます" arrow>
            <Box className="new-price" style={{display: 'flex'}}>
              <LockOutlinedIcon fontSize="small" style={{ marginLeft: 2, color: '#aaa' }} />
              <div>
                {Number(item.newPrice || 0).toLocaleString()}
              </div>
            </Box>
          </Tooltip>
        </div>
        <div className="virtual-table-cell cell-type">
          <div className="div-vendor">
            {item.type?.value}
          </div>
        </div>
        <div className="virtual-table-cell cell-dialog">
          <Button
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation()
              dialogOpen(index)
            }}
          >
            編集
          </Button>
        </div>
        <div className="virtual-table-cell cell-actions">
          <div style={{ whiteSpace: 'nowrap' }}>
            <Button variant="outlined" onClick={() => NewRowInsert(index)}>追加</Button>
            <Button variant="outlined" onClick={() => remove(index)}>削除</Button>
          </div>
        </div>
      </div>
    </div>
  )
}






// type SortableRowProps = {
//   id: string
//   children: (handleListeners: ReturnType<typeof useSortable>['listeners']) => React.ReactNode
// }

// const SortableRow: React.FC<SortableRowProps> = React.memo(({ id, children }) => {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//   } = useSortable({ id })

//   const style: React.CSSProperties = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   }

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...attributes}
//       {...listeners}
//     >
//       {children(listeners)}
//     </div>
//   )
// })



export const loader = async () => {
  const vendorData = await window.myInventoryAPI.VendorData() ?? []
  //console.log(vendorData)
  const Lists = await window.myInventoryAPI.ListGet({
    sheetName: '在庫一覧テスト',
    action: 'ListGet',
    ranges: 'B3:L'
  })

  const typeList = await window.myInventoryAPI.ListGet({
    sheetName: '商品タイプ一覧',
    action: 'ListGet',
    ranges: 'A2:B'
  })

  const vendorSelect = vendorData.filter(row => row[0] !== "").map(item => {
    const result = { value: item[1], label: item[1], id: item[0] }
    return result
  })

  const types = typeList
  .filter(item => item[0] && item[0] !== "")
  .map(item => ({ value: item[1], label: item[1], id: item[0] }));
  return { vendorSelect, Lists, types }
}


export default function ProductDetailChangePage() {
  const { vendorSelect, Lists, types } = useLoaderData<typeof loader>()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)
  const [addRowIndex, setAddRowIndex] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  const [InsertDate, setDate] = useState<string>('')

  const [height, setHeight] = useState<number>(0);
  //console.log(height)

  const [swalProps, setSwalProps] = useState({})

  const addDialogRef = useRef<any>(null)

  const swalWindow = async () => {
    setSwalProps({
      show: true,
      title: '入力データ',
      preConfirm: () => {
        const data = addDialogRef.current.getFormData()
        if (data.code == ''){
          toast.error('商品コードを入力してください')
          return false
        } else if (data.name == ''){
          toast.error('商品名を入力してください')
          return false
        }
        const filterData = getValues().rows.filter((row) => row.code !== '')
        const search = filterData.find(item => item.code == data.code)
        if ((data && !search) || (data && search && !search.possibility)){
          //setSwalProps({ show: false })
          ProductNewDataInsert(data)
          toast.success('送信しました(開発中では閉じない)')
          return false
        } else if (!data) {
          toast.error('送信できるデータがありません')
          return false
        } else if (data && search && search.possibility){
          toast.error('その商品コードはすでに存在しています')
          return false
        }
        return
      }
    })
  }


  const ProductNewDataInsert = async (data) => {

    const now = InsertDate.replace(/-/g, '/')
    const insertResult = ['商品コード']
    Object.keys(data).forEach(async (item) => {
      let sheet
      let insertData
      if (item == 'name' && data.name !== ''){
        insertData = [data.code, data.name, now]
        sheet = '商品名'
      } else if (item == 'newPrice' && data.newPrice !== ''){
        insertData = [data.code, data.newPrice, now]
        sheet = '価格'
      } else if (item == 'VCPrice' && data.VCPrice !== ''){
        insertData = [data.code, data.VCPrice, now]
        sheet = 'VC価格'
      } else if (item == 'valuePrice' && data.valuePrice !== ''){
        insertData = [data.code, data.valuePrice, now]
        sheet = '店販'
      } else if (item == 'remarks' && data.remarks !== ''){
        insertData = [data.code, data.remarks, now]
        sheet = '備考'
      } else if (item == 'possibility' && data.possibility !== ''){
        insertData = [data.code, data.possibility, now]
        sheet = '発注可否'
      } else if (item == 'service' && data.service !== ''){
        insertData = [data.code, data.service, now]
        sheet = 'サービス数'
      } else if (item == 'type' && data.type){
        console.log(data.type)
        insertData = [data.code, data.type?.value ?? '', now]
        sheet = '商品タイプ'
      } else if (item == 'vendor' || item == 'code' || item == 'defPrice') {
        //console.log('キャンセル')
        return
      } else {
        //console.log('キャンセル')
        return
      }
      await window.myInventoryAPI.DataInsert({
        sheetName: sheet,
        action: 'DataHistory',
        data: [insertData],
      })
    })
    toast.success(`${insertResult}の登録が完了しました`)
  }

  useEffect(() => {
    const updateHeight = () => {
      const vh = window.innerHeight;
      setHeight(vh - 160);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    //dialogOpen(0)
    return () => window.removeEventListener('resize', updateHeight);
    
  }, [])

  useEffect(() => {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    setDate(`${yyyy}-${mm}-${dd}`)
  }, [])

  const StoreDataDefaultSet = () => {
    return Lists.map(item => ({
      vendor: vendorSelect.find(row => row.id == item[0]) ?? null,
      code: item[1],
      name: item[2],
      newPrice: String(item[3]),
      VCPrice: String(item[4]),
      valuePrice: String(item[5]),
      type: types.find(row => row.id == item[6]) ?? null,
      remarks: item[7],
      possibility: item[8] === false ? false : true,
      service: item[9],
      orderNum: item[10],
    }))
  }

  const defaultRows = useRef(StoreDataDefaultSet())

  const { control, register, getValues, reset } =
    useForm<FormValues>({
      defaultValues: {
        rows: defaultRows.current,
      }
    })

  const { fields, append, remove, insert, move, watch } = useFieldArray({
    control,
    name: 'rows'
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const NewRowInsert = (row) => {
    insert(row, defaultRowData)
  }

  const dialogOpen = useCallback((index) => {
    console.log(index)
    setSelectedRowIndex(index)
    setModalOpen(true)
    setAddRowIndex(index)
  }, []);

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
    append(defaultRowData)
  } 


  // const ProductDataUpdata = async() => {
  //   const data = getValues().rows
  //   const newData = data.map(item => {
  //     const result = [
  //       item.vendor?.value,
  //       item.code,
  //       item.name,
  //       item.defPrice,
  //       null,
  //       item.VCPrice,
  //       item.valuePrice,
  //       item.type?.value,
  //       item.remarks,
  //       item.possibility ?? '',
  //       item.service,
  //       item.orderNum
  //     ]
  //     return result
  //   })
  //   //console.log(newData)
  //   await window.myInventoryAPI.DataInsert({
  //     sheetName: '在庫一覧',
  //     action: 'ListcellUpdate',
  //     updataValue: newData,
  //     clearNumber: defListsLength,
  //     updataColumnNumber: 1,
  //     updataColumnNums: 12,
  //     formulaConfig: {
  //       targetCol: 5,
  //       formula: `=IF(XLOOKUP(RC2,'最新単価'!C1,'最新単価'!C2,RC4)="", RC4, XLOOKUP(RC2,'最新単価'!C1,'最新単価'!C2,RC4))`
  //     }
  //   })
  // }

  const getDiffKeys = (newData: Record<string, any>, originalData: Record<string, any>) => {
    return Object.keys(newData).filter(key => {
      const a = newData[key];
      const b = originalData[key];

      // 両方オブジェクト（nullも弾く）で、valueキーがあるなら value を比較
      if (
        typeof a === 'object' &&
        typeof b === 'object' &&
        a !== null &&
        b !== null &&
        'value' in a &&
        'value' in b
      ) {
        return a.value !== b.value;
      }

      return a !== b;
    });
  }

  const movingRow = (active, over): void => {
    if (active.id !== over?.id && over) {
      const oldIndex = fields.findIndex((f) => f.id === active.id)
      const newIndex = fields.findIndex((f) => f.id === over?.id)
      move(oldIndex, newIndex);
    }
    const listdata = getValues()
      .rows.map((item) => [item.code])
      .filter((item) => item[0] !== '')
    console.log(listdata)
    window.myInventoryAPI.DataInsert({
      action: 'codeOrder',
      sub_action: 'insert',
      data: listdata,
    })
  }

  const update = async (index): Promise<void> => {
    const data = getValues().rows[index]
    const search = defaultRows.current.find((item) => item.code == data.code)
    if (search) {
      const original = defaultRows.current[index]
      const diffKeys = getDiffKeys(data, original)
      if (diffKeys.length === 0) {
        toast.error('変更箇所はありません')
        setModalOpen(false)
        return
      }
      const now = new Date().toLocaleString()
      diffKeys.forEach(async (item) => {
        let sheet
        let insertData
        if (item == 'name'){
          insertData = [data.code, data.name, now]
          sheet = '商品名'
        } else if (item == 'newPrice'){
          insertData = [data.code, data.newPrice, now]
          sheet = '価格'
        } else if (item == 'VCPrice'){
          insertData = [data.code, data.VCPrice, now]
          sheet = 'VC価格'
        } else if (item == 'valuePrice'){
          insertData = [data.code, data.valuePrice, now]
          sheet = '店販'
        } else if (item == 'remarks'){
          insertData = [data.code, data.remarks, now]
          sheet = '備考'
        } else if (item == 'possibility'){
          insertData = [data.code, data.possibility, now]
          sheet = '発注可否'
        } else if (item == 'service'){
          insertData = [data.code, data.service, now]
          sheet = 'サービス数'
        }

        await window.myInventoryAPI.DataInsert({
          sheetName: sheet,
          action: 'DataHistory',
          sub_action: 'insert',
          updataValue: insertData,
        })
      })
      setModalOpen(false)
    }
  }


  const DialogClosed = async (e) => {
    if (e.target === e.currentTarget){
      setModalOpen(false)
    }
  }


  return(
    <div>
      <div>
        <LinkBaner id="zaiko" />
        <Toaster />
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
      <div style={{ paddingLeft: 20 }}>
        <div className="productRow-header">
          <div className="virtual-table-cell cell-vendor">業者</div>
          <div className="virtual-table-cell cell-code">商品コード</div>
          <div className="virtual-table-cell cell-name">商品名</div>
          <div className="virtual-table-cell cell-price">最新価格</div>
          <div className="virtual-table-cell cell-type">商品タイプ</div>
          <div className="virtual-table-cell cell-dialog">編集</div>
          <div className="virtual-table-cell cell-actions">行の編集</div>
        </div>
        <div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={({ active, over }) => {
              movingRow(active, over)
            }}
          >
            <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
              <List
                className="no-scrollbar"
                height={window.innerHeight - 160}
                width="100%"
                itemCount={fields.length}
                itemSize={48}
                itemData={{
                  rows: fields,
                  control,
                  dialogOpen,
                  NewRowInsert,
                  remove,
                }}
              >
                {Row}
              </List>
            </SortableContext>
          </DndContext>
        </div>
      </div>
      <div className={`modalOverlay ${modalOpen ? 'open' : ''}`} onClick={DialogClosed}>
        {selectedRowIndex !== null && (
          <div className="modalContent">
            <h3>編集</h3>
            <div style={{ display: 'flex' }}>
              <label style={{ display: 'flex', alignItems: 'center', padding: '0px 10px' }}>
                商品コード:
              </label>
              <div>
                {getValues(`rows.${selectedRowIndex}.code`)}
              </div>
            </div>
            <div style={{display: 'flex'}}>
              <label style={{ display: 'flex', alignItems: 'center', padding: '0px 10px' }}>
                商品名:
              </label>
              <input
                style={{ height: 32 }}
                {...register(`rows.${selectedRowIndex}.name`)}
              />
            </div>
            <div style={{ display: 'flex', margin: '10px 0px' }}>
              <div className="div-vendor">
                <LockOutlinedIcon fontSize="small" style={{ marginLeft: 2, color: '#aaa' }} />
                {getValues(`rows.${selectedRowIndex}.vendor`)?.value ?? ''}
              </div>
              <Controller
                name={`rows.${selectedRowIndex}.type`}
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
              <div style={{ display: 'flex', marginLeft: 4, alignItems: 'center' }}>
                <div>注文可否:</div>
                <Controller
                  name={`rows.${selectedRowIndex}.possibility`}
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
              
            </div>
            <div style={{display: 'flex'}}>
              <div className="price-div">
                <label style={{ display: 'flex', alignItems: 'center', padding: '0px 10px' }}>
                  価格
                </label>
                <input
                  style={{ height: 32, textAlign: 'right', width: 80 }}
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
            <div style={{ display: 'flex' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ alignItems: 'center', padding: '0px 10px' }}>注文単位:</label>
                <Controller
                  name={`rows.${selectedRowIndex}.orderNum`}
                  control={control}
                  render={({ field }) => (
                    <input {...field}
                      style={{ width: 60 }}
                    />
                  )}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ alignItems: 'center', padding: '0px 10px' }}>サービス:</label>
                <Controller
                  name={`rows.${selectedRowIndex}.service`}
                  control={control}
                  render={({ field }) => (
                    <input {...field} style={{ width: 60 }} />
                  )}
                />
              </div>
              
            </div>
            <div style={{ marginTop: 10 }}>
              <Button variant='outlined' onClick={() => update(selectedRowIndex)}>更新</Button>
              {/* <Button variant='outlined' onClick={() => setModalOpen(false)}>
                保存して閉じる
              </Button> */}
            </div>
          </div>
        )}
      </div>
      <SweetAlert2
        {...swalProps}
        didClose={() => {
          console.log('ダイアログが閉じられました');
          setSwalProps({ show: false })
        }}
      >
        <AddProductDialogTable
          addRowNumber={addRowIndex}
          ref={addDialogRef}
        />
      </SweetAlert2>
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
          <Button variant="outlined" onClick={swalWindow}>新規商品追加</Button>
          <Button variant='outlined' onClick={() => console.log(getValues().rows)}>テスト</Button>
          {/* <Button variant='outlined' onClick={() => ProductDataUpdata()}>
            データ送信
          </Button> */}
        </div>
      </div>
    </div>
  )
}

