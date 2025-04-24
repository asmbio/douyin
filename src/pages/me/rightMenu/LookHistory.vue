<template>
  <div class="lookHistory">
    <BaseHeader>
      <template v-slot:center>
        <span class="f16">观看历史</span>
      </template>
      <template v-slot:right v-if="isClear">
        <span class="second-text-color f13" @click="clear">清空</span>
      </template>
    </BaseHeader>
    <div class="content">
      <Indicator
        tabStyleWidth="50%"
        :tabTexts="['视频', '影视综']"
        v-model:active-index="data.currentSlideItemIndex"
      >
      </Indicator>
      <SlideHorizontal v-model:index="data.currentSlideItemIndex" class="SlideHorizontal">
        <SlideItem class="tab1" style="overflow: auto">
          <Scroll class="Scroll" @pulldown="getWatchHistoryVideos">
            <Posters :list="data.historyVideo.list" v-if="data.historyVideo.total"></Posters>
            <Loading :is-full-screen="false" v-if="data.loadingVideo" />
            <template v-else>
              <NoMore v-if="data.historyVideo.list.length" />
              <div class="empty" v-else>
                <img src="../../../assets/img/icon/none-bg1.webp" alt="" />
                <div class="title">暂无观看历史记录</div>
              </div>
            </template>
          </Scroll>
        </SlideItem>
        <SlideItem class="tab2">
          <div class="empty">
            <img src="../../../assets/img/icon/none-bg1.webp" alt="" />
            <div class="title">暂无观影历史记录</div>
          </div>
        </SlideItem>
      </SlideHorizontal>
    </div>
  </div>
</template>
<script setup lang="ts">
import Posters from '@/components/Posters.vue'
import Scroll from '@/components/Scroll.vue'
import NoMore from '@/components/NoMore.vue'
import { historyOther } from '@/api/videos'
import { getWatchHistory } from '@/api/moguservice'

import { computed, onMounted, reactive } from 'vue'
import { _showConfirmDialog } from '@/utils'

defineOptions({
  name: 'LookHistory'
})

const data = reactive({
  loadingVideo: false,
  loadingOther: false,
  isClearHistoryVideo: false,
  isClearHistoryOther: false,
  currentSlideItemIndex: 0,
  pageSize: 15,
  historyVideo: {
    total: 0,
    fromkey: '',
    list: []
  },
  historyOther: {
    total: 0,
    pageNo: 0,
    list: []
  }
})

const isClear = computed(() => {
  if (data.currentSlideItemIndex === 0) {
    return data.historyVideo.list.length
  }
  return data.historyOther.list.length
})
onMounted(() => {
  getWatchHistoryVideos(true)
  getHistoryOther(true)
})

async function getWatchHistoryVideos(init = false) {
  if (data.loadingVideo) return
  if (data.isClearHistoryVideo) return

  data.loadingVideo = true

  try {
    const res = await getWatchHistory(init ? '' : data.historyVideo.fromkey, data.pageSize)
    console.log('getWatchHistory', res.all)
    if (res && res.all) {
      if (init) {
        data.historyVideo.list = res.all
      } else {
        data.historyVideo.list = [...data.historyVideo.list, ...res.all]
      }

      data.historyVideo.total = data.historyVideo.list.length

      // Save the last item's key for pagination
      if (res.all.length > 0) {
        data.historyVideo.fromkey = res.all[res.all.length - 1].awemeId || ''
      }
    }
  } catch (error) {
    console.error('Failed to fetch watch history:', error)
  } finally {
    data.loadingVideo = false
  }
}

async function getHistoryOther(init = false) {
  if (data.loadingOther) return
  if (data.isClearHistoryOther) return
  data.loadingOther = true
  if (!init) {
    data.historyOther.pageNo++
  }
  let res: any = await historyOther({
    pageNo: data.historyOther.pageNo,
    pageSize: data.pageSize
  })
  data.loadingOther = false
  if (res.success) {
    data.historyOther.list = data.historyOther.list.concat(res.data.list)
    data.historyOther.total = res.data.total
  }
}

function clear() {
  _showConfirmDialog(
    '确定清空？',
    '清空后，以往观看记录不再展示',
    'gray',
    () => {
      if (data.currentSlideItemIndex === 0) {
        data.historyVideo.list = []
        data.isClearHistoryVideo = true
        return
      }
      data.historyOther.list = []
      data.isClearHistoryVideo = true
    },
    null,
    '取消',
    '确定'
  )
}
</script>

<style scoped lang="less">
@import '../../../assets/less/index';

.lookHistory {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  overflow: auto;
  color: white;
  font-size: 14rem;

  .content {
    padding-top: 60rem;

    .SlideHorizontal,
    .Scroll {
      height: calc(
        var(--vh, 1vh) * 100 - var(--indicator-height) - var(--common-header-height)
      ) !important;
    }

    .empty {
      height: 70vh;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      img {
        height: 120rem;
      }

      .title {
        font-size: 13rem;
        margin-top: 10rem;
        color: var(--second-text-color);
      }
    }
  }
}
</style>
