import Box from '@mui/material/Box'
import type { JSX } from 'react'
import { EtcOrderType } from './types'

const EtcOrder = ({ Data, Address, vendorName }: EtcOrderType): JSX.Element => {
  const MyAddress = Address[0]
  const targetAddress = Address.find((row) => row[0] == vendorName) ?? []
  return (
    <Box
      sx={{
        minWidth: '210mm',
        minHeight: '297mm',
        maxWidth: '210mm',
        maxHeight: '297mm',
        backgroundColor: 'white',
        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center',
        padding: '1px',
        breakInside: 'avoid'
      }}
    >
      <Box sx={{ fontSize: '28px', fontWeight: 'bold' }}>注文書</Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <Box>
          <Box
            sx={{
              display: 'flex',
              fontSize: '24px',
              fontWeight: 'bold'
            }}
          >
            <Box>株式会社</Box>
            <Box sx={{ padding: '0px 6px' }}>{vendorName}</Box>
            <Box>御中</Box>
          </Box>
          <Box>TEL:{targetAddress[3]}</Box>
          <Box>FAX:{targetAddress[2]}</Box>
          <Box sx={{ fontSize: '20px', fontWeight: 'bold' }}>お世話になります</Box>
          <Box sx={{ fontSize: '20px', fontWeight: 'bold' }}>ご注文宜しくお願いします</Box>
        </Box>
        <Box sx={{ marginBottom: '8px' }}>
          <Box
            sx={{
              border: '1px black solid',
              height: '100%',
              fontSize: '18px',
              textAlign: 'right',
              padding: '0px 10px'
            }}
          >
            <Box>{MyAddress[6]}</Box>
            <Box>{MyAddress[5]}</Box>
            <Box>TEL:{MyAddress[3]}</Box>
            <Box sx={{ textAlign: 'left' }}>担当</Box>
            <Box>FAX:{MyAddress[3]}</Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: '790px'
        }}
      >
        <Box
          sx={{
            border: '1px black solid',
            display: 'flex',
            width: '100%',
            fontSize: '18px'
          }}
        >
          <Box sx={{ flex: 1, textAlign: 'center', borderRight: '1px black solid' }}>商品名</Box>
          <Box sx={{ width: '150px', textAlign: 'center' }}>個数</Box>
        </Box>
        {Data.map((row, index: number) => (
          <Box
            key={index}
            sx={{
              border: '1px black solid',
              borderTop: 'none',
              display: 'flex',
              width: '100%',
              minHeight: '32px',
              fontSize: '20px'
            }}
          >
            <Box
              sx={{
                flex: 1,
                textAlign: 'Left',
                paddingLeft: '10px',
                alignItems: 'center',
                borderRight: '1px black solid'
              }}
            >
              {row[1]}
            </Box>
            <Box sx={{ width: '150px', textAlign: 'center', alignItems: 'center' }}>{row[2]}</Box>
          </Box>
        ))}
        {vendorName == 'ムラカミ' && (
          <Box
            sx={{
              border: '2px black solid',
              borderTop: 'none',
              display: 'flex',
              width: '100%',
              textAlign: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              fontWeight: 'bold'
            }}
          >
            <Box>プロステップは別紙です</Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default EtcOrder
