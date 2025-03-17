<template>
  <div class="edit">
    <BaseHeader @onBack="save">
      <template v-slot:center>
        <div class="title">
          <span class="f16">编辑资料</span>
          <span class="sub f10">已完成85%</span>
        </div>
      </template>
      <template v-slot:right>
        <div class="button" @click="save">保存</div>
      </template>
    </BaseHeader>
    <div class="userinfo">
      <div class="change-avatar">
        <div class="avatar-ctn" @click="showAvatarDialog">
          <img class="avatar" :src="store.userinfo.avatar168x168?.urlList[0]" alt="" />
          <img class="change" src="../../../assets/img/icon/me/camera-light.png" alt="" />
        </div>
        <span>点击更换头像</span>
      </div>
      <div class="row" @click="nav('/me/edit-userinfo-item', { type: 1 })">
        <div class="left">名字</div>
        <div class="right">
          <span>{{ isEmpty(store.userinfo.nickname) }}</span>
          <dy-back scale=".8" direction="right"></dy-back>
        </div>
      </div>
      <div class="row" @click="_notice('不可修改')">
        <div class="left">抖音号</div>
        <div class="right">
          <span>{{ isEmpty(_getUserDouyinId({ author: store.userinfo })) }}</span>
          <dy-back scale=".8" direction="right"></dy-back>
        </div>
      </div>
      <div class="row" @click="nav('/me/edit-userinfo-item', { type: 3 })">
        <div class="left">简介</div>
        <div class="right">
          <span>{{ isEmpty(store.userinfo.signature) }}</span>
          <dy-back scale=".8" direction="right"></dy-back>
        </div>
      </div>
      <div class="row" @click="showSexDialog">
        <div class="left">性别</div>
        <div class="right">
          <span>{{ sex }}</span>
          <dy-back scale=".8" direction="right"></dy-back>
        </div>
      </div>
      <div class="row" @click="showBirthdayDialog">
        <div class="left">生日</div>
        <div class="right">
          <span>{{ unixNanoToYYYYMMDD(store.userinfo.userAge) }}</span>
          <div v-show="false" id="trigger1"></div>
          <dy-back scale=".8" direction="right"></dy-back>
        </div>
      </div>
      <div class="row" @click="nav('/me/choose-location')">
        <div class="left">所在地</div>
        <div class="right">
          <span v-if="store.userinfo.province || store.userinfo.city">
            {{ store.userinfo.province }}
            <template v-if="store.userinfo.province && store.userinfo.city"> - </template>
            {{ store.userinfo.city }}
          </span>
          <dy-back scale=".8" direction="right"></dy-back>
        </div>
      </div>
      <div class="row" @click="nav('/me/add-school')">
        <div class="left">学校</div>
        <div class="right">
          <span>{{ isEmpty(store.userinfo.school?.name) }}</span>
          <dy-back scale=".8" direction="right"></dy-back>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div class="preview-img" v-if="data.previewImg" @click="data.previewImg = ''">
        <img class="resource" :src="data.previewImg" alt="" />
        <img
          class="download"
          src="../../../assets/img/icon/components/video/download.png"
          alt=""
          @click.stop="_no"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import MobileSelect from '../../../components/mobile-select/mobile-select'
import { useBaseStore } from '@/store/pinia'
import {
  _checkImgUrl,
  _getUserDouyinId,
  _hideLoading,
  _no,
  _notice,
  _showLoading,
  _showSelectDialog,
  _sleep
} from '@/utils'
import { computed, reactive } from 'vue'
import { useNav } from '@/utils/hooks/useNav'
import router from '@/router'
import { editUserInfo } from '@/api/moguservice'
import { AvatarImageSchema } from '@/api/gen/userinfo_pb'
import { create } from '@bufbuild/protobuf'

defineOptions({
  name: 'EditUserInfo'
})
const store = useBaseStore()
const nav = useNav()
const data = reactive({
  sexList: [
    { id: 1, name: '男' },
    { id: 2, name: '女' },
    { id: 3, name: '不展示' }
  ],
  avatarList: [
    { id: 1, name: '拍一张' },
    { id: 2, name: '从相册选择' },
    { id: 3, name: '查看大图' },
    { id: 4, name: '取消' }
  ],
  previewImg: ''
})

const sex = computed(() => {
  switch (Number(store.userinfo.gender)) {
    case 1:
      return '男'
    case 2:
      return '女'
    default:
      return ''
  }
})

function isEmpty(val) {
  if (val && val !== -1) return val
  return '点击设置'
}

function showSexDialog() {
  _showSelectDialog(data.sexList, async (e) => {
    _showLoading()
    await _sleep(500)
    store.userinfo.gender = e.id
    _hideLoading()
  })
}
async function save() {
  try {
    await editUserInfo(store.userinfo)
    _notice('保存成功')
  } catch (error) {
    _notice(error)
    console.log(error)
  }
  router.back()
}

function showAvatarDialog() {
  _showSelectDialog(data.avatarList, (e) => {
    switch (e.id) {
      case 1:
        return _no()
      case 2:
        handleAvatarClick()
        break
      case 3:
        data.previewImg = store.userinfo.avatar168x168?.urlList[0]
        break
    }
  })
}

// 影集点击处理函数
const handleAvatarClick = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.multiple = false
  input.accept = 'image/*'

  input.onchange = (e: Event) => {
    const files = (e.target as HTMLInputElement).files
    if (!files || files.length === 0) return

    const file = files[0]
    const reader = new FileReader()

    reader.onload = (readEvent) => {
      const img = new Image()
      img.onload = () => {
        // 创建画布并设置尺寸
        const canvas = document.createElement('canvas')
        canvas.width = 168
        canvas.height = 168
        const ctx = canvas.getContext('2d')

        if (!ctx) return

        // 计算裁剪参数
        const targetSize = 168
        const sourceWidth = img.width
        const sourceHeight = img.height

        // 计算缩放比例和位置
        const scale = Math.max(targetSize / sourceWidth, targetSize / sourceHeight)
        const scaledWidth = sourceWidth * scale
        const scaledHeight = sourceHeight * scale

        // 计算裁剪位置
        const x = (scaledWidth - targetSize) / 2 / scale
        const y = (scaledHeight - targetSize) / 2 / scale
        const cropSize = targetSize / scale

        // 绘制并裁剪图像
        ctx.drawImage(img, x, y, cropSize, cropSize, 0, 0, targetSize, targetSize)

        // 转换为 Blob 并创建文件
        let aurl = canvas.toDataURL('image/jpeg', 0.85) // 质量为 85%
        store.userinfo.avatar168x168 = create(AvatarImageSchema, { urlList: [aurl] })
        img.src = aurl
      }

      img.src = readEvent.target?.result as string
    }

    reader.readAsDataURL(file)
  }

  input.click()
}

function showBirthdayDialog() {
  new MobileSelect({
    trigger: '#trigger1',
    title: '生日',
    connector: '生日',
    wheels: [
      {
        data: Array.apply(null, { length: 100 }).map((v, i) => new Date().getFullYear() - i)
      },
      {
        data: Array.apply(null, { length: 12 }).map((v, i) => 12 - i)
      },
      {
        data: Array.apply(null, { length: 31 }).map((v, i) => 31 - i)
      }
    ],
    callback: async (indexArr, data) => {
      _showLoading()
      //  await _sleep(500)
      store.userinfo.userAge = convertToUnixNano(data.join('-'))
      _hideLoading()
    }
  }).show()
}

function convertToUnixNano(dateString: string): bigint {
  const parts = dateString.split('-')
  const year = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1
  const day = parseInt(parts[2], 10)
  const timestamp = Date.UTC(year, month, day)
  //console.log(year,month,day, timestamp)
  return BigInt(timestamp) * 1000_000n // 转换为纳秒
}

function unixNanoToYYYYMMDD(unixNano: bigint): string {
  // 将 bigint 纳秒转换为毫秒（需要先转换为 bigint 除法）
  const milliseconds = unixNano / 1_000_000n // 使用 bigint 字面量 1_000_000n
  // 将 bigint 转换为 number（注意：确保结果不超过 Number.MAX_SAFE_INTEGER）
  const timestamp = Number(milliseconds)
  const date = new Date(timestamp)

  // 格式化为 YY-MM-DD（UTC 时间）
  const year = date.getUTCFullYear().toString() // 取年份后两位
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0') // 月份补零
  const day = date.getUTCDate().toString().padStart(2, '0') // 日期补零

  return `${year}-${month}-${day}`
}
</script>

<style scoped lang="less">
@import '../../../assets/less/index';

.edit {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  overflow: auto;
  font-size: 14rem;
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;

  .sub {
    color: var(--second-text-color);
  }
}

.preview-img {
  z-index: 9;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;

  .resource {
    width: 100%;
    max-height: 100%;
  }

  .download {
    position: absolute;
    bottom: 20rem;
    right: 20rem;
    padding: 3rem;
    background: var(--second-btn-color-tran);
    width: 20rem;
  }
}

.userinfo {
  padding-top: 60rem;
  color: white;

  .change-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 30rem 0;
    @avatar-width: 80rem;

    .avatar-ctn {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10rem;

      width: @avatar-width;
      height: @avatar-width;

      .avatar {
        opacity: 0.5;
        position: absolute;
        width: @avatar-width;
        height: @avatar-width;
        border-radius: 50%;
      }

      .change {
        width: 28rem;
        z-index: 9;
        position: relative;
      }
    }
  }
}

.change-dialog {
  z-index: 10;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #000000bb;
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    background: white;
    width: 80%;
    padding: 5rem 0;
    border-radius: 2px;
    box-sizing: border-box;

    .item {
      font-size: 15rem;
      padding: 15rem 20rem;
      transition: all 0.2s;

      &:active {
        background: darkgray;
      }
    }
  }
}
</style>
