import type { JSX } from 'react'
import Box from '@mui/material/Box'
import { ColumnSize, BoxSxSetting } from './logic'
import { PrintRowType, RowCompType } from './types'

const RowComp = ({ printData }: RowCompType): JSX.Element => {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: '1px',
        width: '100%',
        fontSize: '12px',
        padding: '1px'
      }}
    >
      {printData.map((row: PrintRowType, index: number) => (
        <Box
          key={index}
          sx={{
            minHeight: '48px',
            maxHeight: '48px',
            display: 'grid',
            gap: '1px',
            ...ColumnSize
          }}
        >
          <Box
            sx={{
              ...BoxSxSetting,
              alignItems: 'left',
              justifyContent: 'center',
              flexFlow: 'column',
              paddingLeft: '6px'
            }}
          >
            <Box sx={{ whiteSpace: 'nowrap' }}>
              <Box
                sx={{
                  width: '40px',
                  textAlign: 'right'
                }}
              >
                {row[3]}
              </Box>
            </Box>
            <Box sx={{ whiteSpace: 'nowrap' }}>{row[4]}</Box>
          </Box>
          <Box
            sx={{
              ...BoxSxSetting,
              alignItems: 'left',
              justifyContent: 'center',
              flexFlow: 'column',
              paddingLeft: '6px'
            }}
          >
            <Box sx={{ overflow: 'hidden' }}>{row[5]}</Box>
          </Box>
          <Box
            sx={{
              ...BoxSxSetting,
              justifyContent: 'center',
              flexFlow: 'column'
            }}
          >
            <Box sx={{ width: '100%', textAlign: 'right', paddingRight: '18px' }}>
              {row[4] !== '' && Number(row[6]).toLocaleString()}
            </Box>
          </Box>
          <Box
            sx={{
              ...BoxSxSetting,
              justifyContent: 'center',
              flexFlow: 'column'
            }}
          >
            <Box sx={{ width: '100%', textAlign: 'right', paddingRight: '18px' }}>
              {row[4] !== '' && Number(row[8]).toLocaleString()}
            </Box>
          </Box>
          <Box
            sx={{
              ...BoxSxSetting,
              justifyContent: 'center',
              flexFlow: 'column'
            }}
          >
            <Box sx={{ width: '100%', textAlign: 'right', paddingRight: '18px' }}>
              {row[4] !== '' && Number(row[9]).toLocaleString()}
            </Box>
          </Box>
          <Box
            sx={{
              ...BoxSxSetting,
              justifyContent: 'center',
              flexFlow: 'column'
            }}
          >
            {row[10] !== '' && (
              <Box sx={{ width: '100%', textAlign: 'right', paddingRight: '18px' }}>
                {row[10]}様 ¥{(Number(row[6]) * Number(row[8])).toLocaleString()}
              </Box>
            )}
          </Box>
          <Box
            sx={{
              ...BoxSxSetting,
              justifyContent: 'center',
              flexFlow: 'column'
            }}
          >
            <Box>{row[11]}</Box>
          </Box>
          <Box
            sx={{
              ...BoxSxSetting,
              justifyContent: 'center',
              flexFlow: 'column'
            }}
          >
            <Box></Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default RowComp
