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
import Autocomplete from '@mui/material/Autocomplete'

// MUIアイコン
import SendIcon from '@mui/icons-material/Send'

// 日付関連コンポーネント
import 'dayjs/locale/ja'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
//dayjs.locale('ja')

// 独自コンポーネント
import LinkBaner from '../../../comp/Linkbanar'
import WordSearch from '../../../comp/ProductSearchWord'

// トースト通知コンポーネント
import { Toaster } from 'react-hot-toast'


import {
  Controller,
} from 'react-hook-form'

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
    DetailsGet,
    deleteRow,
    insertRow,
    addNewForm
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
          <WordSearch RegisterData={RegisterData}/>
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
                            height: '1.5em',
                          },
                          width: '150px',
                        },
                      },
                    }}
                    value={dateValue}
                    onChange={(e) => handleDateChange(e)}
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
                <Box
                  key={field.id}
                >
                  <Box
                    sx={{
                      paddingTop: '6px',
                      paddingLeft: '10px',
                      display: 'flex'
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        width: '12px',
                        justifyContent: 'right',
                        alignItems: 'center',
                        paddingRight: '6px',
                        color: 'white'
                      }}
                    >
                      <Typography>{index}</Typography>
                    </Box>
                    <Box
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        width: '100px'
                      }}
                    >
                      <TextField
                        {...register(`rows.${index}.vendor`)}
                        size="small"
                        placeholder="業者名"
                        onKeyDown={(e) => handleEnterFocusNext(e)}
                      />
                    </Box>
                    <Box
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        width: '110px',
                        marginLeft: '8px'
                      }}
                    >
                      <TextField
                        {...register(`rows.${index}.code`)}
                        size="small"
                        placeholder="商品コード"
                        inputProps={{
                          style: { textAlign: 'right' }
                        }}
                        onKeyDown={(e) => handleEnterFocusNext(e)}
                        onBlur={() => productCodeSearch(index)}
                      />
                    </Box>
                    <Box
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        width: '280px',
                        marginLeft: '8px'
                      }}
                    >
                      <TextField
                        fullWidth
                        {...register(`rows.${index}.name`)}
                        size="small"
                        placeholder="商品名"
                        
                        onKeyDown={(e) => handleEnterFocusNext(e)}
                      />
                    </Box>
                    <Box
                      sx={{
                        borderRadius: '4px',
                        marginLeft: '8px',
                        backgroundColor: 'white',
                      }}
                    >
                      <Controller
                        name={`rows.${index}.detail`}
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            options={DetailsGet(index)}
                            getOptionLabel={(option) => option.label}
                            isOptionEqualToValue={(option, value) => option.value === value?.value}
                            value={field.value || null}
                            onChange={(_, newValue) => field.onChange(newValue)}
                            onKeyDown={(e) => handleEnterFocusNext(e)}
                            openOnFocus
                            autoHighlight
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="詳細"
                                size="small"
                                style={{
                                  width: 160,
                                  height: 38,
                                }}
                              />
                            )}
                          />
                        )}
                      />
                    </Box>
                    <Box
                      sx={{
                        borderRadius: '4px',
                        marginLeft: '8px',
                        backgroundColor: 'white',
                        width: '80px'
                      }}
                    >
                      <TextField
                        {...register(`rows.${index}.quantity`)}
                        size="small"
                        placeholder="数量"
                        onKeyDown={(e) => handleEnterFocusNext(e)}
                        inputProps={{
                          style: { textAlign: 'right' }
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        borderRadius: '4px',
                        marginLeft: '8px',
                        backgroundColor: 'white',
                        width: '100px'
                      }}
                    >
                      <TextField
                        {...register(`rows.${index}.price`)}
                        size="small"
                        placeholder="単価"
                        onKeyDown={(e) => handleEnterFocusNext(e)}
                        inputProps={{
                          style: { textAlign: 'right' }
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        borderRadius: '4px',
                        marginLeft: '8px',
                        backgroundColor: 'white',
                        width: '100px'
                      }}
                    >
                      <TextField
                        {...register(`rows.${index}.person`)}
                        size="small"
                        placeholder="個人購入"
                        onKeyDown={(e) => handleEnterFocusNext(e)}
                      />
                    </Box>
                    <Box
                      sx={{
                        borderRadius: '4px',
                        marginLeft: '8px',
                        backgroundColor: 'white',
                        width: '160px'
                      }}
                    >
                      <TextField
                        {...register(`rows.${index}.remarks`)}
                        size="small"
                        placeholder="備考"
                        onKeyDown={(e) => handleEnterFocusNext(e)}
                      />
                    </Box>
                    <Box
                      sx={{
                        marginLeft: '8px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => insertRow(index)}
                      >
                        追加
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => deleteRow(index)}
                      >
                        削除
                      </Button>
                    </Box>
                  </Box>
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
                
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default StoreOrderPage
