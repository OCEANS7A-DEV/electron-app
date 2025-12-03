// React
import type { JSX } from 'react'

// Mui
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// 自作コンポとuse
import StoreComp from './storeComp'
import { useLogic } from './useLogic'

const DeliverySlip = (): JSX.Element => {
  const { printDate, resultdata } = useLogic()

  return (
    <Box
      sx={{
        '@media print': {
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact'
        }
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
      {resultdata.map((storeData, index) => (
        <Box key={index}>
          <StoreComp printDate={printDate} storeData={storeData} />
        </Box>
      ))}
    </Box>
  )
}

export default DeliverySlip
