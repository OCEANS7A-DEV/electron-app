import LinkBaner from '../../comp/Linkbanar'
import '../../css/uriage.css'
import { Button } from '@mui/material'
// import { 
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
// } from 'recharts';
import React, { useState, useRef } from 'react'
// import Select, { SelectChangeEvent } from '@mui/material/Select'
// import InputLabel from '@mui/material/InputLabel'
// import MenuItem from '@mui/material/MenuItem'
// import FormControl from '@mui/material/FormControl'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useLoaderData } from 'react-router-dom'
import { TextField } from '@mui/material'
import { useForm, useFieldArray } from 'react-hook-form'
import HQDialogTable from '../../comp/HQdetail'
import HQAddDialogTable from '../../comp/HQdataAdd'
import toast, { Toaster } from 'react-hot-toast'



const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#2a2a30',
      paper: '#333',
    },
    primary: {
      main: '#90caf9',
    },
    text: {
      primary: '#ffffff',
    },
  },
})

type FormValues = {
  rows: {
    id: string
    title: string
    remarks: string
    details: [] | []
  }[]
}


export const loader = async () => {
  const data = await window.myInventoryAPI.ListGet({
    action: 'HQdataGet',
    ranges: 'A2:C'
  })

  return { data }
}





export default function HQdata() {
  const { data } = useLoaderData<typeof loader>()
  const [searchString, setSearchString] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpenAdd, setModalOpenAdd] = useState(false)
  const addDialogRef = useRef<any>(null)
  const addDataDialogRef = useRef<any>(null)
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)

  const DefaultSet = (defData) => {
    return defData.filter((row) => row[3] == 0).map(item => ({
      id: item[0],
      title: item[1],
      remarks: item[2],
      details: data.detail.filter((row) => row[0] == item[0])
    }))
  }

  const DataRefresh = async () => {
    const refresh = async () => {
      const data = await window.myInventoryAPI.ListGet({
        action: 'HQdataGet',
        ranges: 'A2:C'
      })
      reset({
        rows: DefaultSet(data.main)
      })
    }
    toast.promise(
      refresh(),
      {
        loading: '取得中...',
        success: () => {
          return '取得完了'
        },
        error: () => {
          return 'エラーが発生しました'
        },
      },
    )
  }

  const { control, getValues, reset } =
    useForm<FormValues>({
      defaultValues: {
        rows: DefaultSet(data.main),
      }
    })

  const { fields } = useFieldArray({
    control,
    name: 'rows'
  })


  const search = () => {
    const mainData = data.main.filter((item) => 
      item[1].includes(searchString) ||
      item[2].includes(searchString)
    )
    const detailData = data.detail.filter((item) => 
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

  const dialogOpen = (index) => {
    setSelectedRowIndex(index)
    setModalOpen(true)
  }

  const HQDataDelete = async (index) => {
    const deleteId = getValues(`rows.${index}.id`)
    const deletePost = async() => {
      await window.myInventoryAPI.DataInsert({
        action: 'HQmaindataDelete',
        sub_action: 'insert',
        data: deleteId
      })
    } 
    toast.promise(
      deletePost(),
      {
        loading: '実行中...',
        success: () => {
          DataRefresh()
          return '実行完了'
        },
        error: () => {
          return 'エラーが発生しました'
        },
      },
    )
  }


  const DialogClosed = async (e) => {
    if (e.target === e.currentTarget){
      setModalOpen(false)
    }
  }
  const DialogClosedAdd = async (e) => {
    if (e.target === e.currentTarget){
      setModalOpenAdd(false)
    }
  }

  const update = () => {
    DataRefresh()
    setModalOpen(false)
  }

  const Insert = async() => {
    setModalOpenAdd(false)

    const DataInsert = async() => {
      const insertData = addDataDialogRef.current.getFormData()
      await window.myInventoryAPI.DataInsert({
        action: 'HQdataInsert',
        sub_action: 'insert',
        data: insertData
      })
    }
    toast.promise(
      DataInsert(),
      {
        loading: '新規データ追加中...',
        success: () => {
          return '追加完了'
        },
        error: () => {
          return 'エラーが発生しました'
        },
      },
    )
  }



  return (
    <div>
      <div className="banner">
        <LinkBaner id="OfficeWork"/>
        <Toaster/>
      </div>
      <div className="HQdata-window">
        <div>
          <div className="HQdata-title">
            <ThemeProvider theme={darkTheme}>
              <div style={{ marginRight: 20 }}>
                <TextField
                  value={searchString}
                  onChange={(e) => setSearchString(e.target.value)}
                />
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
                  <th className="HQdata-table-title">タイトル</th>
                  <th className="HQdata-table-remarks">備考</th>
                  <th className="HQdata-table-operation">操作</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id}>
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
            <HQDialogTable
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
            <HQAddDialogTable
              ref={addDataDialogRef}
              Insert={Insert}
            />
          </div>
        )}
      </div>
      {/* <SweetAlert2
        {...swalProps}
        didClose={() => {
          console.log('ダイアログが閉じられました');
          setSwalProps({ show: false })
        }}
      >
        <HQDialogTable
          data={getValues().rows[selectRow]}
          ref={addDialogRef}
        />
      </SweetAlert2> */}
    </div>
  )
}