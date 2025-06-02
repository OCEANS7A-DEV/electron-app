/* eslint-disable prettier/prettier */
import React, { useState, ChangeEvent, useEffect } from 'react'
import WordSearch from '../comp/ProductSearchWord'
import '../css/Receiving.css'
import { Button } from '@mui/material'
import { Autocomplete, TextField } from '@mui/material';
import LinkBaner from '../comp/Linkbanar'
import SendIcon from '@mui/icons-material/Send'
//import DeleteIcon from '@mui/icons-material/Delete'
//import FormControl from '@mui/material/FormControl'
//import InputLabel from '@mui/material/InputLabel'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import SweetAlert2 from 'react-sweetalert2';
import Swal from 'sweetalert2'
import StoreDialogTable from '../comp/StoreDialogTable'
import toast, { Toaster } from 'react-hot-toast';
import { SubmitHandler } from 'react-hook-form'
import { MenuItem } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';

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

interface SelectOption {
  value: string
  label: string
}


type FormValues = {
  rows: {
    vendor: string
    code: string
    name: string
    detail: { value: string; label: string } | null
    detailList: { value: string; label: string }[] | []
    quantity: string
    person: string
    remarks: string
    price: string
  }[]
}

const defaultRowData = {
  vendor: '',
  code: '',
  name: '',
  detail: null,
  detailList: [],
  quantity: '',
  person: '',
  remarks: '',
  price: ''
}

const defaultSet = (): FormValues["rows"] => {
  const result: FormValues["rows"] = []
  for (let i = 0; i < 20; i++) {
    result.push(defaultRowData)
  }
  return result
}







export default function StoreOrderPage() {
  //const [VendorList, setVendorList] = useState<SelectOption[]>([])
  // const [isDialogOpen, setDialogOpen] = useState(false)
  // const message =
  //   '入庫内容は以下の通りです\n以下の内容でよろしければOKをクリックしてください\n内容の変更がある場合にはキャンセルをクリックしてください'

  const [DisplayStatus, setDisplayStatus] = useState(false)

  const [marginNum, setMarginNum] = useState(100)

  const [storeSelect, setStoreSelect] = React.useState('');

  const [storeOptions, setStoreOptions] = useState<SelectOption[]>([])

  const [InsertDate, setDate] = useState<string>('')

  const [swalProps, setSwalProps] = useState({});

  const [ProductdetailsList, setProductdetailsList] = useState([])



  const swalWindow = async () => {
    setSwalProps({
      show: true,
      title: storeSelect,
      onConfirm: () => {
        setSwalProps({ show: false })
        insertPost()
      }
    }); 
  }




  const { control, register, handleSubmit, getValues,  setValue, reset, watch } =
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



  const addNewForm = () => {
    for (let i = 0; i < 20; i++) {
      append(defaultRowData)
    }
  }

  const insertPost = async () => {
    //await Swal.fire("")
    toast.success('送信しました(test)')
    if(storeSelect == ''){
      await Swal.fire({
        icon: 'warning',
        title: '店舗が未選択です',
        text: '店舗を選んでから送信してください',
        confirmButtonText: 'OK'
      })
      return
    }
    const Now = await window.myInventoryAPI.NowGet()
    const filterData = getValues().rows.filter((row) => row.code !== '')
    const formData = filterData.map((item) => {
      const result = [
        InsertDate,
        storeSelect,
        item.vendor,
        item.code,
        item.name,
        item.detail?.value,
        item.quantity,
        '',
        item.price,
        null,
        item.person,
        item.remarks,
        '未印刷',
        Now[0],
        Now[1]
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
    toast.success('送信しました')
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

  const StoresGet = async () => {
    const stores = await window.myInventoryAPI.ListGet({
      sheetName: 'その他一覧',
      action: 'ListGet',
      ranges: 'A2:B'
    });

    const storenames: SelectOption[] = stores
      .filter(row => row[0] !== "")
      .map(item => ({
        value: item[0],
        label: item[0]
      }));
    console.log(storenames)
    setStoreOptions(storenames);
  }

  const DetailsSet = async () => {
    const list = await window.myInventoryAPI.DetailsData()
    const filtered = list.filter(row => row[1] !== '')
    setProductdetailsList(filtered)
  }

  const DetailsGet = (index) => {
    const result = watch(`rows.${index}.detailList`)
    return result
  }

  useEffect(() => {
    //dataget()
    //defaultSet()

    //VendorListGet()
    StoresGet()
    DetailsSet()
  }, [])

  useEffect(() => {
    if(DisplayStatus){
      setMarginNum(330)
    }else{
      setMarginNum(80)
    }
  },[DisplayStatus])

  useEffect(() => {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    setDate(`${yyyy}-${mm}-${dd}`)
  }, [])

  const handleEnterFocusNext = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = (e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement).form;
      if (form) {
        const elements = Array.from(form.elements) as HTMLElement[];
        const index = elements.indexOf(e.target as HTMLElement);
        for (let i = index + 1; i < elements.length; i++) {
          const next = elements[i] as HTMLElement;
          if (
            next &&
            typeof next.focus === 'function' &&
            !next.hasAttribute('disabled') &&
            next.getAttribute('tabindex') !== '-1' &&
            (next instanceof HTMLInputElement ||
              next instanceof HTMLSelectElement ||
              next instanceof HTMLTextAreaElement ||
              next instanceof HTMLButtonElement) &&
            next.type !== 'button'
          ) {
            next.focus();
            break;
          }
        }
      }
    }
  };




  

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
      const detailfilter = ProductdetailsList.filter(row => row[0] == code && row[1] !== '')
      const detaillist = detailfilter.map(item => {
        const result = {value: item[1] ?? '', label: item[1] ?? ''}
        return result
      })
      setValue(`rows.${index}.detailList`, detaillist)
      setValue(`rows.${index}.price`, productData.newPrice)
      if(detailfilter.length !== 0){
        console.log('詳細あり')
      }
    }
  }

  const RowRemove = async (index) => {
    const scrollY = window.scrollY
    remove(index)
    append(defaultRowData)
    setTimeout(() => {
      window.scrollTo(0, scrollY);
    }, 0);
  }


  const handleStoreChange = (event: SelectChangeEvent) => {
    setStoreSelect(event.target.value as string);
  };


  return (
    <>
      <div>
        <LinkBaner />
        <Toaster />
      </div>
      <div className="window_area">
        <div className="form_area">
          <WordSearch
            DisplayStatus={DisplayStatus}
            setDisplayStatus={setDisplayStatus}
          />
          <div className="in-area" style={{marginLeft: `${marginNum}px`}}>
            <div className="insertDate">
              <Select
                value={storeSelect}
                label='店舗'
                onChange={handleStoreChange}
                displayEmpty
                size="small"
                style={{ width: 120, backgroundColor: 'white' }}
              >
                <MenuItem value="">
                  <em>未選択</em>
                </MenuItem>
                {storeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              <h2 style={{ color: 'white' }}>入庫日付</h2>
              <input
                type="date"
                className="insert_date"
                value={InsertDate}
                onChange={(e) => handleChangeDate(e)}
              />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">
              {fields.map((field, index) => (
                <div key={field.id} className="insert_area_store">
                  <input
                    {...register(`rows.${index}.vendor`)}
                    className="insert_vendor"
                    placeholder="業者名"
                    onKeyDown={(e) => handleEnterFocusNext(e)}
                    onBlur={() => search(index)}
                  />
                  <input
                    {...register(`rows.${index}.code`, {
                      validate: (value) => isHalfWidth(value) || '半角英数字で入力してください'
                    })}
                    className="insert_code"
                    placeholder="商品コード"
                    onKeyDown={(e) => handleEnterFocusNext(e)}
                    onBlur={() => search(index)}
                  />
                  <input
                    {...register(`rows.${index}.name`)}
                    placeholder="商品名"
                    className="insert_name"
                    onKeyDown={(e) => handleEnterFocusNext(e)}
                  />
                  <Controller
                    name={`rows.${index}.detail`}
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        options={DetailsGet(index)}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) => option.value === value?.value}
                        value={field.value || null}
                        onChange={(_, newValue) => field.onChange(newValue)}
                        onKeyDown={(e) => handleEnterFocusNext(e)}
                        openOnFocus
                        autoHighlight
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="詳細"
                            size="small"
                            style={{ width: 160, backgroundColor: 'white', height: 38, marginRight: 8 }}
                          />
                        )}
                      />
                    )}
                  />
                  <input
                    {...register(`rows.${index}.quantity`, {
                      validate: (value) => isHalfWidth(value) || '半角数字で入力してください'
                    })}
                    name={`rows.${index}.quantity`}
                    placeholder="数量"
                    className="insert_quantity"
                    type="text"
                    onKeyDown={(e) => handleEnterFocusNext(e)}
                  />
                  <input
                    {...register(`rows.${index}.person`)}
                    className="personal"
                    placeholder='個人購入'
                    onKeyDown={(e) => handleEnterFocusNext(e)}
                    type="text"
                  />
                  <input
                    {...register(`rows.${index}.remarks`)}
                    className="remarks"
                    placeholder='備考'
                    onKeyDown={(e) => handleEnterFocusNext(e)}
                    type="text"
                  />
                  <Button variant='outlined'
                    onClick={() => RowRemove(index)}
                    className="text-red-500 hover:underline"
                  >
                    削除
                  </Button>
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
            customClass={{
              popup: 'custom-swal-popup',
              htmlContainer: 'custom-swal-html'
            }}
          >
            <StoreDialogTable
              tableData={getValues().rows}
            />
          </SweetAlert2>
        </div>
      </div>
    </>
  )
}
