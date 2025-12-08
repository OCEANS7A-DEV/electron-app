import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {}

contextBridge.exposeInMainWorld('myInventoryAPI', {
  isDev: process.env.NODE_ENV === 'development',
  fetchData: () => ipcRenderer.invoke('fetch-data'),
  postData: (endpoint: string, payload: any) => ipcRenderer.invoke('post-data', endpoint, payload),
  postDataGet: (endpoint: string) => ipcRenderer.invoke('post-get-data', endpoint),
  filePost: (endpoint, formData) => ipcRenderer.invoke('file-post', endpoint, formData),
  ListGet: (payload) => ipcRenderer.invoke('list-get', payload),
  DataInsert: (payload) => ipcRenderer.invoke('data-insert', payload),
  ListData: () => ipcRenderer.invoke('product-list'),
  ListReload: () => ipcRenderer.send('product-reload'),
  DetailsData: () => ipcRenderer.invoke('details-list'),
  NowGet: () => ipcRenderer.invoke('now-DateGet'),
  WorkGet: () => ipcRenderer.invoke('hellowork-get'),
  VendorData: () => ipcRenderer.invoke('vendor-list'),
  shortageGet: () => ipcRenderer.invoke('shortageGet'),
  archiveGet: () => ipcRenderer.invoke('archiveGet'),
  orderPrint: (payload) => ipcRenderer.invoke('orderPrint', payload),
  HelloWorkPDFGet: (lists) => ipcRenderer.invoke('hellowork-PDF', lists),
  PrintReady: () => ipcRenderer.invoke('Print-Ready'),
  CountListPrint: (fileName: string, folderPath: string) => ipcRenderer.invoke('CountListPrint', fileName, folderPath),
  FolderBuild: (folderName: string) => ipcRenderer.invoke('folderBuild', folderName),
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
    ipcRenderer.on('helloWork-progress', (_event, data) => callback(data))
  },
  removeHelloWorkProgress: () => {
    ipcRenderer.removeAllListeners('helloWork-progress')
  },
  PDFMarge: () => ipcRenderer.send('PDF-Marge'),
  TokenChange: () => ipcRenderer.send('change-github-token'),
  GoogleLogout: () => ipcRenderer.send('google-logout'),
  GoogleLogin: () => ipcRenderer.send('google-login'),
  GoogleConfirmation: () => ipcRenderer.send('google-login-confirmation'),
  WindowInfoGet: () => ipcRenderer.invoke('windowInfo'),
  WindowZaiko: () => ipcRenderer.send('WindowZaiko'),
  HelloWorkWindow: () => ipcRenderer.send('HelloWorkWindow'),
  OfficeWorkWindow: () => ipcRenderer.send('OfficeWorkWindow'),
  SettingWindow: () => ipcRenderer.send('SettingWindow'),
  PrivateMemoGet: () => ipcRenderer.invoke('PrivateMemo-Get'),
  PrivateMemoInsert: (payload) => ipcRenderer.send('PrivateMemo-Insert', payload),
  PrivateMemoDelete: (payload) => ipcRenderer.send('PrivateMemo-Delete', payload),
  UuidGet: (payload) => ipcRenderer.invoke('uuid-get', payload),
  onShowOtpPrompt: (callback) => ipcRenderer.on('show-otp-prompt', callback),
  sendOtp: (otp) => ipcRenderer.send('otp-submitted', otp),
  helloworkInit: () => ipcRenderer.invoke('hellowork-init'),
  helloworkUpdate: (RecruitNumbers) => ipcRenderer.invoke('hellowork-update', RecruitNumbers),
  PDFUnlocked: (fileData, password, fileName) =>
    ipcRenderer.invoke('unlock-pdf', fileData, password, fileName)
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
