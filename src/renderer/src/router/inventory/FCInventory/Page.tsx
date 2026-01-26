import React from 'react'
import type { JSX } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// 自作コンポーネント
import WordSearch from '../../../comp/ProductSearchWord'
import LinkBaner from '../TopBanner/Page'
import RowComp from './RowComp'
import SelectArea from './SelectArea'
import MyDialog from './Dialog'

// MUIアイコン
import SendIcon from '@mui/icons-material/Send'
import { Toaster } from 'react-hot-toast'
import { useLogic } from './useLogic'

const FCInventoryPage = React.memo((): JSX.Element => {
  const {
    RegisterData,
    storenames,
    storeValue,
    handleStoreChange,
    yearList,
    yearValue,
    handleYearChange,
    monthList,
    monthValue,
    handleMonthChange,
    handleEnterFocusNext,
    fields,
    register,
    handleSubmit,
    onSubmit,
    handleRowDelete,
    DialogOpen,
    setDialogOpen,
    insertPost,
    getValues,
    addNewForm,
    Reget
  } = useLogic()
  return (
    <Box>
      <Box>
        <LinkBaner id="zaiko" />
        <Toaster />
      </Box>
      <Box
        sx={{
          paddingTop: '60px',
          paddingLeft: '10px',
          display: 'flex'
        }}
      >
        <Box
          sx={{
            paddingTop: '60px'
          }}
        >
          <WordSearch RegisterData={RegisterData} />
        </Box>
        <Box
          sx={{
            paddingLeft: '20px'
          }}
        >
          <Box
            sx={{
              display: 'flex'
            }}
          >
            <SelectArea
              ListData={yearList}
              labelName="年"
              valueData={yearValue}
              handleValueChange={handleYearChange}
            />
            <SelectArea
              ListData={monthList}
              labelName="月"
              valueData={monthValue}
              handleValueChange={handleMonthChange}
            />
            <SelectArea
              ListData={storenames}
              labelName="店舗"
              valueData={storeValue}
              handleValueChange={handleStoreChange}
            />
            <Button variant="outlined" onClick={Reget}>
              印刷
            </Button>
          </Box>
          <Box
            sx={{
              paddingTop: '12px',
              paddingBottom: '80px'
            }}
          >
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              {fields.map((field, index) => (
                <Box key={field.id}>
                  <RowComp
                    index={index}
                    register={register}
                    handleEnterFocusNext={handleEnterFocusNext}
                    handleRowDelete={handleRowDelete}
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
                    入力枠追加
                  </Button>
                  <Button variant="outlined" endIcon={<SendIcon />} type="submit">
                    送信
                  </Button>
                </Box>
                <MyDialog
                  data={getValues('rows')}
                  InsertDate={`${yearValue}年${monthValue}月`}
                  DialogOpen={DialogOpen}
                  setDialogOpen={setDialogOpen}
                  insertPost={insertPost}
                  storeName={storeValue}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
})

export default FCInventoryPage
