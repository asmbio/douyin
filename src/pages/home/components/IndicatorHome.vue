<template>
  <div
    class="indicator-home"
    :class="{ isLight }"
    :style="{ paddingTop: statusbarHeight - 10 + 'px' }"
  >
    <div class="notice" :style="noticeStyle"><span>下拉刷新内容</span></div>
    <div class="toolbar" ref="toolbar" :style="toolbarStyle">
      <Icon
        icon="tabler:menu-deep"
        class="search"
        @click="$emit('showSlidebar')"
        style="transform: rotateY(180deg)"
      />
      <div class="tab-ctn">
        <div class="tabs" ref="tabs">
          <div
            v-for="(tab, i) in tabItems"
            :key="i"
            class="tab"
            :class="{ active: index === i }"
            @click.stop="change(i)"
          >
            <span>{{ tab.title }}</span>
            <img v-if="tab.icon" :src="tab.icon" class="tab-icon" />
          </div>
        </div>
        <div class="indicator" ref="indicator"></div>
      </div>
      <Icon
        v-hide="loading"
        icon="ion:search"
        class="search"
        @click="$router.push('/home/search')"
      />
    </div>
    <Loading :style="loadingStyle" class="loading" style="width: 40rem" :is-full-screen="false" />
  </div>
</template>
<script>
import Loading from '../../../components/Loading.vue'
import bus from '../../../utils/bus'
import { mapState } from 'pinia'
import { useBaseStore } from '@/store/pinia'
import { _css } from '@/utils/dom'
import liveIcon from '../../../assets/img/icon/live.webp'

export default {
  name: 'IndicatorHome',
  components: {
    Loading
  },
  props: {
    loading: {
      type: Boolean,
      default() {
        return false
      }
    },
    //用于和slidList绑定，因为一个页面可能有多个slidList，但只有一个indicator组件
    name: {
      type: String,
      default: () => ''
    },
    index: {
      type: Number,
      default: () => 0
    },
    isLight: {
      type: Boolean,
      default: () => false
    },
    // 配置的tabs，允许自定义tab项
    tabs: {
      type: Array,
      default: () => [
        // { title: '热点',index:0 },
        // { title: '长视频',index:1 },
        { title: '关注', icon: liveIcon },
        { title: '发现' },
        { title: '推荐' }
      ]
    }
  },
  setup() {
    const baseStore = useBaseStore()
    return { baseStore }
  },
  data() {
    return {
      indicatorRef: null,
      lefts: [],
      indicatorSpace: 0,
      type: 1,
      moveY: 0,
      tabItems: []
    }
  },
  computed: {
    ...mapState(useBaseStore, ['judgeValue', 'homeRefresh', 'statusbarHeight']),

    transform() {
      return `translate3d(0, ${this.moveY - this.judgeValue > this.homeRefresh ? this.homeRefresh : this.moveY - this.judgeValue}px, 0)`
    },
    toolbarStyle() {
      console.log('this.statusbarHeight', this.statusbarHeight)
      if (this.loading) {
        return {
          opacity: 1,
          'transition-duration': '300ms',
          transform: `translate3d(0, 0, 0)`
          //paddingTop: this.statusbarHeight + 'px'
        }
      }
      if (this.moveY) {
        return {
          opacity: 1 - (this.moveY - this.judgeValue) / (this.homeRefresh / 2),
          transform: this.transform
          //paddingTop: this.statusbarHeight + 'px'
        }
      }
      if (this.statusbarHeight) {
        return {
          opacity: 1,
          'transition-duration': '300ms',
          transform: `translate3d(0, 0, 0)`
          //paddingTop: this.statusbarHeight + 'px'
        }
      }
      return {
        opacity: 1,
        'transition-duration': '300ms',
        transform: `translate3d(0, 0, 0)`
        //paddingTop: this.statusbarHeight + 'px'
      }
    },
    noticeStyle() {
      if (this.loading) {
        return { opacity: 0 }
      }
      if (this.moveY) {
        return {
          opacity: (this.moveY - this.judgeValue) / (this.homeRefresh / 2) - 0.5,
          transform: this.transform
        }
      }
      return { opacity: 0 }
    },
    loadingStyle() {
      if (this.loading) {
        return { opacity: 1, 'transition-duration': '300ms' }
      }
      if (this.moveY) {
        return {
          opacity: (this.moveY - this.judgeValue) / (this.homeRefresh / 2) - 0.5,
          transform: this.transform
        }
      }
      return {}
    }
  },
  created() {
    this.tabItems = this.tabs
  },
  mounted() {
    this.initTabs()

    bus.on(this.name + '-moveX', this.move)
    bus.on(this.name + '-moveY', (e) => {
      this.moveY = e
    })
    bus.on(this.name + '-end', this.end)
  },
  unmounted() {
    bus.off(this.name + '-moveX', this.move)
    bus.off(this.name + '-moveY')
    bus.off(this.name + '-end', this.end)
  },
  watch: {
    tabs: {
      handler(newVal) {
        this.tabItems = newVal
        this.$nextTick(() => {
          this.initTabs()
        })
      },
      deep: true
    }
  },
  methods: {
    change(index) {
      this.$emit('update:index', index)
      _css(this.indicatorRef, 'transition-duration', `300ms`)
      _css(this.indicatorRef, 'left', this.lefts[index] + 'px')
    },
    initTabs() {
      this.lefts = []
      let tabs = this.$refs.tabs
      this.indicatorRef = this.$refs.indicator
      let indicatorWidth = _css(this.indicatorRef, 'width')
      for (let i = 0; i < tabs.children.length; i++) {
        let item = tabs.children[i]
        let tabWidth = _css(item, 'width')
        this.lefts.push(
          item.getBoundingClientRect().x -
            tabs.children[0].getBoundingClientRect().x +
            (tabWidth * 0.5 - indicatorWidth / 2)
        )
      }
      this.indicatorSpace = this.lefts[1] - this.lefts[0]
      _css(this.indicatorRef, 'transition-duration', `300ms`)
      _css(this.indicatorRef, 'left', this.lefts[this.index] + 'px')
    },
    move(e) {
      _css(this.indicatorRef, 'transition-duration', `0ms`)
      _css(
        this.indicatorRef,
        'left',
        this.lefts[this.index] - e / (this.baseStore.bodyWidth / this.indicatorSpace) + 'px'
      )
    },
    end(index) {
      this.moveY = 0
      _css(this.indicatorRef, 'transition-duration', `300ms`)
      _css(this.indicatorRef, 'left', this.lefts[index] + 'px')
      setTimeout(() => {
        _css(this.indicatorRef, 'transition-duration', `0ms`)
      }, 300)
    }
  }
}
</script>

<style scoped lang="less">
.indicator-home {
  position: absolute;
  font-size: 16rem;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  color: white;
  height: var(--home-header-height);
  transition: all 0.3s;
  font-weight: bold;

  .notice {
    opacity: 0;
    top: 30rem;
    position: absolute;
    width: 100vw;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .loading {
    opacity: 0;
    top: 7rem;
    right: 7rem;
    position: absolute;
  }

  .toolbar {
    z-index: 2;
    position: relative;
    color: white;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 15rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    //padding-top: var(--status-bar-height);
    // padding-top: env(safe-area-inset-top, 0px);    /* 新标准 */
    // padding-top: constant(safe-area-inset-top, 0px); /* 兼容旧版 iOS */
    .tab-ctn {
      width: 80%;
      position: relative;

      .tabs {
        display: flex;
        justify-content: space-between;

        .tab {
          transition: color 0.3s;
          color: rgba(white, 0.7);
          position: relative;
          font-size: 17rem;
          cursor: pointer;
          padding: 0 5rem;
          white-space: nowrap;
          flex: 1;
          text-align: center;

          .tab-icon {
            position: absolute;
            height: 15rem;
            margin-left: 4rem;
            top: -5rem;
          }

          &.active {
            color: white;
          }
        }
      }

      .indicator {
        //transition: left .3s;
        position: absolute;
        bottom: -6rem;
        height: 2.6rem;
        width: 26rem;
        //width: calc(100% / 5);
        background: #fff;
        border-radius: 5rem;
      }
    }

    .search {
      color: white;
      font-size: 24rem;
    }
  }

  .mask {
    top: 0;
    position: absolute;
    width: 100vw;
    height: calc(var(--vh, 1vh) * 100);
    background: #00000066;
  }
}
</style>
