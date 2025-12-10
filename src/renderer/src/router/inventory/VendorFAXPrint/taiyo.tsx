import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { BoxHeader } from './logic'

const TaiyoArea = ({ Data, Address }) => {
  console.log(Data)
  console.log(Address)
  const TaiyoAdd = Address.find((row) => row[0].includes('大洋'))
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        width: '100%',
        height: '100%'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '20px'
        }}
      >
        <Typography variant="h3">FAX注文書</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0px 10px'
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
          border: '1px black solid',
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
            width: '300px',
            borderLeft: '1px solid black',
            borderRight: '1px solid black'
          }}
        >
          商品名
        </Box>
        <Box sx={{ ...BoxHeader, width: '100px' }}>数量</Box>
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
          border: '1px black solid',
          borderTop: 'none'
        }}
      >
        {Data.map((row, index) => (
          <Box key={index}>
            <Box sx={{ width: '100%', display: 'flex', borderBottom: '1px solid black', height: '40px' }}>
              <Box sx={{ ...BoxHeader, width: '100px' }}>{row[0]}</Box>
              <Box
                sx={{
                  ...BoxHeader,
                  width: '300px',
                  borderLeft: '1px solid black',
                  borderRight: '1px solid black'
                }}
              >
                {row[1]}
              </Box>
              <Box sx={{ ...BoxHeader, width: '100px' }}>{row[2]}</Box>
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
    </Box>
  )
}

export default TaiyoArea
