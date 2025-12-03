import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import React from 'react'

import { RowProps } from './types'

const RowComp = React.memo(({ index, register }: RowProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexFlow: 'column',
        paddingBottom: '8px',
        whiteSpace: 'nowrap'
      }}
    >
      <Box
        sx={{
          width: '120px',
          backgroundColor: 'white',
          borderRadius: '4px'
        }}
      >
        <TextField
          {...register(`rows.${index}.code`)}
          fullWidth
          placeholder="商品コード"
          variant="outlined"
          inputProps={{ style: { textAlign: 'right', fontSize: 16 } }}
          size="small"
        />
      </Box>
    </Box>
  )
})

export default RowComp
