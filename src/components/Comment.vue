<template>
  <from-bottom-dialog
    :page-id="pageId"
    :modelValue="modelValue"
    @update:modelValue="(e) => $emit('update:modelValue', e)"
    @cancel="cancel"
    :show-heng-gang="false"
    maskMode="light"
    :height="height"
    tag="comment"
    mode="white"
  >
    <template #header>
      <div class="title">
        <dy-back mode="dark" img="close" direction="right" style="opacity: 0" />
        <div class="num">{{ _formatNumber(comments.length) }}条评论</div>
        <div class="right">
          <Icon icon="prime:arrow-up-right-and-arrow-down-left-from-center" @click.stop="_no" />
          <Icon icon="ic:round-close" @click="cancel" />
        </div>
      </div>
    </template>
    <div class="comment">
      <div class="wrapper" v-if="comments.length">
        <div class="items" ref="commentListRef" @scroll="handleScroll">
          <div class="item" :key="i" v-for="(item, i) in comments">
            <!--            v-longpress="(e) => showOptions(item)"-->
            <div class="main">
              <div class="content">
                <img :src="_getavater(item.user)" alt="" class="head-image" />
                <div class="comment-container">
                  <div class="name">{{ item.user?.nickname }}</div>
                  <div class="detail" :class="item.userBuried && 'gray'">
                    {{ item.userBuried ? '该评论已折叠' : item.content }}
                  </div>
                  <div class="time-wrapper">
                    <div class="left">
                      <div class="time">
                        {{ _time(item.createTime) }}{{ item.ipLocation && ` · ${item.ipLocation}` }}
                      </div>
                      <div class="reply-text">回复</div>
                    </div>
                    <div class="right d-flex" style="gap: 10rem">
                      <div class="love" :class="item.userDigged && 'loved'" @click="loved(item)">
                        <Icon
                          icon="icon-park-solid:like"
                          v-show="item.userDigged"
                          class="love-image"
                        />
                        <Icon
                          icon="icon-park-outline:like"
                          v-show="!item.userDigged"
                          class="love-image"
                        />
                        <span v-if="item.diggCount">{{ _formatNumber(item.diggCount) }}</span>
                      </div>
                      <div class="love" @click="item.userBuried = !item.userBuried">
                        <Icon
                          v-if="item.userBuried"
                          icon="icon-park-solid:dislike-two"
                          class="love-image"
                        />
                        <Icon v-else icon="icon-park-outline:dislike" class="love-image" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="replies" v-if="Number(item.subCommentCount)">
              <template v-if="item.showChildren">
                <div class="reply" :key="i" v-for="(child, i) in item.SubComments">
                  <!--                 v-longpress="e => showOptions(child)"-->
                  <div class="content">
                    <img :src="_getavater(child.user)" alt="" class="head-image" />
                    <div class="comment-container">
                      <div class="name">
                        {{ child.user?.nickname }}
                        <div class="reply-user" v-if="(child as any).reply"></div>
                        {{ (child as any).reply }}
                      </div>
                      <div class="detail">{{ child.content }}</div>
                      <div class="time-wrapper">
                        <div class="left">
                          <div class="time">
                            {{ _time(child.createTime)
                            }}{{ child.ipLocation && ` · ${item.ipLocation}` }}
                          </div>
                          <div class="reply-text">回复</div>
                        </div>
                        <div class="love" :class="child.userDigged && 'loved'" @click="loved(item)">
                          <Icon
                            icon="icon-park-solid:like"
                            v-show="child.userDigged"
                            class="love-image"
                          />
                          <Icon
                            icon="icon-park-outline:like"
                            v-show="!child.userDigged"
                            class="love-image"
                          />
                          <span>{{ _formatNumber(child.diggCount) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <Loading
                v-if="loadChildren && loadChildrenItemCId === item.commentId"
                :type="'small'"
                :is-full-screen="false"
              />
              <div class="more" v-else @click="handShowChildren(item)">
                <div class="gang"></div>
                <span>展开{{ item.showChildren ? '更多' : `${item.subCommentCount}条` }}回复</span>
                <Icon icon="ep:arrow-down-bold" />
              </div>
            </div>
          </div>
        </div>
        <no-more v-if="noMoreComments" />
        <div v-if="isLoading && !noMoreComments" class="loading-more">
          <Loading :type="'small'" :is-full-screen="false" />
        </div>
      </div>
      <Loading v-else style="position: absolute" />
      <transition name="fade">
        <BaseMask v-if="isCall" mode="lightgray" @click="isCall = false" />
      </transition>
      <div class="input-toolbar">
        <transition name="fade">
          <div class="call-friend" v-if="isCall">
            <div class="friend" :key="i" v-for="(item, i) in friendsList" @click="toggleCall(item)">
              <img
                :style="(item as any).select ? 'opacity: .5;' : ''"
                class="avatar"
                :src="_getavater(item)"
                alt=""
              />
              <span>{{ item.nickname }}</span>
              <img
                v-if="(item as any).select"
                class="checked"
                src="../assets/img/icon/components/check/check-red-share.png"
              />
            </div>
          </div>
        </transition>

        <div class="toolbar">
          <div class="input-wrapper">
            <AutoInput v-model="comment" placeholder="善语结善缘，恶言伤人心"></AutoInput>
            <div class="right">
              <img src="../assets/img/icon/message/call.png" @click="isCall = !isCall" />
              <img src="../assets/img/icon/message/emoji-black.png" @click="_no" />
            </div>
          </div>
          <img v-if="comment" src="../assets/img/icon/message/up.png" @click="send" />
        </div>
      </div>
      <ConfirmDialog title="私信给" ok-text="发送" v-model:visible="showPrivateChat">
        <Search mode="light" v-model="test" :isShowSearchIcon="false" />
      </ConfirmDialog>
    </div>
  </from-bottom-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import AutoInput from './AutoInput.vue'
import ConfirmDialog from './dialog/ConfirmDialog.vue'
import FromBottomDialog from './dialog/FromBottomDialog.vue'
import Loading from './Loading.vue'
import Search from './Search.vue'
import BaseMask from './BaseMask.vue'
import NoMore from './NoMore.vue'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import {
  _checkImgUrl,
  _formatNumber,
  _getavater,
  _no,
  _showSelectDialog,
  _sleep,
  _time,
  sampleSize
} from '@/utils'
import { useBaseStore } from '@/store/pinia'

import type { Comment as CommentItem } from '@/api/gen/video_pb'
import type { UserInfo } from '@/api/gen/userinfo_pb'
import { getVideoComments } from '@/api/moguservice'

interface Option {
  id: number
  name: string
}

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  addr: {
    type: String,
    default: ''
  },
  videoId: {
    type: String,
    default: null
  },
  pageId: {
    type: String,
    default: 'home-index'
  },
  height: {
    type: String,
    default: 'calc(var(--vh, 1vh) * 70)'
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const baseStore = useBaseStore()
const { friends } = storeToRefs(baseStore)

const comment = ref('')
const test = ref('')
const comments = ref<CommentItem[]>([])
const options = ref<Option[]>([
  { id: 1, name: '私信回复' },
  { id: 2, name: '复制' },
  { id: 3, name: '搜一搜' },
  { id: 4, name: '举报' }
])
const selectRow = ref<CommentItem | {}>({})
const showPrivateChat = ref(false)
const isInput = ref(false)
const isCall = ref(false)
const loadChildren = ref(false)
const loadChildrenItemCId = ref('')
const isLoading = ref(false)
const noMoreComments = ref(false)
const commentListRef = ref<HTMLElement | null>(null)
const currentCursor = ref('')

const friendsList = computed<UserInfo[]>(() => {
  if (!friends.value || !friends.value.all) return []

  const sourceItems = friends.value.all as any[]

  return sourceItems.map((item) => {
    const user = item as UserInfo
    ;(user as any).select = item.select || false
    return user
  })
})

const resetSelectStatus = () => {
  if (friendsList.value) {
    friendsList.value.forEach((item: UserInfo) => {
      item.select = false // 重置选中状态
    })
  }
}

const handShowChildren = async (item: CommentItem) => {
  loadChildrenItemCId.value = item.commentId
  loadChildren.value = true
  await _sleep(500)
  loadChildren.value = false
  if (item.showChildren) {
    item.SubComments = [...(item.SubComments || []), ...sampleSize(comments.value, 10)]
  } else {
    item.SubComments = sampleSize(comments.value, 3)
    item.showChildren = true
  }
}

const send = () => {
  if (!comment.value.trim()) {
    return // 如果评论内容为空，直接返回
  }

  const userinfo = baseStore.userinfo
  const commentData: CommentItem = {
    //commentId: Date.now(),
    user: userinfo,
    content: comment.value,
    // createTime: Date.now(),
    //  diggCount: 0,

    userBuried: false,
    userDigged: false
  } as CommentItem

  comments.value.unshift(commentData)
  comment.value = ''
  isCall.value = false
  resetSelectStatus()
}

const getData = async (isInitial = true) => {
  try {
    isLoading.value = true

    const cursor = isInitial ? '' : currentCursor.value
    const res = await getVideoComments(props.addr, props.videoId, '', cursor, 10)

    if (res.comments && res.comments.length > 0) {
      res.comments.forEach((v: CommentItem) => {
        v.showChildren = false
      })

      if (res.comments.length > 0) {
        currentCursor.value = res.comments[res.comments.length - 1].commentId
      }

      if (isInitial) {
        comments.value = res.comments
      } else {
        res.comments.forEach((newComment: CommentItem) => {
          const existingComment = comments.value.find(
            (comment) => comment.commentId === newComment.commentId
          )

          if (existingComment) {
            existingComment.SubComments.push(...newComment.SubComments)
          } else {
            comments.value.push(newComment)
          }
        })
      }
    } else {
      if (!isInitial) {
        noMoreComments.value = true
      }
    }
  } catch (error) {
    console.error('Failed to fetch comments:', error)
  } finally {
    isLoading.value = false
  }
}

const handleScroll = async (event: Event) => {
  const target = event.target as HTMLElement
  if (
    target.scrollHeight - target.scrollTop - target.clientHeight < 50 &&
    !isLoading.value &&
    !noMoreComments.value
  ) {
    await getData(false)
  }
}

const cancel = () => {
  emit('update:modelValue', false)
  emit('close')
}

const toggleCall = (item: UserInfo) => {
  ;(item as any).select = !(item as any).select
  let name = (item as any).name || item.nickname || ''
  if (comment.value.includes('@' + name)) {
    comment.value = comment.value.replace(`@${name} `, '')
  } else {
    comment.value += `@${name} `
  }
}

const loved = (row: CommentItem) => {
  if (row.isLoved) {
    row.diggCount--
  } else {
    row.diggCount++
  }
  row.userDigged = !row.userDigged
}

const showOptions = (row: CommentItem) => {
  _showSelectDialog(options.value, (e: Option) => {
    if (e.id === 1) {
      selectRow.value = row
      showPrivateChat.value = true
    }
  })
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      currentCursor.value = ''
      noMoreComments.value = false
      getData(true)
    } else {
      comments.value = []
    }
  }
)
</script>

<style lang="less" scoped>
@import '../assets/less/index';

.title {
  box-sizing: border-box;
  width: 100%;
  height: 40rem;
  padding: 0 15rem;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10rem 10rem 0 0;

  .num {
    width: 100%;
    position: absolute;
    font-size: 12rem;
    font-weight: bold;
    text-align: center;
  }

  .right {
    display: flex;
    gap: 12rem;
    position: relative;
    z-index: 9;

    svg {
      color: #000;
      background: rgb(242, 242, 242);
      padding: 4rem;
      font-size: 16rem;
      border-radius: 50%;
    }
  }
}

.gray {
  color: var(--second-text-color);
}

.comment {
  color: #000;
  width: 100%;
  background: #fff;
  z-index: 5;

  .wrapper {
    width: 100%;
    position: relative;
    padding-bottom: 60rem;
  }

  .items {
    width: 100%;
    max-height: calc(var(--vh, 1vh) * 60);
    overflow-y: auto;

    .item {
      width: 100%;
      margin-bottom: 15rem;

      .main {
        width: 100%;
        padding: 5rem 0;
        display: flex;

        &:active {
          background: #53535321;
        }

        .head-image {
          margin-left: 15rem;
          margin-right: 10rem;
          width: 37rem;
          height: 37rem;
          border-radius: 50%;
        }
      }

      .replies {
        padding-left: 55rem;

        .reply {
          padding: 5rem 0 5rem 5rem;
          display: flex;

          &:active {
            background: #53535321;
          }

          .head-image {
            margin-right: 10rem;
            width: 20rem;
            height: 20rem;
            border-radius: 50%;
          }
        }

        .more {
          font-size: 13rem;
          margin: 5rem;
          display: flex;
          align-items: center;
          color: gray;

          .gang {
            background: #d5d5d5;
            width: 20rem;
            margin-right: 10rem;
            height: 1px;
          }

          span {
            margin-right: 5rem;
          }

          svg {
            font-size: 10rem;
          }
        }
      }

      .content {
        width: 100%;
        display: flex;
        font-size: 14rem;

        .comment-container {
          flex: 1;
          margin-right: 20rem;

          .name {
            color: var(--second-text-color);
            margin-bottom: 5rem;
            display: flex;
            align-items: center;

            .reply-user {
              margin-left: 5rem;
              width: 0;
              height: 0;
              border: 5rem solid transparent;
              border-left: 6rem solid gray;
            }
          }

          .detail {
            margin-bottom: 5rem;
          }

          .time-wrapper {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 13rem;

            .left {
              display: flex;

              .time {
                color: #c4c3c3;
                margin-right: 10rem;
              }

              .reply-text {
                color: var(--second-text-color);
              }
            }

            .love {
              color: gray;
              display: flex;
              align-items: center;

              &.loved {
                color: rgb(231, 58, 87);
              }

              .love-image {
                font-size: 17rem;
                margin-right: 4rem;
              }

              span {
                word-break: keep-all;
              }
            }
          }
        }
      }
    }
  }

  @normal-bg-color: rgb(35, 38, 47);
  @chat-bg-color: rgb(105, 143, 244);

  .input-toolbar {
    border-radius: 10rem 10rem 0 0;
    background: white;
    position: fixed;
    width: 100%;
    bottom: 0;
    z-index: 3;

    @space-width: 18rem;
    @icon-width: 48rem;

    .call-friend {
      padding-top: 30rem;
      overflow-x: scroll;
      display: flex;
      padding-right: @space-width;

      .friend {
        width: @icon-width;
        position: relative;
        margin-left: @space-width;
        margin-bottom: @space-width;
        font-size: 10rem;
        display: flex;
        flex-direction: column;
        align-items: center;

        .avatar {
          width: @icon-width;
          height: @icon-width;
          border-radius: 50%;
        }

        span {
          margin-top: 5rem;
          text-align: center;
          width: @icon-width;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .checked {
          position: absolute;
          top: @icon-width - 1.5;
          right: -2px;
          width: 20rem;
          height: 20rem;
          border-radius: 50%;
        }
      }
    }

    .toolbar {
      @icon-width: 25rem;
      display: flex;
      align-items: center;
      padding: 10rem 15rem;
      border-top: 1px solid #e2e1e1;

      .input-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 5rem 10rem;
        background: #eee;
        border-radius: 20rem;

        .right {
          display: flex;
          align-items: center;
        }

        .auto-input {
          width: calc(100% - 160rem);
        }
      }

      img {
        width: @icon-width;
        height: @icon-width;
        border-radius: 50%;
        margin-left: 15rem;
      }
    }
  }

  .loading-more {
    display: flex;
    justify-content: center;
    padding: 10rem 0;
  }
}

.comment-enter-active,
.comment-leave-active {
  transition: all 0.15s ease;
}

.comment-enter-from,
.comment-leave-to {
  transform: translateY(60vh);
}
</style>
