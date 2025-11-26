// 最初にページ用コンポーネントの名前を変える
import type { JSX } from 'react'

import Box from '@mui/material/Box'

import { useLogic } from './useLogic'

const Page = (): JSX.Element => {
  const {
  } = useLogic()
  return (
    <Box>
    </Box>
  )
}

export default Page
