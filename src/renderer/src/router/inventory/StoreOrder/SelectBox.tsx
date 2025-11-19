// components/DetailSelectBox/index.tsx
import type { JSX } from 'react'
import { Controller, Control } from 'react-hook-form'
import { FormValues } from './types'

// ロジックのインポート
import { useDetailSelectBox } from './useLogic'

// MUI
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

type DetailSelectBoxProps = {
  control: Control<FormValues>
  index: number
  handleEnterFocusNext: (e: React.KeyboardEvent<HTMLElement>) => void
}

const DetailSelectBox = ({
  control,
  index,
  handleEnterFocusNext
}: DetailSelectBoxProps): JSX.Element => {
  const { options } = useDetailSelectBox(control, index)

  return (
    <Controller
      name={`rows.${index}.detail`}
      control={control}
      render={({ field }) => (
        <Autocomplete
          options={options}
          getOptionLabel={(option) => option.label || ''}
          isOptionEqualToValue={(option, value) => option.value === value?.value}
          value={field.value || null}
          onChange={(_, newValue) => field.onChange(newValue)}
          onKeyDown={(e) => handleEnterFocusNext(e)}
          openOnFocus
          autoHighlight
          renderInput={(params) => (
            <TextField {...params} label="詳細" size="small" style={{ width: 160, height: 38 }} />
          )}
        />
      )}
    />
  )
}

export default DetailSelectBox
