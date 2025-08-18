import LinkBaner from '../../comp/Linkbanar'
import '../../css/uriage.css'
import { Button } from '@mui/material'
import React, { useState, useRef } from 'react'
import type { JSX } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useLoaderData } from 'react-router-dom'
import { TextField } from '@mui/material'
import { useForm, useFieldArray } from 'react-hook-form'
import StaffDialogTable from '../../comp/staffDialog'
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
    address: string
    afterAddress: string
    rank: string
    joined: Date | string
    status: string
    gender: string | number
  }[]
}

type DataType = {
  data: string[][]
  stores: {
    id: string
    label: string
    value: string
  }[]
  dist: string[][]
}

type sendDataType = string[]

function createObjectsFromArray<T extends string>(
  keys: readonly T[],
  values: unknown[][]
): Record<T, unknown>[] {
  return values.map(row => {
    const obj = {} as Record<T, unknown>;
    keys.forEach((key, index) => {
      obj[key] = row[index];
    });

    return obj;
  });
}

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

  const stores = storesData.filter((item) => (item[0] !== '' && item[2] == 'DM') || item[1] == '本部')
    .map((item) => {
    return {
      id: item[0],
      label: item[1],
      value: item[1]
    }
    })

  const dist = await window.myInventoryAPI.ListGet({
    sheetName: 'カラム',
    action: 'StaffGet',
    sheetid: '125Hz6aVG9UaCKtyUZmrL-FsdHBykj0wFbBpBUKrHp0U'
  })
  
  return { data, stores, dist }
}


type RowKey = keyof FormValues['rows'][0]

export default function StaffData(): JSX.Element {
  const { data, stores, dist } = useLoaderData<typeof loader>()

  console.log(stores)
  console.log(dist)
  console.log(data)

  const columns = data[0] as RowKey[]
  const products = createObjectsFromArray(columns, data.slice(1))

  console.log(products)

  const [searchString, setSearchString] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpenAdd, setModalOpenAdd] = useState(false)
  const addDialogRef = useRef<any>(null)
  const addDataDialogRef = useRef<any>(null)
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)

  const DefaultSet = (defData) => {
    const dataRows = defData.slice(1).filter((row) => row[0] !== '')
    const result = createObjectsFromArray(columns, dataRows) as FormValues['rows']
    return result
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
    //console.log(data)
    //const mainData = data.main.filter(
    //  (item) => item[1].includes(searchString) || item[2].includes(searchString)
    //)
    //const detailData = data.detail.filter(
    //  (item) =>
    //    item[2].includes(searchString) ||
    //    item[3].includes(searchString) ||
    //    item[4].includes(searchString)
    //)
    //const finddata = detailData.map((item) => {
    //  return data.main.find((row) => row[0] == item[0])
    //})
    //if (finddata) {
    //  finddata.forEach((row) => {
    //    mainData.push(row!)
    //  })
    //}
    //const resultdata = [...new Set(mainData)]
    //reset({
    //  rows: DefaultSet(resultdata)
    //})
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
        const nullData = ['status', 'store', 'id']
        insertData = addDataDialogRef.current.getFormData()
        const ids = getValues('rows').map((row) => row.id)
        const uuid = await window.myInventoryAPI.UuidGet(ids)
        const now = new Date().toLocaleDateString()
        Object.keys(insertData).forEach((key) => {
          if (key == 'joined') {
            sendData.push([new Date(insertData[key]).toLocaleDateString(), uuid, key, 'in'])
          } else if (nullData.includes(key)) {
            return
          } else {
            sendData.push([now, uuid, key, insertData[key]])
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

  const Columns = (data) => {
    const value = dist.find((item) => item[0] === data)
    if (!value) {
      return null
    } else {
      return (
        <th className={`Staff-table-${value[1]}`}>{value[1]}</th>
      )
    }
  }

  const Rows = (data: RowKey, index: number) => {
    try {
      const nulllist = [
        'endName',
        'afterAddress'
      ]

      if (nulllist.includes(data) || data.includes('id')) {
        return null
      } else if (data == 'topName') {
        return (
          <td>
            {getValues(`rows.${index}.topName`)}{getValues(`rows.${index}.endName`)}
          </td>
        )
      } else if (data == 'address') {
        return (
          <td>
            {getValues(`rows.${index}.address`)}{getValues(`rows.${index}.afterAddress`)}
          </td>
        )
      } else if (data == 'joined') {
        const value = new Date(getValues(`rows.${index}.joined`)).toLocaleDateString()
        return (<td>{value}</td>)
      } else if (data == 'postNumber') {
        const code = String(getValues(`rows.${index}.postNumber`))
        const startCode = code.substr(0, 3)
        const endCode = code.substr(3)
        const postCode = startCode + '-' + endCode
        return (
          <td>
            {postCode}
          </td>
        )
      } else {
        const value = getValues(`rows.${index}.${data}` as const)
        return (
          <td>
            {value ?? ''}
          </td>
        )
      }
    } catch {
      return null
    }
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
                  {columns.map((column) => (
                    Columns(column)
                  ))}
                  <th className="Staff-table-operation">操作</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id}>
                    {columns.map((column) => (
                      Rows(column, index)
                    ))}
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
            <StaffDialogTable
              data={getValues().rows[selectedRowIndex]}
              stores={stores}
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
