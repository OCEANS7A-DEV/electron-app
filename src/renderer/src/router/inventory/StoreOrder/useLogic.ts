// ReactUSE
import { useState, useEffect } from 'react'

// Form関連コンポーネント
import {
  useForm,
  Controller,
  SubmitHandler,
  useFieldArray
} from 'react-hook-form'


import {
  defaultDataFormat,
} from './logic'



export type FormValues = {
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


export const useLogic = () => {


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

  return {

  }
}
