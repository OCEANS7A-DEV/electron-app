import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
contextBridge.exposeInMainWorld('myInventoryAPI', {
  fetchData: () => ipcRenderer.invoke('fetch-data'),
  postData: (endpoint: string, payload: any) => ipcRenderer.invoke('post-data', endpoint, payload),
  postDataGet: (endpoint: string) => ipcRenderer.invoke('post-get-data', endpoint),
  filePost: (endpoint, formData) => ipcRenderer.invoke('file-post', endpoint, formData),
  ListGet: (payload) => ipcRenderer.invoke('list-get', payload),
  DataInsert: (payload) => ipcRenderer.invoke('data-insert', payload),
  ListData: () => ipcRenderer.invoke('product-list'),
  VendorData: () => ipcRenderer.invoke('vendor-list'),
  shortageGet: () => ipcRenderer.invoke('shortageGet'),
  orderPrint: (payload) => ipcRenderer.invoke('orderPrint', payload),
  PrintReady: () => ipcRenderer.invoke('Print-Ready'),
  storeSet: (settitle: string, setData: any) => ipcRenderer.invoke('storeSet', settitle, setData),
  storeGet: (gettitle: string) => ipcRenderer.invoke('storeGet', gettitle)
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
