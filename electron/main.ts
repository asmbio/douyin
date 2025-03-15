import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { ChildProcess, spawn } from 'child_process'
import { fileURLToPath } from 'url'
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let subProcess: ChildProcess | null = null

function getAppPath() {
  const resourcesPath = app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.join(__dirname, '../electron/bin')
  let platformSubdir
  switch (process.platform) {
    case 'win32':
      platformSubdir = 'win'
      break
    case 'darwin':
      platformSubdir = 'mac'
      break
    default:
      platformSubdir = 'linux'
  }
  const exeName = process.platform === 'win32' ? 'mogu.exe' : 'mogu'
  return path.join(resourcesPath, platformSubdir, exeName)
}

app.on('before-quit', () => {
  if (subProcess && !subProcess.killed) {
    subProcess.kill()
  }
})
const __dirname = path.dirname(fileURLToPath(import.meta.url)) // ✅ 正确写法

function createWindow() {
  console.log(__dirname)
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // 使用预加载脚本
      nodeIntegration: false, // 推荐禁用Node集成以提高安全性
      contextIsolation: true // 启用上下文隔离
    }
  })

  //
  // 开发环境加载Vue开发服务器
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://127.0.0.1:3000')
    // win.loadFile(path.join(__dirname, '../dist/index.html'))
    win.webContents.openDevTools()
  } else {
    //app.isPackaged
    // 生产环境加载打包后的文件
    win.loadFile(path.join(__dirname, '../dist/index.html'))
    // win.webContents.openDevTools()
  }
}

app.whenReady().then(() => {
  ipcMain.handle('start-app', async (event, arg) => {
    console.log('start-app')
    if (subProcess && !subProcess.killed) {
      throw new Error('App is already running')
    }

    try {
      const exePath = getAppPath()
      subProcess = spawn(exePath, [arg], {
        stdio: 'ignore',
        detached: true
      })

      subProcess.on('error', (err) => {
        console.error('Failed to start app:', err)
        subProcess = null
      })

      subProcess.on('exit', () => {
        subProcess = null
      })

      return { value: 'App started ' }
    } catch (error) {
      throw new Error(`Failed to start app: ${error}`)
    }
  }),
    createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
