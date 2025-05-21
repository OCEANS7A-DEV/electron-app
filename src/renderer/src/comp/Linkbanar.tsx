/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigation, useNavigate } from "react-router-dom";
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import { LinearProgress } from '@mui/material';
// import { useEffect, useState } from "react";
// import ProgressBar from './ProgressBar';
// import { LinearProgress } from '@mui/material';
import '../css/banner.css';


const LinkBaner = () => {
  const navigate = useNavigate();
  const [open, setopen] = useState(false);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(navigation.state === 'loading');

  useEffect(() => {
    if (navigation.state === "loading") {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [navigation.state]);

  const handleDrawerOpen = () => {
    if(open){
      setopen(false);
    }else{
      setopen(true);
    }
  };
  return(
    <div>
      {loading && (
        <div
          className="LinearProgress"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 300,
          }}
        >
          <LinearProgress sx={{ width: "100%", height: 2 }}/>
        </div>
      )}
      <div className="Link-area">
        <div className="Arrowarea">
          <div>
            <IconButton onClick={() => window.history.back()} sx={{color:'white', height:'30px', width:'30px'}} aria-label="戻る">
              <ArrowBackIcon />
            </IconButton>
            <IconButton onClick={() => window.history.forward()} sx={{color:'white', height:'30px', width:'30px'}} aria-label="進む">
              <ArrowForwardIcon />
            </IconButton>
          </div>
          
          <div className="blank"></div>
          <div>
            <IconButton sx={{color: "white"}} onClick={handleDrawerOpen}>
              <MenuIcon/>
            </IconButton>
          </div>
          
        </div>
      </div>
      <div className="DrawerArea">
        <Drawer
          variant="persistent"
          anchor="right"
          open={open}
          sx={{
            '& .MuiDrawer-paper': {
              backgroundColor: "#40404a",
              top: '30px',
              marginTop: "40px",
              maxHeight: 'calc(100vh - 100px)',
            }
          }}
        >
          <div className="Link-button" style={{ marginTop: "40px" }}>
            {/* <Link className="link" to="/">トップ</Link> */}
            {/* <Link className="link" to="/about">テスト用</Link> */}
            {/* <Link className="link" to="/">入庫</Link> */}
            <Button variant="outlined" onClick={() => navigate('/')} sx={{height:'30px', margin: "5px 10px"}}>入庫</Button>
            {/* <Button variant='outlined' onClick={() => navigate('/StoreOrder')} sx={{height:'30px', margin: "5px 10px"}}>店舗注文</Button> */}
            <Button variant="outlined" onClick={() => navigate('/HQ_Stocks')} sx={{height:'30px', margin: "5px 10px"}}>在庫数</Button>
            {/* <Link className="link" to="/service">サービス品入庫</Link>
            <Link className="link" to="/HQ_Stocks">在庫数</Link>
            <Link className="link" to="/ImgUpload">商品画像設定</Link> */}
            <Button variant="outlined" onClick={() => navigate('/netOrder')} sx={{height:'30px', margin: "5px 10px"}}>発注サイト</Button>
            <Button variant="outlined" onClick={() => navigate('/process_chack')} sx={{height:'30px', margin: "5px 10px"}}>印刷関係</Button>
            {/* <Link className="link" to="/netOrder">発注サイトリンク</Link> */}
            {/* <Link className="link" to="/process_chack">印刷関係</Link> */}
            <Button variant="outlined" onClick={() => navigate('/ProductListUpdata')} sx={{height:'30px', margin: "5px 10px"}}>商品設定</Button>
            <Button variant="outlined" onClick={() => navigate('/setting')} sx={{height:'30px', margin: "5px 10px"}}>設定</Button>
          </div>
        </Drawer>
      </div>
    </div>
  );
}

export default LinkBaner;