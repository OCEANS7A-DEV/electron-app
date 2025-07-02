import { useLoaderData } from "react-router-dom"
import '../css/stocks.css'
import LinkBaner from '../comp/Linkbanar'
import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { Button } from '@mui/material'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

import Select, { SelectChangeEvent } from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import { createTheme, ThemeProvider } from '@mui/material/styles'



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









export const loader = async () => {
  const loaderData = await window.myInventoryAPI.shortageGet()
  const archiveData = await window.myInventoryAPI.archiveGet() as any[]
  const archiveDateList = archiveData.map((row: any) => {
    return { label: new Date(row[0]).toLocaleDateString(), value: new Date(row[0]).toLocaleDateString() }
  })
  const PList = await window.myInventoryAPI.ListData()
  return { loaderData, archiveData, archiveDateList, PList }
}


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function HQStocks() {
  const { loaderData, archiveData, archiveDateList, PList } = useLoaderData<typeof loader>()

  const [stockData, setStockData] = useState([])
  const [value, setValue] = React.useState(0)
  const [date, setDate] = React.useState(archiveDateList[0].value)

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  };
  const handleDateChange = (event: SelectChangeEvent) => {
    setDate(event.target.value as string);
  };

  
  const URL = "https://docs.google.com/spreadsheets/d/1UK3huzFfa3lQnhqWylJU65IeF8z-L39zgj3bSKDMALI/edit?gid=0#gid=0"
  
  const ArchiveSelectData = () => {
    const result = archiveData.find(item => new Date(item[0]).toLocaleDateString() == date)
    return JSON.parse(result[1])
  }

  const PnameGet = (code) => {
    const result = PList.find(item => item.code == Number(code))
    return result.name ?? ''
  }


  const dataset = async() => {
    const data = await window.myInventoryAPI.shortageGet()
    setStockData(data)
  }

  const dialog = async () => {
    Swal.fire({
      title: "本当に入力された現物数をすべて空にしますか？",
      text: "一度空にしたら元のデータには戻りません",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "実行する",
      cancelButtonText: "キャンセル",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "すべて空になりました!",
          text: "",
          icon: "success"
        });
        //AllClearCells
      }
    });
  }

  useEffect(() => {
    setStockData(loaderData)
  }, [])

  return(
    <div>
      <div>
        <LinkBaner/>
      </div>
      <div className="stocksWindow">
        <div>
          <ThemeProvider theme={darkTheme}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="現在の在庫データ"/>
              <Tab label="過去の在庫データ"/>
            </Tabs>
          </ThemeProvider>
        </div>
        <CustomTabPanel value={value} index={0}>
          <div>
            <div className="stocks-button-area">
              <Button variant="outlined" onClick={dataset}>在庫データ再取得</Button>
              <Button variant="outlined" onClick={dialog}>現物数オールクリア</Button>
              <Button variant="outlined" href={URL} target="_blank">入出庫等入力データへ</Button>
            </div>
            <table style={{ marginTop: 10 }}>
              <thead>
                <tr>
                  <th>業者名</th>
                  <th>商品コード</th>
                  <th>商品名</th>
                  <th>商品単価</th>
                  <th>在庫数</th>
                  <th>現物数</th>
                </tr>
              </thead>
              <tbody>
                {
                  stockData.map((row,index) => (
                    <tr key={index}>
                      <td>{row[0]}</td>
                      <td>{row[1]}</td>
                      <td>{row[2]}</td>
                      <td className="stocksNum">{Number(row[4]).toLocaleString('ja-JP')}</td>
                      <td className="stocksNum">{row[12]}</td>
                      <td className="stocksNum" style={{color: row[12] === row[13] ? "black" : "red"}}>{row[13]}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <div>
            <div style={{ width: 200, color: 'white' }}>
              <div></div>
              <ThemeProvider theme={darkTheme}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">日付</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={date}
                    label="日付"
                    onChange={handleDateChange}
                  >
                    {archiveDateList.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </ThemeProvider>
            </div>
            <div>
              <table style={{ marginTop: 10 }}>
                <thead>
                  <tr>
                    <th>商品コード</th>
                    <th>商品名</th>
                    <th>在庫数</th>
                  </tr>
                </thead>
                <tbody>
                  {ArchiveSelectData().map((row, index) => (
                    <tr key={index}>
                      <td style={{ textAlign: 'right' }}>{row[0]}</td>
                      <td>{PnameGet(row[0])}</td>
                      <td style={{ textAlign: 'right' }}>{row[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CustomTabPanel>
      </div>
    </div>
  );
}

