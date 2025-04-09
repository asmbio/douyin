<template>
  <div
    class="message"
    @touchstart.prevent="handleTouchStart"
    @touchend.prevent="handleTouchEnd"
    @touchcancel="cancelPress"
    @mousedown="handleTouchStart"
    @mouseleave="cancelPress"
    @mouseup="handleTouchEnd"
  >
    <div class="avatar" :class="{ 'on-line': data.isConnect }">
      <img
        :src="getImgSrcByMessageId(data.uid) || data.avatar168x168?.urlList[0] || Dftimg.avatar"
        alt=""
        class="head-image"
      />
    </div>
    <div class="content">
      <div class="left">
        <div class="name">
          <span>{{ getNameByMessageId(data.uid) || data.displayname }}</span>
          <span v-if="getTagByMessageId(data.uid)" class="tag">{{
            getTagByMessageId(data.uid) || data.displayname
          }}</span>
        </div>
        <div class="detail">
          {{ data.lastcontent }}
          <div class="point"></div>
          {{ unixNanoToYYYYMMDD(data.lastsendtime) }}
        </div>
      </div>
      <div class="right">
        <div v-if="data.unread > 0" class="badge">{{ data.unread }}</div>
        <div v-else-if="data.unread == 9999" class="not-read"></div>
        <dy-back v-if="data.unread == -1" class="arrow" mode="gray" img="back" direction="right" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type UserInfo } from '../../api/gen/userinfo_pb'
import { useRouter } from 'vue-router'
import { unixNanoToYYYYMMDD } from '@/utils/date'
import { setRead } from '@/api/moguservice'
import { Dftimg } from '@/utils/const_var'
import { _showSelectDialog } from '@/utils'
import { idMappings, useBaseStore } from '@/store/pinia'
const messageActionList = [
  { id: 99, name: '其他操作' },
  { id: 1, name: '删除' }
]
const router = useRouter()
const store = useBaseStore()
const props = defineProps({
  data: Object as () => UserInfo
})
let timer = null

function handleTouchStart() {
  // 清除之前的定时器
  if (timer) clearTimeout(timer)
  // 设置新的定时器
  timer = setTimeout(() => {
    // 执行长按后的逻辑
    console.log('长按事件被触发')
    // 清除定时器
    timer = null
    handleLongPress()
  }, 600) // 600毫秒后触发长按事件
}
function handleTouchEnd() {
  // 如果定时器还存在，说明触摸时间不足以触发长按事件
  if (timer) {
    clearTimeout(timer)
    timer = null
    // 执行单击事件的逻辑
    console.log('单击事件被触发')
    handleClick()
  }
}

const cancelPress = () => {
  clearTimeout(timer)
  timer = null
}

function handleLongPress() {
  _showSelectDialog(messageActionList, (e) => {
    switch (e.id) {
      case 1:
        store.removeNotification(props.data.uid)
        break
      case 99:
        break
    }
  })
}
const handleClick = () => {
  let rt = getRouteByMessageId(props.data.uid) || '/message/chat'
  // props.data.unread=0
  setRead(props.data.uid)
  router.push({
    path: rt,
    query: { uid: props.data.uid }
    //state: { objurl: JSON.stringify() }
  })
}

// 获取消息路由
function getRouteByMessageId(messageId) {
  console.log(props.data.unread)
  return idMappings.get(messageId)?.route || null
}

// 获取消息图片
function getImgSrcByMessageId(messageId) {
  return idMappings.get(messageId)?.img || null
}

// 获取消息名称
function getNameByMessageId(messageId) {
  return idMappings.get(messageId)?.name || ''
}

// 获取消息标签
function getTagByMessageId(messageId) {
  return idMappings.get(messageId)?.tag || ''
}
</script>

<style scoped lang="less">
@import '../../assets/less/index';

#Message {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 14rem;
  background: var(--color-message);
  color: white;

  .no-search {
    height: calc(var(--vh, 1vh) * 100);
    display: flex;
    flex-direction: column;

    > header {
      padding: 0 20rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: var(--common-header-height);
      box-sizing: border-box;
      position: relative;
      font-size: 24rem;
    }

    .create-chat-wrapper {
      min-height: 70vh;
      padding-bottom: 60rem;
      margin-top: 6rem;

      .joined-chat {
        border-bottom: 1px solid var(--line-color);
        height: 50rem;
        padding: 0 20rem;
        display: flex;
        align-items: center;

        .left {
          width: 22rem;
          height: 22rem;
          margin-left: 10rem;
          margin-right: 20rem;
        }

        .right {
          font-size: 14rem;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;

          img {
            height: 15rem;
          }
        }
      }

      .friend-list {
        padding: 0 20rem;

        .index {
          height: 60rem;
          line-height: 60rem;
          font-size: 14rem;
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
            width: 48rem;
            height: 48rem;
            border-radius: 50%;
            margin-right: 10rem;
          }

          .right {
            font-size: 14rem;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;

            img {
              height: 20rem;
            }
          }
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
        padding-bottom: 20rem;

        .btn {
          width: calc(100% - 40rem);
          height: 40rem;
          display: flex;
          align-items: center;
          font-size: 14rem;
          justify-content: center;
          border-radius: 10rem;
          background: var(--primary-btn-color);
        }
      }

      .search-result {
        padding: 0 20rem;

        .search-result-item {
          margin-bottom: 20rem;
          display: flex;
          align-items: center;

          &:nth-child(1) {
            margin-top: 10rem;
          }

          .left {
            width: 48rem;
            height: 48rem;
            border-radius: 50%;
            margin-right: 10rem;
          }

          .right {
            font-size: 14rem;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .info {
              display: flex;
              flex-direction: column;

              .name {
                font-size: 14rem;
              }

              .account {
                font-size: 13rem;
                color: var(--second-text-color);
              }
            }

            img {
              height: 20rem;
            }
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

    .joined-chat-wrapper {
      min-height: 70vh;

      .nav {
        font-size: 17rem;
        padding: 20rem;
        display: flex;
        justify-content: space-between;

        img {
          height: 20rem;
        }
      }

      .chat-list {
        padding: 0 20rem;

        .chat-item {
          margin-bottom: 20rem;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;

          &:nth-last-child(1) {
            margin-bottom: 0;
          }

          &:nth-child(1) {
            margin-top: 10rem;
          }

          .left {
            width: 48rem;
            height: 48rem;
            border-radius: 50%;
            margin-right: 10rem;
          }

          .right {
            font-size: 14rem;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .title {
              box-sizing: border-box;
              display: flex;
              align-items: center;

              .name {
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

    :deep(#BaseHeader .header) {
      border-bottom: none;

      .left {
        opacity: 0;
      }
    }

    .scroll {
      flex: 1;
      padding-top: 10rem;
      padding-bottom: var(--footer-height);
    }

    .friends {
      overflow-x: scroll;
      display: flex;
      font-size: 14rem;
      padding: 0 10rem;
      gap: 20rem;

      .friend {
        @width: 70rem;
        width: @width;
        min-width: @width;

        &:nth-last-child(1) {
          .avatar {
            height: @width;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--second-btn-color-tran);
            margin-bottom: 10rem;

            img {
              width: 35rem;
              height: 35rem;
            }
          }
        }

        .avatar {
          position: relative;
          margin-bottom: 6rem;
          width: 100%;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }

          &.on-line::before {
            content: ' ';
            border: 4rem solid black;
            width: 18rem;
            height: 18rem;
            background: rgb(115, 254, 73);
            border-radius: 50%;
            position: absolute;
            bottom: 0;
            right: 0;
          }
        }

        span {
          width: 64rem;
          font-size: 12rem;
          color: white;
          display: block;
          text-align: center;
          word-break: break-all;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }

    .messages {
      margin-top: 20rem;

      .message {
        display: flex;
        align-items: center;

        &.top {
          background: #353a4f;
        }

        &:active {
          background: rgb(57, 57, 57);
        }

        .avatar {
          position: relative;

          .head-image {
            margin-left: 20rem;
            margin-right: 15rem;
            @width: 55rem;
            width: @width;
            height: @width;
            border-radius: 50%;
          }

          &.on-line::before {
            content: ' ';
            border: 3rem solid black;
            width: 12rem;
            height: 12rem;
            background: rgb(115, 254, 73);
            border-radius: 50%;
            position: absolute;
            bottom: 0;
            right: 15rem;
          }
        }

        .content {
          flex: 1;
          display: flex;
          justify-content: space-between;
          @padding: 16rem;
          padding: @padding 0 @padding 0;

          .left {
            .name {
              font-size: 16rem;
              color: white;
              display: flex;
              align-items: flex-start;

              .tag {
                margin-left: 5rem;
                font-size: 10rem;
                background: var(--second-btn-color-tran);
                color: var(--second-text-color);
                padding: 2rem 5rem;
                border-radius: 2rem;
              }
            }

            .detail {
              color: var(--second-text-color);
              font-size: 14rem;
              margin-top: 4rem;
              display: flex;
              align-items: center;

              .point {
                display: inline-block;
                margin-left: 8rem;
                margin-right: 8rem;
                border-radius: 50%;
                width: 1.5px;
                height: 1.5px;
                background: var(--second-text-color);
              }

              .sent {
                width: 10rem;
                height: 10rem;
              }
            }
          }

          .right {
            margin-right: 20rem;
            display: flex;
            align-items: center;

            .arrow {
              width: 15rem;
              height: 15rem;
            }

            .camera {
              width: 20rem;
              height: 20rem;
            }

            .not-read {
              margin-right: 5rem;
            }
          }
        }
      }

      .not-more {
        color: var(--second-text-color);
        text-align: center;
        padding: 20rem;
      }
    }

    .recommend-dialog {
      position: fixed;
      z-index: 11;
      top: 0;
      left: 0;
      width: 100vw;
      height: calc(var(--vh, 1vh) * 100);
      display: flex;
      align-items: center;
      justify-content: center;

      .dialog-content {
        position: relative;
        z-index: 4;
        background: white;
        width: 85vw;
        height: 80vh;
        border-radius: 12rem;
        overflow: hidden;

        .dialog-header {
          color: black;
          border-bottom: 1px solid whitesmoke;
          padding: var(--page-padding);
          display: flex;
          align-items: center;
          justify-content: space-between;

          .title {
            display: flex;
            align-items: center;

            & > img {
              margin-left: 3rem;
              width: 15rem;
            }
          }

          & > img {
            width: 20rem;
          }
        }

        .dialog-body {
          padding: var(--page-padding);
          padding-top: 0;
          height: calc(80vh - 50rem);
          overflow: auto;

          .scroll {
            height: calc(80vh - 50rem);
          }

          .l-button {
            color: white;
          }

          .name {
            color: black !important;
          }

          :deep(.People .content .left .name) {
            color: black !important;
          }
        }
      }
    }
  }

  .searching {
    padding: var(--page-padding);

    .sub-title {
      margin-top: var(--page-padding);
      color: var(--second-text-color);
      font-size: 12rem;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .right {
        display: flex;
        align-items: center;
      }
    }

    .goto-search-page {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: var(--page-padding);
      margin-top: var(--page-padding);
      border-top: 1px solid var(--line-color);

      .icon {
        border-radius: 50%;
        padding: 13rem;
        background: var(--second-btn-color-tran);
        width: 22rem;
        height: 22rem;
        margin-right: 10rem;
      }

      .right {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .second-text-color {
            margin-top: 5rem;
          }
        }
      }
    }
  }
}
</style>
