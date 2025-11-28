// 行コンポーネントを書く
import React from 'react'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import { Controller } from 'react-hook-form'
import { RowProps } from './types'

const RowComp = React.memo(
  ({
    index,
    register,
    control,
    handleSelectChange,
    handleEnterFocusNext,
    search,
    errors,
    InsertRow,
    RowRemove,
    placeholderStyle,
    VendorList,
    textFieldStyle,
    validateCheck
  }: RowProps) => {
    return (
      <Box
        sx={{
          display: 'flex'
        }}
      >
        <Box
          sx={{
            width: 120
          }}
        >
          <FormControl fullWidth>
            <Controller
              name={`rows.${index}.vendor`}
              control={control}
              render={({ field }) => (
                <Select
                  size="small"
                  onChange={(e) => handleSelectChange(e, index)}
                  value={field.value?.value || ''}
                  onBlur={field.onBlur}
                  sx={{
                    ...textFieldStyle,
                    textAlign: 'right'
                  }}
                >
                  <MenuItem value=""></MenuItem>
                  {VendorList.map((Vdata) => (
                    <MenuItem value={Vdata.value} key={Vdata.id}>
                      {Vdata.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Box>
        <TextField
          {...register(`rows.${index}.code`, {
            validate: () => validateCheck(index, 'code', '半角英数字で入力してください')
          })}
          placeholder="商品コード"
          size="small"
          onKeyDown={(e) => handleEnterFocusNext(e)}
          inputProps={{
            sx: placeholderStyle,
            style: { textAlign: 'right' }
          }}
          sx={{
            ...textFieldStyle,
            width: 100
          }}
          onBlur={() => search(index)}
        />
        <TextField
          {...register(`rows.${index}.name`)}
          placeholder="商品名"
          size="small"
          onKeyDown={(e) => handleEnterFocusNext(e)}
          inputProps={{
            sx: placeholderStyle
          }}
          sx={{
            ...textFieldStyle,
            width: 300
          }}
        />
        <TextField
          {...register(`rows.${index}.quantity`, {
            validate: () => validateCheck(index, 'quantity', '半角数字で入力してください')
          })}
          error={!!errors?.rows?.[index]?.quantity}
          helperText={errors?.rows?.[index]?.quantity?.message}
          placeholder="数量"
          size="small"
          onKeyDown={(e) => handleEnterFocusNext(e)}
          inputProps={{
            sx: placeholderStyle,
            style: { textAlign: 'right' }
          }}
          sx={{
            ...textFieldStyle,
            width: 80
          }}
        />
        <TextField
          {...register(`rows.${index}.price`, {
            validate: () => validateCheck(index, 'price', '半角数字で入力してください')
          })}
          placeholder="単価"
          size="small"
          inputProps={{
            sx: placeholderStyle,
            style: { textAlign: 'right' }
          }}
          sx={{
            ...textFieldStyle,
            width: 100
          }}
          onKeyDown={(e) => handleEnterFocusNext(e)}
        />
        <Button variant="outlined" onClick={() => InsertRow(index)}>
          追加
        </Button>
        <Button variant="outlined" size="small" onClick={() => RowRemove(index)}>
          削除
        </Button>
      </Box>
    )
  }
)

export default RowComp
