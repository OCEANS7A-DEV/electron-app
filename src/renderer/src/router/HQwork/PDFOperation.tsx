import React from 'react'
import LinkBaner from '../../comp/Linkbanar'
import '../../css/HelloWork.css'
import { Button } from '@mui/material'


export default function PDFOperationPage () {


  const handlePDFMarge = async() => {
    await window.myInventoryAPI.PDFMarge()
  }

  return (
    <div className="PDF-page">
      <div className="banner">
        <LinkBaner id='OfficeWork'/>
      </div>
      <div className="PDF-page-main">
        <div>PDF</div>
        <div>
          <Button variant="outlined" onClick={handlePDFMarge}>
            PDF結合
          </Button>
        </div>
      </div>
    </div>
  )
}
