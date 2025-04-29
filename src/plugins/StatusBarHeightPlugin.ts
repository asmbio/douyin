import { registerPlugin } from '@capacitor/core'

export interface StatusBarHeightPlugin {
  getHeight(): Promise<{ height: number }>
}

const StatusBarHeight = registerPlugin<StatusBarHeightPlugin>('StatusBarHeight')

export default StatusBarHeight
