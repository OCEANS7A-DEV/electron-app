import Box from '@mui/material/Box'


// 独自コンポーネント
import LinkBaner from '../../../comp/Linkbanar'
import WordSearch from '../../../comp/ProductSearchWord'
//import MyDialog from './Dialog'

// トースト通知コンポーネント
import { Toaster } from 'react-hot-toast'

import { useLogic } from './useLogic'

const MovingPage = () => {
  const {
    RegisterData
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
            paddingTop: '130px'
          }}
        >
          <WordSearch RegisterData={RegisterData} />
          <Box
            sx={{
              paddingLeft: '20px',
              color: 'white'
            }}
          >
            idou
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default MovingPage