import {
  useFieldArray,
  Control,
  UseFormRegister,
  UseFormHandleSubmit,
  UseFormGetValues
} from 'react-hook-form'

import { SelectChangeEvent } from '@mui/material/Select'

import dayjs from 'dayjs'
dayjs.locale('ja')

export type FormValues = {
  rows: {
    date: dayjs.Dayjs | null
    outStore: { value: string; label: string; id: number } | null
    inputStore: { value: string; label: string; id: number } | null
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

export interface InsertDialogProps {
  data: FormValues['rows']
  DialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  insertPost: () => void
}

export interface SelectOption {
  value: string
  label: string
  id: number
}

export type InsertTypes = [
  string,
  string,
  string,
  number,
  string,
  number,
  number,
  null,
  string,
  string,
  string
]

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

export type VendorGet = [number | string, string]

export interface UseLogicReturn {
  control: Control<FormValues>
  RegisterData: (data: productType) => Promise<void>
  fields: ReturnType<typeof useFieldArray<FormValues, 'rows'>>['fields']
  register: UseFormRegister<FormValues>
  handleSubmit: UseFormHandleSubmit<FormValues>
  onSubmit: (data: FormValues) => void
  handleEnterFocusNext: (e: React.KeyboardEvent<HTMLElement>) => void
  search: (index: number) => Promise<void>
  RowRemove: (index: number) => Promise<void>
  addNewForm: () => void
  DialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  handleSelectChange: (e: SelectChangeEvent, index: number, select: string) => void
  storeList: SelectOption[]
  insertPost: () => void
  getValues: UseFormGetValues<FormValues>
}

export interface RowProps {
  index: number
  register: UseFormRegister<FormValues>
  control: Control<FormValues>
  storeList: SelectOption[]
  handleEnterFocusNext: (e: React.KeyboardEvent<HTMLElement>) => void
  search: (index: number) => Promise<void>
  handleSelectChange: (e: SelectChangeEvent, index: number, select: string) => void
  RowRemove: (index: number) => Promise<void>
}
