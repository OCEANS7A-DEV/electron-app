import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  net,
  Notification,
  IpcMainInvokeEvent,
  dialog,
  session
} from 'electron'
import { join } from 'path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Store from 'electron-store'
import log from 'electron-log'
import updater from 'electron-updater'
const { autoUpdater } = updater
import puppeteer, { LaunchOptions } from 'puppeteer-core'
import { Browser } from 'puppeteer-core'
import os from 'os'
import fs from 'fs'
import path from 'path'
import { execFile } from 'child_process'
import keytar from 'keytar'
import prompt from 'electron-prompt'
import Database from 'better-sqlite3'
import crypto from 'crypto'
import iconv from 'iconv-lite'

import { HelloWorkGet, HelloWorkPdfGet } from './helloworkMain'
import { WindowStatus } from './WindowCreate'
//PrintWindowCreate

import { CookieSetup } from './logic'

const userDataPath = app.getPath('userData')
const userDataDirPath = path.resolve('./puppeteer_user_data')
const dbDirectory = path.join(userDataPath, 'database')

if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true })
}

const dbPath = path.join(dbDirectory, 'my-data.sqlite3')

let DB!: Database.Database

const initDB = (dbPath: string) => {
  try {
    DB = new Database(dbPath);
    console.log(`データベースを ${dbPath} に接続しました。`)
  } catch (error) {
    console.error("データベースの接続に失敗しました:", error)
    DB = null
    throw error
  }
}

function getDB(): Database.Database {
  if (!DB) {
    throw new Error("DB is not initialized")
  }
  return DB
}

// 初期化
initDB(dbPath)

// テーブル作成
const db = getDB()

const createMemoMainTable = db.prepare(
  `CREATE TABLE IF NOT EXISTS MemoMain (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sub_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    remarks TEXT,
    create_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    update_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    delete_Flg INTEGER DEFAULT 0
  )`
)
createMemoMainTable.run()

const createMemoDetailTable = db.prepare(
  `CREATE TABLE IF NOT EXISTS MemoDetail (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    sub_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    remarks TEXT,
    check_Flg INTEGER DEFAULT 0,
    create_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    update_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    delete_Flg INTEGER DEFAULT 0
  )`
)
createMemoDetailTable.run()

const gotTheLock = app.requestSingleInstanceLock()
const windowManager = new Map()

log.transports.file.level = 'info'
autoUpdater.logger = log

const SERVICE = 'electron-app'
const ACCOUNT = 'OCEANS7A-DEV'

async function getOrPromptToken(launcherWindow: BrowserWindow): Promise<string> {
  let token = await keytar.getPassword(SERVICE, ACCOUNT)
  //console.log(token)
  if (!token) {
    token = (await prompt(
      {
        title: 'GitHub トークンの入力',
        label: 'Personal Access Token:',
        inputAttrs: {
          type: 'password'
        },
        width: 400,
        height: 200,
        alwaysOnTop: true
      },
      launcherWindow.webContents
    )) as string | null
    if (!token) {
      app.quit()
      log.error('GitHub トークンが入力されませんでした')
      throw new Error('GitHub トークンが入力されませんでした')
    }
    await keytar.setPassword(SERVICE, ACCOUNT, token)
    if (token) {
      if (!is.dev) {
        restartApp()
      } else {
        app.quit()
      }
    }
  }
  return token
}

async function updateOrPromptToken(launcherWindow: BrowserWindow): Promise<string> {
  let token = await keytar.getPassword(SERVICE, ACCOUNT)
  token = (await prompt(
    {
      title: 'GitHub トークンの入力',
      label: 'Personal Access Token:',
      inputAttrs: {
        type: 'password'
      },
      width: 400,
      height: 200,
      alwaysOnTop: true
    },
    launcherWindow.webContents
  )) as string
  await keytar.setPassword(SERVICE, ACCOUNT, token)
  return token
}

const PUPPETEER_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-cache',
  '--disable-application-cache',
  '--disk-cache-size=0'
]

function getPuppeteerOptions(): LaunchOptions {
  if (is.dev) {
    return {
      headless: true,
      channel: 'chrome',
      args: PUPPETEER_ARGS,
      userDataDir: userDataDirPath
    }
  } else {
    return {
      headless: true,
      channel: 'chrome',
      args: PUPPETEER_ARGS,
      userDataDir: userDataDirPath
    }
  }
}

const TokenCheck = async (token: string) => {
  let result = false
  const TEST_URL = 'https://api.github.com/repos/OCEANS7A-DEV/electron-app/releases/latest'

  try {
    const res = await net.fetch(TEST_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'electron',
        Authorization: `token ${token}`
      }
    })
    //log.info("🔍 TEST statusCode:", res.status);
    if (res.status === 200) {
      //console.log(res)
      result = true
    } else {
      const text = await res.text()
      log.warn('🔍 接続テスト body:', text)
    }
  } catch (err: any) {
    log.error('🔍 :', err.message)
    result = false
  }
  //console.log(result)
  return result
}

const store = new Store() as any

// const Img_URL =
//   'https://script.google.com/macros/s/AKfycbzCrMJDEFvfTTTCjb2b-8SwVgc2ySlsKwpf7c49H08DS6P4-ZulaS4zcNtiioytK0i6/exec'

const GetAPI_URL =
  'https://script.google.com/macros/s/AKfycbyu7GnlZ-yGcLn1j02ER3hiyKWeUcugopVAh4niSmM9j2_nIA9DhsXFu87PgKr4eBUBhA/exec'

const InsertAPI_URL = GetAPI_URL
let isFirstRunUpdate = true
let updaterWindow: BrowserWindow | null = null

const createUpdaterWindow = async () => {
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
  initAutoUpdater(updaterWindow!)
  const token = await keytar.getPassword(SERVICE, ACCOUNT)
  if (!token) {
    await getOrPromptToken(updaterWindow)
    return
  } else {
    const result = await TokenCheck(token)
    if (!result) {
      await updateOrPromptToken(updaterWindow)
      return
    } else {
      if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        updaterWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/#updater`)
      } else {
        updaterWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'updater' })
      }
      updaterWindow.once('ready-to-show', () => {
        updaterWindow?.show()
        setTimeout(() => {
          if (updaterWindow && !updaterWindow.isDestroyed() && is.dev) {
            updaterWindow.webContents.openDevTools({ mode: 'detach' })
          }
        }, 300)
        if (is.dev) {
          if (updaterWindow && !updaterWindow.isDestroyed()) {
            updaterWindow.webContents.send('check', { status: 'dev', value: true })
          }
        }
        if (updaterWindow && !updaterWindow.isDestroyed()) {
          updaterWindow.webContents.send('progress', {
            percent: 0,
            message: '起動中...',
            status: 'start'
          })
        }
        // StartUpSet()
        hasGoogleLoginCookie().then((isLoggedIn) => {
          if (!isLoggedIn) {
            createGoogleLoginWindow()
          } else {
            if (updaterWindow && !updaterWindow.isDestroyed()) {
              updaterWindow.webContents.send('check', { status: 'google', value: true })
            }
          }
        })
      })
    }
  }
}

let GoogleLoginWindow: BrowserWindow

const createGoogleLoginWindow = async () => {
  GoogleLoginWindow = new BrowserWindow(WindowStatus())
  GoogleLoginWindow.loadURL(GetAPI_URL)
  GoogleLoginWindow.on('ready-to-show', () => {
    GoogleLoginWindow.show()
    if (is.dev) {
      GoogleLoginWindow.webContents.openDevTools()
    }
  })
  GoogleLoginWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  GoogleLoginWindow.webContents.on('did-navigate', async (_evt, url) => {
    if (!url.startsWith(GetAPI_URL)) return
    const cookies = await GoogleLoginWindow.webContents.session.cookies.get({
      url: 'https://script.google.com'
    })
    const hasAuth = cookies.some((c) => ['SID', 'HSID', 'SSID', 'SAPISID'].includes(c.name))
    if (!hasAuth) return
  })
}

let zaikoWindow: BrowserWindow

function createZaikoWindow(): void {
  if (windowManager.has('zaiko')) {
    const win = windowManager.get('zaiko')
    if (win) win.focus()
    return
  }
  StartUpSet()
  zaikoWindow = new BrowserWindow(WindowStatus())
  AffterGet()
  DataUpdate('一覧', 'A2:M', 'data')
  windowManager.set('zaiko', zaikoWindow)
  zaikoWindow.on('ready-to-show', () => {
    zaikoWindow.show()
    if (is.dev) {
      zaikoWindow.webContents.openDevTools()
    }
    updaterWindow?.webContents.send('check', {
      status: 'bootCheck',
      value: true
    })
  })
  zaikoWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    zaikoWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    zaikoWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  zaikoWindow.on('closed', () => {
    windowManager.delete('zaiko')
  })
}

let launcherWindow: BrowserWindow

const createLauncherWindow = (): void => {
  if (windowManager.has('Launcher')) {
    const win = windowManager.get('Launcher')
    if (win) win.focus()
    return
  }

  launcherWindow = new BrowserWindow(WindowStatus())

  windowManager.set('Launcher', launcherWindow)

  launcherWindow.on('ready-to-show', () => {
    launcherWindow.show()
    if (is.dev) {
      launcherWindow.webContents.openDevTools()
    }
    updaterWindow?.webContents.send('check', {
      status: 'bootCheck',
      value: true
    })
  })

  launcherWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    launcherWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/#launcher`)
  } else {
    launcherWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'launcher' })
  }
  launcherWindow.on('closed', () => {
    windowManager.delete('Launcher')
  })
}

let HelloWorkWindow: BrowserWindow

const createHelloWorkWindow = (): void => {
  if (windowManager.has('HelloWork')) {
    const win = windowManager.get('HelloWork')
    if (win) win.focus()
    return
  }

  HelloWorkWindow = new BrowserWindow(WindowStatus())

  windowManager.set('HelloWork', HelloWorkWindow)

  HelloWorkWindow.on('ready-to-show', () => {
    HelloWorkWindow.show()
    if (is.dev) {
      HelloWorkWindow.webContents.openDevTools()
    }
    updaterWindow?.webContents.send('check', {
      status: 'bootCheck',
      value: true
    })
  })

  HelloWorkWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    HelloWorkWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/#HelloWork`)
  } else {
    HelloWorkWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'HelloWork' })
  }
  HelloWorkWindow.on('closed', () => {
    windowManager.delete('HelloWork')
  })
}

let OfficeWorkWindow: BrowserWindow

const createOfficeWorkWindow = (): void => {
  if (windowManager.has('OfficeWork')) {
    const win = windowManager.get('OfficeWork')
    if (win) win.focus()
    return
  }

  OfficeWorkWindow = new BrowserWindow(WindowStatus())

  windowManager.set('OfficeWork', OfficeWorkWindow)

  OfficeWorkWindow.on('ready-to-show', () => {
    OfficeWorkWindow.show()
    if (is.dev) {
      OfficeWorkWindow.webContents.openDevTools()
    }
    updaterWindow?.webContents.send('check', {
      status: 'bootCheck',
      value: true
    })
  })

  OfficeWorkWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    OfficeWorkWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/#PDFOperation`)
  } else {
    OfficeWorkWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: '#PDFOperation' })
  }
  OfficeWorkWindow.on('closed', () => {
    windowManager.delete('OfficeWork')
  })
}

let SettingWindow: BrowserWindow

const createSettingWindow = (): void => {
  if (windowManager.has('Setting')) {
    const win = windowManager.get('Setting')
    if (win) win.focus()
    return
  }

  SettingWindow = new BrowserWindow(WindowStatus())

  windowManager.set('Setting', SettingWindow)

  SettingWindow.on('ready-to-show', () => {
    SettingWindow.show()
    if (is.dev) {
      SettingWindow.webContents.openDevTools()
    }
    updaterWindow?.webContents.send('check', {
      status: 'bootCheck',
      value: true
    })
  })

  SettingWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    SettingWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/#systemSetting`)
  } else {
    SettingWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: '#systemSetting' })
  }
  SettingWindow.on('closed', () => {
    windowManager.delete('Setting')
  })
}

let printWindow: BrowserWindow | null = null

const hasGoogleLoginCookie = async (): Promise<boolean> => {
  const domains = ['https://accounts.google.com', 'https://www.google.com']
  const authCookieNames = ['SID', 'HSID', 'SSID', 'SAPISID']

  let allCookies = [] as Electron.Cookie[]

  for (const url of domains) {
    const cookies = await session.defaultSession.cookies.get({ url })
    allCookies = allCookies.concat(cookies)
  }

  return allCookies.some((c) => authCookieNames.includes(c.name))
}

const firstGet = async () => {
  const LastUpdatedDate = store.get('LastUpdatedDate') || ''
  try {
    const cookieHeader = await CookieSetup()
    const response = await net.fetch(GetAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieHeader
      },
      body: JSON.stringify({
        sheetName: '一覧',
        action: 'ProductsGet',
        ranges: 'A2:M',
        LastDate: LastUpdatedDate
      })
    })
    const result = await response.json()
    const ListResult = await result.ProductsData.map((item) => {
      return {
        vendor: item[1],
        code: item[2],
        name: item[3],
        defaultPrice: '',
        newPrice: item[4],
        VC: item[5],
        store: item[6],
        type: item[11],
        remarks: item[7],
        Possibility: item[12],
        service: item[9],
        order: item[8],
        vendorid: item[0],
        ImageURL: item[14]
      }
    })
    store.set('address', result.AddressData)
    store.set('storeList', result.StoresData)
    store.set('details', result.DetailsData)
    store.set('vendor', result.VenderData)
    store.set('data', ListResult)
    store.set('LastUpdatedDate', result.date)
    return
  } catch (err) {
    console.log(err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return errorMessage
  }
}

const AffterGet = async () => {
  const LastUpdatedDate = ''
  try {
    const cookies1 = await session.defaultSession.cookies.get({
      url: 'https://accounts.google.com'
    })
    const cookies2 = await session.defaultSession.cookies.get({ url: 'https://www.google.com' })
    const allCookies = [...cookies1, ...cookies2]
    const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ')
    const response = await net.fetch(GetAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieHeader
      },
      body: JSON.stringify({
        sheetName: '一覧',
        action: 'ProductsGet',
        ranges: 'A2:M',
        LastDate: LastUpdatedDate
      })
    })
    const result = await response.json()
    const ListResult = await result.ProductsData.map((item) => {
      return {
        vendor: item[1],
        code: item[2],
        name: item[3],
        defaultPrice: '',
        newPrice: item[4],
        VC: item[5],
        store: item[6],
        type: item[11],
        remarks: item[7],
        Possibility: item[12],
        service: item[9],
        order: item[8],
        vendorid: item[0],
        ImageURL: item[14]
      }
    })
    store.set('address', result.AddressData)
    store.set('storeList', result.StoresData)
    store.set('details', result.DetailsData)
    store.set('vendor', result.VenderData)
    store.set('data', ListResult)
    store.set('LastUpdatedDate', result.date)

    return
  } catch (err) {
    console.log(err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return errorMessage
  }
}

const DataUpdate = async (sheetname, range, key) => {
  try {
    const cookies1 = await session.defaultSession.cookies.get({
      url: 'https://accounts.google.com'
    })
    const cookies2 = await session.defaultSession.cookies.get({ url: 'https://www.google.com' })
    const allCookies = [...cookies1, ...cookies2]
    const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ')

    const response = await net.fetch(GetAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieHeader
      },
      body: JSON.stringify({ sheetName: sheetname, action: 'ListGet', ranges: range })
    })
    const result = await response.json()
    console.log(result)
    let ListResult
    if (key === 'data') {
      ListResult = result
        .filter((item) => item[3] !== '')
        .map((item) => {
          return {
            vendor: item[1],
            code: item[2],
            name: item[3],
            defaultPrice: '',
            newPrice: item[4],
            VC: item[5],
            store: item[6],
            type: item[11],
            remarks: item[7],
            Possibility: item[12],
            service: item[9],
            order: item[8],
            vendorid: item[0]
          }
        })
    }
    store.set(key, ListResult)
    return
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return errorMessage
  }
}

export const productTypesGet = async () => {
  try {
    const cookies1 = await session.defaultSession.cookies.get({
      url: 'https://accounts.google.com'
    })
    const cookies2 = await session.defaultSession.cookies.get({ url: 'https://www.google.com' })
    const allCookies = [...cookies1, ...cookies2]
    const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ')

    const response = await net.fetch(GetAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieHeader
      },
      body: JSON.stringify({ sheetName: '商品タイプ一覧', action: 'ListGet', ranges: 'A2:B' })
    })
    const result = await response.json()
    store.set('types', result)
    return
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return errorMessage
  }
}

export const addressGet = async () => {
  try {
    const cookies1 = await session.defaultSession.cookies.get({
      url: 'https://accounts.google.com'
    })
    const cookies2 = await session.defaultSession.cookies.get({ url: 'https://www.google.com' })
    const allCookies = [...cookies1, ...cookies2]
    const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ')

    const response = await net.fetch(GetAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieHeader
      },
      body: JSON.stringify({ sheetName: 'その他データ', action: 'ListGet', ranges: 'A2:H' })
    })
    const result = await response.json()
    store.set('address', result)
    return
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return errorMessage
  }
}

export const ArchiveGet = async () => {
  try {
    const cookies1 = await session.defaultSession.cookies.get({
      url: 'https://accounts.google.com'
    })
    const cookies2 = await session.defaultSession.cookies.get({ url: 'https://www.google.com' })
    const allCookies = [...cookies1, ...cookies2]
    const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ')

    const response = await net.fetch(GetAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieHeader
      },
      body: JSON.stringify({
        sheetName: '本部在庫',
        action: 'ArchiveGet',
        ranges: 'A3:C'
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

export const shortageGet = async () => {
  try {
    const cookies1 = await session.defaultSession.cookies.get({
      url: 'https://accounts.google.com'
    })
    const cookies2 = await session.defaultSession.cookies.get({ url: 'https://www.google.com' })
    const allCookies = [...cookies1, ...cookies2]
    const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ')

    const response = await net.fetch(GetAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieHeader
      },
      body: JSON.stringify({ sheetName: '一覧', action: 'TotallingGet', ranges: 'B2:O' })
    })
    const result = await response.json()
    return result
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return errorMessage
  }
}

export const ProductDetails = async () => {
  try {
    const cookies1 = await session.defaultSession.cookies.get({
      url: 'https://accounts.google.com'
    })
    const cookies2 = await session.defaultSession.cookies.get({ url: 'https://www.google.com' })
    const allCookies = [...cookies1, ...cookies2]
    const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ')

    const response = await net.fetch(GetAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieHeader
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
  await firstGet()

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
    if (updaterWindow && !updaterWindow.isDestroyed()) {
      updaterWindow.webContents.send('check', { status: 'text', value: true })
    }
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
    try {
      if (updaterWindow && !updaterWindow.isDestroyed()) {
        updaterWindow?.webContents.send('progress', {
          percent: percent,
          message: 'ダウンロード中...',
          status: 'downloading'
        })
      }
    } catch {
      if (!launcherWindow) {
        createLauncherWindow()
      }
    }
  })

  autoUpdater.on('update-not-available', () => {
    log.info('アップデートはありません。')
    if (isFirstRunUpdate) {
      if (!launcherWindow) {
        createLauncherWindow()
      }
    }
    try {
      if (launcherWindow) {
        launcherWindow.webContents.send('update-available', false)
      }
    } catch {
      if (!launcherWindow) {
        createLauncherWindow()
      }
    }
  })

  autoUpdater.on('error', (error) => {
    log.error('アップデートエラー:', error)
    if (!launcherWindow) {
      createLauncherWindow()
    }
  })

  autoUpdater.on('update-downloaded', () => {
    log.info('アップデート完了。再起動して更新します。')

    if (isFirstRunUpdate) {
      NotificationEXE('再起動して更新します。')
      autoUpdater.quitAndInstall()
    } else {
      log.info('定期チェックのアップデートは即時インストールしません')
      NotificationEXE('アップデートが利用可能です。')
      try {
        if (launcherWindow) {
          launcherWindow.webContents.send('update-available', false)
        }
      } catch {
        if (!launcherWindow) {
          createLauncherWindow()
        }
      }
    }
  })
}

const initAutoUpdater = async (win: BrowserWindow) => {
  const token = await getOrPromptToken(win)
  process.env.GH_TOKEN = token
  // autoUpdater.setFeedURL({
  //   provider: "github",
  //   owner: "OCEANS7A-DEV",
  //   repo: "electron-app",
  //   private: true,
  //   token: token
  // });

  // autoUpdater.requestHeaders = {
  //   Authorization: `token ${token}`
  // };

  await setupAutoUpdater()

  if (!is.dev) {
    setTimeout(() => {
      log.info('初回アップデート確認中...')
      autoUpdater.checkForUpdates()
    }, 3000)
    setInterval(() => {
      isFirstRunUpdate = false
      log.info('定期アップデート確認中...')
      autoUpdater.checkForUpdates()
    }, 300 * 1000)
  } else {
    isFirstRunUpdate = true
  }
}

app.whenReady().then(async () => {
  if (!gotTheLock) {
    //多重起動しないように
    app.quit()
    return
  }
  electronApp.setAppUserModelId('com.OCEANS7A-DEV.Oceanstockman')
  await createUpdaterWindow()
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
})

ipcMain.on('product-reload', async () => {
  AffterGet()
  DataUpdate('一覧', 'A2:M', 'data')
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

ipcMain.handle('archiveGet', async () => {
  const data = await ArchiveGet()
  return data
})

ipcMain.handle('storeSet', async (_event, key, value) => {
  store.set(key, value)
})

ipcMain.handle('storeGet', async (_event, payload) => {
  return store.get(payload)
})

ipcMain.handle('list-get', async (_event, payload: any) => {
  try {
    const cookies1 = await session.defaultSession.cookies.get({
      url: 'https://accounts.google.com'
    })
    const cookies2 = await session.defaultSession.cookies.get({ url: 'https://www.google.com' })
    const allCookies = [...cookies1, ...cookies2]
    const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ')
    const response = await net.fetch(GetAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieHeader
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

ipcMain.handle('uuid-get', async (_event, payload: any) => {
  let Uuid
  let isDuplicate = false
  do {
    Uuid = crypto.randomUUID()
    isDuplicate = payload.includes(Uuid)
  } while (isDuplicate)
  return Uuid
})

ipcMain.handle('PrivateMemo-Get', () => {
  const selectMainStmt = DB.prepare('SELECT * FROM MemoMain')
  const selectDetailStmt = DB.prepare('SELECT * FROM MemoDetail')
  const mainData = selectMainStmt.all()
  const detailData = selectDetailStmt.all()
  return { main: mainData, detail: detailData }
})

ipcMain.on('PrivateMemo-Insert', async (_event, payload: any) => {
  const Uuid = crypto.randomUUID()
  const insertMainStmt = DB.prepare(`
    INSERT INTO MemoMain (sub_id, title, remarks) VALUES (?, ?, ?)
    ON CONFLICT(sub_id) DO UPDATE SET
    title = excluded.title,
    remarks = excluded.remarks
  `)
  insertMainStmt.run(payload.main.uuid ?? Uuid, payload.main.title, payload.main.remarks)
  payload.detail.forEach((item) => {
    if (item.mainID === '') {
      const insertDetailStmt = DB.prepare(`
        INSERT INTO MemoDetail (sub_id, order_id, title, content, remarks) VALUES (?, ?, ?, ?, ?)
      `)
      insertDetailStmt.run(
        payload.main.uuid ?? Uuid,
        item.id,
        item.detailTitle,
        item.content,
        item.remarks
      )
    } else {
      let check = 0
      if (item.check_Flg) {
        check++
      }
      const updateDetailStmt = DB.prepare(`
        UPDATE MemoDetail SET
        title = ?,
        content = ?,
        remarks = ?,
        check_Flg = ?
        WHERE id = ?
      `)
      updateDetailStmt.run(item.title, item.content, item.remarks, check, item.AI_id)
    }
  })
})

ipcMain.on('PrivateMemo-Delete', (_event, payload: any) => {
  const updateDetailStmt = DB.prepare(`
    UPDATE MemoMain SET
    delete_Flg = 1
    WHERE id = ?
  `)
  updateDetailStmt.run(payload.id)
})

ipcMain.handle('data-insert', async (_event, payload: any) => {
  try {
    const cookies1 = await session.defaultSession.cookies.get({
      url: 'https://accounts.google.com'
    })
    const cookies2 = await session.defaultSession.cookies.get({ url: 'https://www.google.com' })
    const allCookies = [...cookies1, ...cookies2]
    const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ')

    const response = await net.fetch(InsertAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieHeader
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

ipcMain.handle('orderPrint', (_event, payload) => {
  //printWindow = PrintWindowCreate()
  printWindow = new BrowserWindow(WindowStatus())

  printWindow?.on('ready-to-show', () => {
    printWindow?.show()
    if (is.dev) {
      printWindow?.webContents.openDevTools()
    }
  })
  const url =
    is.dev && process.env['ELECTRON_RENDERER_URL']
      ? `${process.env['ELECTRON_RENDERER_URL']}#/${payload}`
      : `file://${join(app.getAppPath(), 'out/renderer/index.html')}#/${payload}`
  printWindow?.loadURL(url)
})

ipcMain.on('button-Upgrade', () => {
  autoUpdater.quitAndInstall()
})

ipcMain.on('Main-boot', () => {
  createLauncherWindow()
  launcherWindow.show()
})

ipcMain.on('WindowZaiko', () => {
  createZaikoWindow()
  launcherWindow.minimize()
})

ipcMain.on('HelloWorkWindow', () => {
  createHelloWorkWindow()
  launcherWindow.minimize()
})

ipcMain.on('OfficeWorkWindow', () => {
  createOfficeWorkWindow()
  launcherWindow.minimize()
})

ipcMain.on('SettingWindow', () => {
  createSettingWindow()
  launcherWindow.minimize()
})

ipcMain.on('startUpClose', () => {
  try {
    if (updaterWindow && !updaterWindow.isDestroyed()) {
      updaterWindow.close()
      updaterWindow = null
    }
  } catch {
    // エラー時は何もしない
  }
})

ipcMain.handle('productEditWindow', (_eventt, payload) => {
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
  //printWindow?.webContents.print({ silent: false, printBackground: false }, () => {
  //  //printWindow.close()
  //})
  let result
  printWindow?.webContents.print({}, (success, failureReason) => {
    console.log(success)
    console.log(failureReason)
    if (success) {
      console.log('print')
      // 印刷成功後の処理をここに記述
      PrintSatusUpdate()
      result = '印刷実行'
    } else {
      console.log('ユーザーは印刷をキャンセルしました。')
      if (failureReason === 'cancelled') {
        console.log('cancelled')
        result = '印刷キャンセル'
      } else {
        console.log(`印刷に失敗しました: ${failureReason}`)
        result = '印刷失敗'
      }
    }
  })
  return result
})

ipcMain.handle('CountListPrint', async (_event, fileName, folderPath) => {
  if (!printWindow) return 'ウィンドウが見つかりません'
  try {
    const targetFileName = fileName || 'output.pdf'
    const savePath = path.join(folderPath, targetFileName)
    const data = await printWindow.webContents.printToPDF({
      printBackground: false,
      landscape: false,
      margins: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    })
    await fs.promises.writeFile(savePath, data)
    return '印刷実行（PDF保存完了）'
  } catch (error) {
    return `印刷失敗: ${error}`
  }
})

ipcMain.handle('folderBuild', async (_event, folderName: string) => {
  const downloadDir = path.join(os.homedir(), 'Downloads', folderName)
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true })
  }
  return downloadDir
})

const PrintSatusUpdate = async (): Promise<void> => {
  try {
    const cookies1 = await session.defaultSession.cookies.get({
      url: 'https://accounts.google.com'
    })
    const cookies2 = await session.defaultSession.cookies.get({ url: 'https://www.google.com' })
    const allCookies = [...cookies1, ...cookies2]
    const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ')

    const printDataObj = await store.get('printData')
    const printDate = printDataObj.printDate
    const ordersGet = JSON.parse(printDataObj.printData)
    const stores = [...new Set(ordersGet.map((item) => item[1] as string))]

    const response = await net.fetch(InsertAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieHeader
      },
      body: JSON.stringify({
        sheetName: '店舗へ',
        action: 'PrintcellUpdate',
        sub_action: 'insert',
        searchData: stores,
        searchColumn: 2,
        updataColumnNumber: 13,
        updataValue: '印刷済',
        updataDate: printDate
      })
    })
    const result = await response.json()
    return result
  } catch {
    return
  }
}

ipcMain.handle('now-DateGet', () => {
  const id = 'OCEAN_HQ'
  const now = new Date()
  const DateTime = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(now)

  return [id, DateTime]
})

ipcMain.handle('printStatus', async (_event, payload: any) => {
  try {
    const cookies1 = await session.defaultSession.cookies.get({
      url: 'https://accounts.google.com'
    })
    const cookies2 = await session.defaultSession.cookies.get({ url: 'https://www.google.com' })
    const allCookies = [...cookies1, ...cookies2]
    const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ')

    const response = await net.fetch(InsertAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieHeader
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

let browser: Browser | null = null

const opts = getPuppeteerOptions()

browser = await puppeteer.launch(opts)

const page = await browser.newPage()

ipcMain.handle('hellowork-init', async () => {
  try {
    if (!page) {
      throw new Error('Puppeteer page is not initialized')
    }

    await page.goto(
      'https://kyujin.hellowork.mhlw.go.jp/kyujin/GEAB040010.do?action=initDisp&screenId=GEAB040010',
      { waitUntil: 'networkidle2' }
    )

    await page.type('input[name="mail"]', 'oceans7a@gmail.com')
    await page.type('input[name="password"]', 'ocean@1115')

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[name="loginBtn"]')
    ])

    const selector = '#ID_ID_container > div.page_title'

    const title = await page.evaluate((selector) => {
      const element = document.querySelector(selector)
      return element ? element.textContent : null
    }, selector)

    if (title == 'ワンタイムパスワード入力') {
      HelloWorkWindow.webContents.send('show-otp-prompt')

      const otp = await new Promise((resolve) => {
        ipcMain.once('otp-submitted', (_event, otpValue) => {
          resolve(otpValue)
        })
      })

      if (!otp || '') {
        return
      }

      const otpInputSelector = 'input[name="txtOtp"]'
      const submitOtpButtonSelector = 'button[name="sendBtn"]'

      await page.type(otpInputSelector, String(otp))

      await page.click('input[name="chkOtpSkip"]')

      await page.click(submitOtpButtonSelector)

      await page.waitForSelector('button[name="okBtn"]', { visible: true })

      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.click('button[name="okBtn"]')
      ])
    }
  } catch (err) {
    console.error('HelloWork page initialization error:', err)
  }
})

ipcMain.handle('hellowork-get', async () => {
  try {
    const resultData = await HelloWorkGet(page)
    return resultData
  } catch (e) {
    log.error('ハロワ取得エラー:', e)
    throw e
  }
})

ipcMain.handle('hellowork-update', async (_event, RecruitNumbers: any) => {
  try {
    for (const num of RecruitNumbers) {
      const updatePass = `https://kyujin.hellowork.mhlw.go.jp/kyujin/GEAB031010.do?screenId=GEAB031010&action=tenyoTorokuBtn&kjNo=${num}`
      await page.goto(updatePass, { waitUntil: 'networkidle2' })
      let pagenum = 1
      while (true) {
        if (pagenum == 1) {
          await page.click('input[name="leafletDoiCKBox"]')
        }
        const nextButton = await page.$('input[name="nextScreenBtn"]')
        if (!nextButton) {
          break
        }
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle2' }),
          nextButton.click()
        ])
        pagenum++
      }
      const confirmButton = await page.$('input[name="kanryoBtn"]')
      if (confirmButton) {
        const comment = '来月からの更新をお願いします'
        await page.type('textarea[name="helloworkRKJK"]', comment)
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle2' }),
          confirmButton.click()
        ])
      }
    }
    return
  } catch {
    return
  } finally {
    const linkLocator = page.locator('a[href*="GEAB100010.do"]')
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), linkLocator.click()])
  }
})

interface Works {
  こだわり条件: any[]
  事業所名: string
  仕事の内容: string
  休日: string
  公開範囲: string
  受付年月日: string
  就業場所: string
  就業時間: string
  年齢: string
  求人区分: string
  求人番号: string
  求人票URL: string
  紹介期限日: string
  職種: string
  '賃金（手当等を含む）': string
  雇用形態: string
  status: string
  address: string
}

ipcMain.handle('hellowork-PDF', async (_event: IpcMainInvokeEvent, lists: Works[]) => {
  try {
    const date = new Date()
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    const today = `${y}.${m}.${d}`
    const downloadDir = path.join(os.homedir(), 'Downloads', `ハロワPDFs${today}`)
    await HelloWorkPdfGet(lists, HelloWorkWindow, page, path, fs, browser, downloadDir)
    PDFfileMarge(`ハロワPDFs${today}.pdf`)
    NotificationEXE('すべてのPDFのダウンロード完了')
  } catch (e) {
    log.error('ハロワ取得エラー:', e)
  }
})

ipcMain.on('PDF-Marge', () => {
  PDFfileMarge('merged.pdf')
})

const PDFfileMarge = async (
  fileName: string
): Promise<{
  canceled: boolean
  output?: string
  error?: string
}> => {
  // 1) フォルダ選択
  const { filePaths, canceled } = await dialog.showOpenDialog({
    title: 'PDF を結合するフォルダを選択',
    properties: ['openDirectory']
  })
  if (canceled || filePaths.length === 0) {
    return { canceled: true }
  }
  const folder = filePaths[0]

  const pdfFiles = (await fs.promises.readdir(folder))
    .filter((f) => f.toLowerCase().endsWith('.pdf'))
    .map((f) => path.join(folder, f))
    .sort()

  if (pdfFiles.length < 2) {
    return { canceled: true, error: 'PDF が 2 つ以上必要です。' }
  }

  const { filePath: outPath, canceled: saveCanceled } = await dialog.showSaveDialog({
    title: '結合後の PDF を保存',
    defaultPath: path.join(folder, fileName),
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  })
  if (saveCanceled || !outPath) {
    return { canceled: true }
  }

  let qpdfDir: string
  if (app.isPackaged) {
    qpdfDir = path.join(process.resourcesPath, 'qpdf')
  } else {
    qpdfDir = path.resolve(__dirname, '../../vendor/qpdf')
  }

  const qpdfBinary = path.join(qpdfDir, 'bin', process.platform === 'win32' ? 'qpdf.exe' : 'qpdf')

  if (!fs.existsSync(qpdfBinary)) {
    return { canceled: true, error: `qpdf が見つかりません: ${qpdfBinary}` }
  }

  const args = ['--empty', '--pages', ...pdfFiles, '--', outPath]

  return new Promise((resolve) => {
    execFile(qpdfBinary, args, (err, stdout, stderr) => {
      if (err) {
        console.error('execFile エラー:', err)
        return resolve({ canceled: true, error: err.message })
      }
      console.log('qpdf stdout:', stdout)
      console.warn('qpdf stderr:', stderr)
      resolve({ canceled: false, output: outPath })
    })
  })
}

ipcMain.handle('unlock-pdf', async (_event, fileData, _password, _fileName) => {
  const tempInputPath = path.join(os.tmpdir(), `temp-pdf-${Date.now()}.pdf`)
  try {
    // '.promises' をつけて await を使う
    const buffer = Buffer.from(fileData.fileData)
    // 変換した buffer を書き込みます
    await fs.promises.writeFile(tempInputPath, buffer)
    const baseName = path.basename(fileData.fileName, '.pdf')
    const { canceled, filePath: outputPath } = await dialog.showSaveDialog({
      title: 'ロック解除したPDFの保存先を選択',
      defaultPath: path.join(app.getPath('downloads'), `${baseName}_unlocked.pdf`),
      filters: [{ name: 'PDFファイル', extensions: ['pdf'] }]
    })

    if (canceled || !outputPath) {
      return { status: 'info', message: '保存がキャンセルされました。' }
    }

    let qpdfDir: string
    if (app.isPackaged) {
      qpdfDir = path.join(process.resourcesPath, 'qpdf')
    } else {
      qpdfDir = path.resolve(__dirname, '../../vendor/qpdf')
    }

    const qpdfPath = path.join(qpdfDir, 'bin', process.platform === 'win32' ? 'qpdf.exe' : 'qpdf')

    const args = [`--password=${fileData.password}`, '--decrypt', tempInputPath, outputPath]

    await new Promise<void>((resolve, reject) => {
      // ここで組み立てた qpdfPath を使う
      execFile(qpdfPath, args, { encoding: 'buffer', shell: true }, (error, _stdout, stderr) => {
        if (error) {
          const errorMessage = iconv.decode(stderr, 'cp932')
          reject(new Error(errorMessage || 'PDFの処理に失敗しました。'))
          return
        }
        resolve()
      })
    })

    return {
      status: 'success',
      message: `ロック解除に成功しました。\n${outputPath} に保存されました。`
    }
  } catch (err: any) {
    console.error(err)
    return { status: 'error', message: `エラーが発生しました: ${err.message}` }
  } finally {
    try {
      await fs.promises.unlink(tempInputPath)
    } catch (cleanupErr) {
      console.error('Failed to clean up temporary file:', cleanupErr)
    }
  }
})

ipcMain.on('change-github-token', async () => {
  const token = await updateOrPromptToken(launcherWindow)
  if (!token) {
    return
  }
  await clearStoredToken()
  process.env.GH_TOKEN = token
})

ipcMain.on('google-logout', async () => {
  // 1) accounts.google.com のクッキーを削除
  const accountCookies = await session.defaultSession.cookies.get({
    url: 'https://accounts.google.com'
  })
  for (const c of accountCookies) {
    await session.defaultSession.cookies.remove('https://' + c.domain + c.path, c.name)
  }

  // 2) script.google.com（GAS） のクッキーも消したいなら同様に
  const scriptCookies = await session.defaultSession.cookies.get({
    url: 'https://script.google.com'
  })
  for (const c of scriptCookies) {
    await session.defaultSession.cookies.remove('https://' + c.domain + c.path, c.name)
  }
})

ipcMain.on('google-login', async () => {
  createGoogleLoginWindow()
})

ipcMain.on('google-login-confirmation', async () => {
  if (updaterWindow && !updaterWindow.isDestroyed()) {
    updaterWindow.webContents.send('check', { status: 'google', value: true })
  }
})

ipcMain.handle('windowInfo', async () => {
  const Focuswin = BrowserWindow.getFocusedWindow()
  if (!Focuswin) return null

  return {
    id: Focuswin.id,
    title: Focuswin.getTitle(),
    bounds: Focuswin.getBounds(),
    url: Focuswin.webContents.getURL()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const NotificationEXE = (bodyString): void => {
  new Notification({
    title: '通知',
    body: bodyString
  }).show()
}

const userDataDir = path.join(app.getPath('userData'), 'files')

ipcMain.handle('get-file-list', async () => {
  if (!fs.existsSync(userDataDir)) return []
  const files = fs.readdirSync(userDataDir)
  return files
})

ipcMain.handle('get-file-path', async (_event, filename) => {
  const fullPath = path.join(app.getPath('userData'), 'files', filename)
  return fullPath
})

const restartApp = (): void => {
  app.relaunch()
  app.exit(0)
}

const clearStoredToken = async (): Promise<void> => {
  await keytar.deletePassword(SERVICE, ACCOUNT)
}
