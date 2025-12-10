import { SelectChangeEvent } from '@mui/material/Select'
import {
  UseFormRegister,
  UseFormGetValues,
  UseFormHandleSubmit,
  SubmitHandler,
  FieldArrayWithId,
  Control
} from 'react-hook-form'
import { Dayjs } from 'dayjs'

export interface SelectOption {
  id: number
  value: string
  label: string
  type: string
}

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

export type storeTypes = [number, string, string]

export type OrderGetTypes = [
  string,
  string,
  string,
  number | string,
  string,
  string,
  number,
  string,
  number,
  number,
  string,
  string,
  string
]

export interface InsertDialogProps {
  data: FormValues['rows']
  InsertDate: string
  DialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  insertPost: () => void
  storeName?: string
}

export type InsertDataType = [
  string,
  string,
  string,
  number | string,
  string,
  string,
  number,
  null,
  number,
  null,
  string,
  string,
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

export interface UseLogicReturn {
  RegisterData: (data: productType) => void
  fields: FieldArrayWithId<FormValues, 'rows', 'id'>[]
  register: UseFormRegister<FormValues>
  onSubmit: SubmitHandler<FormValues>
  handleSubmit: UseFormHandleSubmit<FormValues>
  control: Control<FormValues>
  storeSelect: string
  storeOptions: SelectOption[]
  handleStoreChange: (event: SelectChangeEvent) => void
  dateValue: Dayjs | null
  handleDateChange: (date: Dayjs | null) => void
  handleEnterFocusNext: (e: React.KeyboardEvent<HTMLElement>) => void
  productCodeSearch: (index: number) => Promise<void>
  deleteRow: (index: number) => void
  insertRow: (index: number) => void
  addNewForm: () => void
  getValues: UseFormGetValues<FormValues>
  insertDateRef: React.RefObject<string>
  DialogOpen: boolean
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  insertPost: () => void
}

export interface RowProps {
  index: number
  register: UseFormRegister<FormValues>
  control: Control<FormValues>
  handleEnterFocusNext: (e: React.KeyboardEvent<HTMLElement>) => void
  //handleSelectChange: (e: SelectChangeEvent, index: number) => void
  deleteRow: (index: number) => void
  insertRow: (index: number) => void
  productCodeSearch: (index: number) => Promise<void>
}
