import { registerPlugin } from '@capacitor/core'

export interface MoguPlugin {
  start(options: { pwd: string }): Promise<{ value: string }>
}

//const Mogu = registerPlugin('Mogu');
const Mogu = registerPlugin<MoguPlugin>('Mogu')
export default Mogu
