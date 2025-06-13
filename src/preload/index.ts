import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
contextBridge.exposeInMainWorld('myInventoryAPI', {
  isDev: process.env.NODE_ENV === 'development',
  fetchData: () => ipcRenderer.invoke('fetch-data'),
  postData: (endpoint: string, payload: any) => ipcRenderer.invoke('post-data', endpoint, payload),
  postDataGet: (endpoint: string) => ipcRenderer.invoke('post-get-data', endpoint),
  filePost: (endpoint, formData) => ipcRenderer.invoke('file-post', endpoint, formData),
  ListGet: (payload) => ipcRenderer.invoke('list-get', payload),
  DataInsert: (payload) => ipcRenderer.invoke('data-insert', payload),
  ListData: () => ipcRenderer.invoke('product-list'),
  DetailsData: () => ipcRenderer.invoke('details-list'),
  NowGet: () => ipcRenderer.invoke('now-DateGet'),
  WorkGet: () => ipcRenderer.invoke('hellowork-get'),
  VendorData: () => ipcRenderer.invoke('vendor-list'),
  shortageGet: () => ipcRenderer.invoke('shortageGet'),
  orderPrint: (payload) => ipcRenderer.invoke('orderPrint', payload),
  HelloWorkPDFGet: (lists) => ipcRenderer.invoke('hellowork-PDF', lists),
  PrintReady: () => ipcRenderer.invoke('Print-Ready'),
  storeSet: (settitle: string, setData: any) => ipcRenderer.invoke('storeSet', settitle, setData),
  storeGet: (gettitle: string) => ipcRenderer.invoke('storeGet', gettitle),
  onUpdateAvailable: (callback: (flag: boolean) => void) => {
    ipcRenderer.on('update-available', (_event, flag) => {
      callback(flag)
    })
  },
  upGrade: () => ipcRenderer.send('button-Upgrade'),
  onProgressUpdate: (callback: (data: { percent: number, message: string, status: string }) => void) => {
    ipcRenderer.on('progress', (_, data) => callback(data))
  },
  onCheckedUpdate: (callback: (data: { status: string, value: boolean }) => void) => {
    ipcRenderer.on('check', (_, data) => callback(data))
  },
  MainBoot: () => ipcRenderer.send('Main-boot'),
  UpdaterClose: () => ipcRenderer.send('startUpClose'),
  getFileList: () => ipcRenderer.invoke('get-file-list'),
  getFilePath: (filename: string) => ipcRenderer.invoke('get-file-path', filename),
  onHelloWorkProgress: (callback) => {
    // callback(data) の形にラップして登録
    ipcRenderer.on('helloWork-progress', (_event, data) => callback(data))
  },
  removeHelloWorkProgress: () => {
    // チャンネル全解除
    ipcRenderer.removeAllListeners('helloWork-progress')
  },
})

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
