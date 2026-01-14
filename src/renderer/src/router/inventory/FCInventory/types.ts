import {
  UseFormRegister,
  UseFormGetValues,
  UseFormHandleSubmit,
  SubmitHandler,
  FieldArrayWithId
} from 'react-hook-form'

import { SelectChangeEvent } from '@mui/material/Select'

export interface productType {
  vendor: string
  vendorid: number
  code: number
  name: string
  defaultPrice: number
  newPrice: string | number
  VC: string | number
  store: string | number
  order: string | number
  service: string | number
  remarks: string
  type: string
  Possibility: boolean | string
  ImageURL: string
}

export interface SelectOption {
  id: number
  value: string
  label: string
  type: string
}

export interface DateSelectOption {
  value: number
  label: string
}

export type FormValues = {
  rows: {
    code: string
    name: string
    quantity: string
    price: string
  }[]
}

export interface RowProps {
  index: number
  register: UseFormRegister<FormValues>
  // control: Control<FormValues>
  // storeList: SelectOption[]
  handleEnterFocusNext: (e: React.KeyboardEvent<HTMLElement>) => void
  // search: (index: number) => Promise<void>
  // handleSelectChange: (e: SelectChangeEvent, index: number, select: string) => void
  handleRowDelete: (index: number) => void
}

export interface DialogRowTypes {
  code: string
  name: string
  quantity: string
  price: string
}

export interface DialogProps {
  data: DialogRowTypes[]
  InsertDate: string
  DialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  insertPost: () => void
  storeName: string
}

export type DataTypes = [string, number, number, number]

export type InsertDataTypes = [string, number, number, number, number]

export interface FCInventoryTypes {
  RegisterData: (data: productType) => void
  storenames: SelectOption[]
  storeValue: string
  handleStoreChange: (e: SelectChangeEvent<string>) => void
  yearList: DateSelectOption[]
  yearValue: number
  handleYearChange: (e: SelectChangeEvent<number>) => void
  monthList: DateSelectOption[]
  monthValue: number
  handleMonthChange: (e: SelectChangeEvent<number>) => void
  handleEnterFocusNext: (e: React.KeyboardEvent<HTMLElement>) => void
  handleRowDelete: (index: number) => void
  DialogOpen: boolean
  setDialogOpen: (status: boolean) => void
  insertPost: () => void
  getValues: UseFormGetValues<FormValues>
  fields: FieldArrayWithId<FormValues, 'rows', 'id'>[]
  register: UseFormRegister<FormValues>
  onSubmit: SubmitHandler<FormValues>
  handleSubmit: UseFormHandleSubmit<FormValues>
  addNewForm: () => void
  Reget: () => void
}

export interface LoaderData {
  storenames: {
    id: number
    value: string
    label: string
    type: string
  }[]
  yearList: DateSelectOption[]
  monthList: DateSelectOption[]
  types: any[]
}
