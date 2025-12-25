// MUIコンポーネント
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import { DialogRowTypes, DialogProps } from './types'

import styles from './style.module.css'

const MyDialog = ({
  data,
  InsertDate,
  DialogOpen,
  setDialogOpen,
  insertPost,
  storeName = ''
}: DialogProps) => {

  const InsertStart = (): void => {
    setDialogOpen(false)
    insertPost()
  }
  return (
    <Dialog
      open={DialogOpen}
      onClose={() => setDialogOpen(false)}
      PaperProps={{
        sx: {
          maxWidth: 'calc(100vw - 200px)'
        }
      }}
      fullWidth
    >
      <DialogTitle>入力データを確認してください</DialogTitle>
      <DialogContent>
        <Box>
          <Box className={styles.DialogTableStyle}>
            <Box className={styles.DialogHeaderStyle}>商品コード</Box>
            <Box className={styles.DialogHeaderStyle}>商品名</Box>
            <Box className={styles.DialogHeaderStyle}>個数</Box>
            <Box className={styles.DialogHeaderStyle}>単価</Box>
            {data
              .filter((row: DialogRowTypes) => row.name !== '')
              .map((row: DialogRowTypes) => (
                <>
                  <Box className={styles.DialogCodeStyle}>{row.code}</Box>
                  <Box className={styles.DialogNameStyle}>{row.name}</Box>
                  <Box className={styles.DialogQuantityStyle}>{row.quantity}</Box>
                  <Box className={styles.DialogPriceStyle}>
                    {Number(row.price).toLocaleString()}
                  </Box>
                </>
              ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={InsertStart} variant="contained">
          送信
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MyDialog
