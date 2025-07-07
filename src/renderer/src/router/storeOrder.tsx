/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import WordSearch from '../comp/ProductSearchWord'
import '../css/Receiving.css'
import { Button } from '@mui/material'
import { Autocomplete, TextField } from '@mui/material';
import LinkBaner from '../comp/Linkbanar'
import SendIcon from '@mui/icons-material/Send'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import SweetAlert2 from 'react-sweetalert2';
import Swal from 'sweetalert2'
import StoreDialogTable from '../comp/StoreDialogTable'
import toast, { Toaster } from 'react-hot-toast';
import { SubmitHandler } from 'react-hook-form'
import { MenuItem } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/ja'

dayjs.locale('ja')


interface SelectOption {
  value: string
  label: string
  type: string
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


const getNearestMonday = (D) => {
  const date = new Date(D);
  const dayOfWeek = date.getDay();
  const diffToMonday = dayOfWeek <= 3 ? 1 - dayOfWeek : 8 - dayOfWeek;
  const nearestMonday = new Date(date);
  nearestMonday.setDate(date.getDate() + diffToMonday);
  const year = nearestMonday.getFullYear();
  const month = String(nearestMonday.getMonth() + 1).padStart(2, "0");
  const day = String(nearestMonday.getDate()).padStart(2, "0");
  const result = `${year}-${month}-${day}`
  return result
};



export default function StoreOrderPage() {

  const [DisplayStatus, setDisplayStatus] = useState(false)

  const [marginNum, setMarginNum] = useState(100)

  const [storeSelect, setStoreSelect] = React.useState('');

  const [storeOptions, setStoreOptions] = useState<SelectOption[]>([])

  const [SelectType, setSelectType] = React.useState('');

  const [InsertDate, setDate] = useState<string>('')

  const [swalProps, setSwalProps] = useState({});

  const [ProductdetailsList, setProductdetailsList] = useState([])

  const [DeleteRowNum, setDeleteRowNum] = useState(0)

  const [dateValue, setDateValue] = useState<Dayjs | null>(null);



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

  const { fields, append, remove, insert } = useFieldArray({
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
      append(defaultRowData, { shouldFocus: false })
    }
  }

  const insertPost = async () => {
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
    // console.log(formData)
    // return
    if (formData.length >= 1) {
      await window.myInventoryAPI.DataInsert({
        sheetName: '店舗へ',
        action: 'Orderinsert',
        sub_action: 'insert',
        data: formData,
        formulaConfig: {
          targetCol: 10,
          formula: '=RC[-3]*RC[-1]'
        },
        deleteNum: DeleteRowNum
      })
    }
    toast.success('送信しました')
  }

  const handleOpenDialog = () => {
    swalWindow()
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
        label: item[0],
        type: item[1]
      }));
    //console.log(storenames)
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
    if(DisplayStatus){
      setMarginNum(330)
    }else{
      setMarginNum(80)
    }
  },[DisplayStatus])

  useEffect(() => {
    const today = new Date()
    const date = getNearestMonday(today)
    setDateValue(dayjs(date))
    setDate(date)
  }, [])

  const handleEnterFocusNext = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = (e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement).form;
      if (form) {
        const elements = Array.from(form.elements) as HTMLElement[];
        const index = elements.indexOf(e.target as HTMLElement);
        let focused = false;
        for (let i = index + 1; i < elements.length; i++) {
          const next = elements[i] as HTMLElement;
          //console.log(index)
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
            const headerHeight = 80;
            const footerHeight = 60;
            const buffer = 20;
            const rect = next.getBoundingClientRect();
            const isOutOfViewTop = rect.top < headerHeight + buffer;
            const isOutOfViewBottom = rect.bottom > window.innerHeight - footerHeight - buffer;

            if (isOutOfViewTop || isOutOfViewBottom) {
              window.scrollBy({
                top: rect.top - headerHeight - buffer,
                behavior: 'smooth',
              });
            }
            focused = true;
            break;
          }
        }
        if (!focused) {
          addNewForm()
        }
      }
    }
  };

  const orderDataGetSelect = async () => {
    reset({
      rows: defaultSet()
    })
    const ordersGet = await window.myInventoryAPI.ListGet({sheetName: '店舗へ', action: 'InputDataGet', ranges: 'A2:M'})
    const targetDateStr = new Date(InsertDate).toDateString();
    const filtered = ordersGet.filter(item => new Date(item[0]).toDateString() == targetDateStr && item[1] == storeSelect)
    const UpDataRowNum = filtered.length
    setDeleteRowNum(UpDataRowNum)

    if (filtered.length > 0){
      if (filtered[0][12] == '注文無'){
        return filtered
      }
      if (UpDataRowNum > 20){
        const diffcount = Math.ceil(UpDataRowNum / 20) - 1
        for (let i = 0; i < diffcount; i++ ){
          await addNewForm()
        }
      }
      let count = 0
      filtered.forEach(item => {
        setValue(`rows.${count}.vendor`, item[2])
        setValue(`rows.${count}.code`, item[3])
        const detailfilter = ProductdetailsList.filter(row => row[0] == item[3] && row[1] !== '')
        const detaillist = detailfilter.map(item => {
          const result = {value: item[1] ?? '', label: item[1] ?? ''}
          return result
        })
        setValue(`rows.${count}.detailList`, detaillist)
        const detail = {value: item[5], label: item[5]}
        setValue(`rows.${count}.detail`, detail)
        setValue(`rows.${count}.name`, item[4])
        setValue(`rows.${count}.quantity`, item[6])
        setValue(`rows.${count}.person`, item[10])
        setValue(`rows.${count}.price`, item[8])
        setValue(`rows.${count}.remarks`, item[11])
        count ++
      })
    }
    return filtered
  }

  useEffect(() => {
    if (storeSelect !== ""){
      toast.promise(
        orderDataGetSelect(),
        {
          loading: '注文データ読み込み中…',
          success: (data) => {
            if (data.length == 0){
              return `${InsertDate}の${storeSelect}店は注文されていません`
            } else if (data.length == 1 && data[0][12]){
              return `${InsertDate}の${storeSelect}店は注文無し`
            } else {
              return `${InsertDate}の${storeSelect}店の注文数${data.length}`
            }
          },
          error: () => `エラーが発生しました`,
        },
      )
    }
    
  }, [InsertDate, storeSelect])
  

  const search = async (index) => {
    //console.log(SelectType)
    const List = await window.myInventoryAPI.ListData()
    const values = getValues()
    const code = values.rows[index].code
    const productData = List.find((item) => item.code === Number(code))
    //console.log(productData)
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
      if (SelectType !== 'VC'){
        setValue(`rows.${index}.price`, productData.newPrice)
      } else {
        setValue(`rows.${index}.price`, productData.VC)
      }
      
      if(detailfilter.length !== 0){
        console.log('詳細あり')
      }
    }
  }

  const selectForcus = async(row) => {
    const input = document.querySelector<HTMLInputElement>(
      `input[name="rows.${row}.code"]`
    )
    if (input) input.focus();
  }

  const RowRemove = async (index) => {
    remove(index)
    append(defaultRowData, { shouldFocus: false })
    setTimeout(() => {
      selectForcus(index)
    }, 0)
  }

  const RowInsert = async (index) => {
    insert(index, defaultRowData, { shouldFocus: false })
  }

  const handleStoreChange = (event: SelectChangeEvent) => {
    const select = event.target.value as string
    setStoreSelect(select);
    const type = storeOptions.find(item => item.value == select)?.type ?? ""
    setSelectType(type)
  };

  const RegisterData = async(data) => {
    //console.log(data)
    const filterData = getValues().rows.filter((row) => row.code !== '')
    //const vendordata = { value: data.vendor, label: data.vendor, id: data.vendorid }
    const list = await window.myInventoryAPI.DetailsData()
    const filtered = list.filter(row => row[1] !== '')
    const details = filtered.filter(item => item[0] == data.code)
    insert(filterData.length, {
      vendor: data.vendor,
      code: data.code,
      name: data.name,
      detail: null,
      detailList: details,
      quantity: '',
      person: '',
      remarks: '',
      price: data.newPrice
    })
  }

  useEffect(() => {
    StoresGet()
    DetailsSet()
  }, [])

  

  return (
    <>
      <div>
        <LinkBaner id="zaiko" />
        <Toaster />
      </div>
      <div className="window_area">
        <div className="form_area">
          <WordSearch
            DisplayStatus={DisplayStatus}
            setDisplayStatus={setDisplayStatus}
            RegisterData={RegisterData}
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
              <div className="insert_Title">
                <h2 style={{ color: 'white' }}>注文日付</h2>
              </div>
              <div className="insert_DatePicker">
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
                  <DatePicker
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        sx: {
                          fontSize: '1rem',
                          '& input': {
                            height: '1.5em',
                          },
                          width: '150px',
                        },
                      },
                    }}
                    value={dateValue}
                    onChange={(e) => setDateValue(e)}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">
              {fields.map((field, index) => (
                <div key={field.id} className="insert_area_store">
                  <div style={{width: 24, textAlign: 'right', color: 'white', marginRight: 4}}>{index + 1}</div>
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
                  <Button variant="outlined"
                    onClick={() => RowInsert(index)}
                  >
                    追加
                  </Button>
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
            注文枠追加
          </Button>
          <Button variant="outlined" onClick={handleOpenDialog} endIcon={<SendIcon />}>
            注文実行
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
