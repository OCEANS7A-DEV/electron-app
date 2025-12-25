// React
import type { JSX } from 'react'
import { useLogic } from './useLogic'

// MUIコンポーネント
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// MUIアイコン
import SendIcon from '@mui/icons-material/Send'

// 独自コンポーネント
import LinkBaner from '../TopBanner/Page'
import WordSearch from '../../../comp/ProductSearchWord'
import MyDialog from './Dialog'
import RowComp from './RowComp'

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
                  <RowComp
                    index={index}
                    register={register}
                    control={control}
                    handleSelectChange={handleSelectChange}
                    handleEnterFocusNext={handleEnterFocusNext}
                    search={search}
                    errors={errors}
                    InsertRow={InsertRow}
                    RowRemove={RowRemove}
                    placeholderStyle={placeholderStyle}
                    VendorList={VendorList}
                    textFieldStyle={textFieldStyle}
                    validateCheck={validateCheck}
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
