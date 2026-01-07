<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back" />
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <div class="filter" />
    </div>
    <Scroll
      class="list"
      :probe-type="3"
      :style="scrollStyle"
      v-loading="loading"
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
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'

const RESERVED_HEIGHT = 40

const router = useRouter()

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
})

/** 封面图片高度 */
const imageHeight = ref(0)
/** Y 轴滚动的距离 */
const scrollY = ref(0)
/** 最大 Y 轴可滚动的距离 */
const maxTranslateY = ref(0)
/** 封面图片元素 */
const bgImage = useTemplateRef('bgImage')

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
  return {
    top: `${imageHeight.value}px`,
  }
})

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
