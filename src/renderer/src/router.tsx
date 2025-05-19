// router.ts
import React from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { ipcFetch } from './ipcFetch'
import ReceivingPage, { loader as ReceivingLoader} from './router/Receiving_stock';
import StoreOrderPage from './router/storeOrder'
import ProductDetailChangePage, { loader as productsLoader } from './router/ProductListUpdata'
import SelectPage, { loader as aboutLoader } from './router/SelectTitle'
import AddTitlePage from './router/AddTitlePage'
import AddPreview, { loader as previewLoader } from './router/AddTitlePreview'
import EditPage, { loader as editLoader } from './router/EditPage'
import NETOrder, { loader as netOrderLoader } from './router/netOrder'
import HQStocks, { loader as HQStocksLoader } from './router/HQ_stocks'
import HQPage from './router/process_chack'
import PrintContent, { loader as PrintLoader } from './router/PrintContent'
import TaiyoPrint, {loader as TaiyoLoader} from './router/taiyo'
import EtcPrint, {loader as EtcLoader} from './router/VendorPrint'
import SettingPage, {loader as SettingLoader} from './router/setting'
import DetailContent from './router/productDetailEdit'

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
    path: '/setting',
    element: <SettingPage />,
    loader: SettingLoader
  },
  {
    path: '/ProductListUpdata',
    element: <ProductDetailChangePage />,
    loader: productsLoader,
  },
  {
    path: '/productDetailEdit',
    element: <DetailContent />
  }
])