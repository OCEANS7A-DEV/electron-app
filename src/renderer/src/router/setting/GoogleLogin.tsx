import React from 'react'
import '../../css/google.css'
import { Button } from '@mui/material'


export default function GoogleWindow() {

  const Confirmation = async() => {
    await window.myInventoryAPI.GoogleConfirmation()
  }

  return (
    <div className="Google-Login-Window">
      <div>Authorization successful.</div>
      <div>と表示されたら下記のボタンを押してください</div>
      <Button variant="outlined" onClick={Confirmation}>完了</Button>
    </div>
  )
}