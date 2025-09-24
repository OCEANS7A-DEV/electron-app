import { useLoaderData } from 'react-router-dom'
import LinkBaner from '../../../comp/Linkbanar'
import React, { useState, useEffect, useRef } from 'react'
import type { JSX } from 'react'
import '../../../css/InventoryAmount.css'

import Select, { SelectChangeEvent } from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import { Button } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

import '../../../css/Receiving.css'
import { useForm, useFieldArray } from 'react-hook-form'
import { SubmitHandler } from 'react-hook-form'

import Swal from 'sweetalert2'

interface SelectOption {
  value: number
  label: string
}

interface SelectStoreOption {
  value: string
  label: string
  type: string
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#2a2a30',
      paper: '#333'
    },
    primary: {
      main: '#90caf9'
    },
    text: {
      primary: '#ffffff'
    }
  }
})

type FormValues = {
  rows: {
    store: string
    stocking: string
    used: string
    inventoryamount: string
  }[]
}


const defaultSet = (stores): FormValues['rows'] => {
  const result: FormValues['rows'] = []
  stores.forEach((item) => {
    result.push({
      store: item[0],
      stocking: '',
      used: '',
      inventoryamount: ''
    })
  })
  return result
}

export const loader = async () => {
  const loaderData = await window.myInventoryAPI.ListGet({
    sheetName: '店舗在庫金額',
    action: 'InputDataGet',
    ranges: 'A3:F'
  })
  const now = new Date()
  const year = now.getFullYear()
  const yearList: SelectOption[] = [
    { value: year + 1, label: `${year + 1}年` },
    { value: year, label: `${year}年` },
    { value: year - 1, label: `${year - 1}年` }
  ]
  const monthList: SelectOption[] = []
  for (let i = 0; i < 12; i++) {
    monthList.push({ value: i + 1, label: `${i + 1}月` })
  }

  const stores = await window.myInventoryAPI.ListGet({
    sheetName: '店舗一覧',
    action: 'ListGet',
    ranges: 'A2:B'
  })
  const storenames: SelectStoreOption[] = stores.filter(
    (row) => row[0] !== '' && row[1] == 'DM' && row[0] !== '会議室'
  )

  return { loaderData, yearList, monthList, storenames }
}

export default function InventoryAmount(): JSX.Element {
  const { loaderData, yearList, monthList, storenames } = useLoaderData<typeof loader>()
  const [Year, setYear] = useState<number>(new Date().getFullYear())
  const [Month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const insertActionRef = useRef<string>('')
  const [DATA, setDATA] = useState(loaderData)

  const dataGet = async (): Promise<[string, string, number, number, number, string]> => {
    const getData = await window.myInventoryAPI.ListGet({
      sheetName: '店舗在庫金額',
      action: 'InputDataGet',
      ranges: 'A3:F'
    })
    return getData
  }

  const handleYearChange = (e: SelectChangeEvent<number>): void => {
    setYear(e.target.value)
  }

  const handleMonthChange = (e: SelectChangeEvent<number>): void => {
    setMonth(e.target.value)
  }

  const formatDate = (date): string => {
    const dt = new Date(date)
    const result = `${dt.getFullYear()}/${dt.getMonth() + 1}`
    return result
  }

  const dataSet = (data): void => {
    const fData = watch().rows
    data.forEach((item) => {
      //console.log(item)
      const indexNum = fData.findIndex((row) => row.store == item[1])
      setValue(`rows.${indexNum}.stocking`, item[2])
      setValue(`rows.${indexNum}.used`, item[3])
      setValue(`rows.${indexNum}.inventoryamount`, item[4])
    })
  }

  useEffect(() => {
    const selectDate = `${Year}/${Month}`
    const filter = DATA.filter((item) => formatDate(item[0]) == selectDate)
    if (filter.length == 0) {
      insertActionRef.current = 'insert'
      reset({
        rows: defaultSet(storenames)
      })
    } else {
      insertActionRef.current = 'InventoryAmountUpdate'
      dataSet(filter)
    }
  }, [Year, Month, DATA])

  const { control, register, handleSubmit, getValues, setValue, watch, reset } =
    useForm<FormValues>({
      defaultValues: {
        rows: defaultSet(storenames)
      }
    })

  const { fields } = useFieldArray({
    control,
    name: 'rows'
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data)
  }

  const handleSend = async (): Promise<void> => {
    const selectDate = `${Year}/${Month}`
    if (insertActionRef.current == 'insert') {
      const getData = await dataGet()
      const result = getData.find((item) => formatDate(item[0]) == selectDate)
      if (result) {
        SwalOpen(getData)
        return
      }
    }
    DataSend()
  }

  const DataSend = async (): Promise<void> => {
    const selectDate = `${Year}/${Month}`
    const fData = watch().rows
    const formData = fData.map((item) => {
      return [selectDate, item.store, null, item.used, null]
    })

    const actionstring = insertActionRef.current

    if (formData.length >= 1) {
      await window.myInventoryAPI.DataInsert({
        sheetName: '店舗在庫金額',
        sub_action: 'insert',
        action: actionstring,
        data: formData,
        date: selectDate
      })
    }
  }

  const SwalOpen = (newData): void => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true
    })
    swalWithBootstrapButtons
      .fire({
        title: '確認',
        text: 'すでに入力されたデータがあります。上書きしますか？',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'データを上書きする',
        cancelButtonText: '入力されたデータを取得する',
        reverseButtons: true
      })
      .then((result) => {
        if (result.isConfirmed) {
          insertActionRef.current = 'InventoryAmountUpdate'
          DataSend()
          swalWithBootstrapButtons.fire({
            title: 'complete!',
            text: 'データが上書きされました',
            icon: 'success'
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: 'Cancelled',
            text: '上書きを中止し、データを取得します',
            icon: 'error'
          })
          setDATA(newData)
        }
      })
  }

  const Reget = async (): Promise<void> => {
    const getData = await dataGet()
    setDATA(getData)
  }

  const isHalfWidth = (value: string): boolean => /^[\x20-\x7E]*$/.test(value)

  return (
    <div>
      <div>
        <LinkBaner id="zaiko" />
      </div>
      <div className="Inventory_Amount_area">
        <ThemeProvider theme={darkTheme}>
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
            <div style={{ width: 100 }}>
              <Button variant="outlined" onClick={Reget}>
                再取得
              </Button>
            </div>
          </div>
          <div className="Inventory_Amount_table_area">
            <div className="Inventory_Amount_table">
              <div className="Inventory_Amount_rows_header">
                <div>店舗名</div>
                <div>仕入金額</div>
                <div>使用金額</div>
                <div>在庫金額</div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="p-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="Inventory_Amount_rows">
                    <div className="Inventory_Amount_Store">{getValues(`rows.${index}.store`)}</div>
                    <div className="Inventory_Amount_stocking">
                      {Number(getValues(`rows.${index}.stocking`)).toLocaleString()}
                    </div>
                    <div className="Inventory_Amount_used">
                      <TextField
                        {...register(`rows.${index}.used`, {
                          validate: (value) => isHalfWidth(value) || '半角英数字で入力してください'
                        })}
                        inputProps={{ style: { textAlign: 'right', fontSize: 20 } }}
                        fullWidth
                        size="small"
                        placeholder="使用金額"
                      />
                    </div>
                    <div className="Inventory_Amount_inventoryamount">
                      {Number(getValues(`rows.${index}.inventoryamount`)).toLocaleString()}
                    </div>
                  </div>
                ))}
              </form>
            </div>
          </div>
          <div className="button_area">
            <Button variant="outlined" onClick={handleSend} endIcon={<SendIcon />}>
              送信実行
            </Button>
          </div>
        </ThemeProvider>
      </div>
    </div>
  )
}
