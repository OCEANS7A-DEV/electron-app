import Box from '@mui/material/Box'
import { detailsTypes, TIDAPrintProps } from './types'
import type { JSX } from 'react'

const TIDAPrint = ({ data, status }: TIDAPrintProps): JSX.Element => {
  return (
    <Box
      sx={{
        padding: '4px 0px',
        width: 'calc(210mm - 1px)',
        backgroundColor: 'white',
        breakInside: 'avoid'
      }}
    >
      <Box
        sx={{
          columnCount: 2,
          olumnGap: '6px',
          borderTop: '2px solid black'
        }}
      >
        {data.map((row: detailsTypes, index: number) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              breakInside: 'avoid',
              pageBreakInside: 'avoid',
              borderBottom: '1px solid black',
              width: '100%'
            }}
          >
            <Box
              sx={{
                flex: 1,
                borderRight: '1px solid black',
                borderLeft: '1px solid black',
                padding: '4px',
                paddingLeft: 2,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
              }}
            >
              {status && <Box>{row.productName}</Box>}
              {row.detailName}
            </Box>
            <Box
              sx={{
                width: '80px',
                borderRight: '1px solid black',
                textAlign: 'right',
                padding: '4px',
                paddingRight: 2,
                flexShrink: 0
              }}
            >
              {row.totalNum}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default TIDAPrint
