import { ElectronAPI } from '@electron-toolkit/preload'

import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    myInventoryAPI: MyInventoryAPI
  }
}
