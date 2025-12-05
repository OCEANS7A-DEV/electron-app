import Box from '@mui/material/Box'
import TypePage from './TypePage'

const StoreComp = ({ data }) => {
  return (
    <Box
      sx={{
        width: '210mm',
        backgroundColor: 'white'
      }}
    >
      <Box>
        {data.productCodes.map((row, index) => (
          <Box key={index}>
            <TypePage storeName={data.storeName} data={row} maxPage={data.maxPageNum} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default StoreComp
