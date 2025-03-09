import { createApp } from 'vue'
import App from './App.vue'
import './assets/less/index.less'
import { startMock } from '@/mock'
import router from './router'
import mixin from './utils/mixin'
import VueLazyload from '@jambonn/vue-lazyload'
import { createPinia } from 'pinia'
import { useClick } from '@/utils/hooks/useClick'
import bus, { EVENT_KEY } from '@/utils/bus'
import { PlatformAdapter } from './utils/platform'
import { useBaseStore } from './store/pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const platformAdapter = new PlatformAdapter()
// 获取当前平台
console.log('Current platform:', platformAdapter.platform)
//platformAdapter.executePlatformAction(data.password)

console.log('main.ts')

window.isMoved = false
window.isMuted = false
window.showMutedNotice = false
HTMLElement.prototype.addEventListener = new Proxy(HTMLElement.prototype.addEventListener, {
  apply(target, ctx, args) {
    const eventName = args[0]
    const listener = args[1]
    if (listener instanceof Function && eventName === 'click') {
      args[1] = new Proxy(listener, {
        apply(target1, ctx1, args1) {
          // console.log('e', args1)
          // console.log('click点击', window.isMoved)
          if (window.isMoved) return
          try {
            return target1.apply(ctx1, args1)
          } catch (e) {
            console.error(`[proxyPlayerEvent][${eventName}]`, listener, e)
          }
        }
      })
    }
    return target.apply(ctx, args)
  }
})

const vClick = useClick()
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.mixin(mixin)
const loadImage = new URL('./assets/img/icon/img-loading.png', import.meta.url).href
app.use(VueLazyload, {
  preLoad: 1.3,
  loading: loadImage,
  attempt: 1
})
app.use(pinia)
app.use(router)
const store = useBaseStore()

app.mount('#app')
console.log("app.mount('#app')")

app.directive('click', vClick)

//放到最后才可以使用pinia
//const store = useBaseStore()
//store.init()

startMock()
setTimeout(() => {
  bus.emit(EVENT_KEY.HIDE_MUTED_NOTICE)
  window.showMutedNotice = false
}, 2000)
bus.on(EVENT_KEY.REMOVE_MUTED, () => {
  window.isMuted = false
})
