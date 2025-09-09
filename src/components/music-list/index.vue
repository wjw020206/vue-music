<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImageRef">
      <div class="filter" :style="filterStyle"></div>
    </div>
    <Scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      v-no-result:[noResultText]="noResult"
      :probe-type="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <SongList :songs="songs" />
      </div>
    </Scroll>
  </div>
</template>

<script setup>
import Scroll from '@/components/base/scroll/index.vue'
import SongList from '@/components/base/song-list/index.vue'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const RESERVED_HEIGHT = 40

const props = defineProps({
  songs: {
    type: Array,
    default: () => [],
  },
  title: String,
  pic: String,
  loading: Boolean,
  noResultText: {
    type: String,
    default: '抱歉，没有找到可播放的歌曲',
  },
})

const router = useRouter()

function goBack() {
  router.back()
}

const scrollY = ref(0)

/** 最大可以滚动的距离 */
const maxTranslateY = ref(0)

function onScroll({ y }) {
  scrollY.value = -y
}

const imageHeight = ref(0)

const bgImageStyle = computed(() => {
  let zIndex = 0
  let paddingTop = '70%'
  let height = 0
  // 兼容 iPhone，解决 z-index 层级无法覆盖的问题
  let translateZ = 0

  if (scrollY.value > maxTranslateY.value) {
    zIndex = 10
    paddingTop = 0
    height = `${RESERVED_HEIGHT}px`
    translateZ = 1
  }

  let scale = 1

  if (scrollY.value < 0) {
    scale = 1 + Math.abs(scrollY.value / imageHeight.value)
  }

  return {
    zIndex,
    paddingTop,
    height,
    backgroundImage: `url(${props.pic})`,
    transform: `scale(${scale})translateZ(${translateZ}px)`,
  }
})

const scrollStyle = computed(() => {
  return {
    top: `${imageHeight.value}px`,
  }
})

const filterStyle = computed(() => {
  let blur = 0
  const scrollYValue = scrollY.value
  const imageHeightValue = imageHeight.value

  if (scrollYValue >= 0) {
    blur =
      Math.min(
        scrollYValue / imageHeightValue,
        maxTranslateY.value / imageHeightValue
      ) * 20
  }

  return {
    backdropFilter: `blur(${blur}px)`,
  }
})

const noResult = computed(() => {
  return !props.loading && !props.songs.length
})

const bgImageRef = ref(null)

onMounted(() => {
  imageHeight.value = bgImageRef.value.clientHeight
  maxTranslateY.value = imageHeight.value - RESERVED_HEIGHT
})
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
