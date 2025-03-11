import { defineStore } from 'pinia'

import resource from '@/assets/data/resource'

import { _sleep } from '@/utils'
import { type UserInfo } from '@/api/gen/userinfo_pb'
import { getPanel } from '@/api/moguservice'
let user: UserInfo
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
      users: [],
      userinfo: {} as UserInfo, // Initialized with an empty object
      friends: resource.users,
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
          user = r
          //   console.log('r.data', r);
          this.userinfo = user
          //   console.log('userinfo', this.userinfo);
          // const r2 = await getContacts('', 20, CONTACT_TAG.FRIEND);
          // console.log('r2.data', r2.userList);
          // this.users = r2.userList;
          // console.log('users', this.users);
          success = true
        } catch (err) {
          await _sleep(1000)
          console.error(err)
        }
      }
      // 捕获刷新信号并保存状态到 sessionStorage

      return true
    },
    getuser() {
      return user
    },
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
