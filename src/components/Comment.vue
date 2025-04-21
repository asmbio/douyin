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
        <div class="num">{{ _formatNumber(data.comments.length) }}条评论</div>
        <div class="right">
          <Icon icon="prime:arrow-up-right-and-arrow-down-left-from-center" @click.stop="_no" />
          <Icon icon="ic:round-close" @click="cancel" />
        </div>
      </div>
    </template>
    <div class="comment">
      <div class="wrapper" v-if="data.comments.length">
        <div class="items" ref="commentListRef" @scroll="handleScroll">
          <div class="item" :key="i" v-for="(item, i) in data.comments">
            <!--            v-longpress="(e) => showOptions(item)"-->
            <div class="main">
              <div class="content">
                <img :src="_getavater(item.user)" alt="" class="head-image" />
                <div class="comment-container" @click="startReply(item)">
                  <div class="name">{{ item.user?.nickname }}</div>
                  <div class="detail" :class="item.userBuried && 'gray'">
                    {{ item.userBuried ? '该评论已折叠' : item.content }}
                  </div>
                  <div class="time-wrapper">
                    <div class="left">
                      <div class="time">
                        {{ _time(item.createTime / 1_000_000n)
                        }}{{ item.ipLocation && ` · ${item.ipLocation}` }}
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
                    <div class="comment-container" @click="startReply(item, child)">
                      <div class="name">
                        {{ child.user?.displayname }}
                        <div class="reply-user" v-if="child.ReplyAddr"></div>
                        <span v-if="child.ReplyAddr" class="reply-to-username">
                          {{ child.ReplyAddr }}
                        </span>
                      </div>
                      <div class="detail">{{ child.content }}</div>
                      <div class="time-wrapper">
                        <div class="left">
                          <div class="time">
                            {{ _time(child.createTime / 1_000_000n)
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
                <span v-if="item.showChildren && item.isAllLoaded">收起回复</span>
                <span v-else-if="item.showChildren">展开更多回复</span>
                <span v-else>展开{{ item.subCommentCount }}条回复</span>
                <Icon
                  :icon="
                    item.showChildren && item.isAllLoaded
                      ? 'ep:arrow-up-bold'
                      : 'ep:arrow-down-bold'
                  "
                />
              </div>
            </div>
          </div>
        </div>
        <no-more v-if="noMoreComments" />
        <div v-if="isLoading && !noMoreComments" class="loading-more">
          <Loading :type="'small'" :is-full-screen="false" />
        </div>
      </div>
      <no-more v-else />
      <transition name="fade">
        <BaseMask v-if="isCall" mode="lightgray" @click="isCall = false" />
      </transition>
      <div class="input-toolbar">
        <transition name="fade">
          <div class="call-friend" v-if="isCall">
            <div class="friend" :key="i" v-for="(item, i) in friendsList" @click="toggleCall(item)">
              <img
                :style="item.select ? 'opacity: .5;' : ''"
                class="avatar"
                :src="_getavater(item)"
                alt=""
              />
              <span>{{ item.nickname }}</span>
              <img
                v-if="item.select"
                class="checked"
                src="../assets/img/icon/components/check/check-red-share.png"
              />
            </div>
          </div>
        </transition>

        <div class="toolbar">
          <div class="input-wrapper">
            <div v-if="data.replyTo" class="reply-indicator">
              回复 {{ data.replyTo.user?.displayname }}
              <Icon icon="mdi:close" @click="cancelReply" class="cancel-reply" />
            </div>
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
import { ref, watch, computed, onMounted, reactive } from 'vue'
import AutoInput from './AutoInput.vue'
import ConfirmDialog from './dialog/ConfirmDialog.vue'
import FromBottomDialog from './dialog/FromBottomDialog.vue'
import Loading from './Loading.vue'
import Search from './Search.vue'
import BaseMask from './BaseMask.vue'
import NoMore from './NoMore.vue'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { _formatNumber, _getavater, _no, _showSelectDialog, _time } from '@/utils'
import { useBaseStore } from '@/store/pinia'
import type { Comment as CommentItem } from '@/api/gen/video_pb'
import type { UserInfo } from '@/api/gen/userinfo_pb'
import { getVideoComments, pushVideoComment } from '@/api/moguservice'
import { MEDIA_TYPE, Media_TextSchema, WorksCommentMsgSchema } from '@/api/gen/trans_worksmsg_pb'
import { create } from '@bufbuild/protobuf'

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
    default: null
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

// Use reactive for these three data points
const data = reactive({
  comments: [] as ExtendedComment[],
  replyTo: null as CommentItem | null,
  parentComment: null as CommentItem | null
})

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
type ExtendedComment = CommentItem & {
  showChildren?: boolean
  isAllLoaded?: boolean
  lastSubCommentCursor?: string
}
// Helper function to safely check properties
const asExtendedComment = (item: CommentItem) => {
  return item as CommentItem & {
    showChildren?: boolean
    isAllLoaded?: boolean
    lastSubCommentCursor?: string
  }
}

// 加载更多评论，调用接口getVideoComments subCommentId=item.commentId ,每次加载10个
const handShowChildren = async (item: CommentItem) => {
  // Use type assertion for TypeScript compatibility
  const commentItem = item as CommentItem & {
    showChildren?: boolean
    isAllLoaded?: boolean
    lastSubCommentCursor?: string
  }

  if (commentItem.showChildren && commentItem.isAllLoaded) {
    // If already showing all comments and user clicks, collapse the comments
    commentItem.showChildren = false
    return
  }

  loadChildrenItemCId.value = commentItem.commentId
  loadChildren.value = true

  try {
    if (!commentItem.showChildren) {
      // First time loading comments or collapsed state
      commentItem.showChildren = true
    }
    const cursor = ''
    if (!commentItem.SubComments || commentItem.SubComments.length === 0) {
      // Load initial comments if none exist
      //const cursor = '';
    } else {
      // Load more comments
      const cursor = commentItem.lastSubCommentCursor || ''
    }
    const res = await getVideoComments(props.addr, props.videoId, commentItem.commentId, cursor, 10)

    if (res.comments && res.comments.length > 0) {
      commentItem.SubComments = res.comments
      commentItem.lastSubCommentCursor = res.comments[res.comments.length - 1].commentId
      commentItem.isAllLoaded = res.comments.length < 10
    } else {
      commentItem.isAllLoaded = true
    }
  } catch (error) {
    console.error('Failed to load subcomments:', error)
  } finally {
    loadChildren.value = false
  }
}

// 开始回复某条评论
const startReply = (parent: CommentItem, replycomment?: CommentItem) => {
  data.parentComment = parent
  if (replycomment) {
    data.replyTo = replycomment
  } else {
    data.replyTo = parent
  }
  // 自动聚焦输入框
  // 可以在这里添加滚动到输入框的逻辑
}

// 取消回复
const cancelReply = () => {
  data.replyTo = null
  data.parentComment = null
}

const send = async () => {
  if (!comment.value.trim()) {
    return // 如果评论内容为空，直接返回
  }

  try {
    isLoading.value = true
    const userinfo = baseStore.userinfo

    // 创建一个Media_Text对象
    const mediaText = create(Media_TextSchema, {
      Text: comment.value
    })

    // 确定是否是回复评论
    const isReplylv2 = data.replyTo?.commentId !== data.parentComment?.commentId
    const commentId = data.parentComment?.commentId || ''
    const replyAddr = data.replyTo?.user?.nickname || ''

    // 创建评论消息对象
    const commentMsg = create(WorksCommentMsgSchema, {
      From: userinfo.uid || '',
      To: props.addr,
      wKey: props.videoId || '',
      plKey: commentId,
      ReplyAddr: isReplylv2 ? data.replyTo?.user?.uid : '',
      Tag: MEDIA_TYPE._TEXT,
      Content: {
        case: 'MediaText',
        value: mediaText
      },
      Time: BigInt(Date.now()) * 1_000_000n,
      Feesrate: BigInt(0)
    })

    // 发送评论
    var cid = await pushVideoComment(commentMsg)

    // 创建本地评论对象用于UI显示
    const commentData: CommentItem = {
      commentId: cid.Value,
      user: userinfo,
      content: comment.value,
      createTime: commentMsg.Time,
      diggCount: 0,
      SubComments: [],
      ReplyAddr: replyAddr, // 子评论的评论的回复，在名称显示的地方加一个三角箭头符号
      userBuried: false,
      userDigged: false
    } as unknown as CommentItem

    // 根据是否是回复，添加到对应位置
    if (data.parentComment) {
      // 如果回复的是子评论，添加到父评论的子评论里
      const pc = data.comments.find((v) => v.commentId == data.parentComment!.commentId)
      if (pc) {
        // 确保SubComments是数组
        if (!pc.SubComments) {
          pc.SubComments = []
        }

        // 更新子评论数量
        if (pc.subCommentCount) {
          pc.subCommentCount = BigInt(Number(pc.subCommentCount) + 1)
        } else {
          pc.subCommentCount = BigInt(1)
        }

        // 添加到子评论数组
        pc.SubComments.unshift(commentData)

        // 确保显示子评论
        pc.showChildren = true

        // 强制UI更新
        // const commentIndex = data.comments.findIndex((v) => v.commentId == data.parentComment!.commentId)
        // if (commentIndex !== -1) {
        //   // 创建新数组触发响应式更新
        //   const updatedComments = [...data.comments]
        //   data.comments = updatedComments
        // }
      } else {
        // 父评论未找到，添加到顶层
        console.warn('Parent comment not found, adding to top level')
        data.comments.unshift(commentData)
      }
    } else {
      // 普通评论，添加到列表顶部
      data.comments.unshift(commentData)
    }

    // 重置状态
    comment.value = ''
    isCall.value = false
    resetSelectStatus()
    cancelReply() // 重置回复状态
  } catch (error) {
    console.error('Failed to send comment:', error)
  } finally {
    isLoading.value = false
  }
}

const getData = async (isInitial = true) => {
  try {
    isLoading.value = true

    const cursor = isInitial ? '' : currentCursor.value
    const res = await getVideoComments(props.addr, props.videoId, '', cursor, 10)
    console.log('getVideoComments', res)

    if (res.comments && res.comments.length > 0) {
      if (res.comments.length < 10) {
        noMoreComments.value = true
      }

      res.comments.forEach((v: CommentItem) => {
        const extendedComment = asExtendedComment(v)
        extendedComment.showChildren = false
        extendedComment.isAllLoaded = false
      })

      if (res.comments.length > 0) {
        currentCursor.value = res.comments[res.comments.length - 1].commentId
      }

      if (isInitial) {
        data.comments = res.comments
      } else {
        res.comments.forEach((newComment: CommentItem) => {
          const existingComment = data.comments.find(
            (comment) => comment.commentId === newComment.commentId
          )

          if (existingComment) {
            existingComment.SubComments.push(...newComment.SubComments)
          } else {
            data.comments.push(newComment)
          }
        })
      }
    } else {
      noMoreComments.value = true
    }
  } catch (error) {
    console.error('Failed to fetch comments:', error)
  } finally {
    isLoading.value = false
    console.log('isLoading', isLoading.value)
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
  item.select = !item.select
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
      console.log('comment', props.addr, props.videoId)
      currentCursor.value = ''
      noMoreComments.value = false
      getData(true)
    } else {
      data.comments = []
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
              margin-right: 3rem;
              width: 0;
              height: 0;
              border: 5rem solid transparent;
              border-left: 6rem solid var(--second-text-color);
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
        position: relative;

        .reply-indicator {
          position: absolute;
          top: -25rem;
          left: 10rem;
          background: rgba(0, 0, 0, 0.05);
          padding: 2rem 10rem;
          border-radius: 10rem;
          font-size: 12rem;
          display: flex;
          align-items: center;

          .cancel-reply {
            margin-left: 5rem;
            font-size: 14rem;
          }
        }

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

.reply-to-username {
  color: var(--primary-color);
  margin-right: 5rem;
  font-size: 13rem;
}
</style>
