import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import { useLogic } from './useLogic'

import StoreComp from './storeComp'

const DeliverySlip = () => {
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
