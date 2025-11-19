// 型import
import { SelectChangeEvent } from '@mui/material/Select'
import {
  SubmitHandler,
  UseFormGetValues,
  UseFormRegister,
  UseFormHandleSubmit,
  FieldArrayWithId
} from 'react-hook-form'

export interface SelectStoreOption {
  value: string
  label: string
  type: string
}

export type FormValues = {
  rows: {
    store: string
    stocking: string
    used: string
    inventoryamount: string
  }[]
}

export interface SelectOption {
  value: number
  label: string
}

export type storeGetType = [
  number,
  string,
  string
]

export type GetDataType = [
  string,
  string,
  number,
  number,
  number,
  string
]

export interface UseLogicReturn {
  yearList: SelectOption[]
  monthList: SelectOption[]
  Year: number
  Month: number
  handleYearChange: (e: SelectChangeEvent<number>) => void
  handleMonthChange: (e: SelectChangeEvent<number>) => void
  getValues: UseFormGetValues<FormValues>
  Reget: () => Promise<void>
  fields: FieldArrayWithId<FormValues, 'rows', 'id'>[]
  register: UseFormRegister<FormValues>
  onSubmit: SubmitHandler<FormValues>
  handleSubmit: UseFormHandleSubmit<FormValues>
  isHalfWidth: (str: string) => boolean
}

export interface DateReturn {
  yearList: SelectOption[]
  monthList: SelectOption[]
}

export type FormDataType = [
  string,
  string,
  null,
  string,
  null
]

export interface NowReturn {
  year: number
  month: number
}
