<template>
  <div>
    <UserPanel
      ref="uploader"
      v-model:currentItem="state.currentItem"
      :active="true"
      @toggleCanMove="(e) => (state.canMove = e)"
      @showFollowSetting="state.showFollowSetting = true"
      @showFollowSetting2="state.showFollowSetting2 = true"
      @update-follow="handleUpdateFollow"
    />

    <FollowSetting
      v-model:currentItem="state.currentItem"
      @showChangeNote="delayShowDialog(() => (state.showChangeNote = true))"
      @showBlockDialog="delayShowDialog(() => (state.showBlockDialog = true))"
      @showShare="delayShowDialog(() => (state.isSharing = true))"
      v-model="state.showFollowSetting"
      @cancelFollow="uploader.cancelFollow()"
    />

    <FollowSetting2
      v-model:currentItem="state.currentItem"
      @cancelFollow="uploader.cancelFollow()"
      v-model="state.showFollowSetting2"
    />

    <BlockDialog
      v-model="state.showBlockDialog"
      v-model:blockedUserId="state.currentItem.author.uid"
    />

    <ConfirmDialog title="设置备注名" ok-text="确认" v-model:visible="state.showChangeNote">
      <Search mode="light" v-model="test" :isShowSearchIcon="false" />
    </ConfirmDialog>

    <Share
      v-model="state.isSharing"
      ref="share"
      page-id="userPanel"
      :item="transformToVideo(state.currentItem)"
    />
  </div>
</template>

<script setup lang="ts">
import { onActivated, onDeactivated, reactive, ref } from 'vue'
import UserPanel from '@/components/UserPanel.vue'
import FollowSetting from '@/pages/home/components/FollowSetting.vue'
import FollowSetting2 from '@/pages/home/components/FollowSetting2.vue'
import BlockDialog from '../message/components/BlockDialog.vue'
import Search from '../../components/Search.vue'
import ConfirmDialog from '../../components/dialog/ConfirmDialog.vue'
import { useRouter } from 'vue-router'
import type { UserInfo } from '@/api/gen/userinfo_pb'
import type { VideoList } from '@/api/gen/video_pb'
import { useBaseStore } from '@/store/pinia'
import Share from '../../components/Share.vue'

defineOptions({
  name: 'UserPanelPage'
})

const baseStore = useBaseStore()
const router = useRouter()

const uploader = ref()
const test = ref('')

const state = reactive({
  currentItem: {
    author: { uid: '' } as UserInfo,
    aweme_list: {} as VideoList
  },
  showFollowSetting: false,
  showFollowSetting2: false,
  showBlockDialog: false,
  showChangeNote: false,
  canMove: true,
  isSharing: false
})
onActivated(() => {
  // 处理激活事件
  console.log('index onactivated', baseStore.routeData)

  if (baseStore.routeData?.currentItem) {
    state.currentItem = baseStore.routeData.currentItem
  }
})
onDeactivated(() => {
  // 处理停用事件
  console.log('index ondeactivated')
})

function handleBack() {
  router.back()
}

function handleUpdateFollow(newStatus) {
  state.currentItem.author.followStatus = newStatus
}

function delayShowDialog(cb: Function) {
  setTimeout(cb, 400)
}
function transformToVideo(item) {
  return {
    ...item,
    $typeName: 'protos.Video',
    $unknown: item.$unknown || []
  }
}
</script>

<style scoped lang="less">
/* 添加必要的样式 */
</style>
