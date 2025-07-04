/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigation, useNavigate } from "react-router-dom";
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import { LinearProgress } from '@mui/material';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import Tooltip from '@mui/material/Tooltip';

import '../css/banner.css';


const LinkBaner = () => {
  const navigate = useNavigate();
  const [open, setopen] = useState(false);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(navigation.state === 'loading');
  const [updateIconColor, setUpdateIconColor] = useState<SvgIconProps['color']>('disabled');

  useEffect(() => {
    if (navigation.state === "loading") {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [navigation.state]);

  useEffect(() => {
    window.myInventoryAPI.onUpdateAvailable((flag) => {
      //console.log('Update available:', flag)
      // UI表示などの処理
      if(flag){
        setUpdateIconColor('success')
      }else{
        setUpdateIconColor('disabled')
      }
    })
  }, [])

  const handleUpdateClick = () => {
    window.myInventoryAPI.upGrade()
    //window.myInventoryAPI.MainBoot()
  }


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
          <div>
            {updateIconColor === 'success' ? (
              <Tooltip title="アップデートがあります！" children={
                <IconButton onClick={handleUpdateClick}>
                  <SystemUpdateAltIcon color={updateIconColor} />
                </IconButton>
              } />
            ) : (
              <IconButton disabled>
                <SystemUpdateAltIcon color={updateIconColor} />
              </IconButton>
            )}
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
              top: '20px',
              marginTop: "40px",
              maxHeight: 'calc(100vh - 100px)',
            }
          }}
        >
          <div className="Link-button" style={{ marginTop: "40px" }}>
            <Button variant="outlined" onClick={() => navigate('/')} sx={{height:'30px', margin: "5px 10px", width: 120}}>入庫</Button>
            <Button variant='outlined' onClick={() => navigate('/StoreOrder')} sx={{height:'30px', margin: "5px 10px", width: 120}}>店舗注文</Button>
            <Button variant='outlined' onClick={() => navigate('/Moving')} sx={{height:'30px', margin: "5px 10px", width: 120}}>店舗間移動</Button>
            <Button variant="outlined" onClick={() => navigate('/HQ_Stocks')} sx={{height:'30px', margin: "5px 10px", width: 120}}>在庫数</Button>
            {/* <Link className="link" to="/service">サービス品入庫</Link>
            <Link className="link" to="/ImgUpload">商品画像設定</Link> */}
            <Button variant="outlined" onClick={() => navigate('/netOrder')} sx={{height:'30px', margin: "5px 10px", width: 120}}>発注サイト</Button>
            <Button variant="outlined" onClick={() => navigate('/CatalogView')} sx={{height:'30px', margin: "5px 10px", width: 120}}>カタログ</Button>
            <Button variant="outlined" onClick={() => navigate('/process_chack')} sx={{height:'30px', margin: "5px 10px", width: 120}}>印刷関係</Button>
            <Button variant="outlined" onClick={() => navigate('/ProductListUpdata')} sx={{height:'30px', margin: "5px 10px", width: 120}}>商品設定</Button>
            <Button variant="outlined" onClick={() => navigate('/zaikosetting')} sx={{height:'30px', margin: "5px 10px", width: 120}}>在庫設定</Button>
            <Button variant="outlined" onClick={() => navigate('/InventoryAmount')} sx={{height:'30px', margin: "5px 10px", width: 120}}>在庫金額</Button>
            <Button variant="outlined" onClick={() => navigate('/HelloWork')} sx={{height:'30px', margin: "5px 10px", width: 120}}>ハロワ</Button>
            <Button variant="outlined" onClick={() => navigate('/PDFOperation')} sx={{height:'30px', margin: "5px 10px", width: 120}}>PDF操作</Button>

            <Button variant="outlined" onClick={() => navigate('/systemSetting')} sx={{height:'30px', margin: "5px 10px", width: 120}}>システム設定</Button>
          </div>
        </Drawer>
      </div>
    </div>
  );
}

export default LinkBaner;