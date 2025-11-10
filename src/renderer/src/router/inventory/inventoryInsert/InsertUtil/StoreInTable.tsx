// React
import React from 'react'

// MUIコンポーネント
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// CSS
import './Dialog.css'

interface ReceivingTableProps {
  DisplayData: any;
  DisplayDate: string[];
  storeName: string;
}

const ReceivingTable = ({
  DisplayData,
  DisplayDate,
  storeName
}: ReceivingTableProps) => {
  return (
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
            <tr style={{fontSize: '20px'}}>
              <th style={{width: '100px'}}>業者</th>
              <th style={{width: '120px'}}>商品コード</th>
              <th>商品名</th>
              <th style={{width: '120px'}}>詳細</th>
              <th style={{width: '100px'}}>数量</th>
              <th style={{width: '100px'}}>単価</th>
              <th style={{width: '120px'}}>個人購入</th>
              <th style={{width: '200px'}}>備考</th> 
            </tr>
          </thead>
          <tbody>
            {DisplayData.map((row, index) => (
              <tr key={index} style={{fontSize: '18px'}}>
                <td>{row.vendor}</td>
                <td style={{textAlign: 'right'}}>{row.code}</td>
                <td>{row.name}</td>
                <td>{row.detail?.label ?? ''}</td>
                <td style={{textAlign: 'right'}}>{row.quantity.toLocaleString()}</td>
                <td style={{textAlign: 'right'}}>{row.price.toLocaleString()}</td>
                <td>{row.person}</td>
                <td>{row.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  )
}

export default ReceivingTable
