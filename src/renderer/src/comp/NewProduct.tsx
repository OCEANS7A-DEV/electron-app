import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@mui/material'
import '../css/orderDialog.css'

type FormValues = {
  vendor: { value: string, label: string, id: string } | null;
  code: string;
  name: string;
  defPrice: string;
  newPrice: string;
  VCPrice: string;
  valuePrice: string;
  type: { value: string, label: string, id: string } | null;
  remarks: string;
  possibility: boolean;
  service: string;
  orderNum: string;
};

interface ConfirmDialogProps {
  addRowNumber: number;
}

const AddProductDialogTable: React.FC<ConfirmDialogProps> = ({ addRowNumber }) => {
  const defaultValues: FormValues = {
    vendor: null,
    code: '',
    name: '',
    defPrice: '',
    newPrice: '',
    VCPrice: '',
    valuePrice: '',
    type: null,
    remarks: '',
    possibility: false,
    service: '',
    orderNum: ''
  };

  const { register, getValues } = useForm<FormValues>({ defaultValues });

  const Add = () => {
    console.log(getValues());
    console.log(addRowNumber);
  };

  return (
    <div className="modal-dialog-table-area">
      <div style={{ display: 'flex', gap: 8 }}>
        <div>商品コード:</div>
        <input style={{ height: 32 }} {...register('code')} />
      </div>

      <div>
        <input style={{ height: 32 }} {...register('name')} />
      </div>

      <Button variant="outlined" onClick={Add}>test</Button>
    </div>
  );
};

export default AddProductDialogTable;
