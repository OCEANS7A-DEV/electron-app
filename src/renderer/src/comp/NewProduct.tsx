import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
//import { Button } from '@mui/material'
import '../css/orderDialog.css'
import Select from '@mui/material/Select'
import { MenuItem, TextField } from '@mui/material'

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

// interface ConfirmDialogProps {
//   addRowNumber: number;
// }

type Option = { value: string; label: string; id: string };

interface Props {
  addRowNumber: number
}

const AddProductDialogTable = forwardRef(({ addRowNumber }: Props, ref) => {
  console.log(addRowNumber)
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

  const [data, setData] = useState<any[]>([])

  const [types, setTypes] = useState<Option[]>([])

  const [codeColor, setCodeColor] = useState('black')
  const [codeError, setCodeError] = useState('')

  //const [Lists, setLists] = useState([])

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

  useImperativeHandle(ref, () => ({
    getFormData: () => getValues()
  }))

  const dataSet = async () => {
    const data = await window.myInventoryAPI.ListData()
    //console.log(data)
    setData(data)

  }

  useEffect(() => {
    typesGet()
    dataSet()
    //Products()
  }, [])

  const productReSearch = async(codeS) => {
    const result = data.find((item) => item.code == Number(codeS))
    if (result){
      setCodeColor('red')
      setCodeError('このコードは使用できません')
    } else {
      setCodeColor('black')
      setCodeError('使用できます')
    }
  }

  const { register, getValues, control } = useForm<FormValues>({ defaultValues });

  return (
    <div className="modal-dialog-newProduct">
      <div className="newProductInputArea">

        {/* <div className="newProductInsert">
          <div>店販価格(税込):</div>
          <input style={{ height: 32 }} {...register('vendor')} />
        </div> */}

        <div className="newProductInsert">
          <div className="newProductLabel">商品コード:</div>
          <input
            style={{ height: 32, color: codeColor }}
            {...register('code')}
            onChange={(e) => productReSearch(e.target.value)}
            title={codeError}
          />
        </div>

        <div className="newProductInsert">
          <div className="newProductLabel">商品名:</div>
          <input style={{ height: 32 }} {...register('name')} />
        </div>

        <div className="newProductInsert">
          <div className="newProductLabel">商品単価:</div>
          <input style={{ height: 32 }} {...register('newPrice')} />
        </div>

        <div className="newProductInsert">
          <div className="newProductLabel">VC価格:</div>
          <input style={{ height: 32 }} {...register('VCPrice')} />
        </div>

        <div className="newProductInsert">
          <div className="newProductLabel">店販価格(税込):</div>
          <input style={{ height: 32 }} {...register('valuePrice')} />
        </div>

        <div className="newProductInsert">
          <div className="newProductLabel">商品タイプ:</div>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                value={field.value?.value || ''} // 初期値が undefined でも警告が出ないように
                onChange={(e) => {
                  const selected = types.find((t) => t.value === e.target.value) || null;
                  field.onChange(selected);
                }}
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
              </Select>
            )}
          />
        </div>

        <div className="newProductInsert">
          <div className="newProductLabel">注文単位:</div>
          <input style={{ height: 32 }} {...register('orderNum')} />
        </div>

        <div className="newProductInsert">
          <div className="newProductLabel">サービス単位:</div>
          <input style={{ height: 32 }} {...register('service')} />
        </div>

        <div className="newProductInsert">
          <div className="newProductLabel">備考:</div>
          <TextField
            {...register('remarks')}
            multiline
          />
        </div>
      </div>
    </div>
  )
})

export default AddProductDialogTable;
