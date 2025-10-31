import React, { useState, useEffect } from 'react'
import './inventorySearch.css'
import { Button } from '@mui/material'


const InventorySearchDetailDialog = ({ DisplayStatus, setDisplayStatus, SelectData }) => {
  if (!DisplayStatus) return null
  const [ImgURL, setImgURL] = useState('')

  const closed = () => {
    setDisplayStatus(false)
  }

  useEffect(() => {
    ImageUrlSet(SelectData.ImageURL)
  }, [])

  const ImageUrlSet = (URL: string) => {
    const match = URL.match(/\/file\/d\/([^/]+)/);
    let fileId = ''
    if (match && match[1]) {
      fileId = match[1];
    }
    const result = `https://lh3.googleusercontent.com/d/${fileId}`
    setImgURL(result)
  }


  return (
    <div className="SearchTable-detailWindow">
      <div className="SearchTable-detailArea">
        <div className="detail-displayArea">
          <h2 className="productName">
            {SelectData.name}
          </h2>
          <div className="detail-display-Image">
            <img src={ImgURL} />
          </div>
        </div>
        <div className="detail-display-Button">
          <Button
            variant="contained"
            onClick={closed}
          >
            閉じる
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InventorySearchDetailDialog
