<template>
  <div class="player">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.pic" />
      </div>
      <div class="top">
        <div class="back" @click="goBack">
          <i class="icon-back" />
        </div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.singer }}</h2>
      </div>
    </div>
    <audio ref="audioRef" />
  </div>
</template>

<script setup>
import { computed, useTemplateRef, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const audioRef = useTemplateRef('audioRef')

/** 播放器是否全屏播放 */
const fullScreen = computed(() => {
  return store.state.fullScreen
})

/** 当前播放的歌曲 */
const currentSong = computed(() => {
  return store.getters.currentSong
})

// 监听当前播放歌曲是否发生变化
watch(currentSong, (newSong) => {
  // 判断歌曲是否合法（没有 id 或者没有播放地址为不合法歌曲数据）
  if (!newSong.id || !newSong.url) return

  const audioEl = audioRef.value
  audioEl.src = newSong.url
  // 播放
  audioEl.play()
})

/** 隐藏播放器全屏播放 */
function goBack() {
  store.commit('setFullScreen', false)
}
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
  }
}
</style>
