import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import type { JSX } from 'react'

const FAXArea = (): JSX.Element => {
  return (
    <Box>
      <Box sx={{ color: 'white' }}>FAX発注印刷</Box>
      <Box>
        <Button variant="outlined" onClick={() => window.myInventoryAPI.orderPrint('VendorPrint')}>
          印刷
        </Button>
      </Box>
    </Box>
  )
}

export default FAXArea
