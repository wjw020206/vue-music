<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back" />
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div class="play-btn" v-show="songs.length > 0" @click="random">
          <i class="icon-play" />
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle" />
    </div>
    <Scroll
      class="list"
      :probe-type="3"
      :style="scrollStyle"
      v-loading="loading"
      v-no-result:[noResultText]="noResult"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <SongList :songs="songs" @select="selectItem" />
      </div>
    </Scroll>
  </div>
</template>

<script setup>
import Scroll from '@/components/wrap-scroll'
import SongList from '@/components/base/song-list/index.vue'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const RESERVED_HEIGHT = 40

const props = defineProps({
  /** 歌曲列表 */
  songs: {
    type: Array,
    default: () => [],
  },
  /** 页面标题 */
  title: String,
  /** 封面 */
  pic: String,
  /** 是否加载完成 */
  loading: Boolean,
  /** 无数据时的提示文本 */
  noResultText: {
    type: String,
    default: '抱歉，没有找到可播放的歌曲',
  },
})

const router = useRouter()
const store = useStore()

/** 封面图片元素 */
const bgImage = useTemplateRef('bgImage')

/** 封面图片高度 */
const imageHeight = ref(0)
/** Y 轴滚动的距离 */
const scrollY = ref(0)
/** 最大 Y 轴可滚动的距离 */
const maxTranslateY = ref(0)

const bgImageStyle = computed(() => {
  const scrollYVal = scrollY.value
  let zIndex = 0
  let paddingTop = '70%'
  let height = 0
  let translateZ = 0

  if (scrollYVal > maxTranslateY.value) {
    zIndex = 10
    paddingTop = 0
    height = `${RESERVED_HEIGHT}px`
    translateZ = 1
  }

  let scale = 1

  if (scrollYVal < 0) {
    scale = 1 + Math.abs(scrollYVal / imageHeight.value)
  }

  return {
    height,
    paddingTop,
    zIndex,
    backgroundImage: `url(${props.pic})`,
    // 兼容 IOS，参考 https://www.zhangxinxu.com/wordpress/2016/08/safari-3d-transform-z-index/
    transform: `scale(${scale}) translateZ(${translateZ}px)`,
  }
})
const scrollStyle = computed(() => {
  // 判断是否显示了迷你播放器
  const bottom = playlist.value.length ? '60px' : '0'

  return {
    top: `${imageHeight.value}px`,
    bottom,
  }
})
const filterStyle = computed(() => {
  let blur = 0
  const scrollYVal = scrollY.value
  const imageHeightVal = imageHeight.value

  if (scrollYVal >= 0) {
    blur =
      Math.min(
        maxTranslateY.value / imageHeightVal,
        scrollYVal / imageHeightVal,
      ) * 20
  }

  return {
    backdropFilter: `blur(${blur}px)`,
  }
})
const noResult = computed(() => !props.loading && !props.songs.length)
const playBtnStyle = computed(() => {
  const scrollYVal = scrollY.value
  let display = ''

  if (scrollYVal >= maxTranslateY.value) {
    display = 'none'
  }

  return {
    display,
  }
})
const playlist = computed(() => store.state.playlist)

onMounted(() => {
  imageHeight.value = bgImage.value.clientHeight
  maxTranslateY.value = imageHeight.value - RESERVED_HEIGHT
})

function goBack() {
  router.back()
}
function onScroll(position) {
  scrollY.value = -position.y
}
/** 播放单首歌曲 */
function selectItem({ index }) {
  store.dispatch('selectPlay', {
    list: props.songs,
    index,
  })
}
/** 随机顺序播放所有歌曲 */
function random() {
  store.dispatch('randomPlay', props.songs)
}
</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
    padding-top: 70%;
    height: 0;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
