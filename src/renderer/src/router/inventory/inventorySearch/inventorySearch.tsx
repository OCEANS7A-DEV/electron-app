import React, { useState, ChangeEvent } from 'react'
import './inventorySearch.css'
import { Button } from '@mui/material'
import LinkBaner from '../../../comp/Linkbanar'
import { Toaster } from 'react-hot-toast'
//import jaconv from 'jaconv'
//import { MenuItem } from '@mui/material'
//import FormControl from '@mui/material/FormControl'
//import Select, { SelectChangeEvent } from '@mui/material/Select'
//import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'





const InventorySearchPage = () => {
  const [SearchWord, setSearchWord] = useState('')

  const searchWordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value)
  }


  const Search = async () => {
    const data = await window.myInventoryAPI.ListData()
    console.log(data)
  }


  return (
    <div className="SearchPage-Window">
      <div>
        <LinkBaner id="zaiko" />
        <Toaster />
      </div>
      <div className="SearchPage-Area">
        <div className="SearchPage-inputArea">
          <div className="SearchPage-Setting">
            <TextField
              label="検索ワード"
              value={SearchWord}
              onChange={(e) => searchWordChange(e)}
              size="small"
            />
          </div>
          <div className="SearchPage-StartButton">
            <Button variant="outlined" onClick={Search}>検索</Button>
          </div>
        </div>
        <div className="SearchPage-ResultArea">
          <table className="SearchPageTable">
            <tr>
              <th>test1</th>
            </tr>
          </table>
        </div>
      </div>
    </div>
  )
}


export default InventorySearchPage
