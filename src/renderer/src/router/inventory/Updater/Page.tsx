import type { JSX } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { useLogic } from './useLogic'

const UpdatePage = (): JSX.Element => {
  const { number, message, status } = useLogic()

  return (
    <>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexFlow: 'column',
          color: 'white'
        }}
      >
        <Box>
          {status === 'start' ? (
            <Box>
              <CircularProgress size="3rem" />
            </Box>
          ) : status === 'downloading' ? (
            <Box>
              <CircularProgress variant="determinate" value={number} />
            </Box>
          ) : null}
        </Box>
        <Box>{message}</Box>
      </Box>
    </>
  )
}

export default UpdatePage
