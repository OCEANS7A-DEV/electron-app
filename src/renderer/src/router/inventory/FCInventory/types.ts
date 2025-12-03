import {
  useFieldArray,
  Control,
  UseFormRegister,
  UseFormHandleSubmit,
  UseFormGetValues
} from 'react-hook-form'

import { SelectChangeEvent } from '@mui/material/Select'


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

export interface FCInventoryTypes {

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
  // handleEnterFocusNext: (e: React.KeyboardEvent<HTMLElement>) => void
  // search: (index: number) => Promise<void>
  // handleSelectChange: (e: SelectChangeEvent, index: number, select: string) => void
  // RowRemove: (index: number) => Promise<void>
}