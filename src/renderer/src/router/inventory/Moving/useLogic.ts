// React
import { useState, useEffect, useCallback } from 'react'

// Form関連コンポーネント
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form'

import { SelectChangeEvent } from '@mui/material/Select'

import toast from 'react-hot-toast'

import { formatStoreData, insertDataFormat } from './logic'

import { FormValues, SelectOption, productType, UseLogicReturn } from './types'

import { defaultDataFormat } from './logic'

export const useLogic = (): UseLogicReturn => {
  const [storeList, setStoreList] = useState<SelectOption[]>([])
  const [DialogOpen, setDialogOpen] = useState(false)

  const { control, register, handleSubmit, getValues, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      rows: defaultDataFormat()
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rows'
  })

  const RegisterData = async (product: productType): Promise<void> => {
    const Values = getValues('rows')
    const index = Values.findLastIndex((item) => item.code !== '') + 1
    setValue(`rows.${index}.name`, product.name)
    setValue(`rows.${index}.code`, String(product.code))
    setValue(`rows.${index}.price`, String(product.newPrice))
  }

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues): void => {
    setDialogOpen(true)
    console.log(data.rows)
  }

  const GetStores = async (): Promise<void> => {
    const data = await window.myInventoryAPI.storeGet('storeList')
    const result = formatStoreData(data)
    setStoreList(result)
  }

  const firstSet = async (): Promise<void> => {
    GetStores()
  }

  const addNewForm = (): void => {
    append(defaultDataFormat(), { shouldFocus: true })
  }

  const handleEnterFocusNext = useCallback(
    (e: React.KeyboardEvent<HTMLElement>): void => {
      const maxRows = getValues().rows.length
      if (e.key === 'Enter') {
        e.preventDefault()
        const form = (
          e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement
        ).form
        if (form) {
          const elements = Array.from(form.elements) as HTMLElement[]
          const index = elements.indexOf(e.target as HTMLElement)
          const before = elements[index] as HTMLElement
          let next = elements[index + 2] as HTMLElement
          let nextType = next.tagName
          let count = 3
          while (nextType == 'BUTTON' || nextType == 'FIELDSET') {
            next = elements[index + count] as HTMLElement
            nextType = next.tagName
            count++
          }
          if ((before as HTMLInputElement).name == `rows.${maxRows - 1}.remarks`) {
            addNewForm()
            return
          }
          next.focus()
        }
      }
    },
    [addNewForm, getValues]
  )

  const RowRemove = useCallback(
    async (index: number): Promise<void> => {
      remove(index)
      append(defaultDataFormat()[0], { shouldFocus: true })
    },
    [remove, append]
  )

  const search = useCallback(
    async (index: number): Promise<void> => {
      const List = await window.myInventoryAPI.ListData()
      const code = Number(getValues('rows')[index].code)
      const productData = List.find((item: productType) => item.code == code)
      if (!productData) {
        return
      }
      setValue(`rows.${index}.vendor`, productData.vendor)
      setValue(`rows.${index}.name`, productData.name)
      setValue(`rows.${index}.price`, productData.newPrice)
    },
    [getValues, setValue]
  )

  const handleSelectChange = useCallback(
    (e: SelectChangeEvent, index: number, select: string): void => {
      const selectedVendor = e.target.value as string
      const storedata =
        storeList.find((item: SelectOption) => item.value === selectedVendor) || null
      if (select == 'out') {
        setValue(`rows.${index}.outStore`, storedata)
      } else {
        setValue(`rows.${index}.inputStore`, storedata)
      }
    },
    [setValue]
  )

  const insertPost = async (): Promise<void> => {
    const data = getValues('rows')
    const filterData = data.filter((row) => row.code !== '')
    if (filterData.length == 0) return
    const formData = await insertDataFormat(filterData)
    await window.myInventoryAPI.DataInsert({
      sheetName: '店舗間移動',
      action: 'insert',
      sub_action: 'insert',
      data: formData,
      formulaConfig: {
        targetCol: 8,
        formula: '=RC[-2]*RC[-1]'
      }
    })
    reset({
      rows: defaultDataFormat()
    })
    toast.success('送信しました')
  }

  useEffect(() => {
    firstSet()
  }, [])

  return {
    RegisterData,
    fields,
    register,
    control,
    handleSubmit,
    onSubmit,
    storeList,
    handleEnterFocusNext,
    search,
    handleSelectChange,
    RowRemove,
    addNewForm,
    DialogOpen,
    setDialogOpen,
    insertPost,
    getValues
  }
}
