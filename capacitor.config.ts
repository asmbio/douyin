import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.asmbio.p2psosial',
  appName: 'p2p-sosial',
  webDir: 'dist',
  plugins: {
    StatusBarHeight: {
      enabled: true
    }
  }
}

export default config
