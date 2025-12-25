import { useLogic } from './useLogic'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TaiyoArea from './taiyo'
import EtcOrder from './EtcOrder'
import ProStepOrder from './ProStep'

const VendorFAXPage = () => {
  const {
    VendorOrderData,
    Address,
    ProStepDatas
  } = useLogic()
  return (
    <Box>
      <Box
        displayPrint="none"
        sx={{
          position: 'fixed',
          top: 30
        }}
      >
        <Button variant="contained" onClick={() => window.myInventoryAPI.PrintReady()}>
          印刷
        </Button>
      </Box>
      {VendorOrderData.filter((item) => item.data.length !== 0).map((row, index) => (
        <Box key={index}>
          {row.vendor == '大洋商会' ? (
            <TaiyoArea Data={row.data} Address={Address} />
          ) : (
            <EtcOrder Data={row.data} Address={Address} vendorName={row.vendor} />
          )}
        </Box>
      ))}
      <Box
        sx={{
          breakInside: 'before'
        }}
      >
        {ProStepDatas.map((row, index) => (
          <Box key={index}>
            <ProStepOrder data={row} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default VendorFAXPage
