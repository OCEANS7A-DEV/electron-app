import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@mui/material'
import '../css/orderDialog.css'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { MenuItem } from '@mui/material'

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

  const [types, setTypes] = useState([])

  const typesGet = async () => {
    const list = await window.myInventoryAPI.storeGet('types')
    const filtered = list.types.filter(item => item[0] !== '')
    console.log(filtered)
    const setdata = filtered.map(item => {
      const result = {
        value: item[1],
        label: item[1],
        id: item[0]
      }
      return result
    })
    setTypes(setdata)
  }

  useEffect(() => {
    typesGet()
  },[])

  const { register, getValues } = useForm<FormValues>({ defaultValues });

  const Add = () => {
    console.log(getValues());
    console.log(addRowNumber);
  };

  return (
    <div className="modal-dialog-newProduct">
      <div style={{ width: '50%' }}>

        {/* <div className="newProductInsert">
          <div>店販価格(税込):</div>
          <input style={{ height: 32 }} {...register('vendor')} />
        </div> */}

        <div className="newProductInsert">
          <div>商品コード:</div>
          <input style={{ height: 32 }} {...register('code')} />
        </div>

        <div className="newProductInsert">
          <div>商品名:</div>
          <input style={{ height: 32 }} {...register('name')} />
        </div>

        <div className="newProductInsert">
          <div>商品単価:</div>
          <input style={{ height: 32 }} {...register('newPrice')} />
        </div>

        <div className="newProductInsert">
          <div>VC価格:</div>
          <input style={{ height: 32 }} {...register('VCPrice')} />
        </div>

        <div className="newProductInsert">
          <div>店販価格(税込):</div>
          <input style={{ height: 32 }} {...register('valuePrice')} />
        </div>

        <div className="newProductInsert">
          <div>商品タイプ:</div>
          {/* <Select
            label='タイプ'
            {...register(`rows.type`)}
            displayEmpty
            size="small"
            style={{ width: 120, backgroundColor: 'white' }}
          >
            <MenuItem value="">
              <em>未選択</em>
            </MenuItem>
            {types.map((option) => (
              <MenuItem key={option.value} value={option.value} id={option.id}>
                {option.label}
              </MenuItem>
            ))}
          </Select> */}
        </div>
      </div>
      

      {/* <Button variant="outlined" onClick={Add}>test</Button> */}
    </div>
  );
};

export default AddProductDialogTable;
