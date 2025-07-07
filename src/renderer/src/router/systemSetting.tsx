import React from 'react'

import LinkBaner from '../comp/Linkbanar'
import '../css/setting.css'



import { Button } from '@mui/material'





export default function SystemSettingPage() {



  const handleTokenChange = async() => {
    await window.myInventoryAPI.TokenChange()
  }
  const handleGoogleLogout = async () => {
    await window.myInventoryAPI.GoogleLogout()
  }

  return (
    <>
      <div>
        <LinkBaner id='Setting' />
      </div>
      <div style={{color: 'white', paddingTop: 60, paddingLeft: 20}}>
        <div>
          設定ページ
          <div style={{ display: 'flex' }} className="system-setting-area">
            <div className="Token">
              <Button variant="outlined" onClick={handleTokenChange}>トークン変更</Button>
            </div>
            <div className="Google">
              <div>Google関係</div>
              <Button variant="outlined" onClick={handleGoogleLogout}>ログアウト</Button>
            </div>
          </div>
          
        </div>
      </div>
    </>
  )
}