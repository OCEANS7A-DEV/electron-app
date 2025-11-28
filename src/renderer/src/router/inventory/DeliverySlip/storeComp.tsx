import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import RowComp from './RowComp'
import { BoxSxSetting, ColumnSize } from './logic'

const StoreComp = ({ printDate, storeData }) => {
  const orderData = storeData.printData
  const storeName = storeData.storeName
  const maxPageNum = orderData.length
  console.log(storeData.total)
  return (
    <Box
      sx={{
        width: '210mm'
      }}
    >
      {orderData.map((page, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexFlow: 'column',
            backgroundColor: 'white',
            minWidth: '210mm',
            maxWidth: '210mm',
            minHeight: '297mm',
            maxHeight: '297mm'
          }}
        >
          <Box
            sx={{
              display: 'flex'
            }}
          >
            <Box
              sx={{
                width: '33%'
              }}
            >
              <Typography variant="button">発注日: {printDate}</Typography>
            </Box>
            <Box
              sx={{
                width: '33%',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Typography variant="button">納品書</Typography>
            </Box>
          </Box>
          <Box>
            <Typography sx={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold' }}>
              {storeName}
            </Typography>
            <Box
              sx={{
                position: 'relative',
                width: '20px',
                left: '200mm',
                top: '-10mm',
                height: 0
              }}
            >
              {index + 1}/{maxPageNum}
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: 'black'
            }}
          >
            <Box
              sx={{
                height: '36px',
                display: 'grid',
                gap: '1px',
                fontSize: '12px',
                padding: '1px 1px 0px 1px',
                fontWeight: 'bold',
                ...ColumnSize
              }}
            >
              <Box
                sx={{
                  ...BoxSxSetting,
                  justifyContent: 'center'
                }}
              >
                商品ナンバー・商品名
              </Box>
              <Box
                sx={{
                  ...BoxSxSetting,
                  justifyContent: 'center'
                }}
              >
                商品詳細
              </Box>
              <Box
                sx={{
                  ...BoxSxSetting,
                  justifyContent: 'center'
                }}
              >
                注文数
              </Box>
              <Box
                sx={{
                  ...BoxSxSetting,
                  justifyContent: 'center'
                }}
              >
                単価
              </Box>
              <Box
                sx={{
                  ...BoxSxSetting,
                  justifyContent: 'center'
                }}
              >
                合計金額
              </Box>
              <Box
                sx={{
                  ...BoxSxSetting,
                  justifyContent: 'center'
                }}
              >
                個人購入
              </Box>
              <Box
                sx={{
                  ...BoxSxSetting,
                  justifyContent: 'center'
                }}
              >
                個人税込
              </Box>
              <Box
                sx={{
                  ...BoxSxSetting,
                  justifyContent: 'center'
                }}
              >
                備考
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex'
              }}
            >
              <RowComp printData={page} />
            </Box>
          </Box>
          {index == maxPageNum - 1 && (
            <Box
              sx={{
                height: '40px',
                display: 'flex',
                justifyContent: 'right',
                alignItems: 'center',
                paddingRight: '10px',
                textUnderlineOffset: '4px',
                textDecoration: 'underline solid black'
              }}
            >
              <Box>税抜き合計金額(個人購入含む):</Box>
              <Box sx={{ paddingLeft: '6px' }}>¥{storeData.total.toLocaleString()}</Box>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  )
}

export default StoreComp
