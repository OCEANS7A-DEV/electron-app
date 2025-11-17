// MUIコンポーネント
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// MUIアイコン
import SendIcon from '@mui/icons-material/Send'

import {
  FormValues
} from './types'


interface InsertDialogProps {
  data: any;
  InsertDate: string;
  DialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  insertPost: () => void;
  storeName?: string;
}

const MyDialog = ({
  data,
  InsertDate,
  DialogOpen,
  setDialogOpen,
  insertPost,
  storeName = ''
}: InsertDialogProps) => {
  const DisplayData = data.filter((item: FormValues['rows'][number]) => item?.quantity !== '')
  const DisplayDate = InsertDate.split('/')

  const InsertStart = () => {
    setDialogOpen(false)
    insertPost()
  }


  return (
    <Dialog
      open={DialogOpen}
      onClose={() => setDialogOpen(false)}
      PaperProps={{
        sx: {
          maxWidth: 'calc(100vw - 200px)',
        }
      }}
      fullWidth
    >
      <DialogTitle>入力データを確認してください</DialogTitle>
      <DialogContent>
        <Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              {`${storeName}店: ${DisplayDate[0]}年 ${DisplayDate[1]}月 ${DisplayDate[2]}日 注文`}
            </Typography>
          </Box>
          <Box
            sx={{
              height: 'calc(100vh - 300px)'
            }}
            className="RecevingDialogTable"
          >
            <table
              style={{
                width: '100%'
              }}
            >
              <thead>
                <tr style={{ fontSize: '20px' }}>
                  <th style={{ width: '100px' }}>業者</th>
                  <th style={{ width: '120px' }}>商品コード</th>
                  <th>商品名</th>
                  <th style={{ width: '120px' }}>詳細</th>
                  <th style={{ width: '100px' }}>数量</th>
                  <th style={{ width: '100px' }}>単価</th>
                  <th style={{ width: '120px' }}>個人購入</th>
                  <th style={{ width: '200px' }}>備考</th>
                </tr>
              </thead>
              <tbody>
                {DisplayData.map((row: FormValues['rows'][number], index: number) => (
                  <tr key={index} style={{ fontSize: '18px' }}>
                    <td>{row.vendor}</td>
                    <td style={{ textAlign: 'right' }}>{row.code}</td>
                    <td>{row.name}</td>
                    <td>{row.detail?.label ?? ''}</td>
                    <td style={{ textAlign: 'right' }}>{row.quantity.toLocaleString()}</td>
                    <td style={{ textAlign: 'right' }}>{row.price.toLocaleString()}</td>
                    <td>{row.person}</td>
                    <td>{row.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={InsertStart}
          endIcon={<SendIcon />}
        >
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setDialogOpen(false)}
        >
          Cancell
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MyDialog
