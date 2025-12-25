import Box from '@mui/material/Box'
import type { JSX } from 'react'
import { shortageType, ETCPrintProps } from './types'

const ETCPrint = ({ data }: ETCPrintProps): JSX.Element => {
  return (
    <Box sx={{ width: '100%', breakInside: 'avoid' }}>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: '100px', padding: '8px', border: '1px black solid' }}>業者</Box>
        <Box sx={{ width: '100px', padding: '8px', border: '1px black solid' }}>コード</Box>
        <Box sx={{ width: '400px', padding: '8px', border: '1px black solid' }}>商品名</Box>
        <Box sx={{ width: '100px', padding: '8px', border: '1px black solid' }}>不足数</Box>
      </Box>
      {data.map((row: shortageType, index: number) => (
        <Box key={index} sx={{ display: 'flex' }}>
          <Box sx={{ width: '100px', border: '1px black solid', padding: '8px' }}>{row[0]}</Box>
          <Box sx={{ width: '100px', border: '1px black solid', padding: '8px' }}>{row[1]}</Box>
          <Box
            sx={{
              width: '400px',
              border: '1px black solid',
              padding: '8px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {row[2]}
          </Box>
          <Box sx={{ width: '100px', border: '1px black solid', padding: '8px' }}>
            {Number(row[14]) * -1}
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default ETCPrint
