import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import SendIcon from '@mui/icons-material/Send'

import type { JSX } from 'react'

// 独自コンポーネント
import LinkBaner from '../../../comp/Linkbanar'
import WordSearch from '../../../comp/ProductSearchWord'
import RowComp from './RowComp'
import MyDialog from './Dialog'

// トースト通知コンポーネント
import { Toaster } from 'react-hot-toast'

import { useLogic } from './useLogic'

const MovingPage = (): JSX.Element => {
  const {
    RegisterData,
    fields,
    register,
    control,
    handleSubmit,
    onSubmit,
    storeList,
    handleEnterFocusNext,
    search,
    handleSelectChange,
    RowRemove,
    addNewForm,
    insertPost,
    getValues,
    DialogOpen,
    setDialogOpen
  } = useLogic()
  return (
    <Box>
      <Box>
        <LinkBaner id="zaiko" />
        <Toaster />
      </Box>
      <Box
        sx={{
          display: 'flex'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            paddingTop: '80px'
          }}
        >
          <Box>
            <WordSearch RegisterData={RegisterData} />
          </Box>
          <Box
            component="form"
            sx={{
              paddingLeft: '20px',
              color: 'white',
              paddingBottom: '70px'
            }}
            onSubmit={handleSubmit(onSubmit)}
          >
            {fields.map((field, index) => (
              <Box key={field.id}>
                <RowComp
                  index={index}
                  register={register}
                  control={control}
                  storeList={storeList}
                  handleEnterFocusNext={handleEnterFocusNext}
                  search={search}
                  handleSelectChange={handleSelectChange}
                  RowRemove={RowRemove}
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
                DialogOpen={DialogOpen}
                setDialogOpen={setDialogOpen}
                insertPost={insertPost}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default MovingPage
