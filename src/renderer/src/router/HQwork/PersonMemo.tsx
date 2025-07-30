import LinkBaner from '../../comp/Linkbanar'
import '../../css/uriage.css'
import { Button } from '@mui/material'
import React, { useState, useRef } from 'react'
import type { JSX } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useLoaderData } from 'react-router-dom'
import { TextField } from '@mui/material'
import { useForm, useFieldArray } from 'react-hook-form'
import PersonMemoDialogTable from '../../comp/PersonMemoDetail'
import HQAddDialogTable from '../../comp/HQdataAdd'
import toast, { Toaster } from 'react-hot-toast'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#2a2a30',
      paper: '#333'
    },
    primary: {
      main: '#90caf9'
    },
    text: {
      primary: '#ffffff'
    }
  }
})

type FormValues = {
  rows: {
    id: string
    sub_id: string
    date: string
    title: string
    remarks: string
    details: [] | []
  }[]
}

type DataType = {
  main: string[][]
  detail: string[][]
}



export const loader = async (): Promise<DataType> => {
  const data = await window.myInventoryAPI.PrivateMemoGet()
  return data
}

export default function HQPrivatememo(): JSX.Element {
  const data = useLoaderData<typeof loader>()
  console.log(data)
  const [searchString, setSearchString] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpenAdd, setModalOpenAdd] = useState(false)
  const addDialogRef = useRef<any>(null)
  const addDataDialogRef = useRef<any>(null)
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)

  const DefaultSet = (defData): FormValues['rows'] => {
    return defData.main
      .filter((row) => row.delete_Flg == 0)
      .map((item) => ({
        id: item.id,
        uuid: item.sub_id,
        date: new Date(item.create_at).toLocaleDateString(),
        title: item.title,
        remarks: item.remarks,
        details: defData.detail.filter((row) => row.sub_id == item.sub_id)
      }))
  }

  const DataRefresh = async (): Promise<void> => {
    const refresh = async (): Promise<void> => {
      const getdata = await window.myInventoryAPI.PrivateMemoGet()
      reset({
        rows: DefaultSet(getdata)
      })
    }
    toast.promise(refresh(), {
      loading: '取得中...',
      success: () => {
        return '取得完了'
      },
      error: () => {
        return 'エラーが発生しました'
      }
    })
  }

  const { control, getValues, reset } = useForm<FormValues>({
    defaultValues: {
      rows: DefaultSet(data)
    }
  })

  const { fields } = useFieldArray({
    control,
    name: 'rows'
  })

  const search = (): void => {
    const mainData = data.main.filter(
      (item) => item[1].includes(searchString) || item[2].includes(searchString)
    )
    const detailData = data.detail.filter(
      (item) =>
        item[2].includes(searchString) ||
        item[3].includes(searchString) ||
        item[4].includes(searchString)
    )
    const finddata = detailData.map((item) => {
      return data.main.find((row) => row[0] == item[0])
    })
    if (finddata) {
      finddata.forEach((row) => {
        mainData.push(row)
      })
    }
    const resultdata = [...new Set(mainData)]
    reset({
      rows: DefaultSet(resultdata)
    })
  }

  const dialogOpen = (index): void => {
    setSelectedRowIndex(index)
    setModalOpen(true)
  }

  const HQDataDelete = async (index): Promise<void> => {
    const deleteId = getValues(`rows.${index}.id`)
    const deletePost = async (): Promise<void> => {
      window.myInventoryAPI.PrivateMemoDelete({ id: deleteId })
    }
    toast.promise(deletePost(), {
      loading: '実行中...',
      success: () => {
        DataRefresh()
        return '実行完了'
      },
      error: () => {
        return 'エラーが発生しました'
      }
    })
  }

  const DialogClosed = async (e): Promise<void> => {
    if (e.target === e.currentTarget) {
      setModalOpen(false)
      setSelectedRowIndex(null)
    }
  }

  const DialogClosedAdd = async (e): Promise<void> => {
    if (e.target === e.currentTarget) {
      setModalOpenAdd(false)
    }
  }

  const Insert = async (): Promise<void> => {
    setModalOpenAdd(false)
    const DataInsert = async (): Promise<void> => {
      let insertData
      if (addDialogRef.current) {
        insertData = addDialogRef.current.getFormData()
      } else {
        insertData = addDataDialogRef.current.getFormData()
      }
      const maindata = {
        uuid: insertData.uuid,
        title: insertData.title,
        remarks: insertData.remarks
      }
      const allData = {
        main: maindata,
        detail: insertData.detail
      }
      window.myInventoryAPI.PrivateMemoInsert(allData)
    }
    toast.promise(DataInsert(), {
      loading: '新規データ追加中...',
      success: () => {
        DataRefresh()
        setModalOpen(false)
        return '追加完了'
      },
      error: () => {
        setModalOpen(false)
        return 'エラーが発生しました'
      }
    })
  }



  return (
    <div>
      <div className="banner">
        <LinkBaner id="OfficeWork" />
        <Toaster />
      </div>
      <div className="HQdata-window">
        <div>
          <div className="HQdata-title">
            <ThemeProvider theme={darkTheme}>
              <div style={{ marginRight: 20 }}>
                <TextField value={searchString} onChange={(e) => setSearchString(e.target.value)} />
              </div>
              <div>
                <Button variant="outlined" onClick={search}>
                  検索
                </Button>
              </div>
              <div>
                <Button variant="outlined" onClick={DataRefresh}>
                  データ更新
                </Button>
              </div>
              <div>
                <Button variant="outlined" onClick={() => setModalOpenAdd(true)}>
                  新規追加
                </Button>
              </div>
            </ThemeProvider>
          </div>
          <div className="HQdata-table-area">
            <table className="HQdata-table">
              <thead>
                <tr>
                  <th className="HQdata-table-date">日時</th>
                  <th className="HQdata-table-title">タイトル</th>
                  <th className="HQdata-table-remarks">備考</th>
                  <th className="HQdata-table-operation">操作</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id}>
                    <td>{getValues(`rows.${index}.date`)}</td>
                    <td>{getValues(`rows.${index}.title`)}</td>
                    <td>{getValues(`rows.${index}.remarks`)}</td>
                    <td>
                      <div className="HQdata-table-operation-td">
                        <Button variant="outlined" onClick={() => dialogOpen(index)}>
                          詳細
                        </Button>
                        <Button variant="outlined" onClick={() => HQDataDelete(index)}>
                          削除
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className={`modalOverlaydetail ${modalOpen ? 'open' : ''}`} onClick={DialogClosed}>
        {selectedRowIndex !== null && (
          <div className="modaldetailContent">
            <PersonMemoDialogTable
              data={getValues().rows[selectedRowIndex]}
              ref={addDialogRef}
              Insert={Insert}
            />
          </div>
        )}
      </div>
      <div className={`modalOverlaydetail ${modalOpenAdd ? 'open' : ''}`} onClick={DialogClosedAdd}>
        {modalOpenAdd !== false && (
          <div className="modaldetailContent">
            <HQAddDialogTable ref={addDataDialogRef} Insert={Insert} />
          </div>
        )}
      </div>
    </div>
  )
}
