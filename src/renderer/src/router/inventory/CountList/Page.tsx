import { useLogic } from './useLogic'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'


import StoreComp from './storeComp'

const CountListPage = () => {
  const {
    resultData
  } = useLogic()
  return (
    <Box>
      <Box>
        {resultData.map((row, index) => (
          <Box key={index}>
            <StoreComp
              data={row}
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default CountListPage