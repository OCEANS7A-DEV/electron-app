import type { JSX } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// 独自コンポーネント
import LinkBaner from '../../../comp/Linkbanar'
//import RowComp from './RowComp'

import { useLogic } from './useLogic'
import { ColumnSize } from './logic'

// トースト通知コンポーネント
import { Toaster } from 'react-hot-toast'

const NetOrderPage = (): JSX.Element => {
  const { URLs } = useLogic()
  return (
    <Box>
      <Box>
        <LinkBaner id="zaiko" />
        <Toaster />
      </Box>
      <Box
        sx={{
          paddingTop: '80px',
          paddingLeft: '40px'
        }}
      >
        <Box
          sx={{
            backgroundColor: 'white',
            width: '564px'
          }}
        >
          <Box
            sx={{
              height: '36px',
              display: 'grid',
              gap: '1px',
              fontSize: '18px',
              padding: '1px 1px 0px 1px',
              fontWeight: 'bold',
              ...ColumnSize
            }}
          >
            <Box
              sx={{
                border: '1px solid black',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor: 'white',
                paddingLeft: '8px'
              }}
            >
              業者名
            </Box>
            <Box
              sx={{
                border: '1px solid black',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'white',
                textAlign: 'center',
                paddingLeft: '8px'
              }}
            >
              URL
            </Box>
          </Box>
          {URLs.map((row: string[], index: number) => (
            <Box
              key={index}
              sx={{
                height: '36px',
                display: 'grid',
                gap: '1px',
                fontSize: '14px',
                padding: '1px 1px 0px 1px',
                fontWeight: 'bold',
                ...ColumnSize
              }}
            >
              <Box
                sx={{
                  border: '1px solid black',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  paddingLeft: '8px'
                }}
              >
                {row[0]}
              </Box>
              <Box
                sx={{
                  border: '1px solid black',
                  backgroundColor: 'white',
                  paddingLeft: '8px',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap'
                }}
              >
                <Button variant="text" href={row[1]} target="_blank">
                  {row[1]}
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default NetOrderPage
