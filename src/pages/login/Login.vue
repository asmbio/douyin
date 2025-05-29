<template>
  <div class="login">
    <BaseHeader mode="light" backMode="dark" backImg="close">
      <template v-slot:right>
        <span class="f14" @click="nav('/login/help')">帮助与设置</span>
      </template>
    </BaseHeader>
    <Loading v-if="useStore.loading" />
    <div v-else class="content">
      <div class="desc">
        <div class="title">登录看朋友内容</div>
        <div class="phone-number" v-if="useStore.userinfo.uid">{{ useStore.userinfo.uid }}</div>
        <div class="phone-number" v-else>未注册</div>
        <div class="sub-title">输入密码后自动生成随机公钥密钥对</div>
      </div>
      <LoginInput
        autofocus
        class="mt1r"
        type="password"
        v-model="data.password"
        placeholder="请输入密码"
        style="margin-bottom: 10rem"
      />
      <dy-button
        type="primary"
        :loading="data.loading.login"
        :active="false"
        :loadingWithText="true"
        @click="login"
      >
        {{ data.loading.login ? '登录中' : '一键登录' }}
      </dy-button>
      <dy-button :active="false" type="white">其他手机号码登录 </dy-button>

      <div class="protocol" :class="data.showAnim ? 'anim-bounce' : ''">
        <Tooltip style="top: -100%; left: -10rem" v-model="data.showTooltip" />
        <div class="left">
          <Check v-model="data.isAgree" />
        </div>
        <div class="right">
          我已阅读并同意
          <span class="link" @click="nav('/service-protocol', { type: '“蘑菇”用户服务协议' })"
            >个人数据不可侵犯</span
          >
          <!-- 和
          <span class="link" @click="nav('/service-protocol', { type: '“蘑菇”隐私政策' })"
            >个人数据不可侵犯隐私政策</span
          >
          <div>
            以及
            <span class="link" @click="nav('/service-protocol', { type: '中国移动认证服务协议' })"
              >《中国移动认证服务条款》</span
            >
            ，同时登录并使用蘑菇火山版（原“火山小视频”）和蘑菇
          </div> -->
        </div>
      </div>

      <div class="other-login">
        <transition name="fade">
          <div v-if="data.isOtherLogin" class="icons">
            <img @click="_no" src="../../assets/img/icon/login/toutiao-round.png" alt="" />
            <img @click="_no" src="../../assets/img/icon/login/qq-round.webp" alt="" />
            <img @click="_no" src="../../assets/img/icon/login/wechat-round.png" alt="" />
            <img @click="_no" src="../../assets/img/icon/login/weibo-round.webp" alt="" />
          </div>
        </transition>
      </div>
      <transition name="fade">
        <span v-if="!data.isOtherLogin" class="other-login-text link" @click="_no"
          >其他方式登录</span
        >
      </transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import Tooltip from './components/Tooltip.vue'
import Loading from '../../components/Loading.vue'
import { onMounted, reactive } from 'vue'
import { useNav } from '@/utils/hooks/useNav'
import { _no } from '@/utils'
import { useBaseStore } from '@/store/pinia'
import LoginInput from './components/LoginInput.vue'
import { startCore } from '@/api/moguservice'
import Check from '@/components/Check.vue'

defineOptions({
  name: 'login'
})

const nav = useNav()
const useStore = useBaseStore()
if (useStore.islogin) {
  nav('/home')
}
const data = reactive({
  isAgree: true,
  isOtherLogin: false,
  showAnim: false,
  showTooltip: false,
  password: '',
  loading: {
    login: false
  }
})

onMounted(() => {
  console.log('login onmounted')
})

async function login() {
  if (useStore.islogin) {
    nav('/home')
  }
  if (data.isAgree) {
    data.loading.login = true

    try {
      await startCore(data.password)
      const result = await useStore.init()
      console.log('useStore init result:', result)
      useStore.islogin = true
      nav('/home')
    } catch (error) {
      console.error('Initialization failed:', error)
    } finally {
      useStore.islogin = false
    }
  } else {
    if (!data.showAnim && !data.showTooltip) {
      data.showAnim = true
      setTimeout(() => {
        data.showAnim = false
        data.showTooltip = true
      }, 500)
      setTimeout(() => {
        data.showTooltip = false
      }, 3000)
    }
  }
}
</script>

<style scoped lang="less">
@import '../../assets/less/index';

.login {
  position: fixed;

  overflow: auto;
  color: black;
  font-size: 14rem;
  background: white;
  max-width: 500rem;
  margin: auto;
  .content {
    padding: 60rem 30rem;

    .desc {
      margin-bottom: 60rem;
      margin-top: 120rem;
      display: flex;
      align-items: center;
      flex-direction: column;

      .title {
        margin-bottom: 20rem;
      }

      .phone-number {
        letter-spacing: 3rem;
        font-size: 30rem;
        margin-bottom: 10rem;
        width: 200rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 200px; /* 根据实际情况调整 */
      }

      .sub-title {
        font-size: 12rem;
        color: var(--second-text-color);
      }
    }

    .button {
      width: 100%;
      margin-bottom: 5rem;
    }

    .protocol {
      position: relative;
      color: gray;
      margin-top: 20rem;
      font-size: 12rem;
      display: flex;

      .left {
        padding-top: 1rem;
        margin-right: 5rem;
      }
    }

    .other-login {
      position: absolute;
      bottom: 40rem;
      font-size: 12rem;
      display: flex;
      justify-content: center;
      width: calc(100vw - 60rem);
      transform: translateX(-50%);
      left: 50%;

      .icons {
        img {
          width: 40rem;
          margin-right: 15rem;

          &:nth-last-child(1) {
            margin-right: 0;
          }
        }
      }
    }

    .other-login-text {
      position: absolute;
      bottom: 55rem;
      font-size: 12rem;
      transform: translateX(-50%);
      left: 50%;
    }
  }
}
</style>
