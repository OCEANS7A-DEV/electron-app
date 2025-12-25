import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import { ButtonStyle } from './logic'
import { ButtonSelectType } from './types'
import type { JSX } from 'react'

const ButtonSelect = ({ data, navigate, open }: ButtonSelectType): JSX.Element => {
  return (
    <Box className="DrawerArea">
      <Drawer
        variant="persistent"
        anchor="right"
        open={open}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: '#40404a',
            top: '20px',
            marginTop: '30px',
            maxHeight: 'calc(100vh - 140px)'
          }
        }}
      >
        <Box className="Link-button">
          {data.id == 'zaiko' && (
            <Box className="Link-button" style={{ marginTop: '6px' }}>
              <Button variant="outlined" onClick={() => navigate('/')} sx={ButtonStyle}>
                入庫
              </Button>
              <Button variant="outlined" onClick={() => navigate('/StoreOrder')} sx={ButtonStyle}>
                店舗注文
              </Button>
              <Button variant="outlined" onClick={() => navigate('/Moving')} sx={ButtonStyle}>
                店舗間移動
              </Button>
              <Button variant="outlined" onClick={() => navigate('/HQ_Stocks')} sx={ButtonStyle}>
                在庫数
              </Button>
              <Button variant="outlined" onClick={() => navigate('/FCInventory')} sx={ButtonStyle}>
                店舗在庫数
              </Button>
              <Button variant="outlined" onClick={() => navigate('/netOrder')} sx={ButtonStyle}>
                発注サイト
              </Button>
              <Button variant="outlined" onClick={() => navigate('/CatalogView')} sx={ButtonStyle}>
                カタログ
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/process_chack')}
                sx={ButtonStyle}
              >
                印刷関係
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/ProductListUpdata')}
                sx={ButtonStyle}
              >
                商品設定
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/InventorySearchPage')}
                sx={ButtonStyle}
              >
                商品検索
              </Button>
              <Button variant="outlined" onClick={() => navigate('/zaikosetting')} sx={ButtonStyle}>
                在庫設定
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/InventoryAmount')}
                sx={ButtonStyle}
              >
                在庫金額
              </Button>
            </Box>
          )}
          {data.id == 'helloWork' && (
            <Box className="Link-button" style={{ marginTop: '6px' }}>
              <Button variant="outlined" onClick={() => navigate('/HelloWork')} sx={ButtonStyle}>
                ハロワ
              </Button>
            </Box>
          )}
          {data.id == 'OfficeWork' && (
            <Box className="Link-button" style={{ marginTop: '6px' }}>
              <Button variant="outlined" onClick={() => navigate('/PDFOperation')} sx={ButtonStyle}>
                PDF操作
              </Button>
              <Button variant="outlined" onClick={() => navigate('/Uriage')} sx={ButtonStyle}>
                売上
              </Button>
              <Button variant="outlined" onClick={() => navigate('/HQdata')} sx={ButtonStyle}>
                本部データ
              </Button>
              <Button variant="outlined" onClick={() => navigate('/HQmemo')} sx={ButtonStyle}>
                本部メモ
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/HQPrivatememo')}
                sx={ButtonStyle}
              >
                個人メモ
              </Button>
              <Button variant="outlined" onClick={() => navigate('/StaffData')} sx={ButtonStyle}>
                スタッフデータ
              </Button>
            </Box>
          )}
          {data.id == 'Setting' && (
            <Box className="Link-button" style={{ marginTop: '6px' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/systemSetting')}
                sx={ButtonStyle}
              >
                システム設定
              </Button>
            </Box>
          )}
          {/* <Link className="link" to="/service">サービス品入庫</Link>
          <Link className="link" to="/ImgUpload">商品画像設定</Link> */}
        </Box>
      </Drawer>
    </Box>
  )
}

export default ButtonSelect
