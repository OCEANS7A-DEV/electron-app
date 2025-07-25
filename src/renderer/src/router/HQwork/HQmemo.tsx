import LinkBaner from '../../comp/Linkbanar'
import '../../css/uriage.css'
import { Button } from '@mui/material'
import React, { useState, useRef } from 'react'
import type { JSX } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useLoaderData } from 'react-router-dom'
import { TextField } from '@mui/material'
import { useForm, useFieldArray } from 'react-hook-form'
import HQMemoDialogTable from '../../comp/HQMemoDetail'
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
  const data = await window.myInventoryAPI.ListGet({
    action: 'HQdataGet',
    sheetid: '1qccINd8CGGFW3R63ewjJSu8pmDVDPnn384m4UBj1Cp0'
  })
  return data
}

export default function HQmemo(): JSX.Element {
  const data = useLoaderData<typeof loader>()
  console.log(data)
  const [searchString, setSearchString] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpenAdd, setModalOpenAdd] = useState(false)
  const addDialogRef = useRef<any>(null)
  const addDataDialogRef = useRef<any>(null)
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)

  const DefaultSet = (defData): FormValues['rows'] => {
    return defData
      .filter((row) => row[5] == 0)
      .map((item) => ({
        id: String(item[0]),
        date: new Date(item[3]).toLocaleDateString(),
        title: item[1],
        remarks: item[2],
        details: data.detail.filter((row) => row[0] == item[0])
      }))
  }

  const DataRefresh = async (): Promise<void> => {
    const refresh = async (): Promise<void> => {
      const getdata = await window.myInventoryAPI.ListGet({
        action: 'HQdataGet',
        ranges: 'A2:C',
        sheetid: '1qccINd8CGGFW3R63ewjJSu8pmDVDPnn384m4UBj1Cp0'
      })
      reset({
        rows: DefaultSet(getdata.main)
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
      rows: DefaultSet(data.main)
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
      await window.myInventoryAPI.DataInsert({
        action: 'HQmaindataDelete',
        sub_action: 'insert',
        sheetid: '1qccINd8CGGFW3R63ewjJSu8pmDVDPnn384m4UBj1Cp0',
        data: deleteId
      })
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
    }
  }

  const DialogClosedAdd = async (e): Promise<void> => {
    if (e.target === e.currentTarget) {
      setModalOpenAdd(false)
    }
  }

  const update = (): void => {
    DataRefresh()
    setModalOpen(false)
  }

  const Insert = async (): Promise<void> => {
    setModalOpenAdd(false)
    const DataInsert = async (): Promise<void> => {
      const insertData = addDataDialogRef.current.getFormData()
      await window.myInventoryAPI.DataInsert({
        action: 'HQdataInsert',
        sub_action: 'insert',
        data: insertData,
        type: 'memo',
        sheetid: '1qccINd8CGGFW3R63ewjJSu8pmDVDPnn384m4UBj1Cp0'
      })
    }
    toast.promise(DataInsert(), {
      loading: '新規データ追加中...',
      success: () => {
        return '追加完了'
      },
      error: () => {
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
            <HQMemoDialogTable
              data={getValues().rows[selectedRowIndex]}
              ref={addDialogRef}
              update={update}
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
