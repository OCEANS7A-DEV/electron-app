import {
  useState,
  useEffect,
} from 'react'


import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress';

type DataType = {
  vendor: string
  code: number
  productName: string
  detailName: string
  totalNum: number
}

export default function EnrePage() {
  const [loading, setloading] = useState(true)

  const [data, setData] = useState([])

  const [MyAddress, setMyAddress] = useState([])

  const initSetting = async () => {
    const ordersGet = await window.myInventoryAPI.ListGet({
      sheetName: '店舗注文履歴',
      action: 'InputDataGet',
      ranges: 'A2:M'
    })
    const printtargetdate = await window.myInventoryAPI.storeGet('printDate')
    const lastDate = new Date(printtargetdate).toLocaleDateString()
    const filteredData = ordersGet.filter(
      (row) => new Date(row[0]).toLocaleDateString() == lastDate && row[5] !== ''
    )
    const details = await window.myInventoryAPI.storeGet('details')
    const detailCodes: number[] = []
    const Datas = details
      .map((item: [number, string]) => {
        const target = filteredData.filter((row) => row[3] == item[0] && row[5] == item[1])
        if (target.length !== 0) {
          const name = target[0][4]
          let total = 0
          target.forEach((row) => {
            total = total + Number(row[6])
          })
          const result = {
            vendor: target[0][2],
            code: item[0],
            productName: name,
            detailName: item[1],
            totalNum: total
          }
          detailCodes.push(Number(item[0]))
          return result
        } else {
          return
        }
      })
      .filter((row) => row && row.code !== 100001)
    const enreDatas = Datas.filter((row) => row.code == 300003)
    setData(enreDatas)

    const alllist = await window.myInventoryAPI.ListGet({
      sheetName: 'その他データ',
      action: 'ListGet',
      ranges: 'A2:H'
    })

    setMyAddress(alllist[0])
    setloading(false)

  }
  
  useEffect(() => {
    initSetting()
  }, [])

  useEffect(() => {
    if (data.length !== 0) {
      console.log(data)
    }
  }, [data])

  return (
    <div>
      {loading ? (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100vw',
              height: '100vh'
            }}
          >
            <CircularProgress aria-label="取得中…" />
          </Box>
        </>
      ) : (
        <>
          <Box
            displayPrint="none"
            sx={{
              position: 'fixed',
              top: 10
            }}
          >
            <Button variant="contained" onClick={() => window.myInventoryAPI.PrintReady()}>
              印刷
            </Button>
          </Box>
          <Box
            sx={{
              minWidth: '210mm',
              minHeight: '297mm',
              maxWidth: '210mm',
              maxHeight: '297mm',
              backgroundColor: 'white',
              display: 'flex',
              flexFlow: 'column',
              alignItems: 'center',
              padding: '1px',
              breakInside: 'avoid'
            }}
          >
            <Box sx={{ fontSize: '28px', fontWeight: 'bold' }}>注文書</Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%'
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}
                >
                  <Box></Box>
                  <Box sx={{ padding: '0px 6px' }}>ENRE 西迫信義</Box>
                  <Box>様</Box>
                </Box>
                <Box></Box>
                <Box></Box>
                <Box sx={{ fontSize: '20px', fontWeight: 'bold' }}>お世話になります</Box>
                <Box sx={{ fontSize: '20px', fontWeight: 'bold' }}>ご注文宜しくお願いします</Box>
              </Box>
              <Box sx={{ marginBottom: '8px' }}>
                <Box
                  sx={{
                    border: '1px black solid',
                    height: '100%',
                    fontSize: '18px',
                    textAlign: 'right',
                    padding: '0px 10px'
                  }}
                >
                  <Box>{MyAddress[6]}</Box>
                  <Box>{MyAddress[5]}</Box>
                  <Box>TEL:{MyAddress[3]}</Box>
                  <Box sx={{ textAlign: 'left' }}>担当</Box>
                  <Box>FAX:{MyAddress[3]}</Box>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                width: '790px'
              }}
            >
              <Box
                sx={{
                  border: '1px black solid',
                  display: 'flex',
                  width: '100%',
                  fontSize: '18px'
                }}
              >
                <Box sx={{ flex: 1, textAlign: 'center', borderRight: '1px black solid' }}>注文内容</Box>
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '50% 50%',
                  borderTop: '2px solid black'
                }}
              >
                {data.map((row: DataType, index: number) => (
                  <Box key={index} sx={{ display: 'flex', borderBottom: '1px solid black' }}>
                    <Box
                      sx={{
                        width: '500px',
                        borderRight: '1px solid black',
                        borderLeft: '1px solid black',
                        paddingLeft: 2,
                        paddingTop: '6px',
                        paddingBottom: '6px'
                      }}
                    >
                      {row.detailName}
                    </Box>
                    <Box
                      sx={{
                        width: '100px',
                        borderRight: '1px solid black',
                        textAlign: 'right',
                        paddingRight: 2,
                        paddingTop: '6px',
                        paddingBottom: '6px'
                      }}
                    >
                      {row.totalNum}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </>
      )}
    </div>
  )
}