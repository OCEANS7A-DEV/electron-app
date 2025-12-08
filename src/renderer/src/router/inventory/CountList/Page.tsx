import { useLogic } from './useLogic'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import StoreComp from './storeComp'
import { Toaster } from 'react-hot-toast'
import './style.css'

const CountListPage = () => {
  const { resultData, AllPDFPrint } = useLogic()
  return (
    <>
      <Box className="toast">
        <Toaster />
      </Box>
      <Box>
        <Box>
          <Box
            displayPrint="none"
            sx={{
              position: 'fixed',
              top: 30,
              zIndex: 100
            }}
          >
            <Button variant="contained" onClick={AllPDFPrint}>
              印刷
            </Button>
          </Box>
          {resultData.map((row, index) => (
            <Box key={index} id={`print-area-${index}`}>
              <StoreComp data={row} />
            </Box>
          ))}
        </Box>
      </Box>
    </>

  )
}

export default CountListPage
