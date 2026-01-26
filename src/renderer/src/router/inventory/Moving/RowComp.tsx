import React from 'react'

import { Controller } from 'react-hook-form'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
// MUI
import Autocomplete from '@mui/material/Autocomplete'

import { RowProps } from './types'

const RowComp = React.memo(
  ({
    index,
    register,
    control,
    storeList,
    handleEnterFocusNext,
    search,
    handleSelectChange,
    RowRemove
  }: RowProps) => {
    return (
      <Box
        sx={{
          display: 'flex',
          marginBottom: '10px'
        }}
      >
        <Box
          sx={{
            marginRight: '10px',
            backgroundColor: 'white',
            borderRadius: '4px'
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
            <Controller
              name={`rows.${index}.date`}
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={field.value ?? null}
                  onChange={(newValue: any) => field.onChange(newValue)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      sx: {
                        fontSize: '1rem',
                        '& input': {
                          height: '1.5em'
                        },
                        width: '150px'
                      }
                    }
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </Box>
        <Box
          sx={{
            marginRight: '10px',
            backgroundColor: 'white',
            borderRadius: '4px',
            width: '120px'
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">出庫</InputLabel>
            <Controller
              name={`rows.${index}.outStore`}
              control={control}
              render={({ field }) => (
                <Select
                  size="small"
                  onChange={(e) => handleSelectChange(e, index, 'out')}
                  value={field.value?.value || ''}
                  onBlur={field.onBlur}
                  sx={{
                    textAlign: 'right'
                  }}
                >
                  <MenuItem value=""></MenuItem>
                  {storeList.map((Vdata) => (
                    <MenuItem value={Vdata.value} key={Vdata.id}>
                      {Vdata.label}
                    </MenuItem>
                  ))}
                </Select>
                // <Autocomplete
                //   options={storeList}
                //   getOptionLabel={(option) => option.label || ''}
                //   isOptionEqualToValue={(option, value) => option.value === value?.value}
                //   value={field.value || null}
                //   onChange={(_, newValue) => field.onChange(newValue)}
                //   onKeyDown={(e) => handleEnterFocusNext(e)}
                //   openOnFocus
                //   autoHighlight
                //   renderInput={(params) => (
                //     <TextField {...params} label="詳細" size="small" style={{ width: 120, height: 38 }} />
                //   )}
                // />
              )}
            />
          </FormControl>
        </Box>
        <Box
          sx={{
            marginRight: '10px',
            backgroundColor: 'white',
            borderRadius: '4px',
            width: '120px'
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">入庫</InputLabel>
            <Controller
              name={`rows.${index}.inputStore`}
              control={control}
              render={({ field }) => (
                <Select
                  size="small"
                  onChange={(e) => handleSelectChange(e, index, 'in')}
                  value={field.value?.value || ''}
                  onBlur={field.onBlur}
                  sx={{
                    textAlign: 'right'
                  }}
                >
                  <MenuItem value=""></MenuItem>
                  {storeList.map((Vdata) => (
                    <MenuItem value={Vdata.value} key={Vdata.id}>
                      {Vdata.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Box>
        <Box
          sx={{
            marginRight: '10px',
            backgroundColor: 'white',
            borderRadius: '4px',
            width: '120px'
          }}
        >
          <TextField
            {...register(`rows.${index}.code`)}
            placeholder="コード"
            size="small"
            onKeyDown={(e) => handleEnterFocusNext(e)}
            onBlur={() => search(index)}
          />
        </Box>
        <Box
          sx={{
            marginRight: '10px',
            backgroundColor: 'white',
            borderRadius: '4px',
            width: '300px'
          }}
        >
          <TextField
            fullWidth
            {...register(`rows.${index}.name`)}
            placeholder="商品名"
            size="small"
            onKeyDown={(e) => handleEnterFocusNext(e)}
          />
        </Box>
        <Box
          sx={{
            marginRight: '10px',
            backgroundColor: 'white',
            borderRadius: '4px',
            width: '80px'
          }}
        >
          <TextField
            fullWidth
            {...register(`rows.${index}.quantity`)}
            placeholder="数量"
            size="small"
            onKeyDown={(e) => handleEnterFocusNext(e)}
          />
        </Box>
        <Box
          sx={{
            marginRight: '10px',
            backgroundColor: 'white',
            borderRadius: '4px',
            width: '100px'
          }}
        >
          <TextField
            fullWidth
            {...register(`rows.${index}.price`)}
            placeholder="単価"
            size="small"
            onKeyDown={(e) => handleEnterFocusNext(e)}
          />
        </Box>
        <Box
          sx={{
            marginRight: '10px',
            backgroundColor: 'white',
            borderRadius: '4px',
            width: '200px'
          }}
        >
          <TextField
            fullWidth
            {...register(`rows.${index}.remarks`)}
            placeholder="備考"
            size="small"
            onKeyDown={(e) => handleEnterFocusNext(e)}
          />
        </Box>
        <Box>
          <Button variant="outlined" onClick={() => RowRemove(index)}>
            削除
          </Button>
        </Box>
      </Box>
    )
  }
)

export default RowComp
