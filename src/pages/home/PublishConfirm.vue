<template>
  <div class="publish-confirm">
    <div class="header">
      <Icon icon="mingcute:close-line" class="close-icon" @click="router.back()" />
      <div class="title">编辑封面</div>
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

        <div class="section topic-section">
          <input type="text" placeholder="#话题 @朋友" class="topic-input" />
          <div class="tags">
            <span class="tag"># 每天必打开的软件</span>
            <span class="tag"># 一起撸羊毛</span>
            <span class="tag"># 软件分享</span>
          </div>
        </div>

        <div class="section location-section">
          <div class="location-input-wrapper">
            <Icon icon="mdi:map-marker-outline" class="location-icon" />
            <input type="text" v-model="location" placeholder="你在哪里" class="location-input" />
          </div>
          <div class="location-options">
            <span class="option">门景区</span>
            <span class="option">中越人民友谊公园</span>
            <span class="option">A+酒吧</span>
            <span class="option">中越友谊广场</span>
          </div>
        </div>

        <div class="section tag-section">
          <div class="tag-selector">
            <Icon icon="mdi:tag-outline" class="tag-icon" />
            <input type="text" placeholder="📌 添加标签" v-model="newTag" class="tag-input" />
          </div>
          <div class="selected-tags">
            <span v-for="(tag, index) in tags" :key="index" class="tag">
              {{ tag }}
              <Icon icon="mdi:close" @click="removeTag(index)" class="remove-tag" />
            </span>
          </div>
        </div>

        <div class="settings">
          <div class="setting-item">
            <span class="setting-text">🔒 公开·所有人可见</span>
            <Icon icon="material-symbols:arrow-forward-ios-rounded" class="forward-icon" />
          </div>
          <div class="setting-item">
            <span class="setting-text">⚙️ 高级设置</span>
            <Icon icon="material-symbols:arrow-forward-ios-rounded" class="forward-icon" />
          </div>
        </div>
      </div>

      <!-- 发布按钮 -->
      <div class="bottom-area">
        <div class="draft-btn">存草稿</div>
        <button class="publish-btn" @click="handlePublish">发作品</button>
      </div>
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
} from '@/api/gen/trans_worksmsg_pb'
import { useBaseStore } from '@/store/pinia'
import { publishVideo } from '@/api/moguservice'
import { _notice } from '@/utils'

defineOptions({
  name: 'PublishConfirm'
})
const store = useBaseStore()

const router = useRouter()
const route = useRoute()
const textareaRef = ref<HTMLTextAreaElement>()
const isInputFocused = ref(false)

const obj = create(WorksmsgSchema, {
  From: store.userinfo.uid,
  Feesrate: BigInt(0),
  Title: '',
  Topic: [],
  AtUsers: [],
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
      // 添加到列表
      store.getpublishvideo()
      //store.videos.my.list.unshift(obj)
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
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }

  .header {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    padding: 15rem 20rem;
    background: white;
    z-index: 10;
    box-shadow: 0 2rem 10rem rgba(0, 0, 0, 0.05);

    .close-icon {
      font-size: 24rem;
      cursor: pointer;
    }

    .title {
      flex: 1;
      text-align: center;
      font-size: 18rem;
      font-weight: 500;
    }
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 15rem 15rem calc(80rem + env(safe-area-inset-bottom)); // 增加底部padding以显示完整内容

    .preview-area {
      width: min(360rem, 90%); // 调整最大宽度
      margin: 0 auto 15rem;
      aspect-ratio: 9/16;
      height: auto;
      max-height: 65vh; // 调整最大高度
      border-radius: 12rem;
      overflow: hidden;
      background: #f0f0f0;
      box-shadow: 0 2rem 8rem rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;

      .single-preview {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        img,
        video {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }

    .form {
      background: white;
      border-radius: 12rem;
      overflow: hidden;

      .custom-textarea {
        width: 100%;
        min-height: 40rem; // 设置最小高度
        height: 40rem;
        max-height: 150rem; // 设置最大高度
        padding: 15rem;
        border: none;
        font-size: 16rem;
        resize: none;
        background: transparent;

        &::placeholder {
          color: #999;
        }
        &:focus {
          outline: none;
        }
      }

      .topic-section {
        padding: 15rem;
        border-top: 1px solid #f0f0f0;

        .topic-input {
          width: 100%;
          padding: 10rem 0;
          border: none;
          font-size: 16rem;
          background: transparent;

          &::placeholder {
            color: #999;
          }
          &:focus {
            outline: none;
          }
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10rem;
          margin-top: 10rem;

          .tag {
            padding: 6rem 12rem;
            background: #f8f8f8;
            border-radius: 20rem;
            color: #666;
            font-size: 14rem;
          }
        }
      }

      .location-section {
        padding: 15rem;
        border-top: 1px solid #f0f0f0;

        .location-input-wrapper {
          display: flex;
          align-items: center;
          gap: 10rem;

          .location-icon {
            font-size: 20rem;
            color: #666;
          }

          .location-input {
            flex: 1;
            border: none;
            font-size: 16rem;
            background: transparent;

            &::placeholder {
              color: #999;
            }
            &:focus {
              outline: none;
            }
          }
        }

        .location-options {
          display: flex;
          flex-wrap: wrap;
          gap: 10rem;
          margin-top: 15rem;

          .option {
            padding: 6rem 12rem;
            background: #f8f8f8;
            border-radius: 20rem;
            color: #666;
            font-size: 14rem;
          }
        }
      }

      .tag-section {
        padding: 15rem;
        border-top: 1px solid #f0f0f0;

        .tag-selector {
          display: flex;
          align-items: center;
          gap: 10rem;

          .tag-icon {
            font-size: 20rem;
            color: #666;
          }

          .tag-input {
            flex: 1;
            border: none;
            font-size: 16rem;
            background: transparent;

            &::placeholder {
              color: #999;
            }
            &:focus {
              outline: none;
            }
          }
        }

        .selected-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10rem;
          margin-top: 10rem;

          .tag {
            display: flex;
            align-items: center;
            gap: 5rem;
            padding: 6rem 12rem;
            background: #f8f8f8;
            border-radius: 20rem;
            color: #666;
            font-size: 14rem;

            .remove-tag {
              font-size: 16rem;
              cursor: pointer;
            }
          }
        }
      }

      .settings {
        padding: 0 15rem;

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15rem 0;
          border-top: 1px solid #f0f0f0;

          .setting-text {
            font-size: 16rem;
            color: #333;
          }

          .forward-icon {
            font-size: 16rem;
            color: #999;
          }
        }
      }
    }
  }

  .bottom-area {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 15rem;
    padding: 15rem 20rem;
    padding-bottom: calc(15rem + env(safe-area-inset-bottom)); // 适配底部安全区域
    background: white;
    box-shadow: 0 -2rem 10rem rgba(0, 0, 0, 0.05);
    z-index: 100; // 确保底部按钮始终在顶层

    .draft-btn {
      padding: 8rem 20rem;
      border-radius: 20rem;
      background: #f0f0f0;
      color: #666;
      font-size: 14rem;
      cursor: pointer;
    }

    .publish-btn {
      padding: 8rem 25rem;
      border: none;
      border-radius: 20rem;
      background: var(--primary-color, #ff2c54);
      color: white;
      font-size: 14rem;
      cursor: pointer;
    }
  }
}

@media (max-width: 768rem) {
  .publish-confirm {
    .content {
      padding: 10rem 10rem calc(70rem + env(safe-area-inset-bottom));

      .preview-area {
        width: 90%;
        max-height: 60vh; // 在移动端稍微降低预览区域高度
      }
    }
  }
}
</style>
