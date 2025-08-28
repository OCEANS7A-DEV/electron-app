/* eslint-disable prettier/prettier */
import React, { useState, ChangeEvent, useEffect } from 'react'
import Select from 'react-select'
//import { useLoaderData } from 'react-router-dom'
import WordSearch from '../../../comp/ProductSearchWord'
import '../../../css/Receiving.css'
import { Button } from '@mui/material'
import LinkBaner from '../../../comp/Linkbanar'
import SendIcon from '@mui/icons-material/Send'
////import DeleteIcon from '@mui/icons-material/Delete'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import SweetAlert2 from 'react-sweetalert2';
import ConfirmDialogTable from '../../../comp/DialogTable'
import toast, { Toaster } from 'react-hot-toast';


// interface InsertData {
//   業者: { value: string; label: string }[]
//   商品コード: string
//   商品名: string
//   数量: string
//   商品単価: string
//   VendorList: { value: string; label: string }[]
// }

interface SelectOption {
  value: string
  label: string
  id: string
}

// interface InventoryDataType {
//   業者: string
//   商品コード: string
//   商品名: string
//   商品単価: string
// }

// const productSearch = async (codenumber: number) => {
//   const data = await window.myInventoryAPI.ListData()
//   //console.log(data)
//   const storageGet = data
//   const product = storageGet.find((item) => item.code === codenumber)
//   console.log(product)
//   return product
// }

type FormValues = {
  rows: {
    vendor: { value: string, label: string, id: string } | null
    code: string
    name: string
    quantity: string
    price: string
  }[]
}

const defaultSet = (): FormValues["rows"] => {
  const result: FormValues["rows"] = []
  for (let i = 0; i < 20; i++) {
    result.push({
      vendor: null,
      code: '',
      name: '',
      quantity: '',
      price: ''
    })
  }
  return result
}







export default function ReceivingPage() {
  const [VendorList, setVendorList] = useState<SelectOption[]>([])

  const [InsertDate, setDate] = useState<string>('')

  const [swalProps, setSwalProps] = useState({})

  const [DisplayStatus, setDisplayStatus] = useState(false)

  const [marginNum, setMarginNum] = useState(100)

  useEffect(() => {
    if(DisplayStatus){
      setMarginNum(330)
    }else{
      setMarginNum(80)
    }
  },[DisplayStatus])

  const swalWindow = async () => {
    setSwalProps({
      show: true,
      title: '入力データ',
      onConfirm: () => {
        const filterData = getValues().rows.filter((row) => row.code !== '')
        if(filterData.length !== 0){
          setSwalProps({ show: false })
          insertPost()
          toast.success('送信しました')
        }else{
          toast.error('送信できるデータがありません')
        }
      }
    })
  }


  const { control, register, handleSubmit, getValues, setValue, reset } =
    useForm<FormValues>({
      defaultValues: {
        rows: defaultSet()
      }
    })

  const { fields, append, remove, insert } = useFieldArray<FormValues>({
    control,
    name: 'rows'
  })

  const onSubmit = (data: FormValues) => {
    console.log('送信データ:', data.rows)
    // ここでAPIに送信など処理を書く
  }

  const isHalfWidth = (value: string) => /^[\x20-\x7E]*$/.test(value)

  const VendorListGet = async () => {
    const list = await window.myInventoryAPI.VendorData()
    const filtered = list.filter(item => item[0] !== '')
    const result = filtered.map(item => {
      const data = {
        value: item[1],
        label: item[1],
        id: item[0]
      }
      return data
    })
    setVendorList(result)
  }

  const addNewForm = () => {
    for (let i = 0; i < 20; i++) {
      append({
        vendor: null,
        code: '',
        name: '',
        quantity: '',
        price: ''
      }, { shouldFocus: false })
    }
  }

  const insertPost = async () => {
    const filterData = getValues().rows.filter((row) => row.code !== '')
    const formData = filterData.map((item) => {
      const result = [
        InsertDate,
        item.vendor?.value,
        item.code,
        item.name,
        item.quantity,
        item.price,
        null,
        '',
        item.vendor?.id
      ]
      return result
    })
    if (formData.length >= 1) {
      await window.myInventoryAPI.DataInsert({
        sheetName: '本部入庫',
        action: 'insert',
        sub_action: 'insert',
        data: formData,
        formulaConfig: {
          targetCol: 7,
          formula: '=RC[-2]*RC[-1]'
        }
      })
    }
    reset({
      rows: defaultSet()
    })
  }

  const handleOpenDialog = () => {
    // if (Date === '') {
    //   alert('日付が入力されていません')
    //   return
    // }
    swalWindow()
    //setDialogOpen(true)
  }

  const handleChangeDate = (event: ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value)
  }

  useEffect(() => {
    VendorListGet()
  }, [])

  useEffect(() => {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    setDate(`${yyyy}-${mm}-${dd}`)
  }, [])

  const handleEnterFocusNext = (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const form = e.currentTarget.form
      if(form){
        const elements = Array.from(form.elements) as HTMLElement[]
        const index = elements.indexOf(e.currentTarget)
        const nextElement = elements[index + 1] as HTMLInputElement | HTMLButtonElement

        if (nextElement && nextElement.type !== 'button') {
          nextElement.focus()
          
        } else {
          const nextCodeInput = document.querySelector<HTMLInputElement>(
            `input[name="rows.${rowIndex + 1}.code"]`
          )
          nextCodeInput?.focus()
          const headerHeight = 80;
          const footerHeight = 60;
          const buffer = 20;
          const rect = nextElement.getBoundingClientRect();
          const isOutOfViewTop = rect.top < headerHeight + buffer;
          const isOutOfViewBottom = rect.bottom > window.innerHeight - footerHeight - buffer;
          if (isOutOfViewTop || isOutOfViewBottom) {
            window.scrollBy({
              top: rect.top - headerHeight - buffer,
              behavior: 'smooth',
            });
          }
        }
      }
      
    }
  }

  const search = async (index) => {
    const List = await window.myInventoryAPI.ListData()
    console.log(List)
    const values = getValues()
    const code = values.rows[index].code
    const productData = List.find((item) => item.code === Number(code))
    if (productData) {
      const vendordata = { value: productData.vendor, label: productData.vendor, id: productData.vendorid }
      const name = productData.name
      const Price = productData.newPrice
      setValue(`rows.${index}.vendor`, vendordata)
      setValue(`rows.${index}.name`, name)
      setValue(`rows.${index}.price`, Price)
    }
  }

  const RowRemove = async (index) => {
    remove(index)
    append({
      vendor: null,
      code: '',
      name: '',
      quantity: '',
      price: ''
    }, { shouldFocus: false })
  }

  const RegisterData = async(data) => {
    const filterData = getValues().rows.filter((row) => row.code !== '')
    const vendordata = { value: data.vendor, label: data.vendor, id: data.vendorid }
    insert(filterData.length, {
      vendor: vendordata,
      code: data.code,
      name: data.name,
      quantity: '',
      price: data.newPrice
    })
  }

  return (
    <>
      <div>
        <LinkBaner id="zaiko" />
        <Toaster />
      </div>
      <div className="window_area">
        <div className="insertDate">
          <h2 style={{ color: 'white' }}>入庫日付</h2>
          <input
            type="date"
            className="insert_date"
            value={InsertDate}
            onChange={(e) => handleChangeDate(e)}
          />
        </div>
        <div className="form_area">
          <WordSearch
            DisplayStatus={DisplayStatus}
            setDisplayStatus={setDisplayStatus}
            RegisterData={RegisterData}
          />
          <div className="in-area" style={{marginLeft: `${marginNum}px`}}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">
              {fields.map((field, index) => (
                <div key={field.id} className="insert_area">
                  <Controller
                    name={`rows.${index}.vendor`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={VendorList}
                        placeholder="業者"
                        isClearable
                        className="insert_Select"
                        menuPlacement="auto"
                        menuPortalTarget={document.body}
                      />
                    )}
                  />
                  <input
                    {...register(`rows.${index}.code`, {
                      validate: (value) => isHalfWidth(value) || '半角英数字で入力してください'
                    })}
                    className="insert_code"
                    placeholder="商品コード"
                    onKeyDown={(e) => handleEnterFocusNext(e, index)}
                    onBlur={() => search(index)}
                  />
                  <input
                    {...register(`rows.${index}.name`)}
                    placeholder="商品名"
                    className="insert_name"
                    onKeyDown={(e) => handleEnterFocusNext(e, index)}
                  />
                  
                  <input
                    {...register(`rows.${index}.quantity`, {
                      validate: (value) => isHalfWidth(value) || '半角数字で入力してください'
                    })}
                    placeholder="数量"
                    className="insert_quantity"
                    type="text"
                    onKeyDown={(e) => handleEnterFocusNext(e, index)}
                  />
                  <input
                    {...register(`rows.${index}.price`, {
                      validate: (value) => isHalfWidth(value) || '半角数字で入力してください'
                    })}
                    placeholder="単価"
                    className="insert_price"
                    type="text"
                    onKeyDown={(e) => handleEnterFocusNext(e, index)}
                  />
                  <button
                    type="button"
                    onClick={() => RowRemove(index)}
                    className="text-red-500 hover:underline"
                  >
                    削除
                  </button>
                </div>
              ))}
            </form>
          </div>
        </div>
        <div className="button_area">
          <Button variant="outlined" onClick={addNewForm}>
            入庫枠追加
          </Button>
          <Button variant="outlined" onClick={handleOpenDialog} endIcon={<SendIcon />}>
            入庫実行
          </Button>
          <SweetAlert2
            {...swalProps}
            didClose={() => {
              console.log('ダイアログが閉じられました');
              setSwalProps({ show: false });
            }}
          >
            <ConfirmDialogTable
              tableData={getValues().rows}
            />
          </SweetAlert2>
        </div>
      </div>
    </>
  )
}
