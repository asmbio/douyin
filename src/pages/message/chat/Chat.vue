<template>
  <div class="Chat">
    <div class="chat-content" @touchstart="data.tooltipTop = -1">
      <div class="header">
        <div class="left">
          <dy-back @click="router.back"></dy-back>
          <img
            :src="_checkImgUrl(store.userinfo.avatar_168x168.url_list[0])"
            alt=""
            style="border-radius: 50%"
          />
          <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{
            store.userinfo.nickname
          }}</span>
        </div>
        <div class="right">
          <img
            @click="bus.emit(EVENT_KEY.SHOW_AUDIO_CALL)"
            src="../../../assets/img/icon/message/chat/call.png"
            alt=""
          />
          <img @click="_no" src="../../../assets/img/icon/message/chat/video-white.png" alt="" />
          <img
            src="../../../assets/img/icon/menu-white.png"
            alt=""
            @click="nav('/message/chat/detail')"
          />
        </div>
      </div>
      <div class="message-wrapper" ref="msgWrapper" :class="isExpand ? 'expand' : ''">
        <ChatMessage
          @itemClick="clickItem"
          v-longpress="showTooltip"
          :message="item"
          :key="index"
          v-for="(item, index) in data.messages"
        ></ChatMessage>
      </div>
      <!-- 在message-wrapper下方添加录音界面 -->
      <div class="recording-indicator" v-if="data.mediaRecorder">
        <div class="recording-animation">
          <div class="mic-icon"></div>
          <div class="wave"></div>
        </div>
        <div class="recording-time">
          {{ formatTime(data.recordingTime) }}
        </div>
        <div class="recording-hint">松开结束录音</div>
      </div>
      <div class="footer">
        <div class="toolbar" v-if="!data.recording">
          <img src="../../../assets/img/icon/message/camera.png" alt="" class="camera" />
          <input
            v-model="data.messageInput"
            @click="handleInputClick"
            @blur="data.typing = false"
            @keyup.enter.exact="handleSend"
            type="text"
            placeholder="发送信息..."
          />

          <img @click="handleClick" src="../../../assets/img/icon/message/voice-white.png" alt="" />
          <img src="../../../assets/img/icon/message/emoji-white.png" alt="" />

          <img
            v-if="!data.messageInput"
            @click="data.showOption = !data.showOption"
            src="../../../assets/img/icon/message/add-white.png"
            alt=""
          />
          <img
            v-else
            @click="handleSend"
            src="../../../assets/img/icon/message/chat/fasong.png"
            alt="发送"
            class="send-btn"
          />
        </div>
        <div class="record" v-else>
          <div
            style="padding: 0"
            v-on:touchstart="handleStartRecording"
            v-on:touchend="handleStopRecording"
            v-on:mousedown="handleStartRecording"
            v-on:mouseup="handleStopRecording"
          >
            <span>按住 说话</span>
          </div>

          <img
            @click="data.recording = false"
            src="../../../assets/img/icon/message/keyboard.png"
            alt=""
          />
        </div>
        <div class="options" v-if="data.showOption">
          <div class="option-wrapper">
            <div class="option">
              <img src="../../../assets/img/icon/message/photo.png" alt="" />
              <span>照片</span>
            </div>
            <div class="option">
              <img src="../../../assets/img/icon/message/camera2.png" alt="" />
              <span>拍摄</span>
            </div>
            <div class="option">
              <img src="../../../assets/img/icon/message/redpack.png" alt="" />
              <span>红包</span>
            </div>
            <div class="option">
              <img src="../../../assets/img/icon/message/video.png" alt="" />
              <span>视频通话</span>
            </div>
            <div class="option">
              <img src="../../../assets/img/icon/message/audio.png" alt="" />
              <span>语音通话</span>
            </div>
            <div class="option">
              <img src="../../../assets/img/icon/message/come-on.png" alt="" />
              <span>一起看视频</span>
            </div>
            <div class="option">
              <img src="../../../assets/img/icon/message/come-chang.png" alt="" />
              <span>一起唱</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--  长按工具栏  -->
    <transition name="tooltip">
      <!--      TODO 定位也有问题-->
      <div class="tooltip" :style="{ top: data.tooltipTop + 'px' }" v-if="data.tooltipTop !== -1">
        <div class="options">
          <img src="../../../assets/img/icon/message/chat/like.png" alt="" />
          <span>点赞</span>
        </div>
        <div class="options">
          <img src="../../../assets/img/icon/message/chat/copy.png" alt="" />
          <span>复制</span>
        </div>
        <div class="options">
          <img src="../../../assets/img/icon/message/chat/send.png" alt="" />
          <span>转发</span>
        </div>
        <div class="options">
          <img src="../../../assets/img/icon/message/chat/comment.png" alt="" />
          <span>回复</span>
        </div>
        <div class="options">
          <img src="../../../assets/img/icon/message/chat/return.png" alt="" />
          <span>回复</span>
        </div>
        <div class="options">
          <img src="../../../assets/img/icon/message/chat/del.png" alt="" />
          <span>删除</span>
        </div>
        <!--      TODO 官方的三角头会随着点击位置变动，先注释掉-->
        <!--      <div class="arrow" :class="tooltipTopLocation"></div>-->
      </div>
    </transition>

    <div class="preview-img" v-if="false">
      <div class="header">
        <dy-back mode="light" />
        <img src="../../../assets/img/icon/search-light.png" alt="" />
      </div>
      <img :src="data.previewImg" alt="" class="img-src" />
      <div class="footer"></div>
    </div>

    <!--  红包  -->
    <transition name="scale">
      <div class="red-packet" v-if="data.isShowOpenRedPacket">
        <BaseMask @click="data.isShowOpenRedPacket = false" />
        <div class="content">
          <template v-if="data.isOpened">
            <img src="../../../assets/img/icon/message/chat/bg-open.png" alt="" class="bg" />
            <div class="wrapper">
              <div class="top">
                <div class="money">0.01元</div>
                <div class="belong">{{ store.userinfo.nickname }}的红包</div>
                <div class="password">大吉大利</div>
              </div>
              <div class="notice" @click="nav('/message/chat/red-packet-detail')">
                查看红包详情>
              </div>
            </div>
          </template>
          <template v-else>
            <img src="../../../assets/img/icon/message/chat/bg-close.png" alt="" class="bg" />
            <div class="wrapper">
              <div class="top">
                <img
                  :src="_checkImgUrl(store.userinfo.cover_url[0].url_list[0])"
                  alt=""
                  class="avatar"
                />
                <div class="belong">{{ store.userinfo.nickname }}的红包</div>
                <div class="password">大吉大利</div>
              </div>

              <div class="l-button" :class="{ opening: data.opening }" @click="openRedPacket">
                <template v-if="data.opening">
                  <img src="../../../assets/img/icon/loading-white.png" alt="" />
                  正在打开
                </template>
                <span v-else>开红包</span>
              </div>
            </div>
          </template>
          <img
            src="../../../assets/img/icon/message/chat/close.png"
            alt=""
            class="close"
            @click="data.isShowOpenRedPacket = false"
          />
        </div>
      </div>
    </transition>

    <Loading v-if="data.loading" />
  </div>
</template>
<script setup lang="ts">
import ChatMessage from '../components/ChatMessage.vue'
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import Loading from '@/components/Loading.vue'
import { useBaseStore } from '@/store/pinia'
import { _checkImgUrl, _no, _sleep } from '@/utils'
import { useRouter } from 'vue-router'
import { useNav } from '@/utils/hooks/useNav'
import bus, { EVENT_KEY } from '@/utils/bus'
import { mapState } from 'pinia'
// 在现有import后添加：
import { onBeforeUnmount } from 'vue'

let CALL_STATE = {
  REJECT: 0,
  RESOLVE: 1,
  NONE: 2
}
let VIDEO_STATE = {
  VALID: 0,
  INVALID: 1
}
let AUDIO_STATE = {
  NORMAL: 0,
  SENDING: 1
}
let READ_STATE = {
  SENDING: 0,
  ARRIVED: 1,
  READ: 1
}
let MESSAGE_TYPE = {
  TEXT: 0,
  TIME: 1,
  VIDEO: 2,
  DOUYIN_VIDEO: 9,
  AUDIO: 3,
  IMAGE: 6,
  VIDEO_CALL: 4,
  AUDIO_CALL: 5,
  MEME: 7, //表情包
  RED_PACKET: 8 //红包
}
let RED_PACKET_MODE = {
  SINGLE: 1,
  MULTIPLE: 2
}

defineOptions({
  name: 'Chat'
})

const router = useRouter()
const nav = useNav()
const store = useBaseStore()
const msgWrapper = ref<HTMLDivElement>()
const data = reactive({
  previewImg: new URL('../../../assets/img/poster/3.jpg', import.meta.url).href,
  videoCall: [],
  MESSAGE_TYPE,
  messages: [
    {
      type: MESSAGE_TYPE.TIME,
      data: '',
      time: '2021-01-02 21:21',
      user: {
        id: '2739632844317827',
        avatar: 'http://localhost:3000/src/assets/img/icon/avatar/2.png'
      }
    },

    {
      type: MESSAGE_TYPE.MEME,
      state: AUDIO_STATE.NORMAL,
      data: new URL('../../../assets/img/poster/1.jpg', import.meta.url).href,
      time: '2021-01-02 21:21',
      user: {
        id: '2739632844317827',
        avatar: 'http://localhost:3000/src/assets/img/icon/avatar/2.png'
      },
      loved: [
        {
          id: 2,
          avatar: 'http://localhost:3000/src/assets/img/icon/avatar/2.png'
        },
        {
          id: 2,
          avatar: 'http://localhost:3000/src/assets/img/icon/avatar/2.png'
        }
      ]
    },
    {
      type: MESSAGE_TYPE.IMAGE,
      state: AUDIO_STATE.NORMAL,
      data: new URL('../../../assets/img/poster/1.jpg', import.meta.url).href,
      time: '2021-01-02 21:21',
      user: {
        id: 1,
        avatar: 'http://localhost:3000/src/assets/img/icon/avatar/2.png'
      }
    },
    {
      type: MESSAGE_TYPE.IMAGE,
      state: AUDIO_STATE.NORMAL,
      data: new URL('../../../assets/img/poster/1.jpg', import.meta.url).href,
      time: '2021-01-02 21:21',
      user: {
        id: '2739632844317827',
        avatar: 'http://localhost:3000/src/assets/img/icon/avatar/2.png'
      },
      readState: READ_STATE.ARRIVED
    },
    {
      type: MESSAGE_TYPE.VIDEO_CALL,
      state: CALL_STATE.REJECT,
      data: '2021-01-02 21:44',
      time: '2021-01-02 21:21',
      user: {
        id: '2739632844317827',
        avatar: 'http://localhost:3000/src/assets/img/icon/avatar/2.png'
      }
    },
    {
      type: MESSAGE_TYPE.VIDEO_CALL,
      state: CALL_STATE.RESOLVE,
      data: '2021-01-02 21:44',
      time: '2021-01-02 21:21',
      user: {
        id: '2739632844317827',
        avatar: 'http://localhost:3000/src/assets/img/icon/avatar/2.png'
      }
    },
    {
      type: MESSAGE_TYPE.VIDEO_CALL,
      state: CALL_STATE.NONE,
      data: '2021-01-02 21:44',
      time: '2021-01-02 21:21',
      user: {
        id: '2739632844317827',
        avatar: 'http://localhost:3000/src/assets/img/icon/avatar/2.png'
      }
    },
    {
      type: MESSAGE_TYPE.AUDIO_CALL,
      state: CALL_STATE.REJECT,
      data: '2021-01-02 21:44',
      time: '2021-01-02 21:21',
      user: {
        id: '2739632844317827',
        avatar: 'http://localhost:3000/src/assets/img/icon/avatar/2.png'
      }
    },
    {
      type: MESSAGE_TYPE.AUDIO_CALL,
      state: CALL_STATE.RESOLVE,
      data: '2021-01-02 21:44',
      time: '2021-01-02 21:21',
      user: {
        id: '2739632844317827',
        avatar: 'http://localhost:3000/src/assets/img/icon/avatar/2.png'
      }
    },
    {
      type: MESSAGE_TYPE.AUDIO_CALL,
      state: CALL_STATE.NONE,
      data: '2021-01-02 21:44',
      time: '2021-01-02 21:21',
      user: {
        id: '2739632844317827',
        avatar: 'http://localhost:3000/src/assets/img/icon/avatar/2.png'
      }
    },
    {
      type: MESSAGE_TYPE.AUDIO,
      state: AUDIO_STATE.NORMAL,
      data: {
        duration: 5,
        src: ''
      },
      time: '2021-01-02 21:21',
      user: {
        id: '1',
        avatar: 'http://localhost:3000/src/assets/img/icon/avatar/2.png'
      }
    },
    {
      type: MESSAGE_TYPE.AUDIO,
      state: AUDIO_STATE.NORMAL,
      data: {
        duration: 10,
        src: ''
      },
      time: '2021-01-02 21:21',
      user: {
        id: '2739632844317827',
        avatar: 'http://localhost:3000/src/assets/img/icon/avatar/2.png'
      }
    },
    {
      type: MESSAGE_TYPE.TEXT,
      data: '又在刷抖音',
      time: '2021-01-02 21:21',
      user: {
        id: '2739632844317827',
        avatar: 'http://localhost:3000/src/assets/img/icon/avatar/2.png'
      }
    },
    {
      type: MESSAGE_TYPE.TEXT,
      data: '我昨天@你那个视频发给我下',
      time: '2021-01-02 21:21',
      user: {
        id: '2739632844317827',
        avatar: 'http://localhost:3000/src/assets/img/icon/avatar/2.png'
      }
    },
    {
      type: MESSAGE_TYPE.TEXT,
      data: '我找不到了',
      time: '2021-01-02 21:21',
      user: {
        id: '1',
        avatar: 'http://localhost:3000/src/assets/img/icon/avatar/2.png'
      }
    },
    {
      type: MESSAGE_TYPE.TEXT,
      data: '我也找不到了我也找不到了我也找不到了我也找不到了我也找不到了我也找不到了我也找不到了我也找不到了',
      time: '2021-01-02 21:21',
      user: {
        id: '2739632844317827',
        avatar: 'http://localhost:3000/src/assets/img/icon/avatar/2.png'
      }
    },
    {
      type: MESSAGE_TYPE.DOUYIN_VIDEO,
      state: VIDEO_STATE.VALID,
      data: {
        poster: new URL('../../../assets/img/poster/3.jpg', import.meta.url).href,
        author: {
          name: 'safasdfassafasdfassafasdfassafasdfas',
          avatar: new URL('../../../assets/img/icon/head-image.jpeg', import.meta.url).href
        },
        title: '服了asd'
      },
      time: '2021-01-02 21:21',
      user: {
        id: '1',
        avatar: 'http://localhost:3000/src/assets/img/icon/avatar/2.png'
      }
    },
    {
      type: MESSAGE_TYPE.VIDEO,
      state: VIDEO_STATE.VALID,
      data: {
        poster: new URL('../../../assets/img/poster/3.jpg', import.meta.url).href
      },
      time: '2021-01-02 21:21',
      user: {
        id: '2739632844317827',
        avatar: 'http://localhost:3000/src/assets/img/icon/avatar/2.png'
      }
    },
    {
      type: MESSAGE_TYPE.RED_PACKET,
      state: AUDIO_STATE.NORMAL,
      mode: RED_PACKET_MODE.MULTIPLE,
      data: {
        money: 5.11,
        title: '大吉大利',
        state: '未领取'
      },
      time: '2021-01-02 21:21',
      user: {
        id: '2739632844317827',
        avatar: 'http://localhost:3000/src/assets/img/icon/avatar/2.png'
      }
    },
    {
      type: MESSAGE_TYPE.RED_PACKET,
      state: AUDIO_STATE.NORMAL,
      mode: RED_PACKET_MODE.SINGLE,
      data: {
        money: 5.11,
        title: '大吉大利',
        state: '已过期'
      },
      time: '2021-01-02 21:21',
      user: {
        id: 1,
        avatar: 'http://localhost:3000/src/assets/img/icon/avatar/2.png'
      }
    }
  ],
  typing: false,
  loading: false,
  opening: false,
  isOpened: false,
  recording: false,
  showOption: false,
  isShowOpenRedPacket: false,
  tooltipTop: -1,
  tooltipTopLocation: '',

  messageInput: '', // 新增输入绑定字段
  keyboardHeight: 0, // 记录键盘高度

  audioBlob: null, // 存储录音文件
  recordingTime: 0, // 录音时长记录
  mediaRecorder: null, // MediaRecorder实例

  audioChunks: [] as Blob[], // 存储录音数据块
  recordingTimer: null // 录音计时器
})

// 在现有代码后添加返回键处理：
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    router.back()
  }
}

// 处理Android物理返回键
const handlePopState = () => {
  router.back()
}
onMounted(() => {
  msgWrapper.value
    .querySelectorAll('img')
    .forEach((item) => item.addEventListener('load', scrollBottom))
  scrollBottom()

  // 新增键盘事件监听
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('popstate', handlePopState)
})

onBeforeUnmount(() => {
  if (msgWrapper.value) {
    msgWrapper.value
      .querySelectorAll('img')
      .forEach((item) => item.removeEventListener('load', scrollBottom))
  }
  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', adjustLayout)
  }
  // 移除事件监听
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('popstate', handlePopState)
})
onUnmounted(() => {})

const isExpand = computed(() => {
  return data.showOption
})
// 修改后的handleStartRecording
async function handleStartRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    data.mediaRecorder = new MediaRecorder(stream)
    data.audioChunks = []

    data.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        data.audioChunks.push(e.data)
      }
    }

    data.mediaRecorder.onstop = async () => {
      // 创建最终Blob
      const audioBlob = new Blob(data.audioChunks, { type: 'audio/wav' })
      console.log('audioBlob', audioBlob)
      // 生成对象URL并存储
      data.audioBlob = URL.createObjectURL(audioBlob)
      console.log('audioBlob', data.audioBlob)
      // 创建消息对象
      const newMsg = {
        type: MESSAGE_TYPE.AUDIO,
        state: AUDIO_STATE.NORMAL,
        data: {
          duration: data.recordingTime,
          src: data.audioBlob
        },
        time: new Date().toLocaleTimeString(),
        user: {
          id: store.userinfo.uid,
          avatar: store.userinfo.avatar_168x168.url_list[0]
        }
      }

      // 添加消息
      if (data.recordingTime >= 1) {
        data.messages.push(newMsg)
        nextTick(scrollBottom)
      } else {
        alert('录音时间太短')
      }

      // 清理资源
      data.audioChunks = []
      data.recordingTime = 0
      stream.getTracks().forEach((track) => track.stop())
    }

    data.mediaRecorder.start()
    data.recordingTime = 0
    data.recordingTimer = setInterval(() => {
      data.recordingTime++
    }, 1000)
  } catch (error) {
    console.error('录音失败:', error)
  }
}

// 修改后的handleStopRecording
function handleStopRecording() {
  console.log('stop')
  if (data.mediaRecorder) {
    data.mediaRecorder.stop()
    clearInterval(data.recordingTimer)
    data.mediaRecorder.stream.getTracks().forEach((track) => track.stop())
    data.mediaRecorder = null
  }
}

// 添加时间格式化方法
function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 处理输入框点击
function handleInputClick() {
  data.typing = true
  // 移动端需要处理键盘弹出时的布局
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', adjustLayout)
  }
}

// 调整布局适应键盘
function adjustLayout() {
  const viewport = window.visualViewport
  if (viewport) {
    data.keyboardHeight = window.innerHeight - viewport.height
    msgWrapper.value.style.height = `calc(var(--vh, 1vh) * 100 - ${125 + data.keyboardHeight}rem)`
  }
}

// 处理发送
function handleSend() {
  if (!data.messageInput.trim()) return

  // 创建新消息对象
  const newMsg = {
    type: MESSAGE_TYPE.TEXT,
    data: data.messageInput,
    time: new Date().toLocaleTimeString(),
    user: {
      id: store.userinfo.uid, // 当前用户ID
      avatar: 'http://localhost:3000/src/assets/img/icon/avatar/2.png'
    }
  }

  // 添加到消息列表
  data.messages.push(newMsg)

  // 清空输入
  data.messageInput = ''
  data.typing = false

  // 滚动到底部
  nextTick(() => {
    scrollBottom()
    // 还原布局
    msgWrapper.value.style.height = ''
    data.keyboardHeight = 0
  })
}

function handleClick() {
  data.recording = true
  data.showOption = false
}

function scrollBottom() {
  nextTick(() => {
    let wrapper = msgWrapper.value
    // console.log('wrapper.clientHeight', wrapper.clientHeight)
    // console.log('wrapper.scrollHeight', wrapper.scrollHeight)
    wrapper.scrollTo({ top: wrapper.scrollHeight - wrapper.clientHeight })
  })
}

function openRedPacket() {
  data.opening = true
  setTimeout(() => {
    data.opening = false
    nav('/message/chat/red-packet-detail')
  }, 1000)
}

async function clickItem(e) {
  if (e.type === data.MESSAGE_TYPE.RED_PACKET) {
    data.loading = true
    await _sleep(500)
    data.loading = false
    data.isOpened = e.data.state === '已过期'
    data.isShowOpenRedPacket = true
  }
}

function showTooltip(e) {
  console.log(e)
  let wrapper = e.target

  // e.path.map((v) => {
  //   if (v && v.classList) {
  //     if (v.classList.value === 'chat-wrapper') {
  //       wrapper = v
  //     }
  //   }
  // })
  if (wrapper) {
    // console.log(wrapper.getBoundingClientRect())
    if (wrapper.getBoundingClientRect().y - 61 > 70) {
      data.tooltipTopLocation = 'top'
      data.tooltipTop = wrapper.getBoundingClientRect().y - 70
    } else {
      data.tooltipTopLocation = 'bottom'
      data.tooltipTop =
        wrapper.getBoundingClientRect().y + wrapper.getBoundingClientRect().height + 10
    }
  }
}
</script>

<style>
.recording-indicator {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 20rem;
  border-radius: 10rem;
  text-align: center;

  .recording-animation {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10rem;

    .mic-icon {
      width: 30rem;
      height: 30rem;
      background: url('../../../assets/img/icon/microphone.png') no-repeat center;
      background-size: contain;
    }

    .wave {
      width: 100rem;
      height: 30rem;
      background: linear-gradient(90deg, #fff 50%, transparent 50%);
      animation: wave 1s infinite linear;
    }
  }

  .recording-time {
    color: #fff;
    font-size: 16rem;
    margin-bottom: 10rem;
  }

  .recording-hint {
    color: #ccc;
    font-size: 12rem;
  }
}

@keyframes wave {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 40rem 0;
  }
}
/* 添加发送按钮样式 */
.send-btn {
  width: 24rem;
  margin-left: 15rem;
  transition: 0.3s;
  &:active {
    transform: scale(0.9);
  }
}

/* 调整消息容器高度 */
.message-wrapper {
  transition: height 0.3s ease;
}
.scale-enter-active,
.scale-leave-active {
  transition: transform 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0);
}
</style>
<style scoped lang="less">
@import '../../../assets/less/index';

.Chat {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  overflow: auto;
  color: white;
  font-size: 14rem;
  background: var(--color-message);

  .chat-content {
    > .header {
      z-index: 2;
      width: 100%;
      box-sizing: border-box;
      height: var(--common-header-height);
      padding: 0 10rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--line-color);

      img {
        height: 20rem;
        margin: 0 10rem;
      }

      .left {
        max-width: 60%;
        overflow: hidden;
        display: flex;
        align-items: center;

        .badge {
          margin-right: 10rem;
          font-size: 12rem;
          display: block;
          padding: 1px 6px;
          border-radius: 10px;
          color: white;
          background: var(--second-btn-color);
        }
      }

      .right {
        display: flex;
      }
    }

    .message-wrapper {
      height: calc(var(--vh, 1vh) * 100 - 125rem);
      overflow: auto;

      &.expand {
        height: calc(var(--vh, 1vh) * 100 - (125rem + var(--vh, 1vh) * 30));
      }
    }

    .footer {
      @chat-bg-color: rgb(105, 143, 244);
      @normal-bg-color: rgb(57, 57, 57);
      padding: 10rem 0;

      .toolbar {
        box-sizing: border-box;
        height: 44rem;
        margin: 0 10rem;
        padding: 5rem;
        background: @normal-bg-color;
        border-radius: 20rem;
        display: flex;
        align-items: center;

        img {
          width: 24rem;
          border-radius: 50%;
          margin-left: 15rem;
        }

        input {
          flex: 1;
          outline: none;
          border: none;
          background: @normal-bg-color;
        }

        .camera {
          margin-left: 0;
          margin-right: 5rem;
          width: 14rem;
          padding: 5rem;
          border-radius: 50%;
          background: @chat-bg-color;
        }
      }

      .record {
        box-sizing: border-box;
        height: 44rem;
        margin: 0 10rem;
        padding: 10rem 5rem;
        background: @normal-bg-color;
        border-radius: 20rem;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        img {
          right: 5rem;
          position: absolute;
          width: 24rem;
          border-radius: 50%;
          margin-left: 15rem;
        }
      }

      .options {
        font-size: 14rem;
        width: 100vw;
        padding: 15rem;
        height: calc(var(--vh, 1vh) * 30);
        box-sizing: border-box;

        .option-wrapper {
          box-sizing: border-box;
          @grid-width: calc((100vw - 30rem) / 4);
          color: gray;
          display: grid;
          grid-template-columns: @grid-width @grid-width @grid-width @grid-width;

          .option {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            margin-bottom: 10rem;

            img {
              border-radius: 4rem;
              background: @normal-bg-color;
              padding: 10rem;
              width: 30rem;
              margin-bottom: 10rem;
            }
          }
        }
      }
    }
  }

  .preview-img {
    position: fixed;
    z-index: 9;
    top: 0;
    background: black;
    width: 100vw;
    height: calc(var(--vh, 1vh) * 100);

    .header {
      position: fixed;
      width: 100vw;
      box-sizing: border-box;
      padding: var(--page-padding);
      display: flex;
      justify-content: space-between;

      img {
        width: 22rem;
      }
    }
  }

  .tooltip {
    z-index: 9;
    left: 50%;
    margin-left: -33%;
    position: fixed;
    font-size: 12rem;
    border-radius: 6rem;
    //padding: 1rem;
    background: rgb(55, 58, 67);
    display: flex;

    .options {
      width: 45rem;
      height: 60rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      img {
        margin-bottom: 4rem;
        width: 18rem;
      }
    }

    .arrow {
      width: 0;
      height: 0;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);

      &.bottom {
        top: -14rem;
        border: 7rem solid transparent;
        border-bottom: 7rem solid var(--second-btn-color);
      }

      &.top {
        bottom: -14rem;
        border: 7rem solid transparent;
        border-top: 7rem solid var(--second-btn-color);
      }
    }
  }

  .red-packet {
    z-index: 9;
    top: 0;
    position: fixed;
    width: 100vw;
    height: calc(var(--vh, 1vh) * 100);
    display: flex;
    align-items: center;
    justify-content: center;

    .content {
      width: 75vw;
      height: 55vh;
      z-index: 10;
      position: fixed;
      display: flex;
      align-items: center;
      flex-direction: column;

      .bg {
        z-index: 9;
        position: absolute;
        width: 100%;
        height: 100%;
      }

      .wrapper {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 20rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        color: #fdd9b3;
        z-index: 10;
        position: relative;

        .top {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .avatar {
          margin-top: 60rem;
          width: 55rem;
          height: 55rem;
          border-radius: 50%;
          margin-bottom: 20rem;
        }

        .money {
          color: rgb(193, 135, 79);
          font-size: 40rem;
          font-weight: bold;
          margin-top: 15rem;
          margin-bottom: 65rem;
        }

        .belong {
          font-size: 12rem;
          margin-bottom: 30rem;
        }

        .password {
          font-size: 16rem;
        }

        .notice {
          margin-top: 150rem;
          font-size: 12rem;
        }

        .l-button {
          font-size: 16rem;
          border-radius: 0.5rem;
          margin-bottom: 30rem;
          padding: 12rem 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgb(120, 48, 45);
          width: 65vw;
          background: rgb(255, 217, 132);
          box-shadow: 0 0 1px;

          &.opening {
            background: rgb(228, 77, 58);

            img {
              width: 18rem;
              margin-right: 10rem;
              animation: animal 0.8s infinite linear;

              @keyframes animal {
                0% {
                  transform: rotate(-360deg);
                }
                100% {
                  transform: rotate(0deg);
                }
              }
            }
          }
        }
      }

      .close {
        bottom: -8vh;
        position: absolute;
        width: 30rem;
      }
    }
  }
}
</style>
