import type { JSX } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { BoxHeader } from './logic'
import { TaiyoOrderType } from './types'

const TaiyoArea = ({ Data, Address }: TaiyoOrderType): JSX.Element => {
  const TaiyoAdd = Address.find((row) => row[0].includes('大洋')) ?? []
  return (
    <Box
      sx={{
        minWidth: '210mm',
        minHeight: '297mm',
        maxWidth: '210mm',
        maxHeight: '297mm',
        pagebreakAfter: 'always',
        backgroundColor: 'white',
        display: 'flex',
        flexFlow: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1px',
        breakInside: 'avoid'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexFlow: 'column',
          justifyContent: 'center',
          paddingTop: '10px'
        }}
      >
        <Typography variant="h4">FAX注文書</Typography>
      </Box>
      <Box
        sx={{
          width: '98%',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0px 20px'
        }}
      >
        <Box>
          <Typography variant="h6">㈱大洋商会 御中</Typography>
        </Box>
        <Box>
          <Typography variant="h6">FAX{TaiyoAdd[2]}</Typography>
          <Typography variant="h6">TAL{TaiyoAdd[3]}</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          border: '1px solid black'
        }}
      >
        <Box
          sx={{
            borderBottom: '1px black solid',
            display: 'flex'
          }}
        >
          <Box sx={{ ...BoxHeader, width: '100px' }}>
            カタログ
            <br />
            掲載番号
          </Box>
          <Box
            sx={{
              ...BoxHeader,
              width: '327px',
              borderLeft: '1px solid black',
              borderRight: '1px solid black'
            }}
          >
            商品名
          </Box>
          <Box sx={{ ...BoxHeader, width: '60px' }}>数量</Box>
          <Box
            sx={{
              ...BoxHeader,
              width: '100px',
              borderLeft: '1px solid black',
              borderRight: '1px solid black'
            }}
          >
            ディーラー
            <br />
            価格
          </Box>
          <Box sx={{ ...BoxHeader, width: '100px', borderRight: '1px solid black' }}>サロン価格</Box>
          <Box sx={{ ...BoxHeader, width: '100px' }}>備考</Box>
        </Box>
        <Box
          sx={{
            borderTop: 'none'
          }}
        >
          {Data.map((row, index) => (
            <Box key={index}>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  borderBottom: '1px solid black',
                  height: '40px'
                }}
              >
                <Box sx={{ ...BoxHeader, width: '100px' }}>{row[0]}</Box>
                <Box
                  sx={{
                    ...BoxHeader,
                    width: '327px',
                    textAlign: 'Left',
                    justifyContent: 'Left',
                    borderLeft: '1px solid black',
                    borderRight: '1px solid black'
                  }}
                >
                  <Box sx={{ marginLeft: '20px' }}>{row[1]}</Box>
                </Box>
                <Box sx={{ ...BoxHeader, width: '60px' }}>{row[2]}</Box>
                <Box
                  sx={{
                    ...BoxHeader,
                    width: '100px',
                    borderLeft: '1px solid black',
                    borderRight: '1px solid black'
                  }}
                >
                  {''}
                </Box>
                <Box sx={{ ...BoxHeader, width: '100px', borderRight: '1px solid black' }}>{''}</Box>
                <Box sx={{ ...BoxHeader, width: '100px' }}>{''}</Box>
              </Box>
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            padding: '10px 0px',
            borderBottom: '1px black solid'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              textAlign: 'center',
              justifyContent: 'center',
              flexFlow: 'column',
              padding: '10px 0px'
            }}
          >
            <Typography variant="h5">サロン直送</Typography>
          </Box>
          <Box
            sx={{
              paddingLeft: '10px'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                paddingRight: '20px',
                padding: '8px 0px'
              }}
            >
              <Typography
                variant="h6"
                sx={{ width: '100px', textAlignLast: 'justify', marginRight: '20px' }}
              >
                サロン名
              </Typography>
              <Typography variant="h6">{Address[0][6]}</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                paddingBottom: '8px'
              }}
            >
              <Typography
                variant="h6"
                sx={{ width: '100px', textAlignLast: 'justify', marginRight: '20px' }}
              >
                配送先
              </Typography>
              <Box>
                <Typography variant="h6">〒{Address[0][4]}</Typography>
              </Box>
              <Box
                sx={{
                  paddingLeft: '10px'
                }}
              >
                <Typography variant="h6">{Address[0][5]}</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                paddingRight: '20px',
                paddingBottom: '8px'
              }}
            >
              <Typography
                variant="h6"
                sx={{ width: '100px', textAlignLast: 'justify', marginRight: '20px' }}
              >
                電話
              </Typography>
              <Typography variant="h6">{Address[0][3]}</Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexFlow: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100px',
            width: '100%'
          }}
        >
          <Typography
            variant="h6"
          >
            お世話になります。
          </Typography>
          <Typography
            variant="h6"
          >
            ご注文よろしくお願いします
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default TaiyoArea
