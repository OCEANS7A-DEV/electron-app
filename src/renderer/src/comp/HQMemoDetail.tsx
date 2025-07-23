import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import '../css/orderDialog.css'
import { TextField, Button } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import '../css/uriage.css'
import toast from 'react-hot-toast'

type RowsType = {
  mainID: string
  id: string
  detailTitle: string
  content: string
  remarks: string
  check: boolean
}

type FormValues = {
  rows: RowsType[]
}

type RowDataValues = {
  id: string
  title: string
  remarks: string
  details: [string, string, string, string, string, boolean, string, string, string][]
}

interface Props {
  data: RowDataValues
  update: () => void
}

const HQMemoDialogTable = forwardRef(({ data, update }: Props, ref) => {
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
    return data.details
      .filter((row) => Number(row[8]) == 0)
      .map((row) => ({
        mainID: row[0],
        id: row[1],
        detailTitle: row[2],
        content: row[3],
        remarks: row[4],
        check: row[5] === true || String(row[5]).toUpperCase() === 'TRUE',
        create_at: row[6]
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

  const updateSend = async () => {
    const dataUpdate = async () => {
      const newDetailData = getValues().rows
      const deleteID = oldData
        .map((row) => {
          const result = newDetailData.find((item) => item.id == row.id)
          if (!result) {
            return row.id
          } else {
            return null
          }
        })
        .filter((row) => row !== null)
      const addData: RowsType[] = []
      const updata: RowsType[] = []
      newDetailData.forEach((row) => {
        const result = oldData.find((item) => item.id == row.id)
        if (!result) {
          addData.push(row)
        } else {
          if (row !== result) {
            updata.push(row)
          }
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
        type: 'memo',
        sheetid: '1qccINd8CGGFW3R63ewjJSu8pmDVDPnn384m4UBj1Cp0',
        data: updateData
      })
    }

    await toast.promise(dataUpdate(), {
      loading: 'データ変更中...',
      success: () => {
        return '変更完了'
      },
      error: () => {
        return 'エラーが発生しました'
      }
    })
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
      remarks: '',
      check: false
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
                style={{ backgroundColor: backGroundColor(watch(`rows.${index}.check`)) }}
                className="HQMemoinsert_div"
              >
                <li key={field.id} className="HQMemoinsert_area">
                  <div>
                    <Controller
                      name={`rows.${index}.check`}
                      control={control}
                      render={({ field }) => <Checkbox {...field} checked={field.value} />}
                    />
                  </div>
                  <div className="HQdetail-list-Memo">
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
          <Button variant="outlined" onClick={updateSend}>
            更新
          </Button>
        </div>
      </div>
    </div>
  )
})

export default HQMemoDialogTable
