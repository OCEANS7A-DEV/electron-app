/* eslint-disable prettier/prettier */
import React, { useState, ChangeEvent, useEffect } from 'react'
//import Select from 'react-select'
//import { useLoaderData } from 'react-router-dom'
import WordSearch from '../comp/ProductSearchWord'
import '../css/Receiving.css'
import { Button } from '@mui/material'
import LinkBaner from '../comp/Linkbanar'
import SendIcon from '@mui/icons-material/Send'
//import DeleteIcon from '@mui/icons-material/Delete'
import { useForm, useFieldArray } from 'react-hook-form'
import SweetAlert2 from 'react-sweetalert2';
import ConfirmDialogTable from '../comp/DialogTable'
import toast, { Toaster } from 'react-hot-toast';
import { SubmitHandler } from 'react-hook-form'

// interface InsertData {
//   業者: { value: string; label: string }[]
//   商品コード: string
//   商品名: string
//   数量: string
//   商品単価: string
//   VendorList: { value: string; label: string }[]
// }

// interface SelectOption {
//   value: string
//   label: string
// }

// interface InventoryDataType {
//   業者: string
//   商品コード: string
//   商品名: string
//   商品単価: string
// }



type FormValues = {
  rows: {
    vendor: string
    code: string
    name: string
    quantity: string
  }[]
}

const defaultSet = (): FormValues["rows"] => {
  const result: FormValues["rows"] = []
  for (let i = 0; i < 20; i++) {
    result.push({
      vendor: '',
      code: '',
      name: '',
      quantity: '',
    })
  }
  return result
}







export default function StoreOrderPage() {
  //const [VendorList, setVendorList] = useState<SelectOption[]>([])
  // const [isDialogOpen, setDialogOpen] = useState(false)
  // const message =
  //   '入庫内容は以下の通りです\n以下の内容でよろしければOKをクリックしてください\n内容の変更がある場合にはキャンセルをクリックしてください'

  const [InsertDate, setDate] = useState<string>('')

  const [swalProps, setSwalProps] = useState({});


  const swalWindow = async () => {
    setSwalProps({
      show: true,
      title: '入力データ',
      onConfirm: () => {
        setSwalProps({ show: false })
        insertPost()
        toast.success('送信しました')
      }
    }); 
  }




  const { control, register, handleSubmit, getValues,  setValue, reset } =
    useForm<FormValues>({
      defaultValues: {
        rows: defaultSet()
      }
    })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rows'
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // data は FormValues 型として認識される
    console.log(data)
  }

  const isHalfWidth = (value: string) => /^[\x20-\x7E]*$/.test(value)

  // const VendorListGet = async () => {
  //   const result = []
  //   const list = await window.myInventoryAPI.ListGet({sheetName: 'その他一覧', action: 'ListGet', ranges: 'A2:B'})
  //   for (let i = 0; i < list.length; i++) {
  //     result.push({
  //       value: list[i][0],
  //       label: list[i][0]
  //     })
  //   }
  //   setVendorList(result)
  // }

  const addNewForm = () => {
    for (let i = 0; i < 20; i++) {
      append({
        vendor: '',
        code: '',
        name: '',
        quantity: '',
      })
    }
  }

  const insertPost = async () => {
    const filterData = getValues().rows.filter((row) => row.code !== '')
    const formData = filterData.map((item) => {
      const result = [
        InsertDate,
        item.vendor,
        item.code,
        item.name,
        item.quantity,
        null
      ]
      return result
    })
    console.log(formData)

    if (formData.length >= 1) {
      await window.myInventoryAPI.DataInsert({
        sheetName: '店舗へ',
        action: 'insert',
        data: formData,
        formulaConfig: {
          targetCol: 10,
          formula: '=RC[-3]*RC[-1]'
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

  // const handleConfirm = () => {
  //   alert('確認が完了しました')
  //   insertPost()
  //   setDialogOpen(false)
  //   setFormData(initialFormData)
  // }

  // const handleCancel = () => {
  //   alert('キャンセルされました')
  //   setDialogOpen(false)
  // }

  const handleChangeDate = (event: ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value)
  }

  // const dataget = async () => {
  //   try {
  //     const data = await window.myInventoryAPI.ListData()
  //     //console.log(data);
  //     if (!data) {
  //       throw new Error('APIからデータが返されませんでした')
  //     }
  //   } catch (error) {
  //     console.error('データ取得エラー:', error)
  //   }
  // }

  useEffect(() => {
    //dataget()
    //defaultSet()

    //VendorListGet()
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
      }
    }
  }

  const search = async (index) => {
    const List = await window.myInventoryAPI.ListData()
    const values = getValues()
    const code = values.rows[index].code
    const productData = List.find((item) => item.code === Number(code))
    if (productData) {
      const vendordata = productData.vendor
      const name = productData.name
      setValue(`rows.${index}.vendor`, vendordata)
      setValue(`rows.${index}.name`, name)
    }
  }

  const RowRemove = async (index) => {
    remove(index)
    append({
      vendor: '',
      code: '',
      name: '',
      quantity: ''
    })
  }

  return (
    <>
      <div>
        <LinkBaner />
        <Toaster />
      </div>
      <div className="window_area">
        <div className="insertDate">
          {/* <Select
            options={VendorList}
            placeholder="店舗"
            isClearable
            className="insert_Select"
            menuPlacement="auto"
            menuPortalTarget={document.body}
          /> */}
          <h2 style={{ color: 'white' }}>入庫日付</h2>
          <input
            type="date"
            className="insert_date"
            value={InsertDate}
            onChange={(e) => handleChangeDate(e)}
          />
        </div>
        <div className="form_area">
          <WordSearch />
          <div className="in-area">
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">
              {fields.map((field, index) => (
                <div key={field.id} className="insert_area_store">
                  <input
                    {...register(`rows.${index}.vendor`)}
                    className="insert_vendor"
                    placeholder="業者名"
                    onKeyDown={(e) => handleEnterFocusNext(e, index)}
                    onBlur={() => search(index)}
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
          {/* <a className="buttonUnderlineS" type="button" onClick={handleOpenDialog}>入庫実行＞＞</a> */}
          {/* <ConfirmDialog
            title="確認"
            message={message}
            tableData={formData}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            isOpen={isDialogOpen}
          /> */}
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
