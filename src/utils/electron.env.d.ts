// interface electronAPI {
//     startApp: (arg: string) => Promise<void>;
//     // checkAppStatus: () => Promise<{ isRunning: boolean, pid?: number }>;
//     // onAppExit: (callback: () => void) => void;
//   }

// interface window {
//     electronAPI:electronAPI
// }

declare global {
  interface Window {
    electronAPI: {
      startApp: (pwd: string) => Promise<{ value: string }>
    }
  }
}
