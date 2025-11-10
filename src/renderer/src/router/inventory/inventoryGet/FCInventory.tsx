import React, { useState, useEffect } from 'react'
import WordSearch from '../../../comp/ProductSearchWord'
import '../../../css/Receiving.css'
import { Button } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { useForm, useFieldArray } from 'react-hook-form'
import { MenuItem } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import LinkBaner from '../../../comp/Linkbanar'
import toast, { Toaster } from 'react-hot-toast'
import { useLoaderData } from 'react-router-dom'
import '../../../css/FCInventory.css'
import { TextField } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Swal from 'sweetalert2'
import { productGet } from '../../../Util/util'


interface SelectOption {
  id: number
  value: string
  label: string
  type: string
}


interface DateSelectOption {
  value: number
  label: string
}

type FormValues = {
  rows: {
    code: string
    name: string
    quantity: string
    price: string
  }[]
}

const defaultRowData = {
  code: '',
  name: '',
  quantity: '',
  price: ''
}


const defaultSet = (): FormValues["rows"] => {
  const result: FormValues["rows"] = []
  for (let i = 0; i < 20; i++) {
    result.push(defaultRowData)
  }
  return result
}


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#2a2a30',
      paper: '#333',
    },
    primary: {
      main: '#90caf9',
    },
    text: {
      primary: '#ffffff',
    },
  },
})


export const loader = async () => {
  const stores = await window.myInventoryAPI.ListGet({
    sheetName: '店舗一覧',
    action: 'ListGet',
    ranges: 'A2:C'
  });

  const datas = await window.myInventoryAPI.ListGet({
    sheetName: '在庫履歴',
    action: 'FCInventoryGet',
    ranges: 'A2:D'
  })

  const storenames: SelectOption[] = stores
    .filter((row) => row[2] !== "" && row[2] == 'FC')
    .map((item) => ({
      id: item[0],
      value: item[1],
      label: item[1],
      type: item[2]
    }))

  const now = new Date()
  const year = now.getFullYear()
  const yearList: DateSelectOption[] = [
    { value: year + 1, label: `${year + 1}年`},
    { value: year, label: `${year}年`},
    { value: year - 1, label: `${year - 1}年`}
  ]
  const monthList: DateSelectOption[] = []
  for (let i = 0; i < 12; i++){
    monthList.push({ value: i + 1, label: `${i + 1}月`})
  }

  const typeDatas = await window.myInventoryAPI.ListGet({
    sheetName: '商品タイプ一覧',
    action: 'ListGet',
    ranges: 'B2:B'
  })

  const types = typeDatas.map((item) => item[0]).filter((row) => row !== '')

  return { storenames, yearList, monthList, datas, types }
}


export default function FCInventory() {
  const { storenames, yearList, monthList, datas, types } = useLoaderData<typeof loader>()
  const [marginNum, setMarginNum] = useState(100)
  const [DisplayStatus, setDisplayStatus] = useState(false)
  const [storeSelect, setStoreSelect] = React.useState('')
  const [Year, setYear] = useState<number>(new Date().getFullYear())
  const [Month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const [DeleteRowNum, setDeleteRowNum] = useState<number>(0)

  useEffect(() => {
    DataSet()
  }, [storeSelect, Year, Month])

  const DataSet = async () => {
    reset({
      rows: defaultSet()
    })
    const List = await window.myInventoryAPI.ListData()
    const storeId = storenames.find((item) => item.value == storeSelect)
    const date = new Date(Year, Month, 1)
    date.setDate(date.getDate() - 1)
    const filter = datas.filter(
      (item) => item[1] == storeId?.id &&
        new Date(item[0]).toLocaleDateString() == date.toLocaleDateString()
    )
    setDeleteRowNum(filter.length)
    let count = 0
    if (filter.length == 0){
      return
    }
    for (let i = 0; i < filter.length; i++) {
      append(defaultRowData, { shouldFocus: false })
    }
    filter.forEach(async (item) => {
      const code = item[2]
      const productData = List.find((item) => item.code == code)
      if (productData) {
        const name = productData.name
        setValue(`rows.${count}.name`, name)
      }
      setValue(`rows.${count}.code`, code)
      setValue(`rows.${count}.quantity`, item[3])
      setValue(`rows.${count}.price`, productData.newPrice)
      count++
    })
  }

  useEffect(() => {
    if (DisplayStatus){
      setMarginNum(330)
    } else {
      setMarginNum(80)
    }
  }, [DisplayStatus])

  const { control, register, handleSubmit, getValues, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      rows: defaultSet()
    }
  })


  const { fields, append, remove, insert } = useFieldArray<FormValues>({
    control,
    name: 'rows'
  })

  const handleYearChange = (e: SelectChangeEvent<number>) => {
    setYear(e.target.value)
  }

  const handleMonthChange = (e: SelectChangeEvent<number>) => {
    setMonth(e.target.value)
  }





  const onSubmit = (data: FormValues) => {
    console.log('送信データ:', data.rows)
  }

  const isHalfWidth = (value: string) => /^[\x20-\x7E]*$/.test(value)


  const search = async (index) => {
    const values = getValues()
    const code = values.rows[index].code
    const result = await productGet(code)
    if (result) {
      const name = result.productData.name
      setValue(`rows.${index}.name`, name)
      setValue(`rows.${index}.price`, result.productData.newPrice)
    }
  }


  const handleEnterFocusNext = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault()
      const form = (e.currentTarget as HTMLElement).closest('.p-4')
      if (!form) return
      const focusableElements = Array.from(
        form.querySelectorAll<HTMLInputElement>('input[name^="rows."]')
      )
      const currentIndex = focusableElements.indexOf(e.target as HTMLInputElement);
      if (currentIndex !== -1 && currentIndex < focusableElements.length - 1) {
        const nextElement = focusableElements[currentIndex + 1];
        nextElement.focus();
        const headerHeight = 80;
        const footerHeight = 60;
        const buffer = 20;
        const rect = nextElement.getBoundingClientRect();
        const isOutOfViewTop = rect.top < headerHeight + buffer;
        const isOutOfViewBottom = rect.bottom > window.innerHeight - footerHeight - buffer
        if (isOutOfViewTop || isOutOfViewBottom) {
          window.scrollBy({
            top: rect.top - headerHeight - buffer,
            behavior: 'smooth',
          });
        }
      } else {
        addNewForm();
      }
    }
  };

  const RegisterData = async (data) => {
    const filterData = getValues().rows.filter((row) => row.code !== '')
    insert(filterData.length, {
      code: data.code,
      name: data.name,
      quantity: '',
      price: ''
    })
  }

  const RowRemove = async (index) => {
    remove(index)
    append(defaultRowData, { shouldFocus: false })
  }

  const addNewForm = () => {
    for (let i = 0; i < 20; i++) {
      append(defaultRowData, { shouldFocus: false })
    }
  }

  const insertPost = async () => {
    if (storeSelect == ''){
      await Swal.fire({
        icon: 'warning',
        title: '店舗が未選択です',
        text: '店舗を選んでから送信してください',
        confirmButtonText: 'OK'
      })
      return
    }

    const Selectdate = new Date(Year, Month - 1, 1)
    Selectdate.setMonth(Selectdate.getMonth() + 1, 0)
    const inputDate = Selectdate.toLocaleDateString()
    const storeId = storenames.find((item) => item.value == storeSelect)
    const filterData = getValues().rows.filter((row) => row.code !== '')
    const formData = filterData.map((item) => {
      const result = [
        inputDate,
        storeId?.id,
        item.code,
        item.quantity,
        item.price
      ]
      return result
    })
    if (formData.length >= 1) {
      await window.myInventoryAPI.DataInsert({
        sheetName: '在庫履歴',
        action: 'FCInventory',
        sub_action: 'insert',
        data: formData,
        deleteNum: DeleteRowNum
      })
    }
    toast.success('送信しました')
  }

  const handleStoreChange = (event: SelectChangeEvent): void => {
    const select = event.target.value as string
    setStoreSelect(select)
  };


  const Reget = async () => {
    const DataGets = async() => {
      const data = await window.myInventoryAPI.ListGet({
        sheetName: '在庫履歴',
        action: 'FCInventoryGet',
        ranges: 'A2:D'
      })

      const storeId = storenames.find((item) => item.value == storeSelect)
      const date = new Date(Year, Month, 1)
      date.setDate(date.getDate() - 1)
      const filter = data.filter(
        (item) => item[1] == storeId?.id &&
          new Date(item[0]).toLocaleDateString() == date.toLocaleDateString()
      )
      const List = await window.myInventoryAPI.ListData()
      const inventorys: any[] = []
      for (let i = 0; i < types.length; i++) {
        const targets = List.filter((item) => item.type.includes(i + 1))
        const pushData = targets.map((item) => {
          const findData = filter.find((row) => row[2] == item.code)
          const result = [
            item.code,
            item.name,
            findData ? findData[3] : 0,
            item.newPrice
          ]
          return result
        }).filter((row) => row[2] !== 0)
        inventorys.push({ type: types[i], data: pushData })
      }
      const PrintData = {
        printDate: date.toLocaleDateString(),
        printStore: storeSelect,
        printData: JSON.stringify(inventorys)
      }
      await window.myInventoryAPI.storeSet('inventoryPrint', JSON.stringify(PrintData))
      window.myInventoryAPI.orderPrint('FCPrintContent')
    }
    
    toast.promise(
      DataGets(),
      {
        loading: '読み込み中',
        success: () => '終了',
        error: () => `エラーが発生しました`,
      }
    )

    
  }


  return(
    <div>
      <div>
        <LinkBaner id="zaiko" />
        <Toaster />
      </div>
      <div className="window_area">
        <ThemeProvider theme={darkTheme}>
          <div className="FC-Select">
            <div className="Inventory_Amount_title">
              <div style={{ width: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">年</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={Year}
                    label="年"
                    onChange={handleYearChange}
                  >
                    {yearList.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div style={{ width: 100 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">月</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={Month}
                    label="月"
                    onChange={handleMonthChange}
                  >
                    {monthList.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              
              <div>
                <FormControl>
                  <InputLabel id="demo-simple-select-label">店舗</InputLabel>
                  <Select
                    value={storeSelect}
                    label='店舗'
                    onChange={handleStoreChange}
                    displayEmpty
                    style={{ width: 120 }}
                  >
                    {storenames.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div style={{ width: 100 }}>
                <Button variant="outlined" onClick={Reget}>
                  印刷
                </Button>
              </div>
            </div>
          </div>
          <div className="form_area">
            <WordSearch
              DisplayStatus={DisplayStatus}
              setDisplayStatus={setDisplayStatus}
              RegisterData={RegisterData}
            />
            <div className="in-area" style={{ marginLeft: `${marginNum}px` }}>
              <form onSubmit={handleSubmit(onSubmit)} className="p-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="insert_area">
                    <div className="FCInventoryText-code">
                      <TextField
                        variant="outlined"
                        {...register(`rows.${index}.code`, {
                          validate: (value) => isHalfWidth(value) || '半角英数字で入力してください'
                        })}
                        className="insert_code"
                        placeholder="商品コード"
                        onKeyDown={(e) => handleEnterFocusNext(e)}
                        onBlur={() => search(index)}
                        inputProps={{ style: { textAlign: 'right', fontSize: 16 } }}
                        size="small"
                        fullWidth
                      />
                    </div>
                    <div className="FCInventoryText-name">
                      <TextField
                        {...register(`rows.${index}.name`)}
                        fullWidth
                        placeholder="商品名"
                        className="insert_name"
                        onKeyDown={(e) => handleEnterFocusNext(e)}
                        inputProps={{ style: { textAlign: 'left', fontSize: 16 } }}
                        size="small"
                      />
                    </div>
                    <div className="FCInventoryText-quantity">
                      <TextField
                        fullWidth
                        {...register(`rows.${index}.quantity`, {
                          validate: (value) => isHalfWidth(value) || '半角数字で入力してください'
                        })}
                        placeholder="数量"
                        className="insert_quantity"
                        type="text"
                        onKeyDown={(e) => handleEnterFocusNext(e)}
                        inputProps={{ style: { textAlign: 'right', fontSize: 16 } }}
                        size="small"
                      />
                    </div>
                    <div className="FCInventoryText-price">
                      <TextField
                        fullWidth
                        {...register(`rows.${index}.price`, {
                          validate: (value) => isHalfWidth(value) || '半角数字で入力してください'
                        })}
                        placeholder="単価"
                        className="insert_quantity"
                        type="text"
                        onKeyDown={(e) => handleEnterFocusNext(e)}
                        inputProps={{ style: { textAlign: 'right', fontSize: 16 } }}
                        size="small"
                      />
                    </div>
                    <div className="FCInventoryButton">
                      <Button
                        variant="outlined"
                        type="button"
                        onClick={() => RowRemove(index)}
                        className="text-red-500 hover:underline"
                      >
                        削除
                      </Button>
                    </div>
                  </div>
                ))}
              </form>
            </div>
          </div>
          <div className="button_area">
            <Button variant="outlined" onClick={addNewForm}>
              入力枠追加
            </Button>
            <Button variant="outlined" onClick={insertPost} endIcon={<SendIcon />}>
              送信実行
            </Button>
            {/* <SweetAlert2
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
            </SweetAlert2> */}
          </div>
        </ThemeProvider>
      </div>
    </div>
  )
}
