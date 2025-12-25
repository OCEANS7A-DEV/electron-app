import Box from '@mui/material/Box'
import type { JSX } from 'react'
import { proStepDataType, ProStepOrderType } from './types'

const ProStepOrder = ({ data }: ProStepOrderType): JSX.Element => {
  return (
    <Box
      sx={{
        padding: '4px 0px',
        width: '210mm',
        backgroundColor: 'white',
        breakInside: 'avoid'
      }}
    >
      <Box
        sx={{
          border: '2px solid black'
        }}
      >
        <Box sx={{ paddingLeft: 4, fontSize: '20px', fontWeight: 'bold' }}>{data.storeName}</Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '50% 50%',
            borderTop: '2px solid black'
          }}
        >
          {data.proStepData.map((row: proStepDataType, index: number) => (
            <Box key={index} sx={{ display: 'flex', borderBottom: '1px solid black' }}>
              <Box
                sx={{
                  width: '500px',
                  borderRight: '1px solid black',
                  borderLeft: '1px solid black',
                  paddingLeft: 2
                }}
              >
                {row[1]}
              </Box>
              <Box
                sx={{
                  width: '100px',
                  borderRight: '1px solid black',
                  textAlign: 'right',
                  paddingRight: 2
                }}
              >
                {row[2]}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default ProStepOrder
