<template>
  <from-bottom-dialog
    :page-id="pageId"
    :modelValue="modelValue"
    @update:modelValue="(e) => $emit('update:modelValue', e)"
    @cancel="cancel"
    maskMode="light"
    :height="height"
  >
    <div class="content" :style="{ minHeight: height }">
      <div class="create-chat" v-show="!showJoinedChat">
        <Search
          :isShowRightText="isShowRightText"
          @click="handleClick"
          @notice="onNotice"
          rightText="取消"
          rightTextColor="gray"
          placeholder="搜索"
          v-model="searchKey"
        />
        <template v-if="searchKey">
          <div class="friend-list" v-if="searchResult.length">
            <div
              class="friend-item"
              :key="i"
              v-for="(item, i) in searchResult"
              @click="handleClick2(item)"
            >
              <img class="left" v-lazy="_getavater(item)" alt="" />
              <div class="right">
                <div class="info" @click="nav('/message/chat', { uid: item.uid })">
                  <span class="name">
                    <span v-if="item.displayname.indexOf(searchKey) > -1">
                      {{ item.displayname.substr(0, item.displayname.indexOf(searchKey))
                      }}<span style="color: #fc2f56">{{ searchKey }}</span
                      >{{
                        item.displayname.substr(
                          item.displayname.indexOf(searchKey) + searchKey.length
                        )
                      }}
                    </span>
                    <span v-else>{{ item.displayname }}</span>
                  </span>
                </div>
                <dy-button :type="item.shared ? 'dark' : 'primary'" @click="handleClickShare(item)">
                  {{ item.shared ? '已' : '' }}分享
                </dy-button>
              </div>
            </div>
          </div>
          <div class="no-result" v-else>
            <div class="notice-h1">搜索结果为空</div>
            <div class="notice-h2">没有搜索到相关的联系人</div>
          </div>
        </template>
        <template v-else>
          <div class="joined-chat-group-nav" @click="showJoinedChat = true">
            <img class="left" src="../../../assets/img/icon/people-gray.png" alt="" />
            <div class="right">
              <span>已加入的群聊</span>
              <dy-back direction="right" mode="gray" scale=".7" />
            </div>
          </div>
          <div class="friend-list">
            <div class="index">所有朋友</div>
            <div class="friend-item" :key="i" v-for="(item, i) in baseStore.friends.all">
              <img class="left" v-lazy="_getavater(item)" alt="" />
              <div class="right">
                <span>{{ item.displayname }}</span>
                <dy-button :type="item.shared ? 'dark' : 'primary'" @click="handleClickShare(item)">
                  {{ item.shared ? '已' : '' }}分享
                </dy-button>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="joined-chat-group" v-show="showJoinedChat">
        <div class="nav">
          <dy-back @click="showJoinedChat = false" mode="light" scale="1"></dy-back>
          <span>已加入的群聊</span>
          <span>&nbsp;</span>
        </div>

        <div class="friend-list">
          <div class="friend-item" :key="i" v-for="(item, i) in jionedGroups">
            <img class="left" v-lazy="_getavater(item)" alt="" />
            <div class="right">
              <div class="title" @click="nav('/message/chat', { uid: item.uid })">
                <div class="name">{{ item.displayname }}</div>
                <div class="num">({{ item.followerCount }})</div>
              </div>
              <dy-button :type="item.shared ? 'dark' : 'primary'" @click="handleClickShare(item)">
                {{ item.shared ? '已' : '' }}分享
              </dy-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </from-bottom-dialog>
</template>
<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useBaseStore } from '@/store/pinia'
import { _checkImgUrl, _getavater, cloneDeep } from '@/utils'
import FromBottomDialog from '@/components/dialog/FromBottomDialog.vue'
import Search from '@/components/Search.vue'
import { getContacts, sendMessage } from '@/api/moguservice'
import { CONTACT_TAG } from '@/api/gen/moguervice_pb'
import type { UserInfo } from '@/api/gen/userinfo_pb'
import type { Video } from '@/api/gen/video_pb'
import {
  MESSAGE_TYPE,
  type BusinessCartContent,
  type ChatMessage as cMessage,
  type User,
  type VideoCardContent
} from '@/api/gen/message_pb'
import { useNav } from '@/utils/hooks/useNav'

/*
分享给朋友
*/
const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    pageId?: string
    item: Video
  }>(),
  {
    modelValue: false,
    pageId: 'home-index'
  }
)

const emit = defineEmits(['update:modelValue'])

const height = ref('70vh')
const showJoinedChat = ref(false)
const isShowRightText = ref(false)

const jionedGroups = ref<UserInfo[]>([])

const searchResult = ref<UserInfo[]>([])
const searchKey = ref('')

const baseStore = useBaseStore()
const nav = useNav()

// const selectFriends = computed(() => {
//   return localFriends.value.filter((v) => v.shared)
// })

watch(searchKey, (newVal) => {
  if (newVal) {
    searchResult.value = jionedGroups.value.filter((v) => {
      return v.displayname.includes(newVal) || v.nickname.includes(newVal)
    })
  } else {
    searchResult.value = []
  }
})

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      console.log(newVal)
    } else {
      searchKey.value = ''
      height.value = '70vh'
      isShowRightText.value = false
      showJoinedChat.value = false
    }
  }
)
onMounted(() => {
  getGroups()
})
async function getGroups() {
  try {
    let res = await getContacts('', 100, CONTACT_TAG.GROUP)
    jionedGroups.value = res.all
  } catch (error) {
    console.log(error)
  }
}
function handleClick() {
  isShowRightText.value = true
  height.value = 'calc(var(--vh, 1vh) * 100)'
}

function handleClick2(item: any) {
  item.select = !item.select
  searchKey.value = ''
}

function onNotice() {
  isShowRightText.value = false
  searchKey.value = ''
  height.value = '70vh'
}

function cancel() {
  height.value = '70vh'
  emit('update:modelValue', false)
}

async function handleClickShare(item: UserInfo) {
  item.shared = !item.shared

  if (item.shared) {
    // 创建消息对象
    const newMsg = {
      type: MESSAGE_TYPE.BUSINESS_CARD,
      content: {
        case: 'businessCartContent'
      },
      time: BigInt(Date.now()) * 1_000_000n,
      user: {
        id: baseStore.userinfo.uid,
        avatar: baseStore.userinfo.avatar168x168?.urlList[0]
      },
      Receiver: item.uid
    } as cMessage
    if (props.pageId === 'home-index') {
      newMsg.content.value = { video: props.item } as VideoCardContent
    } else if (props.pageId === 'userPanel') {
      newMsg.content.value = {
        userCart: props.item.author
      } as BusinessCartContent
    }
    try {
      console.log(newMsg)
      baseStore.addOrUpdateNotification(props.item.author) // 添加到通知列表
      baseStore.updateLastContent(newMsg)
      // 发送消息
      var ret = await sendMessage(newMsg)
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<style scoped lang="less">
@import '../../../assets/less/index';

.button {
  width: 64rem;
  height: 26rem !important;
}

@avatar-width: 38rem;

.friend-list {
  padding: 0 15rem;

  .index {
    color: var(--second-text-color);
    height: 60rem;
    line-height: 60rem;
    font-size: 13rem;
  }

  .friend-item {
    margin-bottom: 20rem;
    display: flex;
    align-items: center;
    //background: #fff;

    &:nth-child(1) {
      margin-top: 10rem;
    }

    .left {
      flex: 0;
      width: @avatar-width;
      height: @avatar-width;
      border-radius: 50%;
      margin-right: 15rem;
    }

    .right {
      font-size: 14rem;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        display: flex;
        align-items: center;

        .name {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .num {
          margin-left: 5rem;
          color: var(--second-text-color);
        }
      }
      img {
        height: 20rem;
      }
    }
  }
}

.content {
  color: white;

  .create-chat {
    padding-bottom: 40rem;
    background: var(--main-bg);

    .search-ctn {
      padding: 0 15rem;
    }

    .joined-chat-group-nav {
      border-bottom: 1px solid var(--line-color);
      height: 50rem;
      padding: 0 15rem;
      display: flex;
      align-items: center;

      .left {
        width: 22rem;
        height: 22rem;
        margin-right: 10rem;
      }

      .right {
        font-size: 14rem;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }

    .btn-wrapper {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--main-bg);
      //background: red;
      display: flex;
      align-items: center;
      justify-content: center;

      .btn {
        margin-bottom: 20rem;
        width: calc(100% - 40rem);
        height: 40rem;
        display: flex;
        align-items: center;
        font-size: 14rem;
        justify-content: center;
        background: #3f445c;
        border-radius: 2rem;

        &.primary {
          background: var(--primary-btn-color);
        }
      }
    }

    .no-result {
      height: 50vh;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .notice-h1 {
        font-size: 16rem;
      }

      .notice-h2 {
        margin-top: 10rem;
        font-size: 14rem;
        color: var(--second-text-color);
      }
    }
  }

  .joined-chat-group {
    background: var(--main-bg);

    .nav {
      font-size: 16rem;
      padding: 15rem;
      display: flex;
      justify-content: space-between;
    }

    .chat-list {
      padding: 0 15rem;

      .chat-item {
        margin-bottom: 20rem;
        display: flex;
        align-items: center;
        position: relative;
        overflow: hidden;
        justify-content: space-between;

        &:nth-last-child(1) {
          margin-bottom: 0;
        }

        &:nth-child(1) {
          margin-top: 10rem;
        }

        .left {
          width: @avatar-width;
          height: @avatar-width;
          border-radius: 50%;
          margin-right: 15rem;
        }

        .right {
          font-size: 14rem;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .title {
            width: 55vw;
            overflow: hidden;
            box-sizing: border-box;
            display: flex;
            align-items: center;

            .name {
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }

            .num {
              margin-left: 5rem;
              color: var(--second-text-color);
            }
          }

          img {
            height: 15rem;
          }
        }
      }
    }
  }
}
</style>
