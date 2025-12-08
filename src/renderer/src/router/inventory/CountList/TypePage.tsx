import Box from '@mui/material/Box'
import { styleData, CodeStyleData, NameStyleData } from './logic'

const TypePage = ({ storeName, data, maxPage }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexFlow: 'column'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexFlow: 'column',
          width: '100%'
        }}
      >
        <Box
          sx={{
            backgroundColor: 'white',
            fontSize: '24px',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              fontSize: '24px',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            {storeName}
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%',
            padding: '8px 0px'
          }}
        >
          <Box>{data.typeName}</Box>
          <Box>
            {data.pageNum}/{maxPage}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexFlow: 'column'
        }}
      >
        <Box
          sx={{
            width: '100%'
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '20% 65% 15%',
              padding: '1px'
            }}
          >
            <Box sx={{ ...styleData, fontWeight: 'bold', border: '1px black solid' }}>
              商品ナンバー
            </Box>
            <Box
              sx={{
                ...styleData,
                fontWeight: 'bold',
                borderTop: '1px black solid',
                borderBottom: '1px black solid'
              }}
            >
              商品名
            </Box>
            <Box sx={{ ...styleData, fontWeight: 'bold', border: '1px black solid' }}>個数</Box>
            {data.products.map((row) => (
              <>
                <Box sx={{ ...CodeStyleData, border: '1px black solid', borderTop: 'none' }}>
                  {row.code}
                </Box>
                <Box
                  sx={{
                    ...NameStyleData,
                    borderBottom: '1px black solid'
                  }}
                >
                  {row.name}
                </Box>
                <Box sx={{ ...CodeStyleData, border: '1px black solid', borderTop: 'none' }} />
              </>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default TypePage
