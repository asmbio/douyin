<template>
  <div class="posters">
    <div
      class="poster-item"
      :key="index"
      v-for="(i, index) in list"
      @click="goDetail(index)"
      :style="{ order: index }"
    >
      <!-- 添加order样式保持原始顺序 -->>
      <video
        class="poster"
        @loadedmetadata="handleMetadata($event, index)"
        :src="i.video?.playAddr?.urlList[0]"
      >
        <!-- <source
          v-for="(urlItem, index) in i.video?.playAddr?.urlList"
          :key="index"
          :src="urlItem"
          type="video/mp4"
        /> -->
        <p>您的浏览器不支持 video 标签。</p>
      </video>
      <template v-if="mode === 'normal'">
        <div class="num">
          <Icon icon="icon-park-outline:like" />
          <span>{{ _formatNumber(i.statistics?.digg_count) }}</span>
        </div>
        <div class="top" v-if="i.is_top">置顶</div>
      </template>
      <div class="date" v-if="mode === 'date'">
        <div class="day">{{ getDay(i.create_time) }}</div>
        <div class="month">{{ getMonth(i.create_time) }}</div>
      </div>
      <template v-if="mode === 'music'">
        <div class="music" v-if="index === 0">首发</div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { _formatNumber } from '@/utils'
import { useBaseStore } from '@/store/pinia'
import { useRouter } from 'vue-router'

// Mozilla/5.0 (Linux; Android 15; LGE-AN00 Build/HONORLGE-AN00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.6723.58 Mobile Safari/537.36

// Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) mogu-vue/1.1.0 Chrome/132.0.6834.210 Electron/34.3.0 Safari/537.36

// Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0
const store = useBaseStore()
const nav = useRouter()

//const videoEl = $ref<HTMLVideoElement>()

const props = defineProps({
  list: {
    type: [Array, Number],
    default: () => {
      return []
    }
  },
  mode: {
    type: String,
    default: 'normal' //date,music
  }
})

defineOptions({
  name: 'Posters'
})

function goDetail(index) {
  store.routeData = { list: props.list, index }
  nav.push({ path: '/video-detail' })
}

function getDay(time) {
  let date = new Date(time * 1000)
  return date.getDate()
}

function getMonth(time) {
  let date = new Date(time * 1000)
  let month = date.getMonth() + 1
  switch (month) {
    case 1:
      return '一月'
    case 2:
      return '二月'
    case 3:
      return '三月'
    case 4:
      return '四月'
    case 5:
      return '五月'
    case 6:
      return '六月'
    case 7:
      return '七月'
    case 8:
      return '八月'
    case 9:
      return '九月'
    case 10:
      return '十月'
    case 11:
      return '十一月'
    case 12:
      return '十二月'
  }
}

function handleMetadata(event, index) {
  const video = event.target
  // const duration = video.duration;
  // const width = video.videoWidth;
  // const height = video.videoHeight;

  // console.log(`Index ${index}:`, {
  //   duration: duration + "s",
  //   width: width + "px",
  //   height: height + "px"
  // });
  video.currentTime = 0
  // 可选：将元数据保存到 list 数组中（确保响应式更新）
  //this.$set(this.list[index], 'metadata', { duration, width, height });
}
</script>

<style scoped lang="less">
.posters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120rem, 1fr));
  gap: 2rem;
  grid-auto-flow: dense;
  align-items: start;
  justify-content: center;

  /* 计算列数并设置每列宽度的媒体查询 */
  /* 2列 */
  @media screen and (min-width: 250rem) and (max-width: 370rem) {
    grid-template-columns: repeat(2, calc(50% - 1rem));
  }
  /* 3列 */
  @media screen and (min-width: 371rem) and (max-width: 490rem) {
    grid-template-columns: repeat(3, calc(33.33% - 1.33rem));
  }
  /* 4列 */
  @media screen and (min-width: 491rem) and (max-width: 610rem) {
    grid-template-columns: repeat(4, calc(25% - 1.5rem));
  }
  /* 5列及以上 */
  @media screen and (min-width: 611rem) {
    grid-template-columns: repeat(auto-fill, minmax(120rem, 1fr));
  }
}

.poster-item {
  min-width: 120rem;
  width: 100%;
  border: 0.5px solid black;
  overflow: hidden;
  position: relative;
  break-inside: avoid;

  .poster {
    width: 100%;
    height: auto;
    object-fit: contain;
  }

  .top,
  .music {
    position: absolute;
    font-size: 12rem;
    background: gold;
    color: black;
    padding: 2rem 3rem;
    border-radius: 2rem;
    top: 7rem;
    left: 7rem;
  }

  .num {
    color: white;
    position: absolute;
    bottom: 5rem;
    left: 5rem;
    display: flex;
    align-items: center;
    font-size: 14rem;
    gap: 3rem;

    .love {
      width: 14rem;
      height: 14rem;
      margin-right: 5rem;
    }
  }

  .date {
    position: absolute;
    top: 5rem;
    left: 5rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 14rem;
    color: black;
    background: white;
    padding: 6rem;
    border-radius: 6rem;

    .day {
      font-weight: bold;
    }

    .month {
      font-size: 10rem;
    }
  }
}
</style>
