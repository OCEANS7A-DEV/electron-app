import {
  useFieldArray,
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormHandleSubmit,
  UseFormGetValues
} from 'react-hook-form'

import { SelectChangeEvent } from '@mui/material/Select'

import dayjs, { Dayjs } from 'dayjs'
dayjs.locale('ja')

export type FormValues = {
  rows: {
    vendor: {
      value: string
      label: string
      id: number
    } | null
    code: string
    name: string
    quantity: string
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

export type InsertTypes = [string, string, number, string, number, number, null, string, number]

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
  errors: FieldErrors<FormValues>
  fields: ReturnType<typeof useFieldArray<FormValues, 'rows', 'id'>>['fields']
  register: UseFormRegister<FormValues>
  handleSubmit: UseFormHandleSubmit<FormValues>
  getValues: UseFormGetValues<FormValues>
  dateValue: Dayjs | null
  onSubmit: () => void
  handleEnterFocusNext: (e: React.KeyboardEvent<HTMLElement>) => void
  search: (index: number) => Promise<void>
  validateCheck: (
    index: number,
    keyName: keyof FormValues['rows'][number],
    errormsg: string
  ) => boolean
  placeholderStyle: {
    '&::placeholder': {
      fontSize: string
      opacity: number
      color: string
    }
  }
  textFieldStyle: {
    backgroundColor: string
    borderRadius: string
    marginRight: string
    height: string
  }
  VendorList: SelectOption[]
  RowRemove: (index: number) => Promise<void>
  InsertRow: (index: number) => void
  AddNewForm: (num: number) => void
  DialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  insertPost: () => Promise<void>
  handleDateChange: (date: Dayjs | null) => void
  handleSelectChange: (e: SelectChangeEvent, index: number) => void
}
