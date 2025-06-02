import React, { useState, useEffect } from 'react';
// import { useForm, useFieldArray, Controller } from 'react-hook-form'
// import { Button } from '@mui/material'
import WordSearch from '../comp/ProductSearchWord'
import LinkBaner from '../comp/Linkbanar'
import { Toaster } from 'react-hot-toast';
import '../css/Receiving.css'









export default function InventoryMoving() {
  const isDev = window.myInventoryAPI.isDev;
  const Completeness = false

  const [DisplayStatus, setDisplayStatus] = useState(false)

  const [marginNum, setMarginNum] = useState(100)



  useEffect(() => {
    if(DisplayStatus){
      setMarginNum(330)
    }else{
      setMarginNum(80)
    }
  },[DisplayStatus])


  return (
    <>
      <div>
        <LinkBaner />
        <Toaster />
      </div>
      <div className="window_area">
        <div className='form_area'>
          <WordSearch
            DisplayStatus={DisplayStatus}
            setDisplayStatus={setDisplayStatus}
          />
          <div className='in-area' style={{marginLeft: `${marginNum}px`, display: 'flex', flex: 1, justifyContent: 'center'}}>
            {(!isDev && !Completeness) ? (
              <div style={{ flex: 1, textAlign: 'center', paddingTop: '100px', fontSize: '1.5rem', marginLeft: 20, color: 'white' }}>
                🚧 このページは現在準備中です（Coming Soon）
              </div>
            ) : (
              <div className='window_top'>
                <h2 className='store_name'>店舗間移動用ページ</h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
   
  );
}