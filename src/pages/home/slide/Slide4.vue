<template>
  <SlideItem>
    <SlideList
      uniqueId="home"
      style="background: #000"
      :active="props.active"
      :api="getRecommendedVideos"
    />
  </SlideItem>
</template>

<script setup lang="jsx">
import SlideItem from '@/components/slide/SlideItem.vue'
import SlideList from './SlideList.vue'
import { getRecommendedVideos } from '@/api/moguservice'

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  }
})
</script>
