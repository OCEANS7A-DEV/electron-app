import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import { ColumnSize, RowDataStyle } from './logic'

// 日付関連コンポーネント
import 'dayjs/locale/ja'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

const OrderStatus = ({ dateValue, handleDateChange, DataGet, OrderDataStatus }) => {
  return (
    <Box
      sx={{
        marginLeft: '20px',
        padding: '10px',
        backgroundColor: 'white',
        borderRadius: '4px',
        color: 'black',
        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center',
        justifyContent: 'space-around'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingBottom: '4px'
        }}
      >
        <Button variant="outlined" onClick={DataGet}>
          取得
        </Button>
        <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
            <DatePicker
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  sx: {
                    fontSize: '1rem',
                    '& input': {
                      height: '1.5em'
                    },
                    width: '150px'
                  }
                }
              }}
              value={dateValue}
              onChange={handleDateChange}
            />
          </LocalizationProvider>
        </Box>
      </Box>
      <Box
        sx={{
          padding: '1px',
          backgroundColor: 'black',
          display: 'grid',
          gap: '1px',
          gridTemplateColumns: '100px 120px'
        }}
      >
        <Box sx={{ ...ColumnSize }}>店舗名</Box>
        <Box sx={{ ...ColumnSize }}>処理状況</Box>
        {OrderDataStatus.map((row) => (
          <>
            <Box sx={{ ...RowDataStyle }}>{row.storeName}</Box>
            <Box sx={{ ...RowDataStyle, textAlign: 'center' }}>{row.printStatus}</Box>
          </>
        ))}
      </Box>
    </Box>
  )
}

export default OrderStatus
