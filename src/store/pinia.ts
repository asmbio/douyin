import { defineStore } from 'pinia'
import { _sleep } from '@/utils'
import { type UserInfo, type Userinfolist } from '@/api/gen/userinfo_pb'
import { getContacts, getPanel } from '@/api/moguservice'
import { CONTACT_TAG } from '@/api/gen/moguervice_pb'
//let user: UserInfo
export const useBaseStore = defineStore('base', {
  state: () => {
    return {
      bodyHeight: document.body.clientHeight,
      bodyWidth: document.body.clientWidth,
      maskDialog: false,
      maskDialogMode: 'dark',
      version: '17.1.0',
      excludeNames: [],
      judgeValue: 20,
      homeRefresh: 60,
      loading: false,
      routeData: null,
      notifications: <UserInfo[]>[
        // @ts-ignore - 类型不完全匹配但强制保留原始结构
        {
          uid: '3VnYJ8cQmRq9sLpWfT4hBx',
          displayname: '互动消息',
          lastcontent: 'xxx 近期访问过你的主页',
          lastsendtime: BigInt(Date.UTC(2025, 10, 11)) * 1_000_000n,
          unread: 1
        },
        // @ts-ignore
        {
          uid: '7sZq4dFvT9jK3mRnPwXhL6',
          displayname: '系统通知',
          lastcontent: '协议修订通知',
          lastsendtime: BigInt(Date.UTC(2025, 8, 31)) * 1_000_000n
        },
        // @ts-ignore
        {
          uid: '5qMv7dFgHjK3nRtPwS4zL9',
          displayname: '虎子',
          lastcontent: '哈哈哈哈',
          lastsendtime: BigInt(Date.UTC(2025, 8, 31)) * 1_000_000n
        }
      ], // 双重类型断言绕过校验
      users: [],
      userinfo: {} as UserInfo, // Initialized with an empty object
      friends: {} as Userinfolist,
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
          const r2 = await getContacts('', 30, CONTACT_TAG.FRIEND)
          // console.log('r2.data', r2.userList);
          this.friends = r2
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
    addOrUpdateNotification(payload: UserInfo) {
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
        // 新通知添加到最前面
        this.notifications.unshift(payload)
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
          this.excludeNames.push(val.value)
        }
      } else {
        const resIndex = this.excludeNames.findIndex((v) => v === val.value)
        if (resIndex !== -1) {
          this.excludeNames.splice(resIndex, 1)
        }
      }
      // console.log('store.excludeNames', store.excludeNames,val)
    }
  }
})
