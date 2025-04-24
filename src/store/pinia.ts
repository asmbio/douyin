import { defineStore } from 'pinia'
import { _sleep } from '@/utils'
import { type AvatarImage, type UserInfo, type Userinfolist } from '@/api/gen/userinfo_pb'
import {
  deleteConversation,
  getChatStream,
  getContacts,
  getPanel,
  myVideo
} from '@/api/moguservice'
import { CONTACT_TAG } from '@/api/gen/moguervice_pb'

import {
  MESSAGE_TYPE,
  MessagelistSchema,
  type ChatMessage,
  type Messagelist,
  type TextContent
} from '@/api/gen/message_pb'
import { create } from '@bufbuild/protobuf'
import { h } from 'vue'
//let user: UserInfo

// type Conversion = {
//   user: UserInfo,
//   conversion:Messagelist
// };

export const idMappings = new Map([
  [
    'vW1NNYW1Xm6WHzN1nxjKzvWAeVi',
    {
      route: '/message/fans',
      img: new URL('../assets/img/icon/msg-icon1.png', import.meta.url).href,
      name: '新朋友',
      tag: ''
    }
  ],
  [
    'of2BqPA8hkWeQHavWKbjza3cCg2',
    {
      route: '/message/all',
      img: new URL('../assets/img/icon/msg-icon2.png', import.meta.url).href,
      name: '互动消息',
      tag: ''
    }
  ],
  [
    'HVkydXTEfnwSuVuJhhyXpiQ9ZDv',
    {
      route: '/message/chat',
      img: new URL('../assets/img/icon/avatar/2.png', import.meta.url).href,
      name: '测试用户',
      tag: ''
    }
  ],
  [
    'mUCYBWPVug5YTbTqiJFC4RfaNCA',
    {
      route: '/message/douyin-helper',
      img: new URL('../assets/img/icon/msg-icon5.webp', import.meta.url).href,
      name: '抖音小助手',
      tag: '官方'
    }
  ],
  [
    'SVP4jWisrKh16L2JJy9NCVVbwJy',
    {
      route: '/message/system-notice',
      img: new URL('../assets/img/icon/msg-icon4.png', import.meta.url).href,
      name: '系统通知',
      tag: '官方'
    }
  ],
  [
    'mJk7HWJh1zmcbtdwEdbx73k3jx3',
    {
      route: '/me/request-update',
      img: new URL('../assets/img/icon/msg-icon7.webp', import.meta.url).href,
      name: '求更新',
      tag: '官方'
    }
  ],
  [
    'ESexJ9gfosxcVnmPxooA9MxgpTW',
    {
      route: '/message/task-notice',
      img: new URL('../assets/img/icon/msg-icon6.webp', import.meta.url).href,
      name: '任务通知',
      tag: '官方'
    }
  ],
  [
    '6kzL4vkswEcXjmtvK6mL8r59b2o',
    {
      route: '/message/live-notice',
      img: new URL('../assets/img/icon/msg-icon8.webp', import.meta.url).href,
      name: '直播通知',
      tag: '官方'
    }
  ],
  [
    'owyUi3vw9nY5kvLSeatDtP61LNW',
    {
      route: '/message/money-notice',
      img: new URL('../assets/img/icon/msg-icon9.webp', import.meta.url).href,
      name: '钱包通知',
      tag: '官方'
    }
  ]
])

export const useBaseStore = defineStore('base', {
  state: () => {
    return {
      bodyHeight: document.body.clientHeight,
      bodyWidth: document.body.clientWidth,
      maskDialog: false,
      maskDialogMode: 'dark',
      version: '17.1.0',
      excludeNames: [],
      includeNames: ['Home', 'Shop', 'Publish', 'Me', 'Message', 'UserPanelPage'],
      judgeValue: 20,
      homeRefresh: 60,
      loading: false,
      routeData: null,
      conversasions: new Map() as Map<String, Messagelist>,
      activatedConversasionId: '',
      // activatedConversasion:<Messagelist>{},
      activatedCallback: (message: ChatMessage) => void {},
      notifications: <UserInfo[]>[
        // @ts-ignore - 类型不完全匹配但强制保留原始结构
        {
          uid: '3VnYJ8cQmRq9sLpWfT4hBx',
          displayname: '互动消息',
          lastcontent: 'xxx 近期访问过你的主页',
          lastsendtime: BigInt(Date.UTC(2024, 10, 11)) * 1_000_000n,
          unread: 1
        },
        // @ts-ignore
        {
          uid: '7sZq4dFvT9jK3mRnPwXhL6',
          displayname: '系统通知',
          lastcontent: '协议修订通知',
          lastsendtime: BigInt(Date.UTC(2024, 8, 31)) * 1_000_000n
        },
        // @ts-ignore
        {
          uid: '5qMv7dFgHjK3nRtPwS4zL9',
          avatar168x168: {
            urlList: [new URL('../assets/img/icon/avatar/2.png', import.meta.url).href]
          },
          displayname: '虎子',
          lastcontent: '哈哈哈哈',
          lastsendtime: BigInt(Date.UTC(2024, 8, 30)) * 1_000_000n
        }
      ], // 双重类型断言绕过校验
      stranger: <UserInfo[]>[
        {
          uid: '5qMv7dFgHjK3nRtPwS4zL9',
          avatar168x168: {
            urlList: [new URL('../assets/img/icon/avatar/2.png', import.meta.url).href]
          } as AvatarImage,
          displayname: '今日缘分(测)',
          lastcontent: '我们连接上了',
          lastsendtime: BigInt(Date.UTC(2025, 8, 31)) * 1_000_000n
        }
      ],
      users: [],
      userinfo: {} as UserInfo, // Initialized with an empty object
      friends: {} as Userinfolist,
      hasMorefriends: true,
      videos: {
        my: {
          list: [],
          total: 0,
          fromtime: BigInt(Date.now() * 1_000_000),
          hasmore: true
          //fromtime:  Long.fromNumber(Date.now()).multiply(1_000_000)
        },
        private: {
          list: [],
          total: -1,
          pageNo: 0,
          hasmore: true
        },
        like: {
          list: [],
          total: -1,
          pageNo: 0,
          hasmore: true
        },
        collect: {
          video: {
            list: [],
            total: -1,
            hasmore: true
          },
          music: {
            list: [],
            total: -1
          }
        }
      },
      message: '',
      islogin: false
    }
  },
  persist: {
    storage: sessionStorage
  },
  getters: {
    selectFriends: (state) => {
      return state.friends.all.filter((v) => v.select)
    }
  },
  actions: {
    async init() {
      let success = false
      while (!success) {
        try {
          const r = await getPanel()

          //   console.log('r.data', r);
          this.userinfo = r
          //   console.log('userinfo', this.userinfo);
          const r2 = await getContacts('', 100, CONTACT_TAG.FRIEND)
          // console.log('r2.data', r2.userList);
          this.friends = r2

          const st = await getContacts('', 100, CONTACT_TAG.STRANGER)
          console.log('loadstranger', st)
          this.stranger.push(...st.all)

          // console.log('users', this.users);
          // let stm =await getNoticeStream()
          //  try {

          //   // 4. 处理流数据
          //   for await (const message of stm) {
          //     // message 已自动反序列化为 MessageSchema 类型
          //     console.log("Received message:", message);

          //     // 这里可以更新 UI 或处理业务逻辑
          //     // 例如：添加到消息列表、实时显示等
          //   }

          //   console.log("Stream completed");
          // } catch (error) {
          //   console.error("Stream error:", error);
          // }

          success = true
        } catch (err) {
          await _sleep(1000)
          console.error(err)
        }
      }
      // 捕获刷新信号并保存状态到 sessionStorage

      return true
    },
    async loadMoreFriends() {
      if (this.loading || !this.hasMorefriends) return
      try {
        this.loading = true
        const lastUid =
          this.friends.all.length > 0 ? this.friends.all[this.friends.all.length - 1].uid : ''
        const r2 = await getContacts(lastUid, 30, CONTACT_TAG.FRIEND)

        // 处理新数据
        if (r2.all.length > 0) {
          this.friends.all.push(...r2.all)
          if (r2.all.length < 30) {
            this.hasMorefriends = false
          } else {
            this.hasMorefriends = true
          }
        }
      } catch (error) {
        console.error('Error loading more:', error)
      } finally {
        this.loading = false
      }
    },
    async initChatStream() {
      console.log('initChatStream init')
      const stm = await getChatStream('')
      for await (const message of stm) {
        if (this.conversasions.has(this.getConversasionId(message))) {
          this.conversasions.get(this.getConversasionId(message)).msgList.push(message)
        }
        if (this.activatedConversasionId === this.getConversasionId(message)) {
          this.updateLastContent(message)
          this.activatedCallback(message)
        }
        // 如果activeted 滚动
      }
    },
    getConversasionId(msg: ChatMessage) {
      if (msg.user.id === this.userinfo.uid) {
        return msg.Receiver
      }
      return msg.user.id
    },
    activeConversasion(uid: string, callback: (message: ChatMessage) => void) {
      this.activatedConversasionId = uid
      if (!this.conversasions.has(uid)) {
        this.conversasions.set(uid, create(MessagelistSchema))
      }
      //this.activatedConversasion= this.conversasions.get(uid)
      this.activatedCallback = callback
    },
    async getpublishvideo() {
      try {
        const ret = await myVideo(BigInt(Date.now() * 1_000_000), 1)
        console.log('getpublishvideo', ret)
        if (ret.all.length > 0) {
          this.videos.my.list.unshift(ret.all[0])
          this.videos.my.total += 1

          //this.videos.my.fromtime = ret.all[0].createTime
        }
      } catch (error) {
        console.log(error)
      }
    },
    updateLastContent(msg: ChatMessage) {
      const uid = this.getConversasionId(msg)
      let content = ''
      if (msg.type === MESSAGE_TYPE.TEXT) {
        content = (msg.content.value as TextContent).text
      } else if (msg.type === MESSAGE_TYPE.IMAGE) {
        content = '[图片]'
      } else if (msg.type === MESSAGE_TYPE.VIDEO) {
        content = '[视频]'
      } else if (msg.type === MESSAGE_TYPE.AUDIO) {
        content = '[语音]'
      } else {
        content = '[媒体消息]'
      }
      const notificationIndex = this.notifications.findIndex((n) => n.uid === uid)
      if (notificationIndex > -1) {
        this.notifications[notificationIndex].lastcontent = content
        this.notifications[notificationIndex].lastsendtime = msg.time
        const [notification] = this.notifications.splice(notificationIndex, 1)
        this.notifications.unshift(notification)
      } else {
        // const strangerIndex = this.stranger.findIndex((s) => s.uid === uid)
        // if (strangerIndex > -1) {
        //   this.stranger[strangerIndex].lastcontent = content
        //   this.stranger[strangerIndex].lastsendtime =  msg.time
        // } else {
        //   console.warn(`User with uid ${uid} not found in notifications or stranger list.`)
        // }
      }
    },
    removeNotification(uid: string) {
      const index = this.notifications.findIndex((n) => n.uid === uid)
      if (index > -1) {
        this.notifications.splice(index, 1)
        try {
          deleteConversation(uid)
        } catch (error) {
          console.log(error)
        }
      }
    },
    addOrUpdateNotification(payload: UserInfo) {
      console.log('addOrUpdateNotification', payload)
      if (payload.uid === this.userinfo.uid) {
        console.log('addOrUpdateNotification self', payload)
        this.userinfo = payload
        return
      }
      const index = this.notifications.findIndex((n) => n.uid === payload.uid)
      if (index > -1) {
        // 保留原有未读计数逻辑，合并新内容
        this.notifications[index] = payload
        // this.notifications[index] = {
        //   ...this.notifications[index],
        //   ...payload,
        //   unread: this.notifications[index].unread + 1
        // }
      } else {
        this.notifications.unshift(payload)
        console.log('addOrUpdateNotification unshift', payload)
        // 判断是否是陌生人
        // 新通知添加到最前面
        if (payload.followStatus == 0) {
          //
          // if (payload.isConnect) {
          //   this.stranger.push(payload)
          // } else {
          //   const delindex = this.stranger.findIndex((e) => e.uid === payload.uid)
          //   this.stranger.splice(delindex, 1)
          // }
        }
      }
    },
    // getuser() {
    //   return user
    // },
    setsession() {
      console.log('setsession')
      sessionStorage.setItem('piniaState', JSON.stringify(this.$state))
    },
    loadsession() {
      const lstate = JSON.parse(sessionStorage.getItem('piniaState'))
      console.log('loadsession', lstate)
      Object.assign(this.$state, lstate)
    },
    setUserinfo(val) {
      this.userinfo = val
    },
    setMaskDialog(val) {
      this.maskDialog = val.state
      if (val.mode) {
        this.maskDialogMode = val.mode
      }
    },
    updateExcludeNames(val) {
      if (val.type === 'add') {
        if (!this.excludeNames.find((v) => v === val.value)) {
          console.log('excludeNames push ', val)
          this.excludeNames.push(val.value)
        }
      } else {
        const resIndex = this.excludeNames.findIndex((v) => v === val.value)
        if (resIndex !== -1) {
          console.log('excludeNames splice ', val)
          this.excludeNames.splice(resIndex, 1)
        }
      }
      // console.log('store.excludeNames', store.excludeNames,val)
    }
  }
})
