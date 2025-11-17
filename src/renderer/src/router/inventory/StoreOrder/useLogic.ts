// React
import {
  useState,
  useEffect,
  useRef
} from 'react'

// Form関連コンポーネント
import {
  useForm,
  SubmitHandler,
  useFieldArray
} from 'react-hook-form'

import toast from 'react-hot-toast'

import { SelectChangeEvent } from '@mui/material/Select'

import dayjs, { Dayjs } from 'dayjs'
dayjs.locale('ja')


import {
  productGet,
  getNearestMonday
} from '../../../Util/util'


import {
  defaultRowData,
  defaultDataFormat,
  storesGet,
  insertDataFormat,
  MissingItemsDataGet
} from './logic'

import {
  SelectOption,
  FormValues
} from './types'


export const useLogic = () => {
  const [storeSelect, setStoreSelect] = useState('')
  const [storeOptions, setStoreOptions] = useState<SelectOption[]>([])
  const [dateValue, setDateValue] = useState<Dayjs | null>(null)
  const typeRef = useRef('')
  const insertDateRef = useRef('')
  const DeleteRowNumRef = useRef(0)
  const BeforeDataRef = useRef<any[]>([])
  const InsertActionRef = useRef('')

  const { control, register, handleSubmit, getValues, setValue, reset, watch } =
    useForm<FormValues>({
      defaultValues: {
        rows: defaultDataFormat()
      }
    })

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: 'rows'
  })

  const storeSet = async () => {
    const store: SelectOption[] = await storesGet()
    setStoreOptions(store)
  }

  const DateSet = async () => {
    const date = getNearestMonday(new Date())
    setDateValue(dayjs(date))
    insertDateRef.current = new Date(date).toLocaleDateString()
  }

  const firstSet = async() => {
    storeSet()
    DateSet()
  }


  const orderDataGetSelect = async () => {
    const InsertDate = insertDateRef.current
    if (InsertDate == '' || storeSelect == '') return
    const ordersGet = await window.myInventoryAPI.ListGet({
      sheetName: '店舗へ',
      action: 'InputDataGet',
      ranges: 'A2:M'
    })
    const MissingData = await MissingItemsDataGet(InsertDate, storeSelect, ordersGet)
    let count = 0
    MissingData.forEach(async(item) => {
      const OutStockStr = item[11].split("、")
      const OutStocktargetData = OutStockStr.find((item) =>
        (item.includes('欠品') && !item.includes('前回欠品分')
        ) || item.includes('前回欠品分欠品')
      )
      const OutStockNum = OutStocktargetData.replace(/[^0-9]/g, '')
      const result = await productGet(item[3], true)
      const detail = { value: item[5], label: item[5] }
      setValue(`rows.${count}.vendor`, item[2])
      setValue(`rows.${count}.code`, item[3])
      setValue(`rows.${count}.detailList`, result.detailsData)
      setValue(`rows.${count}.detail`, detail)
      setValue(`rows.${count}.name`, item[4])
      setValue(`rows.${count}.quantity`, OutStockNum)
      setValue(`rows.${count}.person`, item[10])
      setValue(`rows.${count}.price`, item[8])
      setValue(`rows.${count}.remarks`, '前回欠品分')
      count++
    })

    const targetDateStr = new Date(InsertDate).toDateString()
    const filtered = ordersGet.filter((item) =>
      new Date(item[0]).toDateString() == targetDateStr &&
      item[1] == storeSelect &&
      item[11] !== '前回欠品分'
    )
    const UpDataRowNum = filtered.length + MissingData.length
    if (filtered.length > 0) {
      if (filtered[0][12] == '注文無') {
        return filtered
      }
      if (UpDataRowNum > 20) {
        const diffcount = Math.ceil(UpDataRowNum / 20) - 1
        for (let i = 0; i < diffcount; i++) {
          await addNewForm()
        }
      }

      filtered.forEach(async(item) => {
        const result = await productGet(item[3], true)
        setValue(`rows.${count}.vendor`, item[2])
        setValue(`rows.${count}.code`, item[3])
        setValue(`rows.${count}.detailList`, result.detailsData)
        const detail = { value: item[5], label: item[5] }
        setValue(`rows.${count}.detail`, detail)
        setValue(`rows.${count}.name`, item[4])
        setValue(`rows.${count}.quantity`, item[6])
        setValue(`rows.${count}.person`, item[10])
        setValue(`rows.${count}.price`, item[8])
        setValue(`rows.${count}.remarks`, item[11])
        count++
      })
    }
    DeleteRowNumRef.current = getValues().rows.filter((item) => item.name !== '').length
    BeforeDataRef.current = filtered
    return filtered
  }

  const addNewForm = () => {
    for (let i = 0; i < 20; i++) {
      append(defaultRowData, { shouldFocus: false })
    }
  }


  const orderedData = () => {
    reset({
      rows: defaultDataFormat()
    })
    if (storeSelect == '') return
    toast.promise(
      orderDataGetSelect(),
      {
        loading: '注文データ読み込み中…',
        success: (data) => {
          const InsertDate = insertDateRef.current
          if (data.length == 0) {
            InsertActionRef.current = 'append'
            return `${InsertDate}の${storeSelect}店は注文されていません`
          } else if (data.length == 1 && data[0][12]) {
            InsertActionRef.current = 'append'
            return `${InsertDate}の${storeSelect}店は注文無し`
          } else {
            InsertActionRef.current = 'update'
            return `${InsertDate}の${storeSelect}店の注文数${data.length}`
          }
        },
        error: () => {
          InsertActionRef.current = 'append'
          return `エラーが発生しました`
        },
      },
    )
  }


  const handleEnterFocusNext = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const form = (e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement).form
      if (form) {
        const elements = Array.from(form.elements) as HTMLElement[];
        const index = elements.indexOf(e.target as HTMLElement);
        let focused = false;
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
          //addNewForm()
        }
      }
    }
  }


  const RegisterData = (data) => {
    console.log(data)
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (storeSelect === '' || data.rows.length == 0) {
      return
    }
    const DataSubmit = async () => {
      const insertData = await insertDataFormat(data.rows, insertDateRef.current, storeSelect)
      if (insertData.length >= 1) {
        await window.myInventoryAPI.DataInsert({
          sheetName: '店舗へ',
          action: 'Orderinsert',
          sub_action: 'insert',
          insert_action: InsertActionRef.current,
          data: insertData,
          formulaConfig: {
            targetCol: 10,
            formula: '=RC[-3]*RC[-1]'
          },
          deleteNum: DeleteRowNumRef.current
        })
        DeleteRowNumRef.current = insertData.length
      }
    }
    toast.promise(
      DataSubmit(),
      {
        loading: 'データ送信中...',
        success: 'データ送信完了',
        error: 'データ送信失敗'
      }
    )
  }


  const handleStoreChange = (event: SelectChangeEvent) => {
    const select = event.target.value as string
    setStoreSelect(select);
    const type = storeOptions.find(item => item.value == select)?.type ?? ""
    typeRef.current = type
  }

  const handleDateChange = (date) => {
    const NewDate = new Date(date).toLocaleDateString()
    setDateValue(dayjs(date))
    insertDateRef.current = NewDate
  }

  const productCodeSearch = async(index: number) => {
    let code = getValues('rows')[index].code
    if (code == '' && index !== 0) {
      code = getValues('rows')[index - 1].code
      setValue(`rows.${index}.code`, code)
    }
    const result = await productGet(code, true)
    if (result) {
      const product = result.productData
      const detail = result.detailsData
      setValue(`rows.${index}.vendor`, product.vendor)
      setValue(`rows.${index}.name`, product.name)
      setValue(`rows.${index}.detailList`, detail)
      if (typeRef.current !== 'VC') {
        setValue(`rows.${index}.price`, product.newPrice)
      } else {
        setValue(`rows.${index}.price`, product.VC)
      }
    }
  }

  const DetailsGet = (index: number) => {
    const result = watch(`rows.${index}.detailList`)
    return result
  }

  const deleteRow = (index: number) => {
    remove(index)
    append(defaultRowData, { shouldFocus: false })
  }

  const insertRow = (index: number) => {
    insert(index, defaultRowData, { shouldFocus: false })
  }


  useEffect(() => {
    firstSet()
  }, [])

  useEffect(() => {
    orderedData()
  }, [storeSelect, insertDateRef.current])


  return {
    RegisterData,
    fields,
    register,
    onSubmit,
    handleSubmit,
    control,
    storeSelect,
    storeOptions,
    handleStoreChange,
    dateValue,
    handleDateChange,
    handleEnterFocusNext,
    productCodeSearch,
    DetailsGet,
    deleteRow,
    insertRow,
    addNewForm
  }
}
