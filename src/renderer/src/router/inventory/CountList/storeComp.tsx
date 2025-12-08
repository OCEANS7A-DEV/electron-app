import Box from '@mui/material/Box'
import TypePage from './TypePage'

const StoreComp = ({ data }) => {
  return (
    <Box>
      {data.productCodes.map((row, index) => (
        <Box
          key={index}
          sx={{
            breakAfter: 'page',
            display: 'flex',
            flexFlow: 'column',
            backgroundColor: 'white',
            minWidth: '210mm',
            maxWidth: '210mm',
            minHeight: '297mm',
            maxHeight: '297mm'
          }}
        >
          <TypePage storeName={data.storeName} data={row} maxPage={data.maxPageNum} />
        </Box>
      ))}
    </Box>
  )
}

export default StoreComp
