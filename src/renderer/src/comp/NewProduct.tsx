// ConfirmDialog.tsx
import React from 'react'
//import ReactDOM from 'react-dom'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Button } from '@mui/material'

import '../css/orderDialog.css'

interface ConfirmDialogProps {
  addRowNumber: number;
}

const AddProductDialogTable: React.FC<ConfirmDialogProps> = ({ addRowNumber }) => {

  const StoreDataDefaultSet = () => {
    return {
      vendor: null,
      code: '',
      name: '',
      defPrice: '',
      newPrice: '',
      VCPrice: '',
      valuePrice: '',
      type: null,
      remarks: '',
      possibility: false,
      service: '',
      orderNum: ''
    }
  }

  const { control, register, getValues, reset } =
    useForm<FormValues>({
      defaultValues: {
        rows: StoreDataDefaultSet(),
      }
    })

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: 'rows'
  })

  const Add = () => {
    console.log(getValues().rows)
    console.log(addRowNumber)
  }
  return (
    <div className="modal-dialog-table-area">
      <div>
        <div style={{display: 'flex'}}>
          <div>商品コード:</div>
          <input
            style={{ height: 32 }}
            {...register(`rows.code`)}
          />
        </div>
        
        <input
          style={{ height: 32 }}
          {...register(`rows.name`)}
        />
      </div>
      <Button variant='outlined' onClick={Add}>test</Button>
    </div>
  )
}

export default AddProductDialogTable
