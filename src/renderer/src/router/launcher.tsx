
import React from 'react'
import { Button } from '@mui/material'
import '../css/launcher.css'


export default function LauncherPage() {
  
  const InventoryApp = async() => {
    await window.myInventoryAPI.WindowZaiko()
    console.log('在庫管理')
  }

  const HelloWorkApp = async() => {
    await window.myInventoryAPI.HelloWorkWindow()
    console.log('ハローワーク')
  }

  const SettingApp = async() => {
    await window.myInventoryAPI.SettingWindow()
    console.log('設定')
  }

  const OfficeWork = async() => {
    await window.myInventoryAPI.OfficeWorkWindow()
    console.log('本部事務')
  }

  return(
    <div className="app-select-area">
      <div className="app-select-title">アプリを選択してください</div>
      <div>
        <Button
          variant="outlined"
          onClick={InventoryApp}
          sx={{height:'30px', margin: "5px 10px", width: 120}}
        >
          在庫管理
        </Button>
        <Button
          variant="outlined"
          onClick={HelloWorkApp}
          sx={{height:'30px', margin: "5px 10px", width: 120}}
        >
          ハロワ
        </Button>
        <Button
          variant="outlined"
          onClick={OfficeWork}
          sx={{height:'30px', margin: "5px 10px", width: 120}}
        >
          その他事務
        </Button>
        <Button
          variant="outlined"
          onClick={SettingApp}
          sx={{height:'30px', margin: "5px 10px", width: 120}}
        >
          設定
        </Button>
      </div>
    </div>
  )
}