import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Button, FormControl, InputLabel } from '@mui/material'
import WordSearch from '../comp/ProductSearchWord'
import LinkBaner from '../comp/Linkbanar'
import toast, { Toaster } from 'react-hot-toast';
import '../css/Receiving.css'
import SendIcon from '@mui/icons-material/Send'
import { SubmitHandler } from 'react-hook-form'
import { MenuItem } from '@mui/material'
import Select from '@mui/material/Select';




import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import dayjs from 'dayjs'
import 'dayjs/locale/ja'



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

dayjs.locale('ja');

interface SelectOption {
  value: string
  label: string
}

type FormValues = {
  rows: {
    date: dayjs.Dayjs | null
    outStore: { value: string; label: string } | null
    inputStore: { value: string; label: string } | null
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
  date: null,
  outStore: null,
  inputStore: null,
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




export default function InventoryMoving() {
  const isDev = window.myInventoryAPI.isDev
  const Completeness = false

  const [DisplayStatus, setDisplayStatus] = useState(false)

  const [marginNum, setMarginNum] = useState(100)

  const [storeOptions, setStoreOptions] = useState<SelectOption[]>([])

  const [ProductdetailsList, setProductdetailsList] = useState([])



  const { control, register, handleSubmit, getValues, setValue, reset } =
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
    console.log(data)
  }

  const isHalfWidth = (value: string) => /^[\x20-\x7E]*$/.test(value)

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

  useEffect(() => {
    if(DisplayStatus){
      setMarginNum(330)
    }else{
      setMarginNum(80)
    }
  }, [DisplayStatus])

  const DetailsSet = async () => {
    const list = await window.myInventoryAPI.DetailsData()
    const filtered = list.filter(row => row[1] !== '')
    setProductdetailsList(filtered)
  }

  useEffect(() => {
    StoresGet()
    DetailsSet()
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

  const addNewForm = () => {
    for (let i = 0; i < 20; i++) {
      append(defaultRowData)
    }
  }

  const insert = async() => {
    const Now = await window.myInventoryAPI.NowGet()
    const filterData = getValues().rows.filter((row) => row.code !== '')
    const formData = filterData.map((item) => {
      const result = [
        item.date?.format('YYYY-MM-DD'),
        item.outStore,
        item.inputStore,
        item.code,
        item.name,
        item.quantity,
        item.price,
        null,
        item.person,
        item.remarks,
        Now[0],
        Now[1]
      ]
      return result
    })

    if (formData.length >= 1) {
      await window.myInventoryAPI.DataInsert({
        sheetName: '店舗間移動',
        action: 'insert',
        data: formData,
        formulaConfig: {
          targetCol: 8,
          formula: '=RC[-3]*RC[-1]'
        }
      })
    }
    reset({
      rows: defaultSet()
    })
    toast.success('送信しました')
  }

  return (
    <>
      <div>
        <LinkBaner />
        <Toaster />
      </div>
      <div className="window_area">
        <div className='form_area'>
          <WordSearch
            DisplayStatus={DisplayStatus}
            setDisplayStatus={setDisplayStatus}
          />
          <div className='in-area' style={{marginLeft: `${marginNum}px`, flex: 1}}>
            {(!isDev && !Completeness) ? (
              <div style={{ textAlign: 'center', paddingTop: '100px', fontSize: '1.5rem', color: 'white' }}>
                🚧 このページは現在準備中です（Coming Soon）
              </div>
            ) : (
              <>
                {/* <div className='window_top' style={{justifyContent: 'center'}}>
                  <h2 style={{color: 'white'}}>店舗間移動用ページ</h2>
                </div> */}
                <div style={{paddingTop: 10}}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
                    <ThemeProvider theme={darkTheme}>
                      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
                        {fields.map((field, index) => (
                          <div key={field.id} className="insert_area_store">
                            <Controller
                              name={`rows.${index}.date`}
                              control={control}
                              render={({ field }) => (
                                <DatePicker
                                  {...field}
                                  value={field.value ?? null}
                                  onChange={(newValue) => field.onChange(newValue)}
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
                                />
                              )}
                            />
                            <FormControl>
                              <InputLabel id="demo-simple-select-label">出庫</InputLabel>
                              <Select
                                {...register(`rows.${index}.outStore`)}
                                label='出庫'
                                displayEmpty
                                size="small"
                                style={{ width: 120, color: 'white' }}
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
                            </FormControl>
                            <FormControl>
                              <InputLabel id="demo-simple-select-label">入庫</InputLabel>
                              <Select
                                {...register(`rows.${index}.inputStore`)}
                                label='入庫'
                                displayEmpty
                                size="small"
                                style={{ width: 120, color: 'white' }}
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
                            </FormControl>
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
                    </ThemeProvider>
                  </LocalizationProvider>
                </div>
              </>
            )}
          </div>
          <div className="button_area">
            <Button variant="outlined" onClick={addNewForm}>
              入庫枠追加
            </Button>
            <Button variant="outlined" onClick={insert} endIcon={<SendIcon />}>
              入庫実行
            </Button>
            {/* <Button variant="outlined" onClick={handleOpenDialog} endIcon={<SendIcon />}>
              入庫実行
            </Button> */}
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
        </div>
      </div>
    </>
  )
}
