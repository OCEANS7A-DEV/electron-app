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

export const CookieSetup = async () => {
  const cookies1 = await session.defaultSession.cookies.get({
    url: 'https://accounts.google.com'
  })
  const cookies2 = await session.defaultSession.cookies.get({ url: 'https://www.google.com' })
  const allCookies = [...cookies1, ...cookies2]
  const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ')
  return cookieHeader
}
