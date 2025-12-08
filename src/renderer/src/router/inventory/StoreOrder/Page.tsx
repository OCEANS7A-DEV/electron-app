import './style.css'

// React
import type { JSX } from 'react'
import { useLogic } from './useLogic'

// MUI
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// MUIアイコン
import SendIcon from '@mui/icons-material/Send'

// 日付関連コンポーネント
import 'dayjs/locale/ja'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

// 独自コンポーネント
import LinkBaner from '../../../comp/Linkbanar'
import WordSearch from '../../../comp/ProductSearchWord'
import MyDialog from './Dialog'
import DetailSelectBox from './SelectBox'
import RowComp from './RowComp'

// トースト通知コンポーネント
import { Toaster } from 'react-hot-toast'

const StoreOrderPage = (): JSX.Element => {
  const {
    RegisterData,
    fields,
    register,
    onSubmit,
    handleSubmit,
    control,
    storeSelect,
    storeOptions,
    handleStoreChange,
    dateValue,
    handleDateChange,
    handleEnterFocusNext,
    productCodeSearch,
    deleteRow,
    insertRow,
    addNewForm,
    getValues,
    insertDateRef,
    DialogOpen,
    setDialogOpen,
    insertPost
  } = useLogic()

  return (
    <Box>
      <Box>
        <LinkBaner id="zaiko" />
        <Toaster />
      </Box>
      <Box>
        <Box
          sx={{
            paddingTop: '80px',
            display: 'flex'
          }}
        >
          <Box>
            <WordSearch RegisterData={RegisterData} />
          </Box>
          <Box>
            <Box
              sx={{
                display: 'flex',
                paddingLeft: '10px',
                justifyContent: 'center',
                paddingBottom: '10px'
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  color: 'black'
                }}
              >
                <Select
                  value={storeSelect}
                  size="small"
                  label="店舗"
                  displayEmpty
                  onChange={handleStoreChange}
                  style={{ width: 120, backgroundColor: 'white' }}
                >
                  <MenuItem value="">未選択</MenuItem>
                  {storeOptions.map((item) => (
                    <MenuItem key={item.id} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box
                sx={{
                  padding: '0px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <Typography variant="h5">注文日付:</Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  color: 'black'
                }}
              >
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
              component="form"
              sx={{
                marginBottom: '80px'
              }}
              onSubmit={handleSubmit(onSubmit)}
            >
              {fields.map((field, index) => (
                <Box key={field.id}>
                  <RowComp
                    index={index}
                    register={register}
                    handleEnterFocusNext={handleEnterFocusNext}
                    productCodeSearch={productCodeSearch}
                    control={control}
                    insertRow={insertRow}
                    deleteRow={deleteRow}
                  />
                </Box>
              ))}
              <Box
                sx={{
                  display: 'flex',
                  position: 'fixed',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '70px',
                  backgroundColor: '#2a2a30',
                  borderTop: '1px solid gray',
                  zIndex: 200,
                  alignItems: 'center'
                }}
              >
                <Box
                  sx={{
                    height: '40px',
                    display: 'flex',
                    justifyContent: 'space-around',
                    width: '100%'
                  }}
                >
                  <Button variant="outlined" onClick={addNewForm}>
                    注文枠追加
                  </Button>
                  <Button variant="outlined" endIcon={<SendIcon />} type="submit">
                    注文実行
                  </Button>
                </Box>
                <MyDialog
                  data={getValues('rows')}
                  InsertDate={insertDateRef.current}
                  DialogOpen={DialogOpen}
                  setDialogOpen={setDialogOpen}
                  insertPost={insertPost}
                  storeName={storeSelect}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default StoreOrderPage
