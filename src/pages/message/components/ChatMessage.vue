<template>
  <div
    class="ChatMessage"
    :class="!isMe ? 'left' : 'right'"
    :style="message.type === MESSAGE_TYPE.TIME && 'margin-bottom: 0;'"
  >
    <div class="time" v-if="message.type === MESSAGE_TYPE.TIME">
      {{ unixNanoToYYYYMMDD(message.time) }}
    </div>
    <template v-else>
      <img
        v-if="!isMe"
        :src="message.user.avatar || Dftimg.avatar"
        alt=""
        class="avatar"
        @click="$emit('userInfoClick')"
      />
      <div class="chat-wrapper" @click="$emit('itemClick', message)">
        <div class="chat-text" v-if="message.type === MESSAGE_TYPE.TEXT">
          {{ message.content.value.text }}
        </div>

        <div class="douyin_video" v-if="message.type === MESSAGE_TYPE.DOUYIN_VIDEO">
          <img class="poster" :src="message.content.value.poster" alt="" />
          <div class="title">{{ message.content.value.title }}</div>
          <img src="../../../assets/img/icon/play-white.png" class="pause" />
          <div class="author">
            <img class="video-avatar" :src="message.content.value.author.avatar" alt="" />
            <span class="name">{{ message.content.value.author.name }}</span>
          </div>
        </div>

        <div class="douyin_video" v-if="message.type === MESSAGE_TYPE.VIDEO">
          <!-- <video class="poster" ></video> -->
          <img class="poster" :src="message.content.value.poster" alt="" />
          <img src="../../../assets/img/icon/play-white.png" class="pause" />
        </div>

        <div
          class="audio"
          v-if="message.type === MESSAGE_TYPE.AUDIO"
          @click.stop="toggleAudioPlayback"
        >
          <template v-if="isMe">
            <div class="duration">{{ formattedDuration }}</div>
            <img
              src="../../../assets/img/icon/message/chat/rss2.png"
              alt="Audio"
              class="audio-icon"
              :class="{ playing: isAudioPlaying }"
            />
          </template>
          <template v-else>
            <img
              src="../../../assets/img/icon/message/chat/rss.png"
              alt="Audio"
              class="audio-icon"
              :class="{ playing: isAudioPlaying }"
            />
            <div class="duration">{{ formattedDuration }}</div>
          </template>
          <audio
            ref="audioPlayer"
            :src="validAudioSrc"
            @ended="handleAudioEnd"
            @timeupdate="handleTimeUpdate"
            style="display: none"
          ></audio>
        </div>
        <div
          class="call"
          v-if="
            message.type === MESSAGE_TYPE.VIDEO_CALL || message.type === MESSAGE_TYPE.AUDIO_CALL
          "
        >
          <div class="resolve" v-if="message.state === CALL_STATE.RESOLVE">
            <img class="icon" src="../../../assets/img/icon/message/chat/video.png" alt="" />
            <span>通话时长 05:32</span>
          </div>
          <div
            class="reject"
            v-if="message.state === CALL_STATE.REJECT || message.state === CALL_STATE.NONE"
          >
            <img class="icon" src="../../../assets/img/icon/message/chat/video.png" alt="" />
            <div class="notice">
              <span class="state" v-if="message.state === CALL_STATE.REJECT">对方已拒绝</span>
              <span class="state" v-if="message.state === CALL_STATE.NONE">对方未接通</span>
              <span>点击呼叫</span>
            </div>
          </div>
        </div>

        <div class="image" v-if="message.type === MESSAGE_TYPE.IMAGE">
          <img :src="message.content.value.imageurl" alt="" />
        </div>

        <div class="meme" v-if="message.type === MESSAGE_TYPE.MEME">
          <img :src="message.content.value.imageurl" alt="" />
        </div>

        <div
          class="red_packet"
          :class="message.content.value.state !== '未领取' ? 'invalid' : ''"
          v-if="message.type === MESSAGE_TYPE.RED_PACKET"
        >
          <div class="top">
            <img src="../../../assets/img/icon/message/chat/redpack-logo.webp" alt="" />
            <div class="right">
              <div class="title">{{ message.content.value.title }}</div>
              <div v-if="message.content.value.state !== '未领取'" class="state">
                {{ message.content.value.state }}
              </div>
            </div>
          </div>
          <span class="bottom">抖音红包</span>
        </div>

        <div class="loves" v-if="message.content.value.loved?.length">
          <img src="../../../assets/img/icon/loved.svg" alt="" />
          <img
            :key="user"
            v-for="user in message.content.value.loved"
            src="../../../assets/img/icon/head-image.jpeg"
            alt=""
            class="love-avatar"
          />
        </div>
        <div class="loves" v-if="message.state === STATUS.FAILED">
          <img src="../../../assets/img/icon/message/chat/fasongshibai.png" alt="" />
        </div>
        <div class="loves" v-if="message.state === STATUS.GOING">
          <img src="../../../assets/img/icon/message/chat/fasongzhong.png" alt="" />
        </div>
      </div>
      <img v-if="isMe" :src="message.user.avatar || Dftimg.avatar" alt="" class="avatar" />
    </template>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useBaseStore } from '@/store/pinia'
import { CALL_STATE, MESSAGE_TYPE, RED_PACKET_MODE, STATUS } from '@/api/gen/message_pb'
import { unixNanoToYYYYMMDD } from '@/utils/date'
import { Dftimg } from '@/utils/const_var'

export default {
  name: 'ChatMessage',
  props: {
    message: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isAudioPlaying: false,
      currentDuration: 0,
      MESSAGE_TYPE,
      CALL_STATE,
      STATUS,
      RED_PACKET_MODE,
      Dftimg: Dftimg
    }
  },
  computed: {
    ...mapState(useBaseStore, ['userinfo']),
    formattedDuration() {
      // 将秒转换为 mm:ss 格式
      const duration = this.currentDuration || this.message.content.value.duration
      const minutes = Math.floor(duration / 60)
      const seconds = Math.floor(duration % 60)
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    },
    validAudioSrc() {
      // // 确保音频路径有效性
      // if (this.message.content.value.src.startsWith('http') || this.message.content.value.src.startsWith('/')) {
      //   return this.message.content.value.src;
      // }
      // return require(`@/assets/${this.message.content.value.src}`);
      return this.message.content.value.src
    },
    isMe() {
      return this.userinfo.uid === this.message.user.id
    }
  },
  created() {},
  methods: {
    unixNanoToYYYYMMDD,
    toggleAudioPlayback() {
      const audio = this.$refs.audioPlayer
      if (!audio) return

      if (audio.paused) {
        audio
          .play()
          .then(() => {
            this.isAudioPlaying = true
          })
          .catch((error) => {
            console.error('音频播放失败:', error)
            this.isAudioPlaying = false
          })
      } else {
        audio.pause()
        this.isAudioPlaying = false
      }
    },
    handleAudioEnd() {
      this.isAudioPlaying = false
      this.currentDuration = 0
      this.$refs.audioPlayer.currentTime = 0
    },
    handleTimeUpdate() {
      this.currentDuration = Math.floor(this.$refs.audioPlayer.currentTime)
    }
  }
}
</script>

<style scoped lang="less">
@import '../../../assets/less/index';
.audio {
  // cursor: pointer;
  // display: flex;
  // align-items: center;
  // gap: 8px;
  // padding: 8px 12px;
  // background: #f0f0f0;
  // border-radius: 16px;
  // transition: background-color 0.3s;

  // &:hover {
  //   background-color: #e0e0e0;
  // }

  .audio-icon {
    width: 24px;
    height: 24px;
    transition: transform 0.3s;

    &.playing {
      animation: pulse 1s infinite;
    }
  }

  // .duration {
  //   font-size: 12px;
  //   color: #666;
  // }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
.ChatMessage {
  padding: 0 10rem;
  margin-bottom: 20rem;
  display: flex;
  //@chat-bg-color: dodgerblue;
  @chat-bg-right-color: rgb(72, 116, 230);
  @chat-bg-left-color: rgb(59, 59, 67);

  &.right {
    justify-content: flex-end;

    .avatar {
      margin-left: 10rem;
      height: 36rem;
      border-radius: 50%;
    }

    .audio-icon {
      margin-left: 50rem;
    }

    .chat-text,
    .call,
    .audio {
      background: @chat-bg-right-color;
    }
  }

  &.left {
    justify-content: flex-start;

    .avatar {
      margin-right: 10rem;
      height: 36rem;
      border-radius: 50%;
    }

    .audio-icon {
      margin-right: 50rem;
    }

    .chat-text,
    .call,
    .audio {
      background: @chat-bg-left-color;
    }
  }

  @border-radius: 10rem;

  .chat-wrapper {
  }

  .time {
    width: 100%;
    color: var(--second-text-color);
    text-align: center;
    height: 40rem;
    line-height: 40rem;
    font-size: 12rem;
  }

  .red_packet {
    border-radius: @border-radius;
    @not-received: rgb(253, 92, 72);
    @received: rgba(253, 92, 72, 0.8);
    width: 300rem;
    background: @not-received;
    display: flex;
    flex-direction: column;
    color: rgb(255, 231, 206);

    &.invalid {
      background: @received;
    }

    .top {
      padding: 10rem;
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgb(253, 124, 81);

      img {
        border-radius: 3rem;
        height: 38rem;
        margin-right: 10rem;
      }

      .title {
        font-size: 14rem;
      }

      .state {
        font-size: 12rem;
        color: rgba(255, 231, 206, 0.8);
      }
    }

    .bottom {
      font-size: 12rem;
      padding: 5rem 10rem 10rem 10rem;
    }
  }

  .meme {
    img {
      border-radius: @border-radius;
      //height: 30vh;
      max-width: 40vw;
    }
  }

  .image {
    img {
      border-radius: @border-radius;
      //height: 30vh;
      max-width: 40vw;
    }
  }

  .call {
    padding: 10rem;
    border-radius: @border-radius;
    display: flex;
    align-items: center;
    font-size: 14rem;

    .resolve {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10rem;
        width: 20rem;
      }
    }

    .reject {
      display: flex;
      align-items: center;

      .icon {
        padding: 6rem;
        border-radius: 50%;
        background: rgba(27, 100, 172, 0.8);
        margin-right: 10rem;
        width: 18rem;
      }

      .notice {
        font-size: 13rem;
        display: flex;
        flex-direction: column;
        color: #dedede;

        .state {
          margin-bottom: 2rem;
          font-size: 15rem;
          color: white;
        }
      }
    }
  }

  .audio {
    max-width: 60vw;
    padding: 10rem;
    padding-right: 15rem;
    border-radius: @border-radius;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14rem;

    .audio-icon {
      width: 15rem;
      height: 15rem;
    }
  }

  .douyin_video {
    position: relative;

    .pause {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
      width: 24rem;
    }

    .title {
      position: absolute;
      font-size: 16rem;
      bottom: 35rem;
      width: calc(100% - 20rem);
      word-break: break-word;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      left: 10rem;
    }

    .poster {
      border-radius: @border-radius;
      //height: 30vh;
      max-width: 300rem;
      max-height: 500rem;
    }

    .author {
      width: calc(100% - 20rem);
      left: 10rem;
      position: absolute;
      bottom: 10rem;
      display: flex;
      align-items: center;

      .video-avatar {
        margin-right: 5rem;
        height: 16rem;
        border-radius: 50%;
      }

      .name {
        width: 80%;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }

  .chat-text {
    border-radius: @border-radius;
    max-width: 60vw;
    padding: 10rem;
    display: flex;
    align-items: center;
    font-size: 14rem;
  }

  .loves {
    margin-top: 10rem;

    img {
      width: 16rem;
      height: 16rem;
      border-radius: 50%;
      margin-right: 5rem;
    }
  }
}
</style>
