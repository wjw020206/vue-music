<template>
  <Transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="showNormalPlayer">
      <div class="cd-wrapper">
        <div class="cd" ref="cdRef">
          <img
            width="40"
            height="40"
            :src="currentSong.pic"
            :class="cdCls"
            ref="cdImageRef"
          />
        </div>
      </div>
      <div class="slider-wrapper" ref="sliderWrapperRef">
        <div class="slider-group">
          <div class="slider-page" v-for="song in playlist" :key="song.id">
            <h2 class="name">{{ song.name }}</h2>
            <p class="desc">{{ song.singer }}</p>
          </div>
        </div>
      </div>
      <div class="control">
        <!-- 播放暂停按钮 -->
        <ProgressCircle :radius="32" :progress>
          <i class="icon-mini" :class="miniPlayIcon" @click.stop="togglePlay" />
        </ProgressCircle>
      </div>
      <div class="control" @click.stop="showPlaylist">
        <i class="icon-playlist" />
      </div>
      <Playlist ref="playlistRef" />
    </div>
  </Transition>
</template>

<script setup>
import { computed, useTemplateRef } from 'vue'
import { useStore } from 'vuex'
import useCd from './use-cd'
import ProgressCircle from './progress-circle.vue'
import useMiniSlider from './use-mini-slider'
import Playlist from './playlist.vue'

defineProps({
  progress: {
    type: Number,
    default: 0,
  },
  togglePlay: Function,
})

const playlistRef = useTemplateRef('playlistRef')

const store = useStore()
const { cdCls } = useCd()
useMiniSlider()

const currentSong = computed(() => store.getters.currentSong)
const fullScreen = computed(() => store.state.fullScreen)
const playing = computed(() => store.state.playing)
const miniPlayIcon = computed(() => {
  return playing.value ? 'icon-pause-mini' : 'icon-play-mini'
})
const playlist = computed(() => store.state.playlist)

/** 显示全屏播放组件 */
function showNormalPlayer() {
  store.commit('setFullScreen', true)
}
/** 显示播放列表 */
function showPlaylist() {
  playlistRef.value.show()
}
</script>

<style lang="scss" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;
  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .cd {
      height: 100%;
      width: 100%;
      img {
        border-radius: 50%;
        &.playing {
          animation: rotate 20s linear infinite;
        }
      }
    }
  }
  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        .name {
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: $color-theme-d;
    }
    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 32px;
    }
  }
  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from,
  &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}
</style>
