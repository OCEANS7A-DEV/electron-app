import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

const SelectArea = ({ ListData, labelName, valueData, handleValueChange }) => {
  return (
    <Box
      sx={{
        width: '120px',
        backgroundColor: 'white',
        borderRadius: '6px',
        marginRight: '10px'
      }}
    >
      <Select value={valueData} onChange={handleValueChange} label={labelName} fullWidth>
        {ListData.map((row: { value: number | string; label: string }, index: number) => (
          <MenuItem key={index} value={row.value}>
            {row.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  )
}

export default SelectArea
