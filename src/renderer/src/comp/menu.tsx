import React from 'react'
import { Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useLoaderData, Link, useNavigation, useNavigate } from "react-router-dom";

// import { useEffect, useState } from "react";
// import ProgressBar from './ProgressBar';
// import { LinearProgress } from '@mui/material';
import '../css/banner.css';


const LinkButton = () => {
  const navigate = useNavigate();
  return(
    <div>
      <div className="Link-area">
        {/* <div className="Arrowarea">
          <IconButton onClick={() => window.history.back()} sx={{color:'white', height:'30px', width:'30px'}} aria-label="戻る">
            <ArrowBackIcon />
          </IconButton>
          <IconButton onClick={() => window.history.forward()} sx={{color:'white', height:'30px', width:'30px'}} aria-label="進む">
            <ArrowForwardIcon />
          </IconButton>
        </div> */}
        <div className="Link-button">
          {/* <Link className="link" to="/">トップ</Link> */}
          {/* <Link className="link" to="/about">テスト用</Link> */}
          {/* <Link className="link" to="/">入庫</Link> */}
          
          {/* <Link className="link" to="/service">サービス品入庫</Link>
          <Link className="link" to="/HQ_Stocks">在庫数</Link>
          <Link className="link" to="/ImgUpload">商品画像設定</Link> */}
          
          {/* <Link className="link" to="/netOrder">発注サイトリンク</Link> */}
          {/* <Link className="link" to="/process_chack">印刷関係</Link> */}
        </div>
        <Button variant="outlined" onClick={() => navigate('/')} sx={{height:'30px'}}>入庫</Button>
        <Button variant="outlined" onClick={() => navigate('/netOrder')} sx={{height:'30px'}}>発注サイトリンク</Button>
      </div>
    </div>
  );
}

export default LinkButton;