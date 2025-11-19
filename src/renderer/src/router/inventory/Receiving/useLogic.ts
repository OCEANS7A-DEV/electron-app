// React
import { useState, useEffect, useRef } from 'react'

// Form関連コンポーネント
import { useForm, SubmitHandler, useFieldArray, useWatch, Control } from 'react-hook-form'

import toast from 'react-hot-toast'

import { SelectChangeEvent } from '@mui/material/Select'

import { productGet, getNearestMonday } from '../../../Util/util'


import {
  defaultDataFormat
} from './logic'

import dayjs, { Dayjs } from 'dayjs'
dayjs.locale('ja')


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


export const useLogic = () => {
  const [VendorList, setVendorList] = useState<SelectOption[]>([])
  const [InsertDate, setDate] = useState<string>('')
  const [dateValue, setDateValue] = useState<Dayjs | null>(null)
  const validateMsg = useRef<string>('')

  const { control, register, handleSubmit, getValues, setValue, reset,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      rows: defaultDataFormat()
    }
  })

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: 'rows'
  })

  const RegisterData = (data) => {
    console.log(data)
  }

  const dateSet = (e) => {
    setDateValue(e)
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
          addNewForm()
        }
      }
    }
  }

  const onSubmit = () => {
    if (InsertDate == 'NaN-NaN-NaN') {
      alert('日付が入力されていません')
      return
    }
    //setDialogOpen(true)
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

  const isHalfWidth = (value: string) => /^[\x20-\x7E]*$/.test(value)

  const isHalfWidthNum = (value: string) => /^[0-9]*$/.test(value)


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

  useEffect(() => {
    VendorListGet()
  }, [])


  return {
    control,
    RegisterData,
    errors,
    fields,
    register,
    handleSubmit,
    getValues,
    dateValue,
    dateSet,
    onSubmit,
    handleEnterFocusNext,
    search,
    validateCheck,
    placeholderStyle,
    textFieldStyle,
    VendorList
  }
}
