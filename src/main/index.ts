import { app, shell, BrowserWindow, ipcMain, net } from 'electron'
import { join } from 'path'
import { electronApp, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Store from 'electron-store'
import log from 'electron-log'
import updater from 'electron-updater'
const { autoUpdater } = updater



// import React from 'react'
// import ReactDOMServer from 'react-dom/server'
// import PrintContent from '../renderer/src/router/PrintContent'

const store = new Store() as any

// const URL_STRING =
//   'https://script.google.com/macros/s/AKfycbznkMazxV3wlmS66uEHcOSRkI_SBQkdfT_MfMzJnvueFkSwDxGFiLlmFtq-MfMM6ldL/exec'
// const Get_URL =
//   'https://script.google.com/macros/s/AKfycbwdZ3lhe2QH2BChceXrTsxzGAkUd9EgZ2AZ7pWXWlMJvwtOtOcjXDTOXUmdBRJgCs25/exec'
// const Img_URL =
//   'https://script.google.com/macros/s/AKfycbzCrMJDEFvfTTTCjb2b-8SwVgc2ySlsKwpf7c49H08DS6P4-ZulaS4zcNtiioytK0i6/exec'


const GetAPI_URL =
  'https://script.google.com/macros/s/AKfycbwCAqk6CMJl2obU-0edITVdKHEcXLwVhiD81ilwv2xuRWPSSr537A1cfaUSs5FvYn8D-g/exec'
const InsertAPI_URL =
  'https://script.google.com/macros/s/AKfycbylyaUttaEI9jYGJM_CQWOWyWAd3C9Q-ikbkNAMCUIPDYIWqtUHgrw9GHNgmgkWKE-M/exec'


let updaterWindow: BrowserWindow | null = null

const createUpdaterWindow = () => {
  updaterWindow = new BrowserWindow({
    width: 400,
    height: 200,
    resizable: false,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    updaterWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/#updater`)
  } else {
    updaterWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'updater' })
  }

  updaterWindow.once('ready-to-show', () => {
    updaterWindow?.show()
  })
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 950,
    height: 670,
    minWidth: 950,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: is.dev
        ? join(__dirname, '../preload/index.mjs')
        : join(app.getAppPath(), 'out/preload/index.mjs'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.webContents.openDevTools()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // console.log(is.dev)
  // console.log(process.env['ELECTRON_RENDERER_URL'])
  // console.log(join(__dirname, '../renderer/index.html'))
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

async function launchMainApp() {
  const list = await productGet()

  const ListResult = list.map((item) => ({
    vendor: item[0],
    code: item[1],
    name: item[2],
    defaultPrice: item[3],
    newPrice: item[4],
    VC: item[5],
    store: item[6],
    type: item[7],
    remarks: item[8],
    Possibility: item[9],
    service: item[10],
    order: item[11]
  }))
  store.set('data', ListResult)

  const VendorList = await vendorGet()
  store.set('vendor', VendorList)

  const AddressList = await addressGet()
  store.set('address', AddressList)

  createWindow()
}



let printWindow: BrowserWindow | null = null;






export const productGet = async () => {
  try {
    const response = await net.fetch(GetAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify({ sheetName: '在庫一覧', action: 'ListGet', ranges: 'A2:L' })
    })
    const result = await response.json()
    return result
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return errorMessage
  }
}

export const vendorGet = async () => {
  try {
    const response = await net.fetch(GetAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify({ sheetName: 'その他一覧', action: 'ListGet', ranges: 'D2:D' })
    })
    const result = await response.json()
    return result
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return errorMessage
  }
}


export const addressGet = async () => {
  try {
    const response = await net.fetch(GetAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify({ sheetName: 'その他データ', action: 'ListGet', ranges: 'A2:H' })
    })
    const result = await response.json()
    return result
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return errorMessage
  }
}

export const shortageGet = async () => {
  try {
    const response = await fetch(GetAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify({
        sheetName: '在庫一覧',
        action: 'TotallingGet',
        ranges: 'A2:N'
      })
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const result = await response.json()
    //console.log(result)
    return result
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

app.whenReady().then(async () => {
  log.info('起動')
  electronApp.setAppUserModelId('com.electron')

  //createUpdaterWindow()

  autoUpdater.on('checking-for-update', () => {
    log.info('アップデートを確認中...')
    updaterWindow?.webContents.send('update-status', 'checking')
  })

  autoUpdater.on('update-available', () => {
    log.info('アップデートが利用可能です。')
    updaterWindow?.webContents.send('update-status', 'available')
  })

  autoUpdater.on('update-not-available', async () => {
    log.info('アップデートはありません。')
    updaterWindow?.close()
    await launchMainApp()
  })

  autoUpdater.on('error', async (error) => {
    log.error('アップデートエラー:', error)
    updaterWindow?.webContents.send('update-status', 'error')
    await launchMainApp()
  })

  autoUpdater.on('download-progress', (progressObj) => {
    updaterWindow?.webContents.send('download-progress', progressObj.percent.toFixed(2))
  })

  if (!is.dev) {
    autoUpdater.on('update-downloaded', () => {
      log.info('アップデート完了。再起動して更新します。')
      autoUpdater.quitAndInstall()
    })
  }

  // app.on('browser-window-created', (_, window) => {
  //   optimizer.watchWindowShortcuts(window)
  // })

  // ipcMain.on('ping', () => console.log('pong'))
  // const list = await productGet()

  // const ListResult = list.map((item) => {
  //   const result = {
  //     vendor: item[0],
  //     code: item[1],
  //     name: item[2],
  //     defaultPrice: item[3],
  //     newPrice: item[4],
  //     VC: item[5],
  //     store: item[6],
  //     type: item[7],
  //     remarks: item[8],
  //     Possibility: item[9],
  //     service: item[10],
  //     order: item[11]
  //   }
  //   return result
  // })

  // store.set('data', ListResult)

  // const VendorList = await vendorGet()

  // store.set('vendor', VendorList)

  // const AddressList = await addressGet()

  // store.set('address', AddressList)

  //createWindow()
})

ipcMain.handle('product-list', async () => {
  const data = await store.get('data')
  return data
})

ipcMain.handle('vendor-list', async () => {
  const data = await store.get('vendor')
  return data
})

ipcMain.handle('shortageGet', async () => {
  const data = await shortageGet()
  return data
})

ipcMain.handle('storeSet', async (_event, set) => {
  store.set(set.settitle, set.setData)
})

ipcMain.handle('storeGet', async (_event, payload: { gettitle: string }) => {
  return store.get(payload.gettitle);
});

ipcMain.handle('list-get', async (_event, payload: any) => {
  //const SetDomain = await getEndpoint()
  try {
    const response = await net.fetch(GetAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify(payload)
    })
    const result = await response.json()
    return result
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return errorMessage
  }
})

ipcMain.handle('data-insert', async (_event, payload: any) => {
  //const SetDomain = await getEndpoint()
  try {
    const response = await net.fetch(InsertAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify(payload)
    })
    const result = await response.json()
    return result;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return errorMessage
  }
})

ipcMain.handle('orderPrint', (_event, payload) => {
  //console.log(payload)
  printWindow = new BrowserWindow({
    width: 950,
    height: 670,
    minWidth: 950,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: is.dev
        ? join(__dirname, '../preload/index.mjs')
        : join(app.getAppPath(), 'out/preload/index.mjs'),
      sandbox: false
    }
  })

  printWindow.on('ready-to-show', () => {
    printWindow?.show()
  })
  const url = `http://localhost:5173/#/${payload}`
  printWindow.loadURL(url)

})


ipcMain.handle('productEditWindow', (_eventt, payload) => {
  //console.log(payload)
  printWindow = new BrowserWindow({
    width: 950,
    height: 670,
    minWidth: 950,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: is.dev
        ? join(__dirname, '../preload/index.mjs')
        : join(app.getAppPath(), 'out/preload/index.mjs'),
      sandbox: false
    }
  })

  printWindow.on('ready-to-show', () => {
    printWindow?.show()
  })
  const url = `http://localhost:5173/#/${payload}`
  printWindow.loadURL(url)

})


ipcMain.handle('Print-Ready', () => {

  printWindow?.webContents.print({ silent: false, printBackground: false }, () => {
    //printWindow.close()
  })
})




ipcMain.handle('printStatus', async (_event, payload: any) => {
  try {
    const response = await net.fetch(InsertAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify(payload)
    })
    const result = await response.json()
    return result;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return errorMessage
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
