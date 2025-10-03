import React, { useState, ChangeEvent, useEffect } from 'react'
import '../css/ProductSearchWord.css'
import { Button } from '@mui/material'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/* @ts-ignore */
import jaconv from 'jaconv';
import { MenuItem } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'

export default function WordSearch({ DisplayStatus, setDisplayStatus, RegisterData }) {
  const [SWord, setSWord] = useState<string>('')
  const [tableData, setTableData] = useState<any[]>([])
  const [data, setData] = useState<any[]>([])
  const [buttonlabel, setButtonLabel] = useState('閉じる')
  const [vendorSelect, setVendorSelect] = React.useState('')
  const [vendorList, setVendorList] = useState<any[]>([])

  // 入力値変更時に呼び出される
  const handlewordchange = (event: ChangeEvent<HTMLInputElement>) => {
    setSWord(event.target.value)
  }

  // データ更新
  const productListUpdate = async () => {
    await window.myInventoryAPI.ListReload()
    dataSet()
  }

  const handleVendorChange = (event: SelectChangeEvent) => {
    const select = event.target.value as string
    setVendorSelect(select)
  }


  // データ取得
  const dataSet = async () => {
    const data = await window.myInventoryAPI.ListData()
    setData(data)
    const vendors = data.map((item) => item.vendor)
    const uniqueVendors = Array.from(new Set(vendors))
      .map((item) => ({
        value: item,
        label: item
      })).filter((item) => item.value !== '')
    setVendorList(uniqueVendors)
  }


  // 入力内容が変わったときに検索ワードをセット
  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      productReSearch()
    }
  }

  const switching = () => {
    setDisplayStatus(!DisplayStatus)
  }

  const buttonlabelSet = () => {
    let result = '開く'
    if (DisplayStatus){
      result = '閉じる'
    }
    setButtonLabel(result)
  }

  const ProductClick = async (row) => {
    RegisterData(row)
  }



  const productReSearch = async () => {
    let filterdData = data
    if (vendorSelect !== '') {
      filterdData = data.filter((item) => item.vendor == vendorSelect)
    }
    if (!SWord){
      setTableData(filterdData)
    } else {
      const multiword = SWord.split(/[ 　]+/).filter((word) => word)
      if (multiword.length === 0) {
        setTableData(filterdData)
        return
      }

      const searchresult = filterdData.filter((item) => {
        const nameStr = String(item.name ?? '')
        return multiword.every((word) => {
          const swKZ = jaconv.toKatakana(word)
          const swHZ = jaconv.toHiragana(swKZ)
          const swKH = jaconv.toHan(swKZ)
          const variations = [word, swKZ, swHZ, swKH]
          return variations.some((sw) => nameStr.includes(sw))
        })
      })

      setTableData(searchresult)
    }
  };

  useEffect(() => {
    dataSet()
    buttonlabelSet()
  }, [])

  useEffect(() => {
    buttonlabelSet()
  }, [DisplayStatus])

  return (
    <div className="WordSearch-area">
      <div className="OandC">
        <Button variant="outlined" onClick={switching} sx={{ height: '30px' }}>
          {buttonlabel}
        </Button>
      </div>
      {DisplayStatus && (
        <div className="WordSearchA">
          <div className="WordSearch-vendorFilter">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">業者</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                value={vendorSelect}
                label="業者"
                onChange={handleVendorChange}
                displayEmpty
                size="small"
                style={{ width: 200, backgroundColor: 'white', color: 'black' }}
              >
                <MenuItem value="">全て</MenuItem>
                {vendorList.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="search-input">
            <input
              type="text"
              value={SWord}
              onChange={handlewordchange}
              placeholder="検索ワードを入力"
              onKeyDown={(e) => handleKeyDown(e)}
            />
            <Button variant="outlined" onClick={productReSearch} sx={{ height: '30px' }}>
              検索
            </Button>
            <Button variant="outlined" onClick={productListUpdate} sx={{ height: '30px' }}>
              更新
            </Button>
          </div>
          <div className="search-table">
            <table className="search-data-table">
              <thead>
                <tr>
                  <th className="stcode">商品コード</th>
                  <th className="stname">商品名</th>
                </tr>
              </thead>
              <tbody className="datail">
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td className="scode">
                      <Button sx={{ height: '30px' }} onClick={() => ProductClick(row)}>
                        {row.code}
                      </Button>
                    </td>
                    <td className="sname">
                      <Button
                        sx={{ height: '30px', color: 'black' }}
                        onClick={() => ProductClick(row)}
                      >
                        {row.name}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
