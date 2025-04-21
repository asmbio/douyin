<template>
  <div class="test-slide-wrapper" id="home-index">
    <SlideHorizontal name="first" v-model:index="state.baseIndex">
      <SlideItem class="sidebar">
        <div class="header">
          <div class="left">下午好</div>
          <div class="right" @click="nav('/home/live')">
            <Icon icon="iconamoon:scanner" />
            <span>扫一扫</span>
          </div>
        </div>
        <div class="card">
          <div class="header">
            <div class="left">常用小程序</div>
            <div class="right">
              <span>全部</span>
              <Icon icon="icon-park-outline:right" />
            </div>
          </div>
          <div class="content">
            <div class="item" @click="_no">
              <img
                class="xcx"
                src="https://lf3-static.bytednsdoc.com/obj/eden-cn/pipieh7nupabozups/toutiao_web_pc/tt-icon.png"
                alt=""
              />
              <span>今日头条</span>
            </div>
            <div class="item" @click="_no">
              <img
                class="xcx"
                src="https://gd-hbimg.huaban.com/65130a3e6a139530bb03bd118e21a2603af7df4e1303b-OOzcBu_fw658webp"
                alt=""
              />
              <span>西瓜视频</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="header">
            <div class="left">最近常看</div>
            <div class="right">
              <span>全部</span>
              <Icon icon="icon-park-outline:right" />
            </div>
          </div>
          <div class="content">
            <div class="item avatar" @click="_no" :key="i" v-for="i in 6">
              <img
                src="https://img.tol.vip/avatar/WEIXIN/3aSuTGYTzjHvcHy0y0tH1eiShKRk9Sgd.jpg?_upt=de4a5c251709635127"
              />
              <span>随机名字</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="header">
            <div class="left">常用功能</div>
            <div class="right"></div>
          </div>
          <div class="content">
            <div class="item" @click="_no">
              <Icon icon="ion:wallet-outline" />
              <span>我的钱包</span>
            </div>
            <div class="item" @click="_no">
              <Icon icon="mingcute:coupon-line" />
              <span>券包</span>
            </div>
            <div class="item" @click="_no">
              <Icon icon="icon-park-outline:bytedance-applets" />
              <span>小程序</span>
            </div>
            <div class="item" @click="_no">
              <Icon icon="solar:history-linear" />
              <span>观看历史</span>
            </div>
            <div class="item" @click="_no">
              <Icon icon="fluent:content-settings-24-regular" />
              <span>内容偏好</span>
            </div>
            <div class="item" @click="_no">
              <Icon icon="iconoir:cloud-download" />
              <span>离线模式</span>
            </div>
            <div class="item" @click="_no">
              <Icon icon="ep:setting" />
              <span>设置</span>
            </div>
            <div class="item" @click="_no">
              <Icon icon="icon-park-outline:baggage-delay" />
              <span>稍后再看</span>
            </div>
          </div>
        </div>
      </SlideItem>
      <SlideItem>
        <IndicatorHome
          v-if="!state.fullScreen"
          :loading="baseStore.loading"
          name="second"
          @showSlidebar="state.baseIndex = 0"
          v-model:index="state.navIndex"
        />
        <SlideHorizontal
          class="first-horizontal-item"
          name="second"
          :change-active-index-use-anim="false"
          v-model:index="state.navIndex"
        >
          <!--          <SlideItem></SlideItem>-->
          <Slide0 :active="state.navIndex === 0 && state.baseIndex === 1" />
          <SlideItem>
            <LongVideo :active="state.navIndex === 1 && state.baseIndex === 1" />
          </SlideItem>
          <!--          <SlideItem></SlideItem>-->
          <Slide2 :active="state.navIndex === 2 && state.baseIndex === 1" />
          <SlideItem>
            <Community :active="state.navIndex === 3 && state.baseIndex === 1" />
          </SlideItem>
          <Slide4 :active="state.navIndex === 4 && state.baseIndex === 1" />
        </SlideHorizontal>

        <BaseFooter v-bind:init-tab="1" />
        <BaseMask
          v-if="state.baseIndex === 0"
          @click="state.baseIndex = 1"
          mode="white"
          style="position: absolute"
        />
      </SlideItem>
    </SlideHorizontal>

    <Comment
      page-id="home-index"
      :video-id="state.currentItem.awemeId"
      :addr="state.currentItem?.author?.uid"
      v-model="state.commentVisible"
      @close="closeComments"
    />

    <Share
      v-model="state.isSharing"
      ref="share"
      page-id="home-index"
      :item="state.currentItem"
      :videoId="state.recommendList[state.itemIndex]?.id"
      :canDownload="state.recommendList[state.itemIndex]?.canDownload"
      @download="state.shareType = 9"
    />

    <ShareTo
      v-model:type="state.shareType"
      :videoId="state.recommendList[state.itemIndex]?.id"
      :canDownload="state.recommendList[state.itemIndex]?.canDownload"
    />

    <!-- <BaseMask v-if="!isMobile" @click="isMobile = true" />
    <div v-if="!isMobile" class="guide">
      <Icon class="danger" icon="mynaui:danger-triangle" />
      <Icon class="close" icon="simple-line-icons:close" @click="isMobile = true" />
      <div class="txt">
        <h2>切换至手机模式获取最佳体验</h2>
        <h3>1. 按 F12 调出控制台</h3>
        <h3>2. 按 Ctrl+Shift+M，或点击下面图标</h3>
      </div>
      <img src="@/assets/img/guide.png" alt="" />
    </div> -->
  </div>
</template>

<script setup lang="tsx">
import SlideHorizontal from '@/components/slide/SlideHorizontal.vue'
import SlideItem from '@/components/slide/SlideItem.vue'
import Comment from '../../components/Comment.vue'
import Share from '../../components/Share.vue'
import IndicatorHome from './components/IndicatorHome.vue'
import { onActivated, onDeactivated, onMounted, onUnmounted, reactive } from 'vue'
import bus, { EVENT_KEY } from '../../utils/bus'
import { useNav } from '@/utils/hooks/useNav'

import ShareTo from '@/pages/home/components/ShareTo.vue'

import Community from '@/pages/home/slide/Community.vue'
import Slide0 from '@/pages/home/slide/Slide0.vue'
import Slide2 from '@/pages/home/slide/Slide2.vue'
import Slide4 from '@/pages/home/slide/Slide4.vue'
import { _no } from '@/utils'
import LongVideo from '@/pages/home/slide/LongVideo.vue'
import { useBaseStore } from '@/store/pinia'
import BaseMask from '@/components/BaseMask.vue'
import type { UserInfo } from '@/api/gen/userinfo_pb'
import type { VideoInfo, VideoList, Video as pVideo } from '@/api/gen/video_pb'

defineOptions({
  name: 'Home'
})
const nav = useNav()
const baseStore = useBaseStore()

//const isMobile = ref(/Mobi|Android|iPhone/i.test(navigator.userAgent))

const state = reactive({
  active: true,
  baseIndex: 1,
  navIndex: 4,
  itemIndex: 0,
  test: '',
  recommendList: [],
  isSharing: false,
  canMove: true,
  shareType: -1,

  showShareDuoshan: false,
  showShareDialog: false,
  showShare2WeChatZone: false,

  showFollowSetting: false,
  showFollowSetting2: false,
  showBlockDialog: false,
  showChangeNote: false,

  commentVisible: false,
  fullScreen: false,
  currentItem: {} as pVideo,
  aweme_list: {} as VideoList
})
function handleUpdateFollow(newStatus) {
  // 直接修改父组件的数据（假设 currentItem 是父组件的响应式对象）
  state.currentItem.author.followStatus = newStatus
  // 若数据来自 Vuex，需通过 commit mutation 修改
}

function delayShowDialog(cb: Function) {
  setTimeout(cb, 400)
}

function setCurrentItem(item) {
  // if (!state.active) return
  console.log('setCurrentItem', item, state.baseIndex)
  //if (state.baseIndex !== 1) return
  if (state.currentItem.author?.uid !== item.author?.uid) {
    state.currentItem = {
      ...item
    }
  }
  // console.log('item', item)
}

onMounted(() => {
  console.log('index onmounted')
  bus.on(EVENT_KEY.ENTER_FULLSCREEN, () => {
    if (!state.active) return
    state.fullScreen = true
  })
  bus.on(EVENT_KEY.EXIT_FULLSCREEN, () => {
    if (!state.active) return
    state.fullScreen = false
  })
  bus.on(EVENT_KEY.OPEN_COMMENTS, () => {
    if (!state.active) return
    bus.emit(EVENT_KEY.ENTER_FULLSCREEN)
    state.commentVisible = true
  })
  bus.on(EVENT_KEY.CLOSE_COMMENTS, () => {
    if (!state.active) return
    bus.emit(EVENT_KEY.EXIT_FULLSCREEN)
    state.commentVisible = false
  })
  bus.on(EVENT_KEY.SHOW_SHARE, () => {
    if (!state.active) return
    state.isSharing = true
  })
  bus.on(EVENT_KEY.NAV, ({ path, query }) => {
    if (!state.active) return
    nav(path, query)
  })
  bus.on(EVENT_KEY.GO_USERINFO, () => {
    if (!state.active) return
    state.baseIndex = 2
    nav(
      '/home/userpanel',
      {},
      {
        currentItem: {
          author: state.currentItem.author,
          aweme_list: state.aweme_list
        }
      }
    )
  })
  bus.on(EVENT_KEY.CURRENT_ITEM, setCurrentItem)
})

onUnmounted(() => {
  bus.offAll()
})

onActivated(() => {
  state.active = true
  bus.emit(EVENT_KEY.TOGGLE_CURRENT_VIDEO)
})

onDeactivated(() => {
  console.log('index onDeactivated', baseStore.routeData)

  state.active = false
  bus.emit(EVENT_KEY.TOGGLE_CURRENT_VIDEO)
})

function closeComments() {
  bus.emit(EVENT_KEY.CLOSE_COMMENTS)
}
</script>

<style scoped lang="less">
.test-slide-wrapper {
  font-size: 14rem;
  width: 100%;
  height: 100%;
  background: black;
  overflow: hidden;

  .sidebar {
    touch-action: pan-y;
    width: 80%;
    height: calc(var(--vh, 1vh) * 100);
    overflow: auto;
    background: rgb(22, 22, 22);
    padding: 10rem;
    padding-bottom: 20rem;
    box-sizing: border-box;

    & > .header {
      font-size: 16rem;
      display: flex;
      color: white;
      justify-content: space-between;
      align-items: center;

      .right {
        border-radius: 20rem;
        padding: 8rem 15rem;
        background: rgb(36, 36, 36);
        display: flex;
        align-items: center;
        font-size: 14rem;
        gap: 10rem;

        svg {
          font-size: 18rem;
        }
      }
    }

    .card {
      margin-top: 10rem;
      border-radius: 12rem;
      padding: 15rem;
      background: rgb(29, 29, 29);

      .header {
        margin-bottom: 8rem;
        font-size: 14rem;
        display: flex;
        color: white;
        justify-content: space-between;
        align-items: center;

        .right {
          display: flex;
          align-items: center;
          font-size: 12rem;
          gap: 4rem;
          color: gray;

          svg {
            font-size: 16rem;
          }
        }
      }

      .content {
        color: white;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;

        .item {
          min-height: 20vw;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-size: 14rem;
          gap: 8rem;

          svg {
            font-size: 28rem;
          }

          .xcx {
            border-radius: 12rem;
            width: 50rem;
            height: 50rem;
          }
        }

        .avatar {
          height: 25vw;

          img {
            border-radius: 50%;
            width: 50rem;
          }
        }
      }
    }
  }

  .slide-content {
    width: 100%;
    height: 100%;
  }
}

.first-horizontal-item {
  //width: 90vw;
  //height: 80vh;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100 - var(--footer-height)) !important;
  overflow: hidden;
  border-radius: 10rem;
}

.guide {
  color: white;
  z-index: 999;
  background: var(--active-main-bg);
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 16rem;
  overflow: hidden;
  text-align: center;

  .danger {
    margin-top: 10rem;
    font-size: 40rem;
    color: red;
  }

  .close {
    cursor: pointer;
    font-size: 18rem;
    color: white;
    position: absolute;
    right: 15rem;
    top: 15rem;
  }

  .txt {
    text-align: left;
    padding: 0 24rem;
  }

  img {
    display: block;
    width: 350rem;
  }
}
</style>
