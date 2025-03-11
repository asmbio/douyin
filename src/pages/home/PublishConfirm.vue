<template>
  <div class="publish-confirm">
    <div class="header">
      <Icon icon="mingcute:close-line" @click="router.back()" />
    </div>

    <div class="content" :class="{ 'input-focused': isInputFocused }">
      <!-- 预览区域 -->
      <div class="preview-area">
        <div v-if="works.Content.value" class="single-preview">
          <img
            v-if="showImagePreview"
            :src="(works.Content.value as Media_Video_Mixed).Medias[0].Content"
          />
          <video
            v-else-if="showVideoPreview"
            :src="(works.Content.value as Media_Video_Mixed).Medias[0].Content"
            controls
          />
        </div>
        <div v-else class="preview-placeholder">请选择要上传的文件</div>
      </div>

      <!-- 表单区域 -->
      <div class="form">
        <textarea
          ref="textareaRef"
          v-model="works.Desc"
          placeholder="添加作品描述..."
          @focus="handleFocus"
          @blur="handleBlur"
          class="custom-textarea"
        ></textarea>

        <div class="section">
          <input type="text" placeholder="# 话题 @ 朋友" class="hashtag-input" />
          <div class="tags">
            <span class="tag">#每天必打开的软件</span>
            <span class="tag">#一起撸羊毛</span>
            <span class="tag">#软件分享</span>
          </div>
        </div>

        <div class="section location-section">
          <Icon icon="mdi:map-marker-outline" class="location-icon" />
          <input type="text" v-model="location" placeholder="你在哪里" class="location-input" />
          <div class="location-options">
            <span class="option">门景区</span>
            <span class="option">友谊公园</span>
            <span class="option">A+酒吧</span>
            <span class="option">友谊广场</span>
          </div>
        </div>

        <div class="section">
          <div class="tag-selector">
            <Icon icon="mdi:tag-outline" />
            <input type="text" placeholder="📌 添加标签" v-model="newTag" />
          </div>
          <div class="selected-tags">
            <span v-for="(tag, index) in tags" :key="index" class="tag">
              {{ tag }}
              <Icon icon="mdi:close" @click="removeTag(index)" />
            </span>
          </div>
        </div>

        <div class="settings">
          <div class="setting-item">
            <span>🔍 公开·所有人可见</span>
            <Icon icon="material-symbols:arrow-forward-ios-rounded" />
          </div>
          <div class="setting-item">
            <span>💡 高级设置</span>
            <Icon icon="material-symbols:arrow-forward-ios-rounded" />
          </div>
        </div>
      </div>

      <!-- 右下角发布按钮 -->
      <button class="publish-btn" @click="handlePublish">发布</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { create } from '@bufbuild/protobuf'
import {
  WorksmsgSchema,
  MEDIA_TYPE,
  Media_AudioSchema,
  Media_Video_MixedSchema,
  type Media_Video_Mixed,
  IpfsFileSchema
} from '@/api/gen/video2_pb'
import { useBaseStore } from '@/store/pinia'
import { publishVideo } from '@/api/moguservice'
import { _notice } from '@/utils'
const store = useBaseStore()

const router = useRouter()
const route = useRoute()
const textareaRef = ref<HTMLTextAreaElement>()
const isInputFocused = ref(false)

const obj = create(WorksmsgSchema, {
  From: store.userinfo.uid,
  Feesrate: BigInt(0),
  Title: 'My Video Title',
  Topic: ['topic1', 'topic2'],
  AtUsers: ['user789', 'user101'],
  Desc: '',
  MediaType: MEDIA_TYPE._VIDEO_MIXED,
  Time: BigInt(Date.now() * 1_000_000),
  Content: {
    case: 'MediaVideoMixed',
    value: create(Media_Video_MixedSchema, {
      Medias: [
        create(IpfsFileSchema, {
          Iscid: false,
          Filename: '',
          Content: ''
        })
      ],
      audio: create(Media_AudioSchema, {
        ipfsFile: create(IpfsFileSchema, {
          Iscid: false,
          Filename: '',
          Content: ''
        })
      })
    })
  }
})
console.log('publishconfirm.vue')
const works = reactive(obj)
// 文件预览处理
//const dataURL = ref<string>()
const showImagePreview = computed(() => {
  console.log('showimgagepreview', works.Content.value as Media_Video_Mixed)
  var ret = (works.Content.value as Media_Video_Mixed).Medias[0].Content.startsWith('data:image')
  // if (ret) {
  //   works.Content = {
  //     case: "MediaImg",
  //     value: create(Media_ImgSchema, {
  //       ipfsFile: {
  //         Content: dataURL.value,
  //         Filename: "1.png",
  //         Iscid: false
  //       }
  //     })
  //   }
  // }
  //console.log(obj.Content)
  return ret
})
const showVideoPreview = computed(() => {
  console.log('showVideoPreview', works.Content.value as Media_Video_Mixed)
  var ret = (works.Content.value as Media_Video_Mixed).Medias[0].Content.startsWith('data:video')
  // if (ret) {
  //   works.Content = {
  //     case: "MediaVideo",
  //     value: create(Media_VideoSchema, {
  //       ipfsFile: {
  //         Content: dataURL.value,
  //         Filename: "1.mp4",
  //         Iscid: false,
  //         Duration: dataURL.value.duraton
  //       },

  //     })
  //   }
  // }
  //console.log(obj.Content)
  return ret
})

// 输入框交互

const handleFocus = () => {
  isInputFocused.value = true
  if (textareaRef.value) {
    textareaRef.value.style.height = '150rem'
  }
}

const handleBlur = () => {
  isInputFocused.value = false
  if (textareaRef.value && !works.Desc) {
    textareaRef.value.style.height = '40rem'
  }
}

const loadmedias = () => {
  // 从路由状态中获取文件列表
  if (window.history.state?.objurl) {
    // 将普通对象转换为 File 对象（如果需要）
    // console.log(window.history.state.objurl)
    works.Content.value = JSON.parse(window.history.state.objurl)
    window.history.state.objurl = ''
    //  Object.assign(works.Content.value,window.history.state.objurl)
    //var vmix= works.Content.value as Media_Video_Mixed
    // console.log(works)
  }

  //   var medias =create(Media_Video_MixedSchema, JSON.parse( sessionStorage.getItem('tempmedia')))
  // //var files = JSON.parse(sessionStorage.getItem('tempmedia')) as HTMLInputElement['files']

  // var videofmt = create(Media_Video_MixedSchema)
  //   if (files && files.value.length > 0) {
  //     const promises = Array.from(files.value).map((file) => {
  //       console.log(file)
  //       return new Promise<void>((resolve, reject) => {
  //         const reader = new FileReader()
  //         reader.onload = (e1) => {
  //           try {
  //             const dataURL = e1.target.result
  //             console.log('filereader onload', e1)
  //             // 修复文件名处理
  //             const ext = file.name.includes('.') ? file.name.split('.').pop() : ''
  //             const ipfsfile = create(IpfsFileSchema, {
  //               Iscid: false,
  //               Filename: `1${ext ? `.${ext}` : ''}`,
  //               Content: dataURL as string
  //             })
  //             videofmt.Medias.push(ipfsfile)
  //             console.log('resolve')
  //             resolve()
  //           } catch (error) {
  //             console.log(error)
  //             reject(error) // 捕获同步错误
  //           }
  //         }
  //         reader.onerror = (error) => reject(error)
  //         reader.readAsDataURL(file)
  //         console.log('readasdataurl')
  //       })
  //     })

  //     Promise.all(promises)
  //       .then(() => {

  //         Object.assign(works.Content.value,videofmt)
  //         //var vmix= works.Content.value as Media_Video_Mixed
  //         console.log(works)
  //       })
  //       .catch((error) => {
  //         console.error('Error processing files:', error)
  //         // 可选：通知用户具体哪个文件出错
  //       })
  //   }
  // }
}

watch(
  () => route.path,
  (newVal) => {
    console.log('watch route path', newVal)
    if (newVal === '/publish/confirm') {
      console.log('watch route path==', newVal)
      loadmedias()
    }
  }
)
onMounted(() => {
  console.log('publishconfirm.vue onMounted')
  if (textareaRef.value) {
    textareaRef.value.style.height = '40rem'
  }
  loadmedias()
})

// 标签管理
const newTag = ref('')
const tags = ref<string[]>([])
const removeTag = (index: number) => {
  tags.value.splice(index, 1)
}

// 位置信息
const location = ref('')

// 发布处理
const handlePublish = async () => {
  // 发布逻辑
  works.Time = BigInt(Date.now() * 1_000_000)
  console.log(obj)

  publishVideo(obj)
    .then(() => {
      _notice('发布成功')
      router.back()
    })
    .catch((err) => {
      _notice(err)
      console.log(err)
    })
  //  publishVideo(create(WorksmsgSchema,JSON.parse( JSON.stringify(works)) ))
}
</script>

<style scoped lang="less">
.publish-confirm {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;

  .header {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    padding: 15rem 20rem;
    background: white;
    z-index: 10;
    box-shadow: 0 2rem 10rem rgba(0, 0, 0, 0.05);

    .icon {
      font-size: 24rem;
      cursor: pointer;
    }
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
    padding: 0 20rem 80rem;
    transition: all 0.3s ease;

    &.input-focused {
      .preview-area {
        height: 50vh !important;
      }
    }

    .preview-area {
      width: 100%;
      max-width: 400rem;
      margin: 0 auto;
      height: 60vh;
      border-radius: 8rem;
      overflow: hidden;
      background: #000;
      transition: height 0.3s ease;

      .single-preview {
        width: 100%;
        height: 100%;
        img,
        video {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: white;
        }
      }

      .preview-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #999;
        font-size: 16rem;
        background: #f5f5f5;
      }
    }

    .form {
      width: 100%;
      max-width: 600rem;
      margin: 20rem auto 0;
      display: flex;
      flex-direction: column;
      gap: 15rem;

      .custom-textarea {
        width: 100%;
        min-height: 40rem !important;
        padding: 15rem;
        border: none;
        border-radius: 8rem;
        background: white;
        font-size: 14rem;
        resize: none;
        transition: height 0.3s ease;

        &:focus {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
        }
      }

      input {
        &:focus {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
        }
      }

      .section {
        padding: 15rem;
        background: white;
        border-radius: 8rem;

        &.location-section {
          position: relative;
          padding: 15rem 15rem 40rem 15rem;

          .location-icon {
            position: absolute;
            left: 15rem;
            top: 18rem;
            font-size: 20rem;
          }

          .location-input {
            width: 100%;
            padding-left: 30rem;
            border: none;
            background: transparent;
            font-size: 14rem;
          }

          .location-options {
            display: flex;
            flex-wrap: wrap;
            gap: 10rem;
            margin-top: 15rem;

            .option {
              padding: 5rem 10rem;
              background: white;
              border-radius: 15rem;
              font-size: 12rem;
            }
          }
        }

        .tags {
          display: flex;
          gap: 10rem;
          margin-top: 10rem;

          .tag {
            padding: 5rem 10rem;
            background: var(--primary-light);
            color: var(--primary-color);
            border-radius: 15rem;
            font-size: 12rem;
          }
        }

        .selected-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8rem;
          margin-top: 10rem;

          .tag {
            padding: 5rem 10rem;
            background: var(--primary-light);
            border-radius: 15rem;
            font-size: 12rem;
            display: flex;
            align-items: center;
            gap: 5rem;

            .icon {
              font-size: 14rem;
              cursor: pointer;
            }
          }
        }
      }

      .settings {
        margin-top: 20rem;

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15rem 0;
          border-bottom: 1rem solid #eee;

          .icon {
            font-size: 14rem;
            color: #999;
          }
        }
      }
    }

    .publish-btn {
      position: fixed;
      right: 30rem;
      bottom: 30rem;
      padding: 6rem 30rem;
      border: none;
      border-radius: 25rem;
      background: #ff0000;
      color: white;
      font-size: 16rem;
      box-shadow: 0 4rem 12rem rgba(0, 0, 0, 0.15);
      z-index: 10;
    }
  }
}

@media (max-width: 768rem) {
  .publish-confirm {
    .content {
      padding: 0 15rem 70rem;

      &.input-focused {
        .preview-area {
          height: 30vh !important;
        }
      }

      .preview-area {
        height: 50vh;
        width: 90%;
      }

      .publish-btn {
        right: 15rem;
        bottom: 15rem;
        padding: 10rem 25rem;
        font-size: 14rem;
      }
    }
  }
}
</style>
