import { app, shell, BrowserWindow, ipcMain, net, Notification, IpcMainInvokeEvent, dialog } from 'electron'
import { join } from 'path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Store from 'electron-store'
import log from 'electron-log'
import updater from 'electron-updater'
const { autoUpdater } = updater
import puppeteer from 'puppeteer'
import { Browser, Page } from 'puppeteer'
import os from 'os';

import fs from 'fs';
import path from 'path';

import { execFile } from 'child_process';



import PDFMerger from 'pdf-merger-js';

//import https from 'https';

//

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

export const DetailsGet = async () => {
  try {
    const response = await fetch(GetAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify({
        sheetName: '',
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
    } catch {
      // エラー時は何もしない
      if (!mainWindow){
        createWindow()
      }
    }
    
    
  })

  autoUpdater.on('update-not-available', () => {
    log.info('アップデートはありません。')

    if (isFirstRunUpdate) {
      if (!mainWindow){
        createWindow()
      }
    }
    try{
      if (mainWindow) {
        mainWindow.webContents.send('update-available', false)
      }
    } catch {
      // エラー時は何もしない
      if (!mainWindow){
        createWindow()
      }
    }
  })

  autoUpdater.on('error', (error) => {
    log.error('アップデートエラー:', error)
    if (!mainWindow){
      createWindow()
    }
  })

  autoUpdater.on('update-downloaded', () => {
    log.info('アップデート完了。再起動して更新します。')
    

    if (isFirstRunUpdate) {
      NotificationEXE('再起動して更新します。')
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
        if (!mainWindow){
          createWindow()
        }
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
      if (mainWindow) {
        isFirstRunUpdate = false
        log.info('定期アップデート確認中...')
        autoUpdater.checkForUpdates()
      }
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



// ipcMain.handle('hellowork-get', async () => {
//   async function scrapeHelloWork() {
//     const browser = await puppeteer.launch({ 
//       headless: true,
//       args: [
//         '--no-sandbox',
//         '--disable-setuid-sandbox',
//         '--disable-cache',
//         '--disable-application-cache',
//         '--disk-cache-size=0',
//       ],
//     });
//     const page = await browser.newPage();

//     // 検索画面を開いて検索条件を入力
//     await page.goto(
//       'https://www.hellowork.mhlw.go.jp/kensaku/GECA110010.do?action=initDisp&screenId=GECA110010',
//       { waitUntil: 'networkidle2' }
//     );
//     await page.type('input[name="jGSHNoJo"]', '3401');
//     await page.type('input[name="jGSHNoChuu"]', '625381');
//     await page.type('input[name="jGSHNoGe"]', '7');
//     await Promise.all([
//       page.waitForNavigation({ waitUntil: 'networkidle2' }),
//       page.click('input[name="searchNoBtn"]'),
//     ]);

//     const allJobs: any[] = [];
//     let pageIndex = 1;

//     while (true) {
//       //console.log(`📄 ページ ${pageIndex} をスクレイピング中…`);

//       // 現ページの求人テーブルを評価
//       const jobsOnPage = await page.evaluate(() => {
//         const jobs: any[] = [];
//         const tables = document.querySelectorAll('table.kyujin');
//         tables.forEach(table => {
//           const job: any = {};

//           // 職種
//           job.職種 = table
//             .querySelector('.kyujin_head strong')
//             ?.parentElement?.nextElementSibling?.textContent?.trim() ?? '';

//           // 受付年月日・紹介期限日
//           const dateRow = Array.from(table.querySelectorAll('tr')).find(tr =>
//             tr.textContent?.includes('受付年月日')
//           );
//           const dateDivs = dateRow?.querySelectorAll('div') ?? [];
//           job.受付年月日 = dateDivs[1]?.textContent?.trim() ?? '';
//           job.紹介期限日 = dateDivs[2]?.textContent?.trim() ?? '';

//           const leftTds = table.querySelectorAll('.left-side table tr');
//           leftTds.forEach(tr => {
//             const label = tr.querySelector('td:nth-child(1)')?.textContent?.trim();
//             const td = tr.querySelector('td:nth-child(2)');
//             const value = (td as HTMLElement)?.innerText?.replace(/\s+/g, ' ').trim();
//             if (label) job[label] = value;
//           });
//           // 右テーブル項目（同上）
//           const rightTds = table.querySelectorAll('.right-side table tr');
//           rightTds.forEach(tr => {
//             const label = tr.querySelector('td:nth-child(1)')?.textContent?.trim();
//             const td = tr.querySelector('td:nth-child(2)');
//             const value = (td as HTMLElement)?.innerText?.replace(/\s+/g, ' ').trim();
//             if (label) job[label] = value;
//           });

//           // こだわり条件
//           job.こだわり条件 = Array.from(
//             table.querySelectorAll('.kodawari span.nes_label.any')
//           ).map(span => span.textContent?.trim());

//           // 求人票URL
//           job.求人票URL =
//             table.querySelector('#ID_kyujinhyoBtn')?.getAttribute('href') ?? '';

//           // 求人数
//           job.求人数 =
//             table
//               .querySelector('tr:last-of-type')
//               ?.textContent?.match(/求人数：(.+?)名/)?.[1]
//               ?.trim() ?? '';

//           jobs.push(job);
//         });
//         return jobs;
//       });
//       allJobs.push(...jobsOnPage);
//       const nextButton = await page.$('input[name="fwListNaviBtnNext"]');
//       if (!nextButton) {
//         break;
//       }
//       const isDisabled = await nextButton.evaluate((btn: HTMLInputElement) => btn.disabled);
//       if (isDisabled) {
//         break;
//       }
//       pageIndex++;
//       await Promise.all([
//         page.waitForNavigation({ waitUntil: 'networkidle2' }),
//         nextButton.click(),
//       ]);
    
//     }
//     return allJobs;
//   }
//   try {
//     const result = await scrapeHelloWork();
//     return result;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// });


ipcMain.handle('hellowork-get', async () => {
  async function scrapeHelloWork() {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-cache',
        '--disable-application-cache',
        '--disk-cache-size=0',
      ],
    });
    const page = await browser.newPage();

    // 検索画面を開いて検索条件を入力
    await page.goto(
      'https://kyujin.hellowork.mhlw.go.jp/kyujin/GEAB040010.do?action=initDisp&screenId=GEAB040010',
      { waitUntil: 'networkidle2' }
    );
    await page.type('input[name="mail"]', 'oceans7a@gmail.com');
    await page.type('input[name="password"]', 'ocean@1115');

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[name="loginBtn"]'),
    ]);

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.evaluate(() => {
        const btn = document.getElementById('ID_yukoKyujinBtn') as HTMLAnchorElement;
        if (!btn) throw new Error('ボタンが見つかりません');
        btn.click();
      })
    ]);

    const allJobs: any[] = [];
    let pageIndex = 1;

    while (true) {
      const jobsOnPage = await page.evaluate(() => {
        const jobs: any[] = [];

        const tables = document.querySelectorAll('table.kyujin');
        tables.forEach(table => {
          const job: any = {};

          // 職種
          job.職種 = table
            .querySelector('.kyujin_head strong')
            ?.parentElement?.nextElementSibling?.textContent?.trim() ?? '';


          job.status = table
            .querySelector('.nes_label.nes')
            ?.textContent
            ?.trim() ?? '';


          // 受付年月日・紹介期限日
          const dateRow = Array.from(table.querySelectorAll('tr')).find(tr =>
            tr.textContent?.includes('受付年月日')
          );
          const dateDivs = dateRow?.querySelectorAll('div') ?? [];
          job.受付年月日 = dateDivs[1]?.textContent?.trim() ?? '';
          job.紹介期限日 = dateDivs[2]?.textContent?.trim() ?? '';

          const leftTds = table.querySelectorAll('.left-side table tr');
          leftTds.forEach(tr => {
            const label = tr.querySelector('td:nth-child(1)')?.textContent?.trim();
            const td = tr.querySelector('td:nth-child(2)');
            const value = (td as HTMLElement)?.innerText?.replace(/\s+/g, ' ').trim();
            if (label) job[label] = value;
          });
          // 右テーブル項目（同上）
          const rightTds = table.querySelectorAll('.right-side table tr');
          rightTds.forEach(tr => {
            const label = tr.querySelector('td:nth-child(1)')?.textContent?.trim();
            const td = tr.querySelector('td:nth-child(2)');
            const value = (td as HTMLElement)?.innerText?.replace(/\s+/g, ' ').trim();
            if (label) job[label] = value;
          });

          // こだわり条件
          job.こだわり条件 = Array.from(
            table.querySelectorAll('.kodawari span.nes_label.any')
          ).map(span => span.textContent?.trim());

          // 求人票URL
          job.求人票URL =
            table.querySelector('#ID_kyujinhyoBtn')?.getAttribute('href') ?? '';

          // 求人数
          job.求人数 =
            table
              .querySelector('tr:last-of-type')
              ?.textContent?.match(/求人数：(.+?)名/)?.[1]
              ?.trim() ?? '';
          
          job.detailUrl = table.querySelector('#ID_dispDetailBtn')?.getAttribute('href') ?? '';
          
          jobs.push(job);
        });
        return jobs;
      });

      allJobs.push(...jobsOnPage);
      const nextButton = await page.$('input[name="fwListNaviBtnNext"]');
      if (!nextButton) {
        break;
      }
      const isDisabled = await nextButton.evaluate((btn: HTMLInputElement) => btn.disabled);
      if (isDisabled) {
        break;
      }
      pageIndex++;
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        nextButton.click(),
      ]);
    
    }
    const filterd = allJobs.filter(item => item.status !== '非公開')


    const jushos: string[] = [];

    for (const item of filterd) {
      // detailUrl は e.g. "./GEAB100020.do?…” のような相対パス
      const url = new URL(item.detailUrl, page.url()).toString();

      try {
        // 詳細ページへ移動
        await page.goto(url, { waitUntil: 'networkidle2' });
      } catch (err) {
        //console.warn(`詳細ページへ移動失敗: ${url}`, err);
        jushos.push('');
        continue;
      }

      let address = '';
      try {
        // 要素取得。見つからなければ null が返る
        const cell = await page.$('div[name="shgBsJusho"]');
        const cellSub = await page.$('div[name="gsShgBsJusho"]');
        if (cell && !cellSub) {
          address = (await page.evaluate(el => el.textContent, cell))?.trim() ?? '';
        } else if (cellSub && !cell){
          address = (await page.evaluate(el => el.textContent, cellSub))?.trim() ?? '';
        } else {
          //console.info(`住所セルなし: ${url}`);
          address = '';
        }
      } catch (err) {
        //console.error(`住所取得中にエラー: ${url}`, err);
        address = '';
      }
      const pushdata = item
      pushdata.address = address

      jushos.push(pushdata);

      // 一覧ページに戻る
      try {
        await page.goBack({ waitUntil: 'networkidle2' });
      } catch (err) {
        console.warn('一覧ページに戻れませんでした:', err);
        // 必要なら再度一覧URLへ飛ばすか break する
      }
    }

    return [filterd, jushos];
  }
  try {
    const result = await scrapeHelloWork();
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
});




interface Works {
  'こだわり条件': any[];
  '事業所名': string;
  '仕事の内容': string;
  '休日': string;
  '公開範囲': string;
  '受付年月日': string;
  '就業場所': string;
  '就業時間': string;
  '年齢': string;
  '求人区分': string;
  '求人番号': string;
  '求人票URL': string;
  '紹介期限日': string;
  '職種': string;
  '賃金（手当等を含む）': string;
  '雇用形態': string;
  'status': string;
  'address': string;
}
// https://kyujin.hellowork.mhlw.go.jp/kyujin/GEAB100020.do?screenId=GEAB100020&action=kyujinhyoBtn&kjNo=3401031501251&kariTrkNo=&kjKbn1=1&kjKbn1Shsi=+
//const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
ipcMain.handle(
  'hellowork-PDF',
  async (_event: IpcMainInvokeEvent, lists: Works[]) => {
    const total = lists.length
    let count = 0

    const date = new Date()
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const today = `${y}.${m}.${d}`
    const downloadDir = path.join(os.homedir(), 'Downloads', `ハロワPDFs${today}`);
    // フォルダがなければ作成する
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    let browser: Browser | null = null;
    let page: Page | null = null;
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-cache',
        '--disable-application-cache',
        '--disk-cache-size=0',
      ],
    });
    page = await browser.newPage();
    await page.goto(
      'https://kyujin.hellowork.mhlw.go.jp/kyujin/GEAB040010.do?action=initDisp&screenId=GEAB040010',
      { waitUntil: 'networkidle2' }
    );
    await page.type('input[name="mail"]', 'oceans7a@gmail.com');
    await page.type('input[name="password"]', 'ocean@1115');

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[name="loginBtn"]'),
    ]);
    

    for (const item of lists) {
      const afterNewline = item.address
        .split(/\r?\n/)
        .filter(line => line.trim() !== '')
        .pop()!
        .trim();
      const filename = `${afterNewline}_${item.求人区分}_${item.職種}`;
      try{
        count = count + 1
        //const downloadDir = path.join(os.homedir(), 'Downloads');
        const finalFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
        const downloadsPath = path.join(downloadDir, finalFilename);
        const jobUrl = `https://kyujin.hellowork.mhlw.go.jp/kyujin/${item.求人票URL}`

        

        try {
          // 1) Puppeteer でページにアクセスし、クッキーを取得
          await page.goto(jobUrl, { waitUntil: 'networkidle2', timeout: 60000 });

          // 2) セッション維持用の Cookie を抜き出す
          const cookies = await page.cookies();
          const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

          // 3) Puppeteer は閉じてもOK
          //await browser.close();
          browser = null;

          const res = await fetch(jobUrl, {
            headers: { Cookie: cookieHeader },
          });
          if (!res.ok) {
            throw new Error(`HTTP エラー ${res.status} ${res.statusText}`);
          }
          // arrayBuffer→Buffer に変換
          const arrayBuffer = await res.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          if (buffer.length < 10000) {
            throw new Error(`取得データが小さすぎます (${buffer.length} bytes)`);
          }

          fs.writeFileSync(downloadsPath, buffer);
          mainWindow.webContents.send('helloWork-progress', { count: count, total: total, success: item.求人番号, url: jobUrl });

        } catch (err: any) {
          console.error('❌ PDFダウンロード失敗:', err);
          mainWindow.webContents.send('helloWork-progress', { count: count, total: total, error: item.求人番号, url: filename });
        } finally {
          //mainWindow.webContents.send('helloWork-progress', { count: count, total: total });
          if (browser) await browser.close();
        }
      } catch (e) {
        //
      }
    }

    PDFfileMarge()
      
    
    NotificationEXE('すべてのPDFのダウンロード完了')
  }
);




ipcMain.on('PDF-Marge', () => {
  PDFfileMergeBuild()
})




const PDFfileMarge = async (): Promise<{
  canceled: boolean;
  output?: string;
  error?: string;
}> => {
  
  const qpdfBinary = getQpdfBinaryPath();
  // 存在確認
  const exists = fs.existsSync(qpdfBinary);
  log.info(`QPDF exists?: ${exists}`);
  if (!exists) {
    return { canceled: true, error: `バイナリが見つかりません: ${qpdfBinary}` };
  }
  // さらに親フォルダの一覧も出す
  const parent = path.dirname(qpdfBinary);
  log.info('Parent folder contents:', fs.readdirSync(parent));


  
  try{
    const { filePaths, canceled } = await dialog.showOpenDialog({
      title: 'PDF を結合するフォルダを選択',
      properties: ['openDirectory']
    });
    if (canceled || filePaths.length === 0) {
      return { canceled: true };
    }
    const folder = filePaths[0];

    // 2) フォルダ内の PDF リスト取得
    const pdfFiles = (await fs.promises.readdir(folder))
      .filter(f => f.toLowerCase().endsWith('.pdf'))
      .map(f => path.join(folder, f))


    if (pdfFiles.length < 2) {
      // canceled を必ず含める
      return { canceled: true, error: 'PDF が 2 つ以上必要です。' };
    }

    // 3) 保存先ダイアログ
    const { filePath: outPath, canceled: saveCanceled } = await dialog.showSaveDialog({
      title: '結合後の PDF を保存',
      defaultPath: path.join(folder, 'merged.pdf'),
      filters: [{ name: 'PDF', extensions: ['pdf'] }]
    });
    if (saveCanceled || !outPath) {
      return { canceled: true };
    }

    // 4) QPDF Portable バイナリパス
    const base = app.isPackaged
      ? process.resourcesPath
      : path.resolve(__dirname, '../../vendor/qpdf');
    const qpdfBinary = path.join(base, 'bin', process.platform === 'win32' ? 'qpdf.exe' : 'qpdf');

    console.log('▶️ using qpdfBinary:', qpdfBinary);
    if (!fs.existsSync(qpdfBinary)) {
      return { canceled: true, error: `qpdf バイナリが見つかりません: ${qpdfBinary}` };
    }

    const args = ['--empty', '--pages', ...pdfFiles, '--', outPath];

    return new Promise(resolve => {
      execFile(qpdfBinary, args, (err, stdout, stderr) => {
        // まず err を必ずログ出力
        if (err) {
          log.info(err)
          console.error('execFile エラー:', err);
        }
        if (stdout) {
          log.info('qpdf stdout:', stdout)
          console.log('qpdf stdout:', stdout);
        }
        if (stderr) {
          log.info('qpdf stderr:', stderr)
          console.warn('qpdf stderr:', stderr);
        }

        if (err) {
          // err.message も返す
          resolve({ canceled: true, error: err.message });
        } else {
          resolve({ canceled: false, output: outPath });
        }
      });
    });
  } catch (err: any) {
    log.info(err);
    console.error('PDFfileMarge で予期せぬエラー:', err);
    // ここでも必ず返す
    return { canceled: true, error: err.message || String(err) };
  }
};

const getQpdfBinaryPath = (): string => {
  const p = app.isPackaged
    ? path.join(process.resourcesPath, 'qpdf', 'bin', process.platform === 'win32' ? 'qpdf.exe' : 'qpdf')
    : path.resolve(__dirname, '../../vendor/qpdf/bin', process.platform === 'win32' ? 'qpdf.exe' : 'qpdf');
  log.info('QPDF path:', p);
  return p;
};



const PDFfileMergeBuild = async (): Promise<{
  canceled: boolean;
  output?: string;
  error?: string;
}> => {
  try {
    // 1) フォルダ選択
    const { filePaths, canceled } = await dialog.showOpenDialog({
      title: 'PDF を結合するフォルダを選択',
      properties: ['openDirectory']
    });
    if (canceled || filePaths.length === 0) {
      return { canceled: true };
    }
    const folder = filePaths[0];

    // 2) フォルダ内の PDF リスト取得
    const pdfFiles = (await fs.promises.readdir(folder))
      .filter(f => f.toLowerCase().endsWith('.pdf'))
      .map(f => path.join(folder, f))
      .sort();

    if (pdfFiles.length < 2) {
      return { canceled: true, error: 'PDF が 2 つ以上必要です。' };
    }

    // 3) 保存先ダイアログ
    const { filePath: outPath, canceled: saveCanceled } = await dialog.showSaveDialog({
      title: '結合後の PDF を保存',
      defaultPath: path.join(folder, 'merged.pdf'),
      filters: [{ name: 'PDF', extensions: ['pdf'] }]
    });
    if (saveCanceled || !outPath) {
      return { canceled: true };
    }

    // 4) pdf-merger-js で結合
    const merger = new PDFMerger();
    for (const file of pdfFiles) {
      merger.add(file);
    }
    await merger.save(outPath);

    // 5) 成功表示
    dialog.showMessageBox({
      type: 'info',
      title: 'PDF結合完了',
      message: 'PDF の結合が正常に完了しました！',
      detail: `保存先：${outPath}`,
      buttons: ['OK']
    });

    return { canceled: false, output: outPath };
  } catch (err: any) {
    log.error('PDFfileMerge でエラー:', err);
    dialog.showErrorBox('PDF結合エラー', err.message || String(err));
    return { canceled: true, error: err.message || String(err) };
  }
};









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
