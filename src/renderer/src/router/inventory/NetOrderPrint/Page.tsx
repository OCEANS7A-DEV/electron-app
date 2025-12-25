import type { JSX } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useLogic } from './useLogic'
import TIDAPrint from './TIDAPrint'
import ETCPrint from './ETCPrint'

const NetOrderPrintPage = (): JSX.Element => {
  const { resultData, ETCDatas } = useLogic()
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        width: '210mm',
        minHeight: '100mm'
      }}
    >
      <Box
        displayPrint="none"
        sx={{
          position: 'fixed',
          top: 30
        }}
      >
        <Button variant="contained" onClick={() => window.myInventoryAPI.PrintReady()}>
          印刷
        </Button>
      </Box>
      <Box>
        <Box>TIDA 注文</Box>
        {resultData
          .filter((row) => row.vendor == 'TIDA')
          .map((row, index) => (
            <Box key={index}>
              <TIDAPrint data={row.data} status={false} />
            </Box>
          ))}
      </Box>
      <Box
        sx={{
          '@media print': {
            breakBefore: 'page'
          }
        }}
      >
        {resultData
          .filter((row) => row.vendor !== 'TIDA')
          .map((row, index) => (
            <Box key={index}>
              <Box>{row.vendor} 注文</Box>
              <TIDAPrint data={row.data} status={true} />
            </Box>
          ))}
      </Box>
      <Box>
        <ETCPrint data={ETCDatas} />
      </Box>
    </Box>
  )
}

export default NetOrderPrintPage
