import React, { useState, useEffect } from 'react'
import './inventorySearch.css'
import LinkBaner from '../../../comp/Linkbanar'
import { Toaster } from 'react-hot-toast'
import jaconv from 'jaconv'
import { SelectChangeEvent } from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'

import InventorySearchDetailDialog from './inventorySearchDetail'
import CommingSoon from '../../CommingSoon'

import SearchFilterDialog from './inventorySearchFilterDialog'


import {
  Button,
  MenuItem,
  FormControl,
  Select,
  TextField,
  Box
} from '@mui/material'








const InventorySearchPage = () => {
  const isDev = window.myInventoryAPI.isDev
  const Completeness = false

  if (!isDev && !Completeness) {
    return (
      <div className="SearchPage-Window">
        <div>
          <LinkBaner id="zaiko" />
          <Toaster />
        </div>
        <CommingSoon />
      </div>
    )
  }

  const [SearchWord, setSearchWord] = useState('')
  const [data, setData] = useState<any[]>([])
  const [tableData, setTableData] = useState<any[]>([])
  const [vendorSelect, setVendorSelect] = React.useState('')
  const [vendorList, setVendorList] = useState<any[]>([])
  const [SelectData, setSelectData] = useState<any>(null)
  const [DisplayStatus, setDisplayStatus] = useState(false)
  const [FilterDialogOpen, setFilterDialogOpen] = useState(false)
  const [FilterConditions, setFilterConditions] = useState({
    PriceType: '',
    LowestPrice: 0,
    HighestPrice: 0,
    ProductType: ''
  })

  const searchWordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchWord(e.target.value)
  }


  const handleVendorChange = (event: SelectChangeEvent) => {
    const select = event.target.value as string
    setVendorSelect(select)
  }

  const Search = async () => {
    let filterdData = data
    let finalData = filterdData
    if (vendorSelect !== '') {
      filterdData = data.filter((item) => item.vendor == vendorSelect)
    }
    if (!SearchWord) {
      finalData = filterdData
    } else {
      const multiword = SearchWord.split(/[ 　]+/).filter((word) => word)
      if (multiword.length === 0) {
        finalData = filterdData
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
      finalData = searchresult
    }
    finalData = finalData.filter((item) => {
      if (FilterConditions.PriceType !== '') {
        let itemPrice = 0
        if (FilterConditions.PriceType === 'newPrice') {
          itemPrice = item.newPrice
        } else if (FilterConditions.PriceType === 'sale') {
          itemPrice = item.store
        }
        if (FilterConditions.HighestPrice == 0) {
          return itemPrice >= FilterConditions.LowestPrice
        } else {
          return itemPrice >= FilterConditions.LowestPrice && itemPrice <= FilterConditions.HighestPrice
        }
      } else {
        return true
      }
    })
    finalData = finalData.filter((item) => {
      const Select = FilterConditions.ProductType
      if (Select !== '') {
        return item.type == Select
      } else {
        return true
      }
    })
    setTableData(finalData)
  }

  const dataSet = async () => {
    const listdata = await window.myInventoryAPI.ListData()
    setData(listdata)
    const vendors = listdata.map((item) => item.vendor)
    const uniqueVendors = Array.from(new Set(vendors))
      .map((item) => ({
        value: item,
        label: item
      })).filter((item) => item.value !== '')
    setVendorList(uniqueVendors)

    setTableData(listdata)
  }

  const DataSelect = async (index: number) => {
    const selectData = tableData[index]
    setSelectData(selectData)
    setDisplayStatus(true)
  }


  useEffect(() => {
    dataSet()
  }, [])


  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
      }}
    >
      <Box>
        <LinkBaner id="zaiko" />
        <Toaster />
      </Box>
      <Box className="SearchPage-Area">
        <Box className="SearchPage-inputArea">
          <Box className="SearchPage-Setting">
            <Box style={{ marginRight: 20 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">業者</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  value={vendorSelect}
                  label="業者"
                  onChange={handleVendorChange}
                  displayEmpty
                  size="small"
                  style={{ width: 150, backgroundColor: 'white', color: 'black' }}
                >
                  <MenuItem value="">全て</MenuItem>
                  {vendorList.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <TextField
                label="検索ワード"
                value={SearchWord}
                style={{ width: 200, backgroundColor: 'white', color: 'black' }}
                onChange={(e) => searchWordChange(e)}
                size="small"
              />
            </Box>
            <Box>
              <Button
                variant="outlined"
                onClick={() => setFilterDialogOpen(true)}
              >
                絞り込み設定
              </Button>
            </Box>
          </Box>
          <Box className="SearchPage-StartButton">
            <Button variant="outlined" onClick={Search}>
              検索
            </Button>
          </Box>
        </Box>
        <div className="SearchPage-ResultArea">
          <div className="SearchTable-headers">
            <table className="SearchPageTable">
              <thead>
                <tr>
                  <th className="Search-vendor">業者</th>
                  <th className="Search-code">商品コード</th>
                  <th className="Search-name">商品名</th>
                  <th className="Search-Button">操作</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="SearchTable-results">
            <table className="SearchPageTable">
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td className="Search-vendor">{row.vendor}</td>
                    <td className="Search-code">{row.code}</td>
                    <td className="Search-name">{row.name}</td>
                    <td className="Search-Button">
                      <Button
                        variant="text"
                        onClick={() => DataSelect(index)}
                        size="small"
                      >
                        詳細
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <InventorySearchDetailDialog
          DisplayStatus={DisplayStatus}
          setDisplayStatus={setDisplayStatus}
          SelectData={SelectData}
        />
        <SearchFilterDialog
          FilterDialogOpen={FilterDialogOpen}
          setFilterDialogOpen={setFilterDialogOpen}
          FilterConditions={FilterConditions}
          setFilterConditions={setFilterConditions}
        />
      </Box>
    </Box>
  )
}

export default InventorySearchPage
