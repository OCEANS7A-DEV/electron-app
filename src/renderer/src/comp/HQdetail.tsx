import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import '../css/orderDialog.css'
import Select from '@mui/material/Select'
import { MenuItem, TextField, Button } from '@mui/material'
import '../css/uriage.css'


type RowsType = {
  mainid: number
  id: number
  detailTitle: string
  content: string
  remarks: string
}

type FormValues = {
  rows: RowsType[]
}




type RowdataValues = {
  id: number;
  title: string;
  remarks: string;
  details: [string, string, string, string, string][];
}

interface Props {
  data: RowdataValues;
  update: () => void;
}

const defaultRowData = {
  mainid: null,
  id: null,
  detailTitle: '',
  content: '',
  remarks: ''
}





const HQDialogTable = forwardRef(({ data, update }: Props, ref) => {
  const [Title, setTitle] = useState('')
  const [TitleRemarks, setTitleRemarks] = useState('')
  const [oldData, setOldData] = useState<any[]>([])
  const [lastID, setLastID] = useState(0)

  useEffect(() => {
    setTitle(data.title)
    setTitleRemarks(data.remarks)
    setOldData(details)
    lastidSet()
  }, [])

  const details = () => {
    return data.details.filter((row) => row[5] == 0).map((row) => ({
      mainid: row[0],
      id: row[1],
      detailTitle: row[2],
      content: row[3],
      remarks: row[4]
    }))
  }

  const { control, register, getValues, reset, handleSubmit } =
    useForm<FormValues>({
      defaultValues: {
        rows: details()
      }
    })

  const { fields, append, remove, insert, move } = useFieldArray({
    control,
    name: 'rows'
  })


  const updateTest = () => {
    const newDetailData = getValues().rows
    const deleteID = oldData.map((row) => {
      const result = newDetailData.find(item => item.id == row.id)
      if (!result){
        return row.id
      }
    }).filter((row) => row !== undefined)
    const updata: RowsType[] = []
    const addData = newDetailData.map((row) => {
      const result = oldData.find(item => item.id == row.id)
      if (!result){
        return row
      } else {
        updata.push(result)
      }
    }).filter((row) => row !== undefined)

    console.log(deleteID)// 削除用リスト
    console.log(addData)// 追加データリスト
    console.log(updata)// 更新データリスト

  }

  const detailReset = () => {
    reset({
      rows: details()
    })
  }

  const deleteRow = (index) => {
    lastidSet()
    remove(index)
  }

  const lastidSet = () => {
    const newDetailData = getValues().rows
    const lastData = newDetailData[newDetailData.length - 1]
    console.log(lastData.id)
    setLastID(lastData.id)
  }

  const detailNewdata = () => {
    append({
      mainid: data.id,
      id: lastID + 1,
      detailTitle: '',
      content: '',
      remarks: ''
    })
    lastidSet()
  }

  useImperativeHandle(ref, () => ({
    getFormData: () => ({
      id: data.id,
      title: Title,
      remarks: TitleRemarks,
      detail: getValues()
    })
  }))


  const onSubmit = (data: FormValues) => {
    console.log('送信データ:', data.rows)
    // ここでAPIに送信など処理を書く
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-4">
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
          <Button variant="outlined" onClick={detailNewdata}>追加</Button>
          <Button variant="outlined" onClick={detailReset}>状態リセット</Button>
          <Button variant="outlined" onClick={update}>更新</Button>
          <Button variant="outlined" onClick={updateTest}>test</Button>
        </div>
      </div>
    </div>
  )
})

export default HQDialogTable;
