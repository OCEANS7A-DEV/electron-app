// ConfirmDialog.tsx
import React from 'react';
import ReactDOM from 'react-dom';



import '../css/orderDialog.css';

interface ConfirmDialogProps {
  tableData: Array<any>;
}

const ConfirmDialogTable: React.FC<ConfirmDialogProps> = ({tableData}) => {
  console.log(tableData)
  return (
    <div className="modal-dialog-table-area">
      <table className='data-table'>
        <thead>
          <tr>
            <th className='dtvendor'>業者</th>
            <th className='dtcode'>商品コード</th>
            <th className='dtname'>商品名</th>
            <th className='dtquantity'>数量</th>
            <th className='dtprice'>商品単価</th>
          </tr>
        </thead>
        <tbody>
          {tableData
            .filter((row) => {
              const 商品コード = row.code;
              return 商品コード !== '';
            })
            .map((row, index) => (
              <tr key={index}>
                <td className='dtvendor'>{row.vendor.value}</td>
                <td className='dtcode' style={{ textAlign:"right"}}>{row.code}</td>
                <td className='dtname'>{row.name}</td>
                <td className='dtquantity' style={{ textAlign:"right"}}>{Number(row.quantity).toLocaleString()}</td>
                <td className='dtprice' style={{ textAlign:"right"}}>{Number(row.price).toLocaleString() ?? ''}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConfirmDialogTable;
