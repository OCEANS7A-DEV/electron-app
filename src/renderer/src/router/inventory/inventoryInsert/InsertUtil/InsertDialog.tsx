// React
import React from 'react'

// MUIコンポーネント
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'

// MUIアイコン
import SendIcon from '@mui/icons-material/Send'

// CSS
import './Dialog.css'

// テーブルコンポーネント
import ReceivingTable from './ReceivingTable'
import StoreInTable from './StoreInTable'


interface InsertDialogProps {
  data: any;
  InsertDate: string;
  DialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  insertPost: () => void;
  tableType: string;
  storeName?: string;
}

const InsertDialog = ({
  data,
  InsertDate,
  DialogOpen,
  setDialogOpen,
  insertPost,
  tableType,
  storeName = ''
}: InsertDialogProps) => {
  const DisplayData = data.filter((item) => item.quantity !== '')
  const DisplayDate = InsertDate.split('-')

  const InsertStart = () => {
    insertPost()
    setDialogOpen(false)
  }

  const TableComponent = () => {
    if (tableType == 'receiving') {
      return (
        <ReceivingTable
          DisplayData={DisplayData}
          DisplayDate={DisplayDate}
        />
      )
    } else if (tableType == 'storeIn') {
      return (
        <StoreInTable
          DisplayData={DisplayData}
          DisplayDate={DisplayDate}
          storeName={storeName}
        />
      )
    }
    return (<></>)
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
        <TableComponent />
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

export default InsertDialog
