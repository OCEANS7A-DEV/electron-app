// React
import type { JSX } from 'react'
import { useLogic } from './useLogic'

// MUIコンポーネント
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

// MUIアイコン
import SendIcon from '@mui/icons-material/Send'

import { Controller } from 'react-hook-form'

// 独自コンポーネント
import LinkBaner from '../../../comp/Linkbanar'
import WordSearch from '../../../comp/ProductSearchWord'
import MyDialog from './Dialog'
//import DetailSelectBox from './SelectBox'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

// トースト通知コンポーネント
import { Toaster } from 'react-hot-toast'

const ReceivingPage = (): JSX.Element => {
  const {
    control,
    RegisterData,
    errors,
    fields,
    register,
    handleSubmit,
    getValues,
    dateValue,
    onSubmit,
    handleEnterFocusNext,
    search,
    validateCheck,
    placeholderStyle,
    textFieldStyle,
    VendorList,
    RowRemove,
    InsertRow,
    AddNewForm,
    DialogOpen,
    setDialogOpen,
    insertPost,
    handleDateChange,
    handleSelectChange
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
            paddingTop: '60px',
            display: 'flex'
          }}
        >
          <Box>
            <WordSearch RegisterData={RegisterData} />
          </Box>
          <Box
            sx={{
              paddingBottom: '80px'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 2
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  marginRight: 1,
                  whiteSpace: 'nowrap',
                  color: 'white'
                }}
              >
                入庫日付
              </Typography>
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
                        width: '150px',
                        backgroundColor: 'white',
                        borderRadius: '4px'
                      }
                    }
                  }}
                  value={dateValue}
                  onChange={handleDateChange}
                />
              </LocalizationProvider>
            </Box>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              {fields.map((field, index) => (
                <Box
                  key={field.id}
                  sx={{
                    display: 'flex',
                    marginBottom: 1,
                    marginLeft: 1
                  }}
                >
                  <Box
                    sx={{
                      width: 120
                    }}
                  >
                    <FormControl fullWidth>
                      <Controller
                        name={`rows.${index}.vendor`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            size="small"
                            onChange={(e) => handleSelectChange(e, index)}
                            value={field.value?.value || ''}
                            onBlur={field.onBlur}
                            sx={{
                              ...textFieldStyle,
                              textAlign: 'right'
                            }}
                          >
                            <MenuItem value=""></MenuItem>
                            {VendorList.map((Vdata) => (
                              <MenuItem value={Vdata.value} key={Vdata.id}>
                                {Vdata.label}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Box>
                  <TextField
                    {...register(`rows.${index}.code`, {
                      validate: () => validateCheck(index, 'code', '半角英数字で入力してください')
                    })}
                    placeholder="商品コード"
                    size="small"
                    onKeyDown={(e) => handleEnterFocusNext(e)}
                    inputProps={{
                      sx: placeholderStyle,
                      style: { textAlign: 'right' }
                    }}
                    sx={{
                      ...textFieldStyle,
                      width: 100
                    }}
                    onBlur={() => search(index)}
                  />
                  <TextField
                    {...register(`rows.${index}.name`)}
                    placeholder="商品名"
                    size="small"
                    onKeyDown={(e) => handleEnterFocusNext(e)}
                    inputProps={{
                      sx: placeholderStyle
                    }}
                    sx={{
                      ...textFieldStyle,
                      width: 300
                    }}
                  />
                  <TextField
                    {...register(`rows.${index}.quantity`, {
                      validate: () => validateCheck(index, 'quantity', '半角数字で入力してください')
                    })}
                    error={!!errors?.rows?.[index]?.quantity}
                    helperText={errors?.rows?.[index]?.quantity?.message}
                    placeholder="数量"
                    size="small"
                    onKeyDown={(e) => handleEnterFocusNext(e)}
                    inputProps={{
                      sx: placeholderStyle,
                      style: { textAlign: 'right' }
                    }}
                    sx={{
                      ...textFieldStyle,
                      width: 80
                    }}
                  />
                  <TextField
                    {...register(`rows.${index}.price`, {
                      validate: () => validateCheck(index, 'price', '半角数字で入力してください')
                    })}
                    placeholder="単価"
                    size="small"
                    inputProps={{
                      sx: placeholderStyle,
                      style: { textAlign: 'right' }
                    }}
                    sx={{
                      ...textFieldStyle,
                      width: 100
                    }}
                    onKeyDown={(e) => handleEnterFocusNext(e)}
                  />
                  <Button variant="outlined" onClick={() => InsertRow(index)}>
                    追加
                  </Button>
                  <Button variant="outlined" size="small" onClick={() => RowRemove(index)}>
                    削除
                  </Button>
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
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-around'
                  }}
                >
                  <Button variant="outlined" onClick={() => AddNewForm(20)}>
                    入庫枠追加
                  </Button>
                  <Button variant="outlined" type="submit" endIcon={<SendIcon />}>
                    入庫実行
                  </Button>
                </Box>
                <MyDialog
                  data={getValues('rows')}
                  DialogOpen={DialogOpen}
                  setDialogOpen={setDialogOpen}
                  insertPost={insertPost}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
export default ReceivingPage
