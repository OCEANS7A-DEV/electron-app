import Box from '@mui/material/Box'

import InventorySearchArea from './inventorySearch'

import { useLogic } from './useLogic'


const InventorySearchPage = () => {
  const {
    SearchWord,
    setSearchWord
  } = useLogic()
  return (
    <Box>
      <InventorySearchArea status={false} />
    </Box>
  )
}

export default InventorySearchPage
