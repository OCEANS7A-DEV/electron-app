// Page.tsx
// React
import type { JSX } from 'react'
import { useLogic } from './useLogic'

// 自作
import LinkBaner from '../../../comp/Linkbanar'

// CSS
import '../../../css/Receiving.css'
import '../../../css/InventoryAmount.css'

// MUI
import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { createTheme, ThemeProvider } from '@mui/material/styles'

// MUIアイコン
import SendIcon from '@mui/icons-material/Send'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#2a2a30',
      paper: '#333'
    },
    primary: {
      main: '#90caf9'
    },
    text: {
      primary: '#ffffff'
    }
  }
})

// メイン
export default function InventoryAmount(): JSX.Element {
  const {
    yearList,
    monthList,
    handleYearChange,
    handleMonthChange,
    fields,
    register,
    getValues,
    Year,
    Month,
    onSubmit,
    handleSubmit,
    Reget,
    isHalfWidth
  } = useLogic()


  return (
    <Box>
      <Box>
        <LinkBaner id="zaiko"/>
      </Box>
      <Box className="Inventory_Amount_area">
        <ThemeProvider theme={darkTheme}>
          <Box className="Inventory_Amount_title">
            <Box sx={{ width: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">年</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={Year}
                  label="年"
                  onChange={handleYearChange}
                >
                  {yearList.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: 100 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">月</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={Month}
                  label="月"
                  onChange={handleMonthChange}
                >
                  {monthList.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: 100 }}>
              <Button variant="outlined" onClick={Reget}>
                再取得
              </Button>
            </Box>
          </Box>
          <Box className="Inventory_Amount_table_area">
            <Box className="Inventory_Amount_table">
              <Box className="Inventory_Amount_rows_header">
                <Box>店舗名</Box>
                <Box>仕入金額</Box>
                <Box>使用金額</Box>
                <Box>在庫金額</Box>
              </Box>
              <Box component="form" onSubmit={handleSubmit(onSubmit)} className="p-4">
                {fields.map((field, index) => (
                  <Box key={field.id} className="Inventory_Amount_rows">
                    <Box className="Inventory_Amount_Store">{getValues(`rows.${index}.store`)}</Box>
                    <Box className="Inventory_Amount_stocking">
                      {Number(getValues(`rows.${index}.stocking`)).toLocaleString()}
                    </Box>
                    <Box className="Inventory_Amount_used">
                      <TextField
                        {...register(`rows.${index}.used`, {
                          validate: (value) => isHalfWidth(value) || '半角英数字で入力してください'
                        })}
                        inputProps={{ style: { textAlign: 'right', fontSize: 20 } }}
                        fullWidth
                        size="small"
                        placeholder="使用金額"
                      />
                    </Box>
                    <Box className="Inventory_Amount_inventoryamount">
                      {Number(getValues(`rows.${index}.inventoryamount`)).toLocaleString()}
                    </Box>
                  </Box>
                ))}
                <Box
                  sx={{
                    display: 'flex',
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    height: '60px',
                    backgroundColor: '#2a2a30',
                    width: '100%',
                    borderTop: '1px solid #444',
                    justifyContent: 'center',
                    zIndex: 100
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Button
                      variant="outlined"
                      type="submit"
                      endIcon={<SendIcon />}
                    >
                      送信実行
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </ThemeProvider>
      </Box>
    </Box>
  )
}
