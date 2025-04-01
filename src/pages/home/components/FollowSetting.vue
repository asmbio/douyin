<template>
  <from-bottom-dialog
    page-id="home-index"
    :modelValue="modelValue"
    @update:modelValue="(e) => $emit('update:modelValue', e)"
    :show-heng-gang="false"
    maskMode="dark"
    @cancel="cancel()"
    height="480rem"
    mode="light"
  >
    <div class="follow-setting-dialog">
      <div class="dialog-header">
        <div class="title-wrapper">
          <span class="title">{{ currentItem.author.displayname }}</span>
          <span class="subtitle">抖音号：{{ _getUserDouyinId(props.currentItem) }}</span>
        </div>
        <dy-back mode="dark" img="close" direction="right" @click="cancel()"></dy-back>
      </div>
      <div class="options">
        <div class="option" @click="cancel(() => $emit('showShare'))">
          <img src="../../../assets/img/icon/components/follow/share.png" alt="" />
          <span>分享主页</span>
        </div>
        <div
          class="option"
          @click="
            cancel(async () => {
              await $router.push({ path: '/message/chat', query: { uid: currentItem.author.uid } })
            })
          "
        >
          <img src="../../../assets/img/icon/components/follow/private-chat.png" alt="" />
          <span>发私信</span>
        </div>
        <div class="option" @click="cancel(() => nav('/home/report', { mode: 'chat' }))">
          <img src="../../../assets/img/icon/components/follow/report.png" alt="" />
          <span>举报</span>
        </div>
        <div class="option" @click="cancel(() => $emit('showBlockDialog'))">
          <img src="../../../assets/img/icon/components/follow/forbid.png" alt="" />
          <span>拉黑</span>
        </div>
      </div>
      <div class="l-rows">
        <div class="l-row" @click="cancel(() => $emit('showChangeNote'))">
          <div class="left">设置分组</div>
          <div class="right">
            <img src="../../../assets/img/icon/components/follow/write.png" alt="" />
          </div>
        </div>
        <div class="l-row" @click="cancel(() => $emit('showChangeNote'))">
          <div class="left">设置备注名</div>
          <div class="right">
            <img src="../../../assets/img/icon/components/follow/write.png" alt="" />
          </div>
        </div>
        <div class="l-row">
          <div class="left">设置更新和开播通知</div>
          <div class="right">
            <dy-back mode="dark" direction="right" @click="cancel()"></dy-back>
          </div>
        </div>
        <div class="l-row">
          <div class="left">在关注列表中置顶</div>
          <div class="right">
            <switches v-model="switches1" theme="bootstrap" color="success"></switches>
          </div>
        </div>
        <div class="l-row">
          <div class="left">不让TA看</div>
          <div class="right">
            <switches v-model="switches1" theme="bootstrap" color="success"></switches>
          </div>
        </div>
        <div
          v-if="currentItem.author.followStatus"
          class="l-row"
          @click="cancel(() => $emit('cancelFollow'))"
        >
          <div class="left" style="color: red">取消关注</div>
          <div class="right">
            <img src="../../../assets/img/icon/components/follow/reduce.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  </from-bottom-dialog>
</template>
<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue'
import FromBottomDialog from '@/components/dialog/FromBottomDialog.vue'
import Switches from '@/pages/message/components/swtich/switches.vue'
import { _getUserDouyinId } from '@/utils'
import type { UserInfo } from '@/api/gen/userinfo_pb'
import { useNav } from '@/utils/hooks/useNav'

const nav = useNav()

const props = withDefaults(
  defineProps<{
    currentItem: {
      author: UserInfo
    }
    modelValue: boolean
  }>(),
  {
    // active: false, // 默认值在这里设置
    modelValue: false // modelValue 也可以在这里设置默认值
    // currentItem 如果是可选参数也需要在这里设置默认值
  }
)

// const props = defineProps({
//   currentItem: {
//     type: Object,
//     default: () => ({
//       author: {} as UserInfo,
//     })
//   },
//   modelValue: {
//     type: Boolean,
//     default: false
//   }
// });

const emit = defineEmits([
  'update:modelValue',
  'showShare',
  'showBlockDialog',
  'showChangeNote',
  'cancelFollow'
])

const switches1 = ref(false)
//const switches2 = ref(false);

function cancel(cb?: () => void) {
  emit('update:modelValue', false)
  cb && cb()
}
</script>

<style scoped lang="less">
@import '../../../assets/less/index';

.follow-setting-dialog {
  padding: 15rem;
  font-size: 14rem;

  .dialog-header {
    color: rgb(81, 81, 89);
    font-size: 14rem;
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .title-wrapper {
      display: flex;
      flex-direction: column;
    }

    .title {
      font-size: 18rem;
    }

    .subtitle {
      margin-top: 5rem;
      color: var(--second-text-color);
      font-size: 13rem;
    }

    img {
      width: 14rem;
      height: 14rem;
      padding: 6rem;
      border-radius: 50%;
      background: rgba(187, 187, 194, 0.4);
    }
  }

  .options {
    margin-top: 20rem;
    display: flex;
    justify-content: space-between;

    .option {
      box-sizing: border-box;
      padding: 10rem;
      display: flex;
      background: white;
      flex-direction: column;
      align-items: center;
      width: 23%;
      font-size: 12rem;
      border-radius: 8rem;

      img {
        margin-top: 5rem;
        margin-bottom: 10rem;
        @width: 20rem;
        width: @width;
        height: @width;
      }
    }
  }

  .l-rows {
    margin-top: 20rem;

    .l-row {
      height: 45rem;
      padding: 0 20rem;
      background: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(222, 222, 222, 0.42);

      &:first-child {
        border-radius: 10rem 10rem 0 0;
      }

      &:last-child {
        border-bottom: none;
        border-radius: 0 0 10rem 10rem;
      }

      img {
        width: 20rem;
        height: 20rem;
      }
    }
  }
}
</style>
