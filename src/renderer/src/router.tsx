// router.ts
import React from 'react'
import { createHashRouter } from 'react-router-dom'

// ページ

import ProductDetailChangePage, {
  loader as productsLoader
} from './router/inventory/inventorySetting/ProductListUpdata'
import NETOrder, { loader as netOrderLoader } from './router/inventory/inventoryGet/netOrder'
import NetEtcPrint, { loader as NetEtcLoader } from './router/inventory/inventoryPrint/etcPrint'
import NotListed, { loader as NotListedLoader } from './router/inventory/inventoryGet/NotListed'
import HQStocks, { loader as HQStocksLoader } from './router/inventory/inventoryGet/HQ_stocks'
import HQPage from './router/inventory/inventoryGet/processCheck'
import PrintContent, { loader as PrintLoader } from './router/inventory/inventoryPrint/PrintContent'
import TaiyoPrint, { loader as TaiyoLoader } from './router/inventory/inventoryPrint/taiyo'

import EtcPrint, { loader as EtcLoader } from './router/inventory/inventoryPrint/VendorPrint'
import ZaikoSettingPage, { loader as ZaikoSettingLoader } from './router/setting/setting'
import HelloWork, { loader as HelloWorkLoader } from './router/helloWork/helloWork'
import DetailContent from './router/inventory/inventorySetting/productDetailEdit'
import UpdateWindow from './router/updater'

import CatalogView from './router/inventory/inventoryGet/Catalog'
import NetDetailsPrint, {
  loader as NetDetailsLoader
} from './router/inventory/inventoryInsert/OrderDetails'
import PDFOperationPage from './router/HQwork/PDFOperation'
import SystemSettingPage from './router/setting/systemSetting'

// 在庫金額
import InventoryAmount from '@Inventory/InventoryAmount/Page'
import { loader as InventoryAmountLoader } from '@InvAmount/useLogic'

// 店舗注文
import StoreOrderPage from '@Inventory/StoreOrder/Page'

// 本部入庫
//import ReceivingPage from './router/inventory/inventoryInsert/Receiving_stock'
import ReceivingPage from '@Inventory/Receiving/Page'

// 店舗間移動
import InventoryMoving from './router/inventory/inventoryInsert/Moving'
import MovingPage from '@Inventory/Moving/Page'

import GoogleWindow from './router/setting/GoogleLogin'
import LauncherPage from './router/launcher'
import Uriage from './router/sales/Uriage'
import FCInventory, { loader as FCLoader } from './router/inventory/inventoryGet/FCInventory'
import HQdata, { loader as HQLoader } from './router/HQwork/HQdata'
import HQmemo, { loader as HQMemoLoader } from './router/HQwork/HQmemo'
import HQPrivatememo, { loader as HQPrivatememoLoader } from './router/HQwork/PersonMemo'
import StaffData, { loader as StaffDataLoader } from './router/HQwork/StaffData'
import FCPrintContent, { loader as FCPrintContentLoader } from './router/inventory/inventoryPrint/FCInventoryPrint'
import HQPrintContent, { loader as HQPrintLoader } from './router/inventory/inventoryPrint/HQInventoryPrint'

import InventorySearchPage from './router/inventory/inventorySearch/inventorySearch'

export const router: ReturnType<typeof createHashRouter> = createHashRouter([
  {
    path: '/',
    element: <ReceivingPage />
  },
  {
    path: '/HQPrintContent',
    element: <HQPrintContent />,
    loader: HQPrintLoader
  },
  {
    path: '/StoreOrder',
    element: <StoreOrderPage />
  },
  {
    path: '/NETOrder',
    element: <NETOrder />,
    loader: netOrderLoader
  },
  {
    path: '/NetEtcPrint',
    element: <NetEtcPrint />,
    loader: NetEtcLoader
  },
  {
    path: '/NotListed',
    element: <NotListed />,
    loader: NotListedLoader
  },
  {
    path: '/OrderDetails',
    element: <NetDetailsPrint />,
    loader: NetDetailsLoader
  },
  {
    path: '/PDFOperation',
    element: <PDFOperationPage />
  },
  {
    path: '/HQ_stocks',
    element: <HQStocks />,
    loader: HQStocksLoader
  },
  {
    path: '/process_chack',
    element: <HQPage />
  },
  {
    path: '/PrintContent',
    element: <PrintContent />,
    loader: PrintLoader
  },
  {
    path: '/taiyo',
    element: <TaiyoPrint />,
    loader: TaiyoLoader
  },
  {
    path: '/VendorPrint',
    element: <EtcPrint />,
    loader: EtcLoader
  },
  {
    path: '/zaikosetting',
    element: <ZaikoSettingPage />,
    loader: ZaikoSettingLoader
  },
  {
    path: '/systemSetting',
    element: <SystemSettingPage />
  },
  {
    path: '/ProductListUpdata',
    element: <ProductDetailChangePage />,
    loader: productsLoader
  },
  {
    path: '/productDetailEdit',
    element: <DetailContent />
  },
  {
    path: '/updater',
    element: <UpdateWindow />
  },
  {
    path: '/Google',
    element: <GoogleWindow />
  },
  {
    path: '/Moving',
    element: <MovingPage />
  },
  {
    path: '/CatalogView',
    element: <CatalogView />
  },
  {
    path: '/HelloWork',
    element: <HelloWork />,
    loader: HelloWorkLoader
  },
  {
    path: '/InventoryAmount',
    element: <InventoryAmount />,
    loader: InventoryAmountLoader
  },
  {
    path: '/launcher',
    element: <LauncherPage />
  },
  {
    path: '/Uriage',
    element: <Uriage />
  },
  {
    path: '/FCInventory',
    element: <FCInventory />,
    loader: FCLoader
  },
  {
    path: '/HQdata',
    element: <HQdata />,
    loader: HQLoader
  },
  {
    path: '/HQmemo',
    element: <HQmemo />,
    loader: HQMemoLoader
  },
  {
    path: '/HQPrivatememo',
    element: <HQPrivatememo />,
    loader: HQPrivatememoLoader
  },
  {
    path: '/StaffData',
    element: <StaffData />,
    loader: StaffDataLoader
  },
  {
    path: '/FCPrintContent',
    element: <FCPrintContent />,
    loader: FCPrintContentLoader
  },
  {
    path: '/InventorySearchPage',
    element: <InventorySearchPage />
  }
])
