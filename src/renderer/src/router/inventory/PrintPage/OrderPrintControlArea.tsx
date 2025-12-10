import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

const OPCArea = ({ storeSelect, handleStoreChange, storeOptions, OrderPrintExe }) => {
  return (
    <Box sx={{ width: '120px', flexFlow: 'column' }}>
      <Box>
        <Button fullWidth variant="outlined" onClick={() => OrderPrintExe(false)}>
          全印刷
        </Button>
      </Box>
      <Box sx={{ padding: '4px 0px' }}>
        <Select
          value={storeSelect}
          size="small"
          label="店舗"
          displayEmpty
          onChange={handleStoreChange}
          style={{ width: 120, backgroundColor: 'white' }}
        >
          <MenuItem value="" />
          {storeOptions.map((item) => (
            <MenuItem key={item.id} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Button fullWidth variant="outlined" onClick={() => OrderPrintExe(true)}>
        印刷
      </Button>
    </Box>
  )
}

export default OPCArea
