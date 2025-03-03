import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  startApp: (arg: string) => ipcRenderer.invoke('start-app', arg),
  checkAppStatus: () => ipcRenderer.invoke('check-app-status'),
  onAppExit: (callback: () => void) => {
    ipcRenderer.on('app-exited', () => callback())
  }
})

// 安全配置 (在创建 BrowserWindow 时设置)
/*
const mainWindow = new BrowserWindow({
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: true
  }
})
*/
// <template>
//   <div>
//     <button @click="startApp">启动应用</button>
//     <button @click="checkStatus">检查状态</button>
//   </div>
// </template>

// <script>
// import { ipcRenderer } from 'electron'

// export default {
//   methods: {
//     async startApp() {
//       try {
//         const result = await ipcRenderer.invoke('start-app', '--my-argument')
//         this.$message.success(result)
//       } catch (err) {
//         this.$message.error(err.message)
//       }
//     },
//     async checkStatus() {
//       const isRunning = await ipcRenderer.invoke('check-app-status')
//       this.$message.info(isRunning ? '应用正在运行' : '应用未运行')
//     }
//   }
// }
// </script>
