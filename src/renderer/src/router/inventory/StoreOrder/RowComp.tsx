// 行コンポーネントを書く

import React from 'react'

// MUI
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { Controller } from 'react-hook-form'
import { RowProps } from './types'


const RowComp = React.memo(() => {
  return (
    <Box
      sx={{
        paddingTop: '6px',
        paddingLeft: '10px',
        display: 'flex'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '12px',
          justifyContent: 'right',
          alignItems: 'center',
          paddingRight: '6px',
          color: 'white'
        }}
      >
        <Typography>{index + 1}</Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '4px',
          width: '100px'
        }}
      >
        <TextField
          {...register(`rows.${index}.vendor`)}
          size="small"
          placeholder="業者名"
          onKeyDown={(e) => handleEnterFocusNext(e)}
        />
      </Box>
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '4px',
          width: '110px',
          marginLeft: '8px'
        }}
      >
        <TextField
          {...register(`rows.${index}.code`)}
          size="small"
          placeholder="商品コード"
          slotProps={{
            htmlInput: {
              style: { textAlign: 'right' }
            }
          }}
          onKeyDown={(e) => handleEnterFocusNext(e)}
          onBlur={() => productCodeSearch(index)}
        />
      </Box>
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '4px',
          width: '280px',
          marginLeft: '8px'
        }}
      >
        <TextField
          fullWidth
          {...register(`rows.${index}.name`)}
          size="small"
          placeholder="商品名"
          onKeyDown={(e) => handleEnterFocusNext(e)}
        />
      </Box>
      <Box
        sx={{
          borderRadius: '4px',
          marginLeft: '8px',
          backgroundColor: 'white'
        }}
      >
        <DetailSelectBox
          control={control}
          index={index}
          handleEnterFocusNext={handleEnterFocusNext}
        />
      </Box>
      <Box
        sx={{
          borderRadius: '4px',
          marginLeft: '8px',
          backgroundColor: 'white',
          width: '80px'
        }}
      >
        <TextField
          {...register(`rows.${index}.quantity`)}
          size="small"
          placeholder="数量"
          onKeyDown={(e) => handleEnterFocusNext(e)}
          slotProps={{
            htmlInput: {
              style: { textAlign: 'right' }
            }
          }}
        />
      </Box>
      <Box
        sx={{
          borderRadius: '4px',
          marginLeft: '8px',
          backgroundColor: 'white',
          width: '100px'
        }}
      >
        <TextField
          {...register(`rows.${index}.price`)}
          size="small"
          placeholder="単価"
          onKeyDown={(e) => handleEnterFocusNext(e)}
          slotProps={{
            htmlInput: {
              style: { textAlign: 'right' }
            }
          }}
        />
      </Box>
      <Box
        sx={{
          borderRadius: '4px',
          marginLeft: '8px',
          backgroundColor: 'white',
          width: '100px'
        }}
      >
        <TextField
          {...register(`rows.${index}.person`)}
          size="small"
          placeholder="個人購入"
          onKeyDown={(e) => handleEnterFocusNext(e)}
        />
      </Box>
      <Box
        sx={{
          borderRadius: '4px',
          marginLeft: '8px',
          backgroundColor: 'white',
          width: '160px'
        }}
      >
        <TextField
          {...register(`rows.${index}.remarks`)}
          size="small"
          placeholder="備考"
          onKeyDown={(e) => handleEnterFocusNext(e)}
        />
      </Box>
      <Box
        sx={{
          marginLeft: '8px',
          whiteSpace: 'nowrap'
        }}
      >
        <Button variant="outlined" onClick={() => insertRow(index)}>
          追加
        </Button>
        <Button variant="outlined" onClick={() => deleteRow(index)}>
          削除
        </Button>
      </Box>
    </Box>
  )
})

export default RowComp