<template>
  <div class="People">
    <img
      :src="_getavater(people)"
      alt=""
      class="head-image pull-left"
      @click="nav('/home/userpanel', {}, { currentItem: { author: people, aweme_list: {} } })"
    />
    <div class="content" @click="canchat && nav('/message/chat', { uid: people.uid })">
      <template v-if="mode === 'normal'">
        <div class="left">
          <div class="name">{{ people.displayname }}</div>
        </div>
      </template>
      <template v-if="mode === 'normal-add-button'">
        <div class="left">
          <div class="name">{{ people.displayname }}</div>
        </div>
        <div class="right">
          <!--   他关注我   -->
          <template v-if="computedRelateEnum === RELATE_ENUM.FOLLOW_ME">
            <div class="l-button red" @click.stop="$emit('follow')">回关</div>
          </template>
          <!--   我关注他   -->
          <template v-if="computedRelateEnum === RELATE_ENUM.FOLLOW_HE">
            <div class="l-button" @click.stop="$emit('unfollow')">已关注</div>
          </template>
          <!--          相互关注-->
          <template v-if="computedRelateEnum === RELATE_ENUM.FOLLOW_EACH_OTHER">
            <div class="l-button" @click.stop="$emit('unfollow')">互相关注</div>
          </template>
          <!--         关注请求-->
          <template v-if="computedRelateEnum === RELATE_ENUM.REQUEST_FOLLOW">
            <div class="l-button" @click.stop="$emit('ignore')">忽略</div>
            <div class="l-button red" @click.stop="$emit('agree')">通过</div>
          </template>
        </div>
      </template>

      <template v-if="mode === 'search'">
        <div class="left">
          <div class="name">
            <span v-if="people.displayname.indexOf(searchKey) > -1"
              >{{ people.displayname.substr(0, people.displayname.indexOf(searchKey))
              }}<span style="color: yellow">{{ searchKey }}</span
              >{{
                people.displayname.substr(people.displayname.indexOf(searchKey) + searchKey.length)
              }}</span
            >
            <span v-else>{{ people.displayname }}</span>
          </div>
          <div class="name f12">
            用户ID:

            <span v-if="people.uid.indexOf(searchKey) > -1"
              >{{ people.uid.substr(0, people.uid.indexOf(searchKey))
              }}<span style="color: yellow">{{ searchKey }}</span
              >{{ people.uid.substr(people.uid.indexOf(searchKey) + searchKey.length) }}</span
            >
            <span v-else>{{ people.uid }}</span>
          </div>
        </div>
      </template>

      <template v-if="mode === 'fans'">
        <div class="left">
          <div class="name">{{ people.displayname }}</div>
          <div class="name">
            <template v-if="computedRelateEnum === RELATE_ENUM.REQUEST_FOLLOW">
              发来一个关注请求
            </template>
            <template v-else> 关注了你</template>
          </div>
          <div class="detail">07-23</div>
        </div>
        <div class="right">
          <!--   他关注我   -->
          <template v-if="computedRelateEnum === RELATE_ENUM.FOLLOW_ME">
            <div class="l-button red" @click.stop="$emit('follow')">回关</div>
          </template>
          <!--   我关注他   -->
          <template v-if="computedRelateEnum === RELATE_ENUM.FOLLOW_HE">
            <div class="l-button" @click.stop="$emit('unfollow')">已关注</div>
          </template>
          <!--          相互关注-->
          <template v-if="computedRelateEnum === RELATE_ENUM.FOLLOW_EACH_OTHER">
            <div class="l-button" @click.stop="$emit('unfollow')">互相关注</div>
          </template>
          <!--         关注请求-->
          <template v-if="computedRelateEnum === RELATE_ENUM.REQUEST_FOLLOW">
            <div class="l-button" @click.stop="$emit('ignore')">忽略</div>
            <div class="l-button red" @click.stop="$emit('agree')">通过</div>
          </template>
        </div>
      </template>

      <template v-if="mode === 'recommend'">
        <div class="left">
          <div class="name">{{ people.displayname }}</div>
          <div class="detail">可能认识的人</div>
        </div>
        <div class="right">
          <template v-if="computedRelateEnum === RELATE_ENUM.RECOMMEND_NO_REMOVE">
            <div class="l-button red" @click.stop="$emit('follow')">关注</div>
          </template>
          <template v-if="computedRelateEnum === RELATE_ENUM.RECOMMEND">
            <div class="l-button" @click.stop="$emit('remove')">移除</div>
            <div class="l-button red" @click.stop="$emit('follow')">关注</div>
          </template>
          <!--   我关注他   -->
          <template v-if="computedRelateEnum === RELATE_ENUM.FOLLOW_HE">
            <div class="l-button" @click.stop="$emit('unfollow')">已关注</div>
          </template>
        </div>
      </template>

      <template v-if="mode === 'friend'">
        <div class="left">
          <div class="name">{{ people.displayname }}</div>
          <div class="detail">4小时之内在线</div>
        </div>
        <div class="right">
          <div class="l-button">发私信</div>
          <img
            src="../../../assets/img/icon/menu-white.png"
            alt=""
            @click.stop="showPopover = !showPopover"
          />
        </div>
      </template>

      <template v-if="mode === 'visitor'">
        <div class="left">
          <div class="name">{{ people.displayname }}</div>
        </div>
        <div class="right">
          <!--   他关注我   -->
          <template v-if="computedRelateEnum === RELATE_ENUM.FOLLOW_ME">
            <div class="l-button red" @click.stop="$emit('follow')">关注</div>
          </template>
          <!--   我关注他   -->
          <template v-if="computedRelateEnum === RELATE_ENUM.FOLLOW_HE">
            <div class="l-button" @click.stop="$emit('unfollow')">已关注</div>
          </template>
          <!--          相互关注-->
          <template v-if="computedRelateEnum === RELATE_ENUM.FOLLOW_EACH_OTHER">
            <div class="l-button" @click.stop="$emit('unfollow')">互相关注</div>
          </template>
        </div>
      </template>
    </div>
    <!--   TODO 点了不消失，内容也变了 -->
    <transition name="scale">
      <div class="popover" v-if="computedRelateEnum === 4 && showPopover">
        <div class="arrow"></div>
        <div class="item">
          <img src="../../../assets/img/icon/feedback-white.png" alt="" />
          <span>设置备注名</span>
        </div>
        <div class="item">
          <img src="../../../assets/img/icon/people-red.png" alt="" />
          <span>从朋友中移除</span>
        </div>
      </div>
    </transition>
  </div>
</template>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, reactive, computed } from 'vue'
import { _checkImgUrl, _getavater } from '@/utils'
import type { UserInfo } from '@/api/gen/userinfo_pb'
import { useNav } from '@/utils/hooks/useNav'
const nav = useNav()
const props = withDefaults(
  defineProps<{
    people: UserInfo
    mode?: string
    searchKey?: string // Mark searchKey as optional
    canchat?: boolean
  }>(),
  {
    searchKey: '', // Default value if not provided
    mode: 'normal',
    canchat: false
  }
)

const emit = defineEmits<{
  (e: 'follow'): void
  (e: 'unfollow'): void
  (e: 'ignore'): void
  (e: 'agree'): void
  (e: 'remove'): void
}>()

const showPopover = ref(false)
const data = reactive({
  ptype: 0
})

const RELATE_ENUM = {
  STRANGER: 0,
  FOLLOW_ME: 1,
  FOLLOW_HE: 2,
  FOLLOW_EACH_OTHER: 3,
  REQUEST_FOLLOW: 4,
  RECOMMEND_NO_REMOVE: 5,
  RECOMMEND: 6
}

const computedRelateEnum = computed(() => {
  if (!props.people) return null

  if (props.people.followStatus && props.people.followerStatus) {
    return RELATE_ENUM.FOLLOW_EACH_OTHER
  } else if (props.people.followStatus) {
    return RELATE_ENUM.FOLLOW_HE
  } else if (props.people.followerStatus) {
    return RELATE_ENUM.FOLLOW_ME
  } else {
    return RELATE_ENUM.STRANGER
  }
})
</script>

<style scoped lang="less">
@import '../../../assets/less/index';

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
  //transform: scale(0);
  opacity: 0;
}

.People {
  transition: all 0.3s ease;
  width: 100%;
  height: 70rem;
  display: flex;
  align-items: center;
  position: relative;

  &.top {
    background: #353a4f;
  }

  .head-image {
    margin-right: 15rem;
    width: 45rem;
    height: 45rem;
    border-radius: 50%;
  }

  .add {
    background: var(--second-btn-color-tran);
    margin-right: 15rem;
    padding: 15rem;
    width: 18rem;
    height: 18rem;
    border-radius: 50%;
  }

  .content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    padding: 15px 0;

    .left {
      .name {
        font-size: 14rem;
        margin-bottom: 2rem;
        color: white;
      }

      .detail {
        color: var(--second-text-color);
        font-size: 12rem;
        margin-top: 4px;
      }
    }

    .right {
      display: flex;
      align-items: center;

      .l-button {
        margin-left: 8rem;
        border-radius: 2rem;
        background: rgb(58, 58, 67);
        font-size: 12rem;
        padding: 5rem 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 58rem;

        &:only-child {
          width: 70rem;
        }

        &.red {
          background: var(--primary-btn-color);
        }
      }

      img {
        height: 18rem;
        margin-left: 20rem;
      }
    }
  }

  .popover {
    z-index: 9;
    position: absolute;
    bottom: -100%;
    right: 10rem;
    border-radius: 8rem;
    background: var(--second-btn-color);

    .item {
      font-size: 14rem;
      padding: 0 40rem 0 10rem;
      display: flex;
      height: 40rem;
      align-items: center;
      border-bottom: 1px solid var(--line-color);

      &:nth-last-child(1) {
        border-bottom: none;
        color: var(--primary-btn-color);
      }

      img {
        margin-right: 10rem;
        height: 20rem;
      }
    }

    .arrow {
      width: 0;
      height: 0;
      border: 7rem solid transparent;
      border-bottom: 7rem solid var(--second-btn-color);
      position: absolute;
      right: 10rem;
      top: -14rem;
    }
  }
}
</style>
