import { useLogic } from './useLogic'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import StoreComp from './storeComp'

const CountListPage = () => {
  const { resultData } = useLogic()

  const handlePrint = async () => {
    const targetIndex = 0
    // 1. 印刷対象のIDを特定
    //const targetElementId = `print-area-${targetIndex}`
    const style = document.createElement('style')
    let styleString = ''
    for (let i = 0; i < resultData.length; i++) {
      if (i == targetIndex) continue
      const targetElementId = `print-area-${i}`
      styleString = styleString + `
        #${targetElementId} {
          display: none;
        }
      `
    }
    style.innerHTML = styleString
    document.head.appendChild(style)

    const result = await window.myInventoryAPI.PrintReady()
    //const result = await window.myInventoryAPI.CountListPrint()
    // console.log(result)
    //document.head.removeChild(style)
  }

  return (
    <Box>
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
            top: 30,
            zIndex: 100
          }}
        >
          <Button variant="contained" onClick={handlePrint}>
            印刷
          </Button>
        </Box>
        {resultData.map((row, index) => (
          <Box
            key={index}
            id={`print-area-${index}`}
          >
            <StoreComp data={row} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default CountListPage
