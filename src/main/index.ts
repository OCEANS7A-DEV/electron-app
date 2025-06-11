import { app, shell, BrowserWindow, ipcMain, net, Notification } from 'electron'
import { join } from 'path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Store from 'electron-store'
import log from 'electron-log'
import updater from 'electron-updater'
const { autoUpdater } = updater
import puppeteer from "puppeteer"
import os from 'os';

import fs from 'fs';
import path from 'path';
//import https from 'https';



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


let isFirstRunUpdate = true
let updaterWindow: BrowserWindow | null = null

const createUpdaterWindow = () => {
  updaterWindow = new BrowserWindow({
    width: 300,
    height: 500,
    resizable: false,
    autoHideMenuBar: true,
    frame: false,
    show: false,
    webPreferences: {
      preload: is.dev
        ? join(__dirname, '../preload/index.mjs')
        : join(app.getAppPath(), 'out/preload/index.mjs'),
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
    setTimeout(() => {
      if (updaterWindow && !updaterWindow.isDestroyed() && is.dev) {
        updaterWindow.webContents.openDevTools({ mode: 'detach' });
      }
    }, 300);
  
    if (is.dev) {
      if (updaterWindow && !updaterWindow.isDestroyed()) {
        updaterWindow.webContents.send('check', { status: 'dev', value: true });
      }
    }
    if (updaterWindow && !updaterWindow.isDestroyed()) {
      updaterWindow.webContents.send('progress', {
        percent: 0,
        message: '起動中...',
        status: 'start'
      });
    }
    StartUpSet()
    isFirstRunUpdate = true
    setupAutoUpdater()
  })
}


let mainWindow: BrowserWindow



function createWindow(): void {
  mainWindow = new BrowserWindow({
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
      sandbox: false,
      webSecurity: false,
      webviewTag: true,
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    if (is.dev) {
      mainWindow.webContents.openDevTools()
    }
    updaterWindow?.webContents.send('check', {
      status: 'bootCheck',
      value: true
    })
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  NotificationEXE('アプリが起動しました')
}



let printWindow: BrowserWindow | null = null;






export const productGet = async () => {
  try {
    const response = await net.fetch(GetAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify({ sheetName: '在庫一覧', action: 'ListGet', ranges: 'A2:N' })
    })
    const result = await response.json()
    return result
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return errorMessage
  }
}

export const productTypesGet = async () => {
  try {
    const response = await net.fetch(GetAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify({ sheetName: '商品タイプ一覧', action: 'ListGet', ranges: 'A2:B' })
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
      body: JSON.stringify({ sheetName: '業者一覧', action: 'ListGet', ranges: 'A2:B' })
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

export const ProductDetails = async () => {
  try {
    const response = await net.fetch(GetAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify({ sheetName: '商品詳細一覧', action: 'ListGet', ranges: 'A2:B' })
    })
    const result = await response.json()
    return result
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return errorMessage
  }
}

export const StartUpSet = async () => {
  const list = await productGet()

  const ListResult = list.map((item) => {
    const result = {
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
      order: item[11],
      vendorid: item[13]
    }
    return result
  })

  store.set('data', ListResult)

  const types = await productTypesGet()

  store.set('types', types)

  const VendorList = await vendorGet()

  store.set('vendor', VendorList)

  const AddressList = await addressGet()

  store.set('address', AddressList)

  const productDetails = await ProductDetails()

  store.set('details', productDetails)



  if (updaterWindow && !updaterWindow.isDestroyed()) {
    updaterWindow.webContents.send('check', {
      status: 'startup',
      value: true
    })
  }
}







const setupAutoUpdater = () => {
  autoUpdater.on('checking-for-update', () => {
    log.info('アップデートを確認中...')
  })

  autoUpdater.on('update-available', () => {
    log.info('アップデートが利用可能です。')
    // NotificationEXE('アップデートが利用可能です。')
    // try{
    //   if (mainWindow) {
    //     mainWindow.webContents.send('update-available', true)
    //   }
    // }catch{
    //   // エラー時は何もしない
    // }
    
  })

  autoUpdater.on('download-progress', (progressObj) => {
    const percent = Math.floor(progressObj.percent)
    try{
      if (updaterWindow && !updaterWindow.isDestroyed()) {
        updaterWindow?.webContents.send('progress', {
          percent: percent,
          message: 'ダウンロード中...',
          status: 'downloading'
        })
      }
    }catch{
      // エラー時は何もしない
      createWindow()
    }
    
    
  })

  autoUpdater.on('update-not-available', () => {
    log.info('アップデートはありません。')

    if (isFirstRunUpdate) {
      createWindow()
    }
    
    try{
      if (mainWindow) {
        mainWindow.webContents.send('update-available', false)
      }
    }catch{
      // エラー時は何もしない
      createWindow()
    }
    
  })

  autoUpdater.on('error', (error) => {
    log.error('アップデートエラー:', error)
    createWindow()
  })

  autoUpdater.on('update-downloaded', () => {
    log.info('アップデート完了。再起動して更新します。')

    if (isFirstRunUpdate) {
      autoUpdater.quitAndInstall()
    } else {
      log.info('定期チェックのアップデートは即時インストールしません')
      // → UI通知 or 次回起動時適用などに切り替え可能
      NotificationEXE('アップデートが利用可能です。')
      try{
        if (mainWindow) {
          mainWindow.webContents.send('update-available', true)
        }
      }catch{
        // エラー時は何もしない
        createWindow()
      }
    }
  })
}




app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.OCEANS7A-DEV.Oceanstockman')
  await createUpdaterWindow()

  if (!is.dev) {
    isFirstRunUpdate = true
    setupAutoUpdater()
    autoUpdater.checkForUpdates()
    setInterval(() => {
      isFirstRunUpdate = false
      log.info('定期アップデート確認中...')
      autoUpdater.checkForUpdates()
    }, 30 * 1000)
  }



  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

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


  // if(is.dev){
  //   updaterWindow?.webContents.send('check', {
  //     status: 'dev',
  //     value: true
  //   })
  // }
  
})




ipcMain.handle('product-list', async () => {
  const data = await store.get('data')
  return data
})

ipcMain.handle('vendor-list', async () => {
  const data = await store.get('vendor')
  return data
})

ipcMain.handle('details-list', async () => {
  const data = await store.get('details')
  return data
})

ipcMain.handle('shortageGet', async () => {
  const data = await shortageGet()
  return data
})

ipcMain.handle('storeSet', async (_event, key, value) => {
  store.set(key, value)
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
  const url = is.dev && process.env['ELECTRON_RENDERER_URL']
    ? `${process.env['ELECTRON_RENDERER_URL']}#/${payload}`
    : `file://${join(app.getAppPath(), 'out/renderer/index.html')}#/${payload}`
  printWindow.loadURL(url)
})

ipcMain.on('button-Upgrade', () => {
  autoUpdater.quitAndInstall()
})

ipcMain.on('Main-boot', () => {
  createWindow()
})

ipcMain.on('startUpClose', () => {
  try{
    if (updaterWindow && !updaterWindow.isDestroyed()) {
      updaterWindow.close()
      updaterWindow = null
    }
  }catch{
    // エラー時は何もしない
  }
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
  if (is.dev) {
    printWindow.loadURL(url)
  } else {
    printWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

})


ipcMain.handle('Print-Ready', () => {

  printWindow?.webContents.print({ silent: false, printBackground: false }, () => {
    //printWindow.close()
  })
})



ipcMain.handle('now-DateGet', () => {
  const id = 'OCEAN_HQ'
  const now = new Date();
  const DateTime = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(now);

  return [id, DateTime]
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

ipcMain.handle('hellowork-get', async () => {
  async function scrapeHelloWork() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // 検索画面を開く
    await page.goto('https://www.hellowork.mhlw.go.jp/kensaku/GECA110010.do?action=initDisp&screenId=GECA110010', {
      waitUntil: 'networkidle2'
    });

    await page.type('input[name="jGSHNoJo"]', '3401')
    await page.type('input[name="jGSHNoChuu"]', '625381')
    await page.type('input[name="jGSHNoGe"]', '7')

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('input[name="searchNoBtn"]'),
    ]);


    const jobData = await page.evaluate(() => {
      const jobs = [];

      const tables = document.querySelectorAll('table.kyujin');

      tables.forEach(table => {
        const job = {};

        // 職種
        const shokushu = table.querySelector('.kyujin_head strong')?.parentElement?.nextElementSibling?.textContent?.trim();
        job.職種 = shokushu;

        // 受付年月日・紹介期限日（テキストからではなく <div> から正確に）
        const dateRow = Array.from(table.querySelectorAll('tr')).find(tr => tr.textContent.includes('受付年月日'));
        const dateDivs = dateRow?.querySelectorAll('div') ?? [];

        job.受付年月日 = dateDivs[1]?.textContent?.trim() ?? '';
        job.紹介期限日 = dateDivs[2]?.textContent?.trim() ?? '';

        // 左テーブル項目（ラベルと値ペア）
        const leftTds = table.querySelectorAll('.left-side table tr');
        leftTds.forEach(tr => {
          const label = tr.querySelector('td:nth-child(1)')?.textContent?.trim();
          const value = tr.querySelector('td:nth-child(2)')?.innerText?.replace(/\s+/g, ' ').trim();
          if (label) job[label] = value;
        });

        // 右テーブル項目（同上）
        const rightTds = table.querySelectorAll('.right-side table tr');
        rightTds.forEach(tr => {
          const label = tr.querySelector('td:nth-child(1)')?.textContent?.trim();
          const value = tr.querySelector('td:nth-child(2)')?.innerText?.replace(/\s+/g, ' ').trim();
          if (label) job[label] = value;
        });

        // こだわり条件
        const kodawari = Array.from(table.querySelectorAll('.kodawari span.nes_label.any')).map(span => span.textContent.trim());
        job.こだわり条件 = kodawari;

        const link = table.querySelector('#ID_kyujinhyoBtn')?.getAttribute('href');
        if (link) {
          job.求人票URL = link;
        }

        // 求人数
        const kyujinCount = table.querySelector('tr:last-of-type')?.textContent?.match(/求人数：(.+?)名/)?.[1]?.trim();
        job.求人数 = kyujinCount;

        jobs.push(job);
      });

      return jobs;
    });

    return jobData
  }

  //scrapeHelloWork().catch(console.error);
  const result = scrapeHelloWork().catch(console.error);
  return result
})


ipcMain.handle('hellowork-PDF', async (_event, relativeUrl: string, filename: string) => {
  const baseUrl = 'https://www.hellowork.mhlw.go.jp/kensaku/';
  const jobUrl = new URL(relativeUrl, baseUrl).toString();
  const downloadsPath = path.join(os.homedir(), 'Downloads', `${filename}.pdf`);

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Puppeteerで自動ダウンロード先を設定
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: path.dirname(downloadsPath),
  });

  await page.goto(jobUrl, { waitUntil: 'networkidle2' });

  // iframeの中から目的のフレームを探す
  const frames = page.frames();
  const targetFrame = frames.find(f => f.url().includes('GECA110010.do'));

  if (!targetFrame) {
    //await browser.close();
    throw new Error('対象のiframeが見つかりませんでした');
  }


  const tagNames = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    return Array.from(elements).map(el => ({
      tag: el.tagName.toLowerCase(),
      id: el.id,
      className: el.className,
      name: el.getAttribute('name'),
      type: el.getAttribute('type'),
      role: el.getAttribute('role'),
      ariaLabel: el.getAttribute('aria-label'),
    }));
  });


  return tagNames;
});







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



const NotificationEXE = (bodyString) => {
  new Notification({
    title: '通知',
    body: bodyString
  }).show()
}
const userDataDir = path.join(app.getPath('userData'), 'files');

ipcMain.handle('get-file-list', async () => {
  if (!fs.existsSync(userDataDir)) return [];
  const files = fs.readdirSync(userDataDir);
  return files;
});

ipcMain.handle('get-file-path', async ( _event, filename ) => {
  const fullPath = path.join(app.getPath('userData'), 'files', filename);
  return fullPath;
});
