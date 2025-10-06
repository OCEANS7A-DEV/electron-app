import React, { useState, ChangeEvent, useEffect } from 'react'
import './inventorySearch.css'
import { Button } from '@mui/material'
import LinkBaner from '../../../comp/Linkbanar'
import toast, { Toaster } from 'react-hot-toast'
import jaconv from 'jaconv'
import { MenuItem } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'





const InventorySearchPage = () => {
  const [SearchWord, setSearchWord] = useState('')

  const searchWordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value)
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
          </div>
        </div>
        <div className="SearchPage-ResultArea">

        </div>
      </div>
    </div>
  )
}


export default InventorySearchPage
