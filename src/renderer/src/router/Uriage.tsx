import LinkBaner from '../comp/Linkbanar'

import '../css/uriage.css'
import { Button } from '@mui/material'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import React, { useState, useEffect } from 'react'


import Select, { SelectChangeEvent } from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import { createTheme, ThemeProvider } from '@mui/material/styles'


interface SelectOption {
  value: number
  label: string
}

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


export default function Uriage() {

  const [Year, setYear] = useState<number>(new Date().getFullYear())
  const [Month, setMonth] = useState<number>(new Date().getMonth() + 1)

  const [Years, setYears] = useState<SelectOption[]>([])
  const [Months, setMonths] = useState<SelectOption[]>([])

  const [SalseData, setSalesData] = useState([])

  const [SalseDataF, setSalesDataF] = useState([])

  const [headers, setHeaders] = useState([])


  const handleYearChange = (e: SelectChangeEvent<number>) => {
    setYear(e.target.value)
  }

  const handleMonthChange = (e: SelectChangeEvent<number>) => {
    setMonth(e.target.value)
  }


  const SalesGet = async () => {
    const result = await window.myInventoryAPI.ListGet({
      action: 'SalesDataGet',
      ranges: 'A1:AH'
    })
    setHeaders(result[0])
    const data = result.filter(item => item[0] !== '日')
    dataFilter(data)
    setSalesData(data)
  }



  const ListSet = () => {
    const now = new Date()
    const year = now.getFullYear()
    const yearList: SelectOption[] = [
      { value: year + 1, label: `${year + 1}年`},
      { value: year, label: `${year}年`},
      { value: year - 1, label: `${year - 1}年`}
    ]
    setYears(yearList)
    const monthList: SelectOption[] = []
    for (let i = 0; i < 12; i++){
      monthList.push({ value: i + 1, label: `${i + 1}月`})
    }
    setMonths(monthList)
  }

  const dataFilter = (data) => {
    const start = new Date(Year, Month - 1, 1)
    const end = new Date(Year, Month - 1, 1)
    end.setMonth(end.getMonth()+1, 0);
    const filterd = data.filter(item => new Date(item[0]) >= start)
    setSalesDataF(filterd)
  }

  useEffect(() => {
    dataFilter(SalseData)
  }, [Year, Month])

  useEffect(() => {
    ListSet()
    SalesGet()
  },[])


  const Col = (data, ind) => {
    let result
    if (ind == 0){
      result = new Date(data).toLocaleDateString()
    } else if (ind == 1){
      result = data
    } else {
      return <td style={{ textAlign: 'right' }}>{Number(data).toLocaleString()}</td>
    }
    return <td style={{ textAlign: 'center' }}>{result}</td>
  }

  


  return (
    <div>
      <div className="banner">
        <LinkBaner id='OfficeWork'/>
      </div>
      <div className="uriage-main">
        <div className="uriage-top">
          <ThemeProvider theme={darkTheme}>
            <div className="Inventory_Amount_title">
              <div style={{ width: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">年</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={Year}
                    label="年"
                    onChange={handleYearChange}
                  >
                    {Years.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div style={{ width: 100 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">月</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={Month}
                    label="月"
                    onChange={handleMonthChange}
                  >
                    {Months.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <Button variant="outlined" onClick={SalesGet}>売上取得</Button>
            </div>
          </ThemeProvider>
        </div>
        <div className="uriage">
          <table>
            <thead>
              <tr>
                {headers.map((row) => (
                  <th>{row}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SalseDataF.map((row,index) => (
                <tr key={index}>
                  {row.map((item, colIdx) => (
                    <React.Fragment key={colIdx}>
                      {Col(item, colIdx)}
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}