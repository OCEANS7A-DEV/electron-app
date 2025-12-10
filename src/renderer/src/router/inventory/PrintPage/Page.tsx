import Box from '@mui/material/Box'

import { useLogic } from './useLogic'

import OrderStatus from './OrderStatus'
import OPCArea from './OrderPrintControlArea'
import FAXArea from './FAXPrintControlArea'

// 独自コンポーネント
import LinkBaner from '../../../comp/Linkbanar'

// トースト通知コンポーネント
import { Toaster } from 'react-hot-toast'

const PrintControlPage = () => {
  const {
    dateValue,
    handleDateChange,
    DataGet,
    OrderDataStatus,
    storeSelect,
    storeOptions,
    handleStoreChange,
    OrderPrintExe
  } = useLogic()

  return (
    <Box>
      <Box>
        <LinkBaner id="zaiko" />
        <Toaster />
      </Box>
      <Box
        sx={{
          paddingTop: '80px',
          display: 'flex'
        }}
      >
        <Box
          sx={{
            paddingBottom: '60px'
          }}
        >
          <OrderStatus
            dateValue={dateValue}
            handleDateChange={handleDateChange}
            DataGet={DataGet}
            OrderDataStatus={OrderDataStatus}
          />
        </Box>
        <Box>
          <Box
            sx={{
              marginLeft: '20px',
              padding: '1px',
              display: 'grid',
              gridTemplateColumns: '140px 140px',
              gap: '1px',
              backgroundColor: 'gray'
            }}
          >
            <Box
              sx={{
                backgroundColor: '#2a2a30',
                padding: '8px',
                display: 'flex',
                justifyContent: 'center',
                flexFlow: 'column'
              }}
            >
              <Box sx={{ textAlign: 'center', color: 'white', paddingBottom: '4px' }}>
                注文書印刷
              </Box>
              <OPCArea
                storeSelect={storeSelect}
                handleStoreChange={handleStoreChange}
                storeOptions={storeOptions}
                OrderPrintExe={OrderPrintExe}
              />
            </Box>
            <Box>
              <FAXArea />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default PrintControlPage
