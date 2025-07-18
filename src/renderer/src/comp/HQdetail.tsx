import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import '../css/orderDialog.css'
import { TextField, Button } from '@mui/material'
import '../css/uriage.css'
import toast, { Toaster } from 'react-hot-toast'

type RowsType = {
  mainID: string
  id: string
  detailTitle: string
  content: string
  remarks: string
}

type FormValues = {
  rows: RowsType[]
}


type RowDataValues = {
  id: string;
  title: string;
  remarks: string;
  details: [string, string, string, string, string, string][];
}

interface Props {
  data: RowDataValues;
  update: () => void;
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
    const defaultLast = data.details[data.details.length - 1][1]
    setLastID(Number(defaultLast))
  }, [])


  const details = () => {
    return data.details.filter((row) => Number(row[5]) == 0).map((row) => ({
      mainID: row[0],
      id: row[1],
      detailTitle: row[2],
      content: row[3],
      remarks: row[4]
    }))
  }

  const { control, register, getValues, reset } =
    useForm<FormValues>({
      defaultValues: {
        rows: details()
      }
    })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rows'
  })


  const updateSend = async() => {
    const dataUpdate = async () => {
      const newDetailData = getValues().rows
      const deleteID = oldData.map((row) => {
        const result = newDetailData.find(item => item.id == row.id)
        if (!result){
          return row.id
        } else {
          return null
        }
      }).filter((row) => row !== null)
      const addData: RowsType[] = []
      const updata: RowsType[] = []
      newDetailData.forEach((row) => {
        const result = oldData.find(item => item.id == row.id)
        if (!result){
          addData.push(row)
        } else {
          updata.push(result)
        }
      })
      const updateData = {
        uuid: data.id,
        title: Title,
        remarks: TitleRemarks,
        deleteID: deleteID,
        addData: addData,
        updata: updata
      }
      await window.myInventoryAPI.DataInsert({
        action: 'HQdataUpdate',
        sub_action: 'insert',
        data: updateData
      })
    }

    toast.promise(
      dataUpdate(),
      {
        loading: 'データ変更中...',
        success: () => {
          return '変更完了'
        },
        error: () => {
          return 'エラーが発生しました'
        },
      },
    )
    update()
  }

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
      mainID: data.id,
      id: String(lastID + 1),
      detailTitle: '',
      content: '',
      remarks: ''
    })
    lastIDSet()
  }

  useImperativeHandle(ref, () => ({
    getFormData: () => ({
      id: data.id,
      title: Title,
      remarks: TitleRemarks,
      detail: getValues().rows
    })
  }))


  return (
    <div className="modal-dialog-HQdetail">
      <div className="HQdetail-window">
        <div className="HQdetail-window-title">
          <Toaster/>
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
          <Button variant="outlined" onClick={detailNewdata}>追加</Button>
          <Button variant="outlined" onClick={detailReset}>状態リセット</Button>
          <Button variant="outlined" onClick={updateSend}>更新</Button>
        </div>
      </div>
    </div>
  )
})

export default HQDialogTable;
