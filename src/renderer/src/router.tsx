// router.ts
import React from 'react';
import { createHashRouter } from 'react-router-dom'

import ReceivingPage from './router/Receiving_stock';
import StoreOrderPage from './router/storeOrder'
import ProductDetailChangePage, { loader as productsLoader } from './router/ProductListUpdata'

import NETOrder, { loader as netOrderLoader } from './router/netOrder'
import NetEtcPrint, { loader as NetEtcLoader } from './router/etcPrint'
import NotListed, { loader as NotListedLoader } from './router/NotListed'
import HQStocks, { loader as HQStocksLoader } from './router/HQ_stocks'
import HQPage from './router/process_chack'
import PrintContent, { loader as PrintLoader } from './router/PrintContent'
import TaiyoPrint, { loader as TaiyoLoader } from './router/taiyo'
import EtcPrint, { loader as EtcLoader } from './router/VendorPrint'
import ZaikoSettingPage, { loader as ZaikoSettingLoader } from './router/setting'
import HelloWork, { loader as HelloWorkLoader } from './router/helloWork'
import DetailContent from './router/productDetailEdit'
import UpdateWindow from './router/updater'
import InventoryMoving from './router/Moving'
import CatalogView from './router/Catalog'
import NetDetailsPrint, { loader as NetDetailsLoader } from './router/OrderDetails'
import PDFOperationPage from './router/PDFOperation'
import SystemSettingPage from './router/systemSetting'
import InventoryAmount, { loader as InventoryAmountLoader } from './router/InventoryAmount'
import GoogleWindow from './router/GoogleLogin'
import LauncherPage from './router/launcher'




export const router = createHashRouter([
  {
    path: '/',
    element: <ReceivingPage />,
  },
  {
    path: '/StoreOrder',
    element: <StoreOrderPage />,
  },
  {
    path: '/NETOrder',
    element: <NETOrder />,
    loader: netOrderLoader
  },
  {
    path: '/NetEtcPrint',
    element: <NetEtcPrint/>,
    loader: NetEtcLoader
  },
  {
    path: '/NotListed',
    element: <NotListed/>,
    loader: NotListedLoader
  },
  {
    path: '/OrderDetails',
    element: <NetDetailsPrint />,
    loader: NetDetailsLoader
  },
  {
    path: '/PDFOperation',
    element: <PDFOperationPage/>
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
    loader: productsLoader,
  },
  {
    path: '/productDetailEdit',
    element: <DetailContent />
  },
  {
    path: '/updater',
    element: <UpdateWindow/>
  },
  {
    path: '/Google',
    element: <GoogleWindow/>
  },
  {
    path: '/Moving',
    element: <InventoryMoving />,
  },
  {
    path: '/CatalogView',
    element: <CatalogView />
  },
  {
    path: '/HelloWork',
    element: <HelloWork/>,
    loader: HelloWorkLoader
  },
  {
    path: '/InventoryAmount',
    element: <InventoryAmount/>,
    loader: InventoryAmountLoader
  },
  {
    path: '/launcher',
    element: <LauncherPage/>
  }
])