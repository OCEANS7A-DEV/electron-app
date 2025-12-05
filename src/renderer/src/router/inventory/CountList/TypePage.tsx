import Box from '@mui/material/Box'
import { styleData, CodeStyleData, NameStyleData } from './logic'


const TypePage = ({ storeName, data, maxPage }) => {
  return (
    <Box>
      <Box
        sx={{
          minWidth: '210mm',
          minHeight: '297mm',
          maxWidth: '210mm',
          maxHeight: '297mm',
          backgroundColor: 'white',
          display: 'flex',
          flexFlow: 'column',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{
            padding: '10px'
          }}
        >
          <Box
            sx={{
              fontSize: '24px'
            }}
          >
            {storeName}
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%'
          }}
        >
          <Box>{data.typeName}</Box>
          <Box>
            {data.pageNum}/{maxPage}
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: 'black',
            width: '100%',
            margin: '8px 0px'
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gap: '1px',
              gridTemplateColumns: '20% 65% calc(15% - 3px)',
              padding: '1px'
            }}
          >
            <Box sx={{ ...styleData, fontWeight: 'bold' }}>商品ナンバー</Box>
            <Box sx={{ ...styleData, fontWeight: 'bold' }}>商品名</Box>
            <Box sx={{ ...styleData, fontWeight: 'bold' }}>個数</Box>
            {data.products.map((row) => (
              <>
                <Box sx={{ ...CodeStyleData }}>{row.code}</Box>
                <Box sx={{ ...NameStyleData }}>{row.name}</Box>
                <Box sx={{ ...CodeStyleData }} />
              </>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default TypePage