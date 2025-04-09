<template>
  <div class="Share2Friend">
    <BaseHeader backMode="light" backImg="back" style="z-index: 7">
      <template v-slot:center>
        <span class="f16">我的群聊</span>
      </template>
      <template v-slot:right>
        <div></div>
      </template>
    </BaseHeader>
    <div class="content">
      <div class="list">
        <div
          class="local-row"
          :key="i"
          v-for="(item, i) of data.friends.all"
          @click="nav('/message/chat', { uid: item.uid })"
        >
          <img :src="_getavater(item)" alt="" />
          <div class="desc">
            <span class="name">{{
              item.displayname.length > 20
                ? item.displayname.substr(0, 20) + '...'
                : item.displayname
            }}</span>
            <span class="num">({{ item.followerCount }})</span>
          </div>
        </div>
      </div>
      <NoMore></NoMore>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { _getavater } from '@/utils'
import type { Userinfolist } from '@/api/gen/userinfo_pb'
import { getContacts } from '@/api/moguservice'
import { CONTACT_TAG } from '@/api/gen/moguervice_pb'
import { useNav } from '@/utils/hooks/useNav'

defineOptions({
  name: 'MyGroupChat'
})
const nav = useNav()
const router = useRouter()
const data = reactive({
  friends: {} as Userinfolist,
  recent: [],
  eachOther: [],
  selectFriends: []
})

onMounted(() => {
  getFriends()
})

function save() {
  if (!data.selectFriends.length) return
  router.back()
}

async function getFriends() {
  try {
    let res = await getContacts('', 100, CONTACT_TAG.MYGROUP)
    data.friends = res
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped lang="less">
@import '@/assets/less/index';

.Share2Friend {
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
  }

  .save-yes {
    color: var(--primary-btn-color);
  }

  .save-no {
    color: var(--disable-primary-btn-color);
  }

  .list {
    .local-row {
      display: flex;
      align-items: center;
      padding: 10rem 20rem;

      &:active {
        background: rgb(35, 41, 58);
      }

      .check {
        height: 22rem;
        width: 22rem;
        margin-right: 15rem;
      }

      img {
        height: 45rem;
        width: 45rem;
        border-radius: 50%;
        margin-right: 15rem;
      }

      .desc {
        .num {
          margin-left: 5rem;
          color: var(--second-text-color);
        }
      }
    }
  }
}
</style>
