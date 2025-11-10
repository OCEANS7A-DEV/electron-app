/* eslint-disable prettier/prettier */

// React関連
import React, { useState, useEffect, useRef } from 'react'
import type {JSX} from 'react'

// フォーム関連
import { useForm, useFieldArray, Controller } from 'react-hook-form'

// トースト通知
import toast, { Toaster } from 'react-hot-toast'

// 日付取得系関連
import 'dayjs/locale/ja'
import dayjs, {Dayjs} from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
dayjs.locale('ja')

// MUIコンポーネント
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import Select, {SelectChangeEvent} from '@mui/material/Select'

// MUIアイコン
import SendIcon from '@mui/icons-material/Send'


// 自作コンポーネント
import LinkBaner from '../../../comp/Linkbanar'
import WordSearch from '../../../comp/ProductSearchWord'
import InsertDialog from './InsertUtil/InsertDialog'

// ユーティリティ
import { productGet, getNearestMonday } from '../../../Util/util'

// CSS
import '../../../css/Receiving.css'


interface SelectOption {
  value: string
  label: string
  id: number
}


type FormValues = {
  rows: {
    vendor: { value: string, label: string, id: number } | null
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


const placeholderStyle = {
  '&::placeholder': {
    fontSize: '14px',
    opacity: 1,
    color: 'gray'
  }
}

const textFieldStyle = {
  backgroundColor: 'white',
  borderRadius: '4px',
  marginRight: '8px',
  height: '36px'
}


const fadeInUp = {
  '@keyframes fadeInUp': {
    'from': {
      opacity: 0,
      transform: 'translateY(-20px)',
    },
    'to': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
};

const fadeOutUp = {
  '@keyframes fadeOutUp': {
    'from': {
      opacity: 1,
      transform: 'translateY(0)',
    },
    'to': {
      opacity: 0,
      transform: 'translateY(-20px)',
    },
  },
};

export default function ReceivingPage(): JSX.Element {
  const [VendorList, setVendorList] = useState<SelectOption[]>([])

  const [InsertDate, setDate] = useState<string>('')

  const [dateValue, setDateValue] = useState<Dayjs | null>(null);

  const keyData = 'ReceivingstockInputData'

  const [DialogOpen, setDialogOpen] = useState(false)

  const validateMsg = useRef<string>('')

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      rows: defaultSet()
    }
  })

  const { fields, append, remove, insert } = useFieldArray<FormValues>({
    control,
    name: 'rows'
  })

  useEffect(() => {
    const subscription = watch((value, {name}) => {
      console.log(value)
      if (name && name.startsWith('rows')) {
        SaveInputContents() 
      }
    });

    return () => subscription.unsubscribe();

  }, [watch])

  useEffect(() => {
    const SaveDataSet = async () => {
      const inputData = await window.myInventoryAPI.storeGet('ReceivingstockInputData')
      const parsedData = JSON.parse(inputData)
      if (parsedData.length === 0) return
      let index = 0
      parsedData.forEach((item) => {
        setValue(`rows.${index}.vendor`, item.vendor)
        setValue(`rows.${index}.name`, item.name)
        setValue(`rows.${index}.quantity`, item.quantity)
        setValue(`rows.${index}.code`, item.code)
        setValue(`rows.${index}.price`, item.price)
        index++
      })
    }
    SaveDataSet()

  }, [])

  const SaveInputContents = () => {
    const filterData = getValues().rows.filter((row) => row.code !== '')
    window.myInventoryAPI.storeSet(keyData, JSON.stringify(filterData))
  }

  const onSubmit = () => {
    if (InsertDate == 'NaN-NaN-NaN') {
      alert('日付が入力されていません')
      return
    }
    setDialogOpen(true)
  }

  const isHalfWidth = (value: string) => /^[\x20-\x7E]*$/.test(value)

  const isHalfWidthNum = (value: string) => /^[0-9]*$/.test(value)

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
    window.myInventoryAPI.storeSet(keyData, JSON.stringify([]))
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
    setDateValue(dayjs(today))
  }, [])

  const handleEnterFocusNext = (e: React.KeyboardEvent<HTMLElement>, rowIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const inputElement = e.target as HTMLInputElement
      const form = inputElement.form
      if(form){
        const elements = Array.from(form.elements) as HTMLElement[]
        const index = elements.indexOf(inputElement)
        const nextElement = elements[index + 1] as HTMLInputElement | HTMLButtonElement
        if (nextElement && nextElement.type !== 'button') {
          if (nextElement.nodeName == "FIELDSET") {
            const nextTextFieldElement = elements[index + 2] as HTMLInputElement | HTMLButtonElement
            nextTextFieldElement.focus()
          } else {
            nextElement.focus()
          }
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
    const values = getValues()
    const code = values.rows[index].code
    const result = await productGet(code)
    if (result.productData) {
      const vendordata = { value: result.productData.vendor, label: result.productData.vendor, id: result.productData.vendorid }
      const name = result.productData.name
      const Price = result.productData.newPrice
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

  useEffect(() => {
    const date = dateValue?.toDate()
    const Setdate = getNearestMonday(date)
    setDate(Setdate)
  }, [dateValue])

  const validateCheck = (index: number, keyName: string, errormsg: string) => {
    let columnName = ''
    if (keyName == 'code') {
      columnName = '商品コード'
    } else if (keyName == 'quantity') {
      columnName = '数量'
    } else if (keyName == 'price') {
      columnName = '単価'
    } else {
      columnName = ''
    }
    const value = getValues().rows[index][keyName]
    const errorstring = `${index + 1}行目 ${columnName} ${errormsg}`
    if (keyName == 'code' || keyName == 'quantity') {
      const result = isHalfWidthNum(value)
      if (!result) {
        if (validateMsg.current == '') {
          validateMsg.current = errorstring
        } else {
          validateMsg.current = `${validateMsg.current}\n${errorstring}`
        }
        return false
      } else {
        return true
      }
    } else {
      const result = isHalfWidth(value)
      if (!result) {
        if (validateMsg.current == '') {
          validateMsg.current = errorstring
        } else {
          validateMsg.current = `${validateMsg.current}\n${errorstring}`
        }
        return false
      } else {
        return true
      }
    }
  }

  const SubmitFaledToast = () => {
    toast.custom((t) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: 2,
          borderRadius: 1,
          boxShadow: 3,
          ...fadeInUp,
          ...fadeOutUp,
          animation: t.visible
            ? 'fadeInUp 0.3s forwards'
            : 'fadeOutUp 0.3s forwards',
        }}
      >
        <Box
          sx={{
            whiteSpace: 'pre-line',
            marginRight: 2,
          }}
        >
          {validateMsg.current}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Button
            onClick={() => {
              toast.dismiss(t.id)
              validateMsg.current = ''
            }}
            size="small"
            variant="contained"
            color="primary"
          >
            Close
          </Button>
        </Box>
      </Box>
    ),
      {
        duration: Infinity,
        position: 'top-center',
      }
    )
  }

  const dateSet = (e) => {
    setDateValue(e)
  }

  return (
    <Box>
      <Box>
        <LinkBaner id="zaiko" />
        <Toaster />
      </Box>
      <Box
        sx={{
          paddingTop: "60px",
          paddingBottom: "70px",
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              marginRight: 1,
              whiteSpace: 'nowrap',
              color: "white"
            }}
          >
            入庫日付
          </Typography>
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
                    backgroundColor: 'white',
                    borderRadius: '4px',
                  },
                },
              }}
              value={dateValue}
              onChange={(e) => dateSet(e)}
            />
          </LocalizationProvider>
        </Box>
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <WordSearch
            RegisterData={RegisterData}
          />
          <Box>
            <Box component="form" onSubmit={handleSubmit(onSubmit, SubmitFaledToast)}>
              {fields.map((field, index) => (
                <Box
                  key={field.id}
                  sx={{
                    display: 'flex',
                    marginBottom: 1,
                    marginLeft: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 120,
                    }}
                  >
                    <FormControl fullWidth>
                      <Controller
                        name={`rows.${index}.vendor`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            size="small"
                            onChange={(e: SelectChangeEvent) => {
                              const selectedVendor = e.target.value as string
                              const vendordata = VendorList.find(vendor => vendor.value === selectedVendor) || null
                              field.onChange(vendordata)
                            }}
                            value={field.value?.value || ''}
                            onBlur={field.onBlur}
                            sx={{
                              ...textFieldStyle,
                              textAlign: 'right'
                            }}
                          >
                            <MenuItem value=""></MenuItem>
                            {VendorList.map((Vdata) => (
                              <MenuItem value={Vdata.value} key={Vdata.id}>
                                {Vdata.label}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Box>
                  <TextField
                    {...register(`rows.${index}.code`, {
                      validate: () => validateCheck(index, 'code', '半角英数字で入力してください')
                    })}
                    placeholder="商品コード"
                    size="small"
                    onKeyDown={(e) => handleEnterFocusNext(e, index)}
                    inputProps={{
                      sx: placeholderStyle,
                      style: { textAlign: 'right' }
                    }}
                    sx={{
                      ...textFieldStyle,
                      width: 100,
                    }}
                    onBlur={() => search(index)}
                  />
                  <TextField
                    {...register(`rows.${index}.name`)}
                    placeholder="商品名"
                    size="small"
                    onKeyDown={(e) => handleEnterFocusNext(e, index)}
                    inputProps={{
                      sx: placeholderStyle
                    }}
                    sx={{
                      ...textFieldStyle,
                      width: 300,
                    }}
                  />
                  <TextField
                    {...register(`rows.${index}.quantity`, {
                      validate: () => validateCheck(index, 'quantity', '半角数字で入力してください')
                    })}
                    error={!!errors.rows?.[index]?.quantity}
                    helperText={errors.rows?.[index]?.quantity?.message}
                    placeholder="数量"
                    size="small"
                    onKeyDown={(e) => handleEnterFocusNext(e, index)}
                    inputProps={{
                      sx: placeholderStyle,
                      style: { textAlign: 'right' }
                    }}
                    sx={{
                      ...textFieldStyle,
                      width: 80,
                    }}
                  />
                  <TextField
                    {...register(`rows.${index}.price`, {
                      validate: () => validateCheck(index, 'price', '半角数字で入力してください')
                    })}
                    placeholder="単価"
                    size="small"
                    inputProps={{
                      sx: placeholderStyle,
                      style: { textAlign: 'right' }
                    }}
                    sx={{
                      ...textFieldStyle,
                      width: 100,
                    }}
                    onKeyDown={(e) => handleEnterFocusNext(e, index)}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => RowRemove(index)}
                  >
                    削除
                  </Button>
                </Box>
              ))}
              <Box
                sx={{
                  display: 'flex',
                  position: 'fixed',
                  zIndex: 100,
                  height: '60px',
                  bottom: 0,
                  width: '100%',
                  left: 0,
                  alignItems: 'center',
                  backgroundColor: '#2a2a30',
                  borderTop: '1px solid #444',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexGrow: 1,
                    justifyContent: 'space-around',
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={addNewForm}
                  >
                    入庫枠追加
                  </Button>
                  <Button
                    variant="outlined"
                    type="submit"
                    endIcon={<SendIcon />}
                  >
                    入庫実行
                  </Button>
                  <InsertDialog
                    data={getValues().rows}
                    DialogOpen={DialogOpen}
                    setDialogOpen={setDialogOpen}
                    insertPost={insertPost}
                    InsertDate={InsertDate}
                    tableType="receiving"
                  />
                </Box>

              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
