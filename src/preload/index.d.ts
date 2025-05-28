import { ElectronAPI } from '@electron-toolkit/preload'

import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface MyInventoryAPI {
    fetchData: () => Promise<any>
    postData: (endpoint: string, payload: any) => Promise<any>
    postDataGet: (endpoint: string) => Promise<any>
    filePost: (endpoint: string, formData: any) => Promise<any>
    ListGet: (payload: any) => Promise<any>
    DataInsert: (payload: any) => Promise<any>
    ListData: () => Promise<any>
    VendorData: () => Promise<any>
    shortageGet: () => Promise<any>
    orderPrint: (payload: any) => Promise<any>
    PrintReady: () => Promise<any>
    storeSet: (settitle: string, setData: any) => Promise<any>
    storeGet: (gettitle: string) => Promise<any>
    onUpdateAvailable: (callback: (flag: boolean) => void) => void
  }

  interface Window {
    electron: ElectronAPI
    api: unknown
    myInventoryAPI: MyInventoryAPI
  }
}
