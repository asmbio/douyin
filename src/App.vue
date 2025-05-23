<template>
  <router-view v-slot="{ Component }">
    <transition :name="transitionName">
      <keep-alive :include="store.includeNames">
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
  <Call />
</template>
<script setup lang="ts">
/*
* try {navigator.control.gesture(false);} catch (e) {} //UC浏览器关闭默认手势事件
try {navigator.control.longpressMenu(false);} catch (e) {} //关闭长按弹出菜单
* */
import routes from './router/routes'
import Call from './components/Call.vue'

import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useNav } from '@/utils/hooks/useNav'
import { useBaseStore } from '@/store/pinia.js'
import { useNoticeStream } from './store/noticeService'
import { App } from '@capacitor/app'
import { Toast } from '@capacitor/toast'

const nav = useNav()
const store = useBaseStore()
const route = useRoute()
const router = useRouter()
const transitionName = ref('go')
const { init } = useNoticeStream()

const lastBackTime = ref(0)
let backButtonListener = null

const handleBackButton = () => {
  // 判断当前是否在根路由
  if (
    router.currentRoute.value.path !== '/login' &&
    router.currentRoute.value.path !== '/home' &&
    router.currentRoute.value.path !== '/me' &&
    router.currentRoute.value.path !== '/message' &&
    router.currentRoute.value.path !== '/shop' &&
    router.currentRoute.value.path !== '/publish'
  ) {
    //console.log(router.getRoutes())
    router.back() // 执行路由返回
  } else {
    const now = Date.now()
    // 2秒内重复点击则退出
    if (now - lastBackTime.value < 2000) {
      App.exitApp() // 退出应用
    } else {
      Toast.show({ text: '再按一次退出应用', duration: 'short' })
      lastBackTime.value = now
    }
  }
}

// watch $route 决定使用哪种过渡
watch(
  () => route.path,
  (to, from) => {
    store.setMaskDialog({ state: false, mode: store.maskDialogMode })
    //底部tab的按钮，跳转是不需要用动画的
    let noAnimation = [
      '/',
      '/home',
      '/slide',
      '/me',
      '/shop',
      '/message',
      '/publish',
      '/home/live',
      'slide',
      '/test'
    ]
    if (noAnimation.indexOf(from) !== -1 && noAnimation.indexOf(to) !== -1) {
      return (transitionName.value = '')
    }
    const toDepth = routes.findIndex((v: RouteRecordRaw) => v.path === to)
    const fromDepth = routes.findIndex((v: RouteRecordRaw) => v.path === from)
    transitionName.value = toDepth > fromDepth ? 'go' : 'back'
  }
)

function resetVhAndPx() {
  let vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
  //document.documentElement.style.fontSize = document.documentElement.clientWidth / 375 + 'px'
}
onBeforeUnmount(() => {
  console.log('onBeforeUnmount')
  // 移除监听防止内存泄漏
  if (backButtonListener) {
    backButtonListener.remove()
  }
  //store.setsession()
})

onMounted(async () => {
  init()

  //store.init()
  //判断是否登录

  console.log('store', store)
  if (store.islogin === false) {
    nav('/login')
  } else {
    nav('/home')
  }
  resetVhAndPx()
  // 监听resize事件 视图大小发生变化就重新计算1vh的值
  window.addEventListener('resize', () => {
    //  location.href = BASE_URL + '/home'
    resetVhAndPx()
  })
  // 添加返回键监听
  backButtonListener = await App.addListener('backButton', handleBackButton)
  // window.addEventListener('beforeunload', (event) => {
  //   event.preventDefault();
  //    store.setsession()
  //    alert('unload')
  // })
})
</script>

<style lang="less">
@import './assets/less/index';

* {
  user-select: none;
}

#app {
  height: 100%;
  width: 100%;
  position: relative;
  font-size: 14rem;
}

@media screen and (min-width: 5000px) {
  #app {
    width: 500px !important;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
}

.go-enter-from {
  transform: translate3d(100%, 0, 0);
}

//最终状态
.back-enter-to,
.back-enter-from,
.go-enter-to,
.go-leave-from {
  transform: translate3d(0, 0, 0);
}

.go-leave-to {
  transform: translate3d(-100%, 0, 0);
}

.go-enter-active,
.go-leave-active,
.back-enter-active,
.back-leave-active {
  transition: all 0.3s;
}

.back-enter-from {
  transform: translate3d(-100%, 0, 0);
}

.back-leave-to {
  transform: translate3d(100%, 0, 0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
