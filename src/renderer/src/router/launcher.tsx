import React from 'react'
import type { JSX } from 'react'
import { Button } from '@mui/material'
import '../css/launcher.css'

const styles = { height: '30px', margin: '5px 10px', width: 120 }

const LauncherPage = (): JSX.Element => {
  const InventoryApp = async (): Promise<void> => {
    await window.myInventoryAPI.WindowZaiko()
  }

  const HelloWorkApp = async (): Promise<void> => {
    await window.myInventoryAPI.HelloWorkWindow()
  }

  const SettingApp = async (): Promise<void> => {
    await window.myInventoryAPI.SettingWindow()
  }

  const OfficeWork = async (): Promise<void> => {
    await window.myInventoryAPI.OfficeWorkWindow()
  }

  return (
    <div className="app-select-area">
      <div className="app-select-title">アプリを選択してください</div>
      <div>
        <Button variant="outlined" onClick={InventoryApp} sx={styles}>
          在庫管理
        </Button>
        <Button variant="outlined" onClick={HelloWorkApp} sx={styles}>
          ハロワ
        </Button>
        <Button variant="outlined" onClick={OfficeWork} sx={styles}>
          その他事務
        </Button>
        <Button variant="outlined" onClick={SettingApp} sx={styles}>
          設定
        </Button>
      </div>
    </div>
  )
}

export default LauncherPage
