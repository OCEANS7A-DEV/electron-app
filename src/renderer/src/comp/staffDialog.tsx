import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import '../css/orderDialog.css'
import { FormControl, MenuItem, TextField, Button } from '@mui/material'
import '../css/uriage.css'
import '../css/newStaff.css'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import { getAddress } from 'jposta'


import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/ja'

dayjs.locale('ja')


type FormValues = {
  id: string
  topName: string
  endName: string
  storeid: string
  store: string
  postNumber: string
  address: string
  afterAddress: string
  rank: string
  joined: string | Date
  status: string
  gender: string | number
}

type storeType = {
  value: string
  label: string
  id: string
}

interface Props {
  data: FormValues
  stores?: storeType[]
  Insert: () => void
}



const StaffDialogTable = forwardRef(({ data, Insert, stores = [] }: Props, ref) => {
  console.log(stores)
  console.log(data)
  const defaultValues: FormValues = {
    id: data.id,
    topName: data.topName,
    endName: data.endName,
    storeid: data.storeid,
    store: data.store,
    postNumber: data.postNumber,
    address: data.address,
    afterAddress: data.afterAddress,
    rank: data.rank,
    joined: data.joined,
    status: data.status,
    gender: ''
  }
  const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs(new Date(data.joined)));

  const { control, register, getValues, watch, setValue } = useForm<FormValues>({ defaultValues })
  const gender = [
    { id: 1, label: '男性', value: '男性' },
    { id: 2, label: '女性', value: '女性' }
  ]
  const watchedpostNumber = watch('postNumber')
  const AddressSearch = async (number) => {
    if (!number || number.length < 7) {
      return
    }
    const addressData = await getAddress(number)
    setValue('address', `${addressData?.pref}${addressData?.city}${addressData?.area}`)
  }

  useEffect(() => {
    AddressSearch(watchedpostNumber)
  }, [watchedpostNumber])

  useImperativeHandle(ref, () => ({
    getFormData: () => getValues()
  }))

  useEffect(() => {
    setValue('joined', dateValue?.toDate()?.toLocaleDateString() || '')
  }, [dateValue])

  return (
    <div className="modal-dialog-HQdetail">
      <div className="HQdetail-window">
        <div className="HQdetail-window-title">
          <div>スタッフデータ</div>
        </div>
        <form className="p-4">
          <div className="newStaff-Input-area" style={{ paddingTop: 20 }}>
            <div className="newStaff-Name-area">
              <TextField
                type="text"
                label="氏"
                {...register('topName')}
                className="newStaff-Name-input"
              />
              <TextField
                type="text"
                label="名"
                {...register('endName')}
                className="newStaff-Name-input"
              />
            </div>
            <div className="newStaff-Store-area">
              <Controller
                name="storeid"
                control={control}
                render={({ field }) => (
                  <FormControl size="small" style={{ width: 120, backgroundColor: 'white' }}>
                    <InputLabel id="store-select-label">店舗</InputLabel>
                    <Select
                      labelId="store-select-label"
                      label="店舗"
                      {...field}
                      displayEmpty
                    >
                      {stores.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
                <DatePicker
                  label="入社日"
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      sx: {
                        fontSize: '1rem',
                        '& input': {
                          height: '1.5em',
                        },
                        width: '150px',
                      },
                    },
                  }}
                  value={dateValue}
                  onChange={(e) => setDateValue(e)}
                />
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <FormControl size="small" style={{ width: 120, backgroundColor: 'white' }}>
                      <InputLabel id="gender-select-label">性別</InputLabel>
                      <Select
                        labelId="gender-select-label"
                        label="性別"
                        {...field}
                        displayEmpty
                      >
                        {gender.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </LocalizationProvider>
            </div>
            <div className="newStaff-Input">
              <TextField
                type="text"
                label="郵便番号"
                {...register('postNumber')}
                className="newStaff-Post-input"
              />
            </div>
            <div className="newStaff-Input">
              <TextField
                type="text"
                label="住所"
                {...register('address')}
                multiline
                className="newStaff-Post-input"
                fullWidth
              />
            </div>
            <div className="newStaff-Input">
              <TextField
                type="text"
                label="住所(建物名等)"
                {...register('afterAddress')}
                multiline
                className="newStaff-Post-input"
                fullWidth
              />
            </div>
          </div>
        </form>
        <div className="HQdetail-button-area">
          <Button variant="outlined" onClick={Insert}>
            データを追加
          </Button>
        </div>
      </div>
    </div>
  )
})

export default StaffDialogTable
