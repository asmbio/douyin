<template>
  <from-bottom-dialog
    page-id="ChatDetail"
    :modelValue="modelValue"
    @update:modelValue="(e) => $emit('update:modelValue', e)"
    :show-heng-gang="false"
    @cancel="cancel"
    mode="white"
  >
    <div class="block-dialog">
      <div class="notice">拉黑后，对方将无法搜索到你，也不能再给你发私信</div>
      <div class="row red" @click="handleConfirmBlock">确认拉黑</div>
      <div class="row">不让 TA 看</div>
      <div class="space"></div>
      <div class="row" @click="cancel">取消</div>
    </div>
  </from-bottom-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import FromBottomDialog from '../../../components/dialog/FromBottomDialog.vue'
import { metaFollow } from '@/api/moguservice' // Replace with actual path

import { MetaFollowMsg_FollowAction } from '@/api/gen/trans_pb' // Replace with actual path
import { useBaseStore } from '@/store/pinia'
const store = useBaseStore()
const props = defineProps<{
  blockedUserId: string
  modelValue: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const cancel = () => {
  emit('update:modelValue', false)
}

const handleConfirmBlock = async () => {
  try {
    await metaFollow(props.blockedUserId, store.userinfo.uid, MetaFollowMsg_FollowAction.BLACKLIST)
  } catch (error) {
    console.error('Error during block action:', error)
  } finally {
    cancel()
  }
}
</script>

<style scoped lang="less">
@import '../../../assets/less/index';

.block-dialog {
  color: black;

  .notice {
    color: var(--second-text-color);
    font-size: 12rem;
    height: 40rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .row {
    height: 50rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid gainsboro;

    &:nth-last-child(1) {
      border-top: none;
    }

    &.red {
      color: var(--primary-btn-color);
    }
  }

  .space {
    height: 10rem;
    background: whitesmoke;
  }
}
</style>
