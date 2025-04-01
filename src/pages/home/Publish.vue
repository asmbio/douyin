<template>
  <div class="Publish">
    <video id="video" autoplay style="width: 100%; height: calc(100% - 60rem)"></video>
    <div class="footer">
      <SlideHorizontal style="height: 60rem" v-model:index="activeIndex">
        <SlideItem style="width: 100rem"></SlideItem>
        <SlideItem style="width: 100rem"></SlideItem>
        <SlideItem style="width: 125rem" @click="activeIndex = 0">
          <span :class="activeIndex + 2 === 2 ? 'active' : ''">分段拍</span>
        </SlideItem>
        <SlideItem style="width: 100rem" @click="activeIndex = 1">
          <span :class="activeIndex + 2 === 3 ? 'active' : ''">快拍</span>
        </SlideItem>
        <SlideItem style="width: 100rem" @click="handleAlbumClick">
          <span :class="activeIndex + 2 === 4 ? 'active' : ''">影集</span>
        </SlideItem>
        <SlideItem style="width: 100rem" @click="activeIndex = 3">
          <span :class="activeIndex + 2 === 5 ? 'active' : ''">开直播</span>
        </SlideItem>
      </SlideHorizontal>
    </div>
    <div class="float">
      <Icon class="close" icon="mingcute:close-line" @click="router.back()" />
      <div class="choose-music">
        <Icon icon="vaadin:music" />
        <span>选择音乐</span>
      </div>
      <div class="toolbar">
        <div class="tool" @click.stop="$emit('showComments')">
          <Icon icon="tabler:refresh" />
        </div>
        <div class="tool" @click.stop="$emit('showComments')">
          <Icon icon="pepicons-pop:electricity-off" />
        </div>
        <div class="tool" @click.stop="$emit('showComments')">
          <Icon icon="lets-icons:setting-fill" />
        </div>
        <div class="tool" @click.stop="$emit('showComments')">
          <Icon icon="bxs:alarm" />
        </div>
        <div class="tool" @click.stop="$emit('showComments')">
          <Icon icon="fluent:pen-sparkle-16-filled" />
        </div>
        <div class="tool" @click.stop="$emit('showComments')">
          <Icon icon="ri:color-filter-fill" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { IpfsFileSchema, Media_Video_MixedSchema } from '@/api/gen/trans_worksmsg_pb'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { create } from '@bufbuild/protobuf'

defineOptions({
  name: 'Publish'
})
const router = useRouter()
const videoEl = ref(null)
const activeIndex = ref(1)

//访问用户媒体设备的兼容方法
function getUserMedia(constrains, success, error) {
  if (navigator.mediaDevices.getUserMedia) {
    //最新标准API
    navigator.mediaDevices.getUserMedia(constrains).then(success).catch(error)
  } else if (navigator.webkitGetUserMedia) {
    //webkit内核浏览器
    navigator.webkitGetUserMedia(constrains).then(success).catch(error)
  } else if (navigator.mozGetUserMedia) {
    //Firefox浏览器
    // eslint-disable-next-line no-undef
    navigator.mozGetUserMedia(constrains).then(success).catch(error)
  } else if (navigator.getUserMedia) {
    //旧版API
    navigator.getUserMedia(constrains).then(success).catch(error)
  }
}

function getMedia() {
  // let constraints = {video: {width: this.bodyWidth, height: this.bodyHeight - 60}, audio: false};
  // let constraints = {video:{width:480,height:320}, audio: false};
  let constraints = { video: true, audio: false }
  try {
    getUserMedia(
      constraints,
      (MediaStream) => {
        videoEl.value.srcObject = MediaStream
        videoEl.value.play()
      },
      function (PermissionDeniedError) {
        console.log(PermissionDeniedError)
      }
    )
  } catch (e) {
    console.log('e', e)
  }
}

// 新增响应式数据

// 影集点击处理函数
const handleAlbumClick = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.multiple = false
  input.accept = 'video/*'
  input.onchange = (e: Event) => {
    console.log('onchange')
    var videofmt = create(Media_Video_MixedSchema)
    const files = (e.target as HTMLInputElement).files
    if (files && files.length > 0) {
      const promises = Array.from(files).map((file) => {
        console.log(file)
        return new Promise<void>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e1) => {
            try {
              const dataURL = e1.target.result
              console.log('filereader onload', e1)
              // 修复文件名处理
              const ext = file.name.includes('.') ? file.name.split('.').pop() : ''
              const ipfsfile = create(IpfsFileSchema, {
                Iscid: false,
                Filename: `1${ext ? `.${ext}` : ''}`,
                Content: dataURL as string
              })
              videofmt.Medias.push(ipfsfile)
              console.log('resolve')
              resolve()
            } catch (error) {
              console.log(error)
              reject(error) // 捕获同步错误
            }
          }
          reader.onerror = (error) => reject(error)
          reader.readAsDataURL(file)
          console.log('readasdataurl')
        })
      })

      Promise.all(promises)
        .then(() => {
          //sessionStorage.setItem('tempmedia', JSON.stringify(files))
          console.log('setitem', videofmt)
          router.push({
            path: '/publish/confirm',
            state: { objurl: JSON.stringify(videofmt) }
          })
        })
        .catch((error) => {
          console.error('Error processing files:', error)
          // 可选：通知用户具体哪个文件出错
        })
    }
  }
  input.click()
}
onMounted(() => {
  videoEl.value = document.getElementById('video')
  getMedia()
})
</script>

<style scoped lang="less">
@import '../../assets/less/index';

.Publish {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  overflow: auto;
  color: white;
  background: black;

  .footer {
    font-size: 15rem;
    font-weight: bold;
    color: var(--second-text-color);

    .base-slide-item {
      display: flex;
      align-items: center;
    }

    .active {
      color: white;
    }
  }

  .float {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: calc(100% - 60px);

    .close {
      font-size: 28rem;
      position: absolute;
      left: 20rem;
      top: 20rem;
    }

    .choose-music {
      position: absolute;
      left: 50%;
      top: 20rem;
      transform: translateX(-50%);
      border-radius: 20rem;
      background: #333333;
      padding: 5rem 15rem;
      display: flex;
      align-items: center;
      font-size: 14rem;

      svg {
        font-size: 30rem;
        margin-right: 5rem;
        width: 12rem;
        height: 12rem;
      }
    }

    .toolbar {
      position: absolute;
      top: 20rem;
      right: 10rem;

      .tool {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20rem;
        font-size: 26rem;
      }
    }
  }
}
</style>
