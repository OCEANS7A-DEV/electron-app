// ConfirmDialog.tsx
import React from 'react';
//import ReactDOM from 'react-dom';


import '../css/orderDialog.css';

interface ConfirmDialogProps {
  tableData: Array<any>;
  storeName: string;
}

const StoreDialogTable: React.FC<ConfirmDialogProps> = ({tableData, storeName}) => {
  return (
    <div className="modal-dialog-table-area">
      <table className='data-table'>
        <thead>
          <tr>
            <th className='dtvendor'>業者</th>
            <th className='dtcode'>商品コード</th>
            <th className='dtname'>商品名</th>
            <th className='dtdetail'>詳細</th>
            <th className='dtquantity'>数量</th>
            <th className='dtperson'>個人</th>
            <th className='dtremarks'>備考</th>
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
                <td className='dtvendor'>{row.vendor}</td>
                <td className='dtcode' style={{ textAlign:"right"}}>{row.code}</td>
                <td className='dtname'>{row.name}</td>
                <td className='dtdetail'>{row.detail?.value}</td>
                <td className='dtquantity' style={{ textAlign:"right"}}>{Number(row.quantity).toLocaleString()}</td>
                <td className='dtperson'>{row.person}</td>
                <td className='dtremarks'>{row.remarks}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default StoreDialogTable;
