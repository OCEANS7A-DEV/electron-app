import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import React from 'react'
import { RowProps } from './types'
import styles from './style.module.css'

const RowComp = React.memo(
  ({ index, register, handleEnterFocusNext, handleRowDelete }: RowProps) => {
    return (
      <Box className={styles.rowCompStyle}>
        <Box className={styles.columnCodeStyle}>
          <TextField
            className={styles.inputCodeStyle}
            {...register(`rows.${index}.code`)}
            fullWidth
            placeholder="商品コード"
            variant="outlined"
            size="small"
            onKeyDown={(e) => handleEnterFocusNext(e)}
          />
        </Box>
        <Box className={styles.columnNameStyle}>
          <TextField
            className={styles.inputNameStyle}
            placeholder="商品名"
            {...register(`rows.${index}.name`)}
            size="small"
            onKeyDown={(e) => handleEnterFocusNext(e)}
          />
        </Box>
        <Box className={styles.columnQuantityStyle}>
          <TextField
            className={styles.inputQuantityStyle}
            placeholder="個数"
            {...register(`rows.${index}.quantity`)}
            size="small"
            onKeyDown={(e) => handleEnterFocusNext(e)}
          />
        </Box>
        <Box className={styles.columnPriceStyle}>
          <TextField
            className={styles.inputPriceStyle}
            placeholder="単価"
            {...register(`rows.${index}.price`)}
            size="small"
            onKeyDown={(e) => handleEnterFocusNext(e)}
          />
        </Box>
        <Box>
          <Button variant="outlined" onClick={() => handleRowDelete(index)}>
            削除
          </Button>
        </Box>
      </Box>
    )
  }
)

export default RowComp
