<template>
  <div id="ChatDetail">
    <BaseHeader>
      <template v-slot:center>
        <span class="f16">聊天详情</span>
      </template>
    </BaseHeader>
    <div class="content">
      <div class="peoples">
        <People mode="normal" :key="data.friend.uid" :people="data.friend" />
        <!-- <div class="add-people" @click="nav('/message/share-to-friend')">
          <img src="../../../assets/img/icon/message/chat/add.png" alt="" class="head-image" />
          <div class="name">多人聊天</div>
        </div> -->
      </div>
      <div class="setting">
        <div v-if="data.friend.isgroup === true">
          <div class="row" @click="() => (data.showChangeNote = true)">
            <div class="left">群名称: {{ data.friend.displayname }}</div>
            <div class="right">
              <img src="../../../assets/img/icon/components/follow/write.png" alt="" />
            </div>
          </div>
          <div class="row" @click="() => (data.showChangeSignature = true)">
            <div class="left">简介: {{ data.friend.signature }}</div>
            <div class="right">
              <img src="../../../assets/img/icon/components/follow/write.png" alt="" />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="left">消息免打扰</div>
          <div class="right">
            <switches v-model="data.noMessage" theme="bootstrap" color="success"></switches>
          </div>
        </div>
        <div class="row">
          <div class="left">置顶聊天</div>
          <div class="right">
            <switches v-model="data.top" theme="bootstrap" color="success"></switches>
          </div>
        </div>
        <div class="row">
          <div class="left">查找聊天内容</div>
          <div class="right">
            <dy-back direction="right" scale=".7"></dy-back>
          </div>
        </div>
        <div class="row" @click="nav('/home/report', { mode: 'chat' })">
          <div class="left">举报</div>
          <div class="right">
            <dy-back direction="right" scale=".7"></dy-back>
          </div>
        </div>
        <div class="row" @click="data.blockDialog = true">
          <div class="left">拉黑</div>
          <div class="right">
            <dy-back direction="right" scale=".7"></dy-back>
          </div>
        </div>
      </div>
    </div>
    <BlockDialog v-model="data.blockDialog" v-model:blockedUserId="data.uid" />

    <ConfirmDialog
      title="名称"
      ok-text="确认"
      v-model:visible="data.showChangeNote"
      @ok="saveUserinfo"
    >
      <Search
        mode="light"
        :placeholder="data.friend.nickname"
        :modelValue="data.friend.nickname"
        :isShowSearchIcon="false"
        @update:modelValue="
          (value) => {
            console.log(data.friend.nickname)
            data.friend.nickname = value
            data.friend.displayname = value
          }
        "
      />
    </ConfirmDialog>
    <ConfirmDialog
      title="简介"
      ok-text="确认"
      v-model:visible="data.showChangeSignature"
      @ok="saveUserinfo"
    >
      <Search
        mode="light"
        :placeholder="data.friend.signature"
        v-model="data.friend.signature"
        :isShowSearchIcon="false"
        @update:modelValue="
          (value) => {
            console.log(value)
            // data.friend.signature = value;
          }
        "
      />
    </ConfirmDialog>
  </div>
</template>
<script setup lang="ts">
import Switches from '../components/swtich/switches.vue'
import People from '../../people/components/People.vue'
import BlockDialog from '../components/BlockDialog.vue'
import CONST_VAR from '../../../utils/const_var'
import { onMounted, reactive } from 'vue'
import { useNav } from '@/utils/hooks/useNav'
import { _notice, _showConfirmDialog } from '@/utils'
import type { UserInfo } from '@/api/gen/userinfo_pb'
import { useRoute } from 'vue-router'
import { useBaseStore } from '@/store/pinia'
import ConfirmDialog from '@/components/dialog/ConfirmDialog.vue'
import Search from '@/components/Search.vue'
import { editUserInfo } from '@/api/moguservice'

defineOptions({
  name: 'ChatDetail'
})
const route = useRoute()
const nav = useNav()
const store = useBaseStore()
const data = reactive({
  uid: '',
  friend: {} as UserInfo,
  noMessage: false,
  top: false,
  blockDialog: false,
  list: [
    {
      id: '224e9a00-ffa0-4bc1-bb07-c318c7b02fa5',
      avatar: new URL('../../../assets/img/icon/avatar/1.png', import.meta.url).href,
      name: '何以为家',
      sex: '',
      age: null,
      idCard: null,
      phone: '',
      address: null,
      wechat: '',
      password: null,
      lastLoginTime: '1629993515',
      createTime: '1630035089',
      isDelete: 0,
      account: '234',
      pinyin: 'M',
      select: false,
      type: CONST_VAR.RELATE_ENUM.FOLLOW_EACH_OTHER
    }
  ],
  showChangeNote: false,
  showChangeSignature: false
})

onMounted(() => {
  data.uid = route.query.uid as string
  data.friend = store.notifications.find((e) => e.uid === data.uid)
})

async function saveUserinfo() {
  console.log('saveUserinfo')

  try {
    data.friend.isgroup = true
    await editUserInfo(data.friend)
    _notice('保存成功')
  } catch (error) {
    _notice(error)
    console.log(error)
  }
}
function follow(index) {
  if (data.list[index].type === CONST_VAR.RELATE_ENUM.FOLLOW_ME) {
    data.list[index].type = CONST_VAR.RELATE_ENUM.FOLLOW_EACH_OTHER
  }
}

function unfollow(index) {
  _showConfirmDialog(
    '正在与对方相互关注，是否不再关注该用户',
    null,
    'gray',
    () => {
      data.list[index].type = CONST_VAR.RELATE_ENUM.FOLLOW_ME
    },
    () => {},
    '取消关注',
    '返回'
  )
}
</script>

<style scoped lang="less">
@import '../../../assets/less/index';

#ChatDetail {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  overflow: auto;
  color: white;
  font-size: 14rem;

  .content {
    padding-top: 60rem;

    .peoples {
      padding: 0 20rem;

      .People {
        border-bottom: 1px solid var(--second-btn-color-tran);
      }

      .add-people {
        transition: all 0.3s ease;
        width: 100%;
        height: 70rem;
        display: flex;
        align-items: center;
        position: relative;
        border-bottom: 1px solid var(--second-btn-color-tran);

        .head-image {
          margin-right: 15rem;
          width: 45rem;
          height: 45rem;
          border-radius: 50%;
        }
      }
    }

    .setting {
      .row {
        padding-left: 20rem;
        padding-right: 20rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40rem;

        .right {
          img {
            height: 20rem;
          }
        }
      }
    }
  }
}
</style>
