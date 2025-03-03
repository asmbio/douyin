import Mogu from '@/definitions'

// electron-preload/preload.ts

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
// platform.enum.ts
export enum Platform {
  // Windows = 'windows',
  // Mac = 'mac',
  // Linux = 'linux',
  Mobile = 'mobile',
  Desktop = 'desktop',
  Unknown = 'unknown'
}

// platform-detector.ts
export class PlatformDetector {
  static detect(): Platform {
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
    console.log(userAgent)
    const rules: [RegExp, Platform][] = [
      [/android|webos|iphone|ipad|Mobile|windows phone/i, Platform.Mobile],
      [/windows|macintosh|linux/i, Platform.Desktop]
      // [/macintosh/i, Platform.Mac],
      // [/linux/i, Platform.Linux],
    ]

    for (const [regex, platform] of rules) {
      if (regex.test(userAgent)) {
        return platform
      }
    }

    return Platform.Unknown
  }

  static isMobile(platform: Platform): boolean {
    return platform === Platform.Mobile
  }
}

// platform-action-handler.ts
type PlatformActionMap = {
  [key in Platform]: (pwd: string) => void
}

export class PlatformActionHandler {
  private static actions: PlatformActionMap = {
    // [Platform.Windows]: () => {
    //   console.log('Executing Windows specific action')
    //   // Windows 原生 API 调用
    // },
    // [Platform.Mac]: () => {
    //   console.log('Executing macOS specific action')
    //   // macOS 原生 API 调用
    // },
    [Platform.Desktop]: (pwd: string) => {
      console.log('Executing Linux specific action')
      window.ipcRenderer
        .invoke('start-app', pwd)
        .then((result) => {
          console.log('Success:', result.value)
        })
        .catch((error) => {
          alert(error.message)
        })
    },
    [Platform.Mobile]: (pwd: string) => {
      console.log('Executing mobile specific action')
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(200)
        Mogu.start({ pwd: '123456' })
          .then((result) => {
            console.log('Success:', result.value)
          })
          .catch((error) => {
            console.error('Error:', error.message)
            alert(error.message)
          })
      } else {
        window.ipcRenderer
          .invoke('start-app', pwd)
          .then((result) => {
            console.log('Success:', result.value)
          })
          .catch((error) => {
            alert(error.message)
          })
      }
    },
    [Platform.Unknown]: (pwd: string) => {
      console.log('Default action for unknown platform')
    }
  }

  static execute(platform: Platform, pwd: string): void {
    this.actions[platform]?.(pwd)
  }
}

// platform-adapter.ts
type PlatformChangeCallback = (platform: Platform) => void

export class PlatformAdapter {
  private currentPlatform: Platform
  private readonly resizeHandler: () => void
  private readonly callbacks: PlatformChangeCallback[] = []

  constructor() {
    this.currentPlatform = PlatformDetector.detect()
    this.resizeHandler = this.handleResize.bind(this)

    if (typeof window !== 'undefined') {
      //  window.addEventListener('resize', this.resizeHandler)
    }
  }

  public get platform(): Platform {
    return this.currentPlatform
  }

  public get isMobile(): boolean {
    return PlatformDetector.isMobile(this.currentPlatform)
  }

  public executePlatformAction(pwd: string): void {
    PlatformActionHandler.execute(this.currentPlatform, pwd)
  }

  public subscribe(callback: PlatformChangeCallback): void {
    this.callbacks.push(callback)
  }

  public unsubscribe(callback: PlatformChangeCallback): void {
    const index = this.callbacks.indexOf(callback)
    if (index !== -1) {
      this.callbacks.splice(index, 1) // 直接修改数组内容
    }
  }

  public destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeHandler)
    }
    this.callbacks.length = 0
  }

  private updatePlatform(): void {
    const newPlatform = PlatformDetector.detect()
    if (newPlatform !== this.currentPlatform) {
      this.currentPlatform = newPlatform
      this.notifySubscribers()
    }
  }

  private notifySubscribers(): void {
    this.callbacks.forEach((callback) => callback(this.currentPlatform))
  }

  private handleResize(): void {
    this.updatePlatform()
  }
}

//   // 使用示例
//   const platformAdapter = new PlatformAdapter();

//   // 获取当前平台
//   console.log('Current platform:', platformAdapter.platform);

//   // 执行平台操作
//   platformAdapter.executePlatformAction();

//   // 订阅平台变化
//   const callback: PlatformChangeCallback = (platform) => {
//     console.log('Platform changed to:', platform);
//   };
//   platformAdapter.subscribe(callback);

//   // 销毁实例
//   // platformAdapter.destroy();
