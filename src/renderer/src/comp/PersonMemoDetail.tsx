import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import '../css/orderDialog.css'
import { TextField, Button } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import '../css/uriage.css'

type RowsType = {
  id: number
  sub_id: string
  order_id: number
  title: string
  content: string
  remarks: string
  check_Flg: number | boolean | undefined
  delete_Flg: number
  create_at: string
  update_at: string
}

type FormValues = {
  rows: RowsType[]
}

type RowDataValues = {
  id: string
  uuid: string
  title: string
  remarks: string
  details: RowsType[]
}

interface Props {
  data: RowDataValues
  Insert: () => void
}

const PersonMemoDialogTable = forwardRef(({ data, Insert }: Props, ref) => {
  console.log(data)
  const [Title, setTitle] = useState('')
  const [TitleRemarks, setTitleRemarks] = useState('')
  const [lastID, setLastID] = useState(0)

  useEffect(() => {
    setTitle(data.title)
    setTitleRemarks(data.remarks)
    const defaultLast = data.details[data.details.length - 1][1]
    setLastID(Number(defaultLast))
  }, [])

  const details = () => {
    return data.details
      .filter((row) => row.delete_Flg == 0)
      .map((row) => ({
        AI_id: row.id,
        sub_id: row.sub_id,
        order_id: row.order_id,
        title: row.title,
        content: row.content,
        remarks: row.remarks,
        check_Flg: row.check_Flg == 1,
        create_at: row.create_at
      }))
  }

  const { control, register, getValues, reset, watch } = useForm<FormValues>({
    defaultValues: {
      rows: details()
    }
  })

  const { fields, append, remove } = useFieldArray({
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
    setLastID(Number(lastData.id))
  }

  const detailNewdata = () => {
    append({
      id: 0,
      sub_id: data.uuid ?? '',
      order_id: lastID + 1,
      title: '',
      content: '',
      remarks: '',
      check_Flg: false,
      delete_Flg: 0,
      create_at: '',
      update_at: ''
    })
    lastIDSet()
  }

  useImperativeHandle(ref, () => ({
    getFormData: () => ({
      uuid: data.uuid,
      id: data.id,
      title: Title,
      remarks: TitleRemarks,
      detail: getValues().rows
    })
  }))

  const backGroundColor = (data): string => {
    if (data) {
      return 'lightgreen'
    } else {
      return 'white'
    }
  }

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
              <div
                style={{ backgroundColor: backGroundColor(watch(`rows.${index}.check_Flg`)) }}
                className="HQMemoinsert_div"
              >
                <li key={field.id} className="HQMemoinsert_area">
                  <div>
                    <Controller
                      name={`rows.${index}.check_Flg`}
                      control={control}
                      render={({ field }) => <Checkbox {...field} checked={field.value} />}
                    />
                  </div>
                  <div className="HQdetail-list-Memo">
                    <div className="HQdetail-list-title">
                      <TextField
                        {...register(`rows.${index}.title`)}
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
                      <Button variant="outlined" onClick={() => deleteRow(index)} size="small">
                        削除
                      </Button>
                    </div>
                  </div>
                </li>
              </div>
            ))}
          </ul>
        </form>
        <div className="HQdetail-button-area">
          <Button variant="outlined" onClick={detailNewdata}>
            追加
          </Button>
          <Button variant="outlined" onClick={detailReset}>
            状態リセット
          </Button>
          <Button variant="outlined" onClick={Insert}>
            更新
          </Button>
        </div>
      </div>
    </div>
  )
})

export default PersonMemoDialogTable
