import { app } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

export const WindowStatus = () => {
  const windowStatus = {
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
  }
  return windowStatus
}
