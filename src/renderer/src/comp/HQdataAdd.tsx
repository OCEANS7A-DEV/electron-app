import React, { useState, useImperativeHandle, forwardRef } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import '../css/orderDialog.css'
import { TextField, Button } from '@mui/material'
import '../css/uriage.css'


type RowsType = {
  mainID: string
  id: number
  detailTitle: string
  content: string
  remarks: string
}

type FormValues = {
  rows: RowsType[]
}

interface Props {
  Insert: () => void;
}



const defaultRowDetail = {
  mainID: '',
  id: 0,
  detailTitle: '',
  content: '',
  remarks: ''
}

const HQAddDialogTable = forwardRef(({ Insert }: Props, ref) => {
  const [Title, setTitle] = useState('')
  const [TitleRemarks, setTitleRemarks] = useState('')
  const [lastID, setLastID] = useState(0)


  const details = () => {
    const newData = defaultRowDetail
    newData.id = lastID + 1
    return [newData]
  }

  const { control, register, getValues, reset } =
    useForm<FormValues>({
      defaultValues: {
        rows: details()
      }
    })

  const { fields, append, remove, } = useFieldArray({
    control,
    name: 'rows'
  })

  const detailReset = () => {
    reset({
      rows: details()
    })
  }

  const deleteRow = (index) => {
    lastIDSet()
    remove(index)
  }

  const lastIDSet = () => {
    const newDetailData = getValues().rows
    const lastData = newDetailData[newDetailData.length - 1]
    setLastID(lastData.id)
  }

  const detailNewdata = () => {
    append({
      mainID: '',
      id: lastID + 1,
      detailTitle: '',
      content: '',
      remarks: ''
    })
    lastIDSet()
  }

  useImperativeHandle(ref, () => ({
    getFormData: () => ({
      id: '',
      title: Title,
      remarks: TitleRemarks,
      detail: getValues().rows
    })
  }))


  return (
    <div className="modal-dialog-HQdetail">
      <div className="HQdetail-window">
        <div className="HQdetail-window-title">
          <div>詳細</div>
        </div>
        <div className="HQdetail-top">
          <TextField
            value={Title}
            onChange={(e) => setTitle(e.target.value)}
            label="タイトル"
            variant="outlined"
            fullWidth
          />
          <TextField
            value={TitleRemarks}
            onChange={(e) => setTitleRemarks(e.target.value)}
            multiline
            label="備考"
            fullWidth
          />
        </div>
        <form className="p-4">
          <ul>
            {fields.map((field, index) => (
              <li key={field.id} className="insert_area">
                <div className="HQdetail-list">
                  <div className="HQdetail-list-title">
                    <TextField
                      {...register(`rows.${index}.detailTitle`)}
                      variant="outlined"
                      label="詳細タイトル"
                      fullWidth
                    />
                  </div>
                  <div className="HQdetail-list-content">
                    <TextField
                      variant="outlined"
                      {...register(`rows.${index}.content`)}
                      multiline
                      label="詳細内容"
                      fullWidth
                    />
                    <TextField
                      variant="outlined"
                      {...register(`rows.${index}.remarks`)}
                      multiline
                      label="詳細備考"
                      fullWidth
                    />
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <Button variant="outlined" onClick={() => deleteRow(index)} size="small">削除</Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </form>
        <div className="HQdetail-button-area">
          <Button variant="outlined" onClick={detailNewdata}>詳細追加</Button>
          <Button variant="outlined" onClick={detailReset}>状態リセット</Button>
          <Button variant="outlined" onClick={Insert}>データを追加</Button>
        </div>
      </div>
    </div>
  )
})

export default HQAddDialogTable;
