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
import NewStaffDialogTable from '../../comp/newStaffDialog'
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
    topName: string
    endName: string
    storeid: string
    store: string
    postNumber: string
    post: string
    Afterpost: string
    rank: string
    joined: Date | string
    status: string
  }[]
}

type DataType = {
  main: string[][]
  detail: string[][]
}

type sendDataType = [string, string, string]



export const loader = async (): Promise<DataType> => {
  const data = await window.myInventoryAPI.ListGet({
    sheetName: 'スタッフ一覧',
    action: 'StaffGet',
    sheetid: '125Hz6aVG9UaCKtyUZmrL-FsdHBykj0wFbBpBUKrHp0U'
  })

  const storesData = await window.myInventoryAPI.ListGet({
    sheetName: '店舗一覧',
    action: 'StaffGet',
    sheetid: '125Hz6aVG9UaCKtyUZmrL-FsdHBykj0wFbBpBUKrHp0U'
  })

  const stores = storesData.filter((item) => item[0] !== '' && item[2] == 'DM')
    .map((item) => {
    return {
      id: item[0],
      label: item[1],
      value: item[1]
    }
  })
  return { data, stores }
}

export default function StaffData(): JSX.Element {
  const { data, stores } = useLoaderData<typeof loader>()
  //console.log(data)
  const [searchString, setSearchString] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpenAdd, setModalOpenAdd] = useState(false)
  const addDialogRef = useRef<any>(null)
  const addDataDialogRef = useRef<any>(null)
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)

  const DefaultSet = (defData): FormValues['rows'] => {
    return defData
      .filter((row) => row[0] !== '')
      .map((item) => ({
        id: item[0],
        topName: item[1],
        endName: item[2],
        storeid: item[3],
        store: item[4],
        postNumber: item[5],
        post: item[6],
        Afterpost: item[7],
        rank: item[8],
        joined: new Date(item[9]),
        status: item[10],
      }))
  }

  const DataRefresh = async (): Promise<void> => {
    const refresh = async (): Promise<void> => {
      const getdata = await window.myInventoryAPI.ListGet({
        sheetName: 'スタッフ一覧',
        action: 'StaffGet',
        sheetid: '125Hz6aVG9UaCKtyUZmrL-FsdHBykj0wFbBpBUKrHp0U'
      })
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
        mainData.push(row!)
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
    return
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
    const DataInsert = async (): Promise<void> => {
      let insertData
      const sendData: sendDataType[] = []
      if (addDialogRef.current) {
        insertData = addDialogRef.current.getFormData()
      } else {
        insertData = addDataDialogRef.current.getFormData()
        const ids = getValues('rows').map((row) => row.id)
        const uuid = await window.myInventoryAPI.UuidGet(ids)
        const now = new Date().toLocaleDateString()
        Object.keys(insertData).forEach((key) => {
          if (key == 'joined') {
            sendData.push([new Date(insertData[key]).toLocaleDateString(), uuid, 'in'])
          } else if (key == 'status') {
            return
          } else {
            sendData.push([now, uuid, insertData[key]])
          }
        })
      }
      console.log(insertData)
      console.log(sendData)

      //window.myInventoryAPI.PrivateMemoInsert(allData)
      setModalOpenAdd(false)
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
            <table className="Staff-table">
              <thead>
                <tr>
                  <th className="Staff-table-name">名前</th>
                  <th className="Staff-table-store">店舗</th>
                  <th className="Staff-table-rank">等級</th>
                  <th className="Staff-table-postnumber">郵便番号</th>
                  <th className="Staff-table-post">住所</th>
                  <th className="Staff-table-joined">入社日</th>
                  <th className="Staff-table-status">status</th>
                  <th className="Staff-table-operation">操作</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id}>
                    <td>
                      {getValues(`rows.${index}.topName`)}{getValues(`rows.${index}.endName`)}
                    </td>
                    <td>{getValues(`rows.${index}.store`)}</td>
                    <td>{getValues(`rows.${index}.rank`)}</td>
                    <td>{getValues(`rows.${index}.postNumber`)}</td>
                    <td>
                      {getValues(`rows.${index}.post`)}{getValues(`rows.${index}.Afterpost`)}
                    </td>
                    <td>{getValues(`rows.${index}.joined`).toLocaleDateString()}</td>
                    <td>{getValues(`rows.${index}.status`)}</td>
                    <td>
                      <div className="Staff-table-operation-td">
                        <Button variant="outlined" onClick={() => dialogOpen(index)}>
                          編集
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
            <NewStaffDialogTable ref={addDataDialogRef} Insert={Insert} stores={stores}/>
          </div>
        )}
      </div>
    </div>
  )
}
