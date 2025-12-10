import { useLogic } from './useLogic'
import Box from '@mui/material/Box'
import TaiyoArea from './taiyo'

const VendorFAXPage = () => {
  const {
    VendorOrderData,
    Address
  } = useLogic()
  console.log(VendorOrderData)
  return (
    <Box>
      {VendorOrderData.filter((item) => item.data.length !== 0).map((row, index) => (
        <Box
          key={index}
          sx={{
            width: '210mm',
            height: '297mm'
          }}
        >
          {row.vendor == '大洋商会' ? (
            <TaiyoArea Data={row.data} Address={Address} />
          ) : (
            <></>
          )}
        </Box>
      ))}
    </Box>
  )
}

export default VendorFAXPage
