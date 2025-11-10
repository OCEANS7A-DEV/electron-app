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
}

const ReceivingTable = ({ DisplayData, DisplayDate }: ReceivingTableProps) => {
  return (
    <Box>
      <Box>
        <Typography variant="h6" gutterBottom>
          入庫日: {`${DisplayDate[0]}年 ${DisplayDate[1]}月 ${DisplayDate[2]}日`}
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
              <th style={{width: '100px'}}>数量</th>
              <th style={{width: '100px'}}>単価</th>
            </tr>
          </thead>
          <tbody>
            {DisplayData.map((row, index) => (
              <tr key={index} style={{fontSize: '18px'}}>
                <td>{row.vendor.label}</td>
                <td style={{textAlign: 'right'}}>{row.code}</td>
                <td>{row.name}</td>
                <td style={{textAlign: 'right'}}>{row.quantity.toLocaleString()}</td>
                <td style={{textAlign: 'right'}}>{row.price.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  )
}

export default ReceivingTable
