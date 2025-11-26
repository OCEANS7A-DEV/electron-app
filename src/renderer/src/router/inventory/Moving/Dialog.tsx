// MUIコンポーネント
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// MUIアイコン
import SendIcon from '@mui/icons-material/Send'

import type { JSX } from 'react'

import { InsertDialogProps } from './types'

import './style.css'

import dayjs from 'dayjs'
dayjs.locale('ja')

const MyDialog = ({
  data,
  DialogOpen,
  setDialogOpen,
  insertPost
}: InsertDialogProps): JSX.Element => {
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
        <Box
          sx={{
            minHeight: '60px'
          }}
        >
          <table className="Receiving-Insert-Dialog">
            <thead>
              <tr>
                <th className="Date">日付</th>
                <th className="OutStore">出庫店舗</th>
                <th className="InStore">入庫店舗</th>
                <th className="Code">商品コード</th>
                <th className="Name">商品名</th>
                <th className="Num">数量</th>
                <th className="Price">単価</th>
              </tr>
            </thead>
            <tbody>
              {data
                .filter((item) => item.code !== '')
                .map((row, index) => (
                  <tr key={index}>
                    <td className="Date">{dayjs(row.date).format('YYYY/MM/DD')}</td>
                    <td className="OutStore">{row.outStore?.label ?? ''}</td>
                    <td className="InStore">{row.inputStore?.label ?? ''}</td>
                    <td className="Code">{row.code}</td>
                    <td className="Name">{row.name}</td>
                    <td className="Num">{row.quantity}</td>
                    <td className="Price">{Number(row.price).toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={InsertStart} endIcon={<SendIcon />}>
          OK
        </Button>
        <Button variant="contained" color="error" onClick={() => setDialogOpen(false)}>
          Cancell
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MyDialog
