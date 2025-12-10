import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

const FAXArea = () => {
  return (
    <Box>
      <Box>FAX発注印刷</Box>
      <Box>
        <Button variant="outlined" onClick={() => window.myInventoryAPI.orderPrint('VendorPrint')}>FAX</Button>
      </Box>
    </Box>
  )
}

export default FAXArea
