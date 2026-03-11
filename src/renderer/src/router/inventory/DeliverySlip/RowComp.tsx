import type { JSX } from 'react'
import Box from '@mui/material/Box'
import { ColumnSize, BoxSxSetting, Tax, DeliverNum, Missing, totalPrice } from './logic'
import { PrintRowType, RowCompType } from './types'

const RowComp = ({ printData }: RowCompType): JSX.Element => {
  console.log(printData)
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
              {row[4] !== '' && DeliverNum(row)}
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
            <Box sx={{ width: '100%', textAlign: 'right', paddingRight: '18px' }}>
              {row[4] !== '' && totalPrice(row)}
            </Box>
          </Box>
          <Box
            sx={{
              ...BoxSxSetting,
              justifyContent: 'center',
              flexFlow: 'column'
            }}
          >
            {row[11] !== '' && (
              <Box sx={{ width: '100%', textAlign: 'right', paddingRight: '18px' }}>
                {row[11]}様<br /> {Tax(row)}
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
            <Box>{row[12]}{Missing(row)}</Box>
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
