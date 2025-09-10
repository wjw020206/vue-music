<template>
  <div class="player">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.pic" />
      </div>
      <div class="top">
        <div class="back" @click="goBack">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.singer }}</h2>
      </div>
      <div class="bottom">
        <div class="operators">
          <div class="icon i-left">
            <i :class="modeIcon" @click="changeMode"></i>
          </div>
          <div class="icon i-left" :class="disableCls">
            <i class="icon-prev" @click="prev"></i>
          </div>
          <div class="icon i-center" :class="disableCls">
            <i :class="playIcon" @click="togglePlay"></i>
          </div>
          <div class="icon i-right" :class="disableCls">
            <i @click="next" class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i
              :class="getFavoriteIcon(currentSong)"
              @click="toggleFavorite(currentSong)"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
    ></audio>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import useMode from './use-mode'
import useFavorite from './use-favorite'

const store = useStore()

const audioRef = ref(null)

const songReady = ref(false)

const fullScreen = computed(() => store.state.fullScreen)
const currentSong = computed(() => store.getters.currentSong)
const playing = computed(() => store.state.playing)
const playList = computed(() => store.state.playList)
const currentIndex = computed(() => store.state.currentIndex)

const { modeIcon, changeMode } = useMode()
const { getFavoriteIcon, toggleFavorite } = useFavorite()

const playIcon = computed(() => {
  return playing.value ? 'icon-pause' : 'icon-play'
})

const disableCls = computed(() => {
  return songReady.value ? '' : 'disable'
})

watch(playing, (newPlaying) => {
  // 如果歌曲没准备好，就不播放
  if (!songReady.value) {
    return
  }

  const audioEl = audioRef.value
  newPlaying ? audioEl.play() : audioEl.pause()
})

watch(currentSong, (newSong) => {
  if (!newSong.id || !newSong.url) {
    return
  }
  songReady.value = false
  const audioEl = audioRef.value
  audioEl.src = newSong.url
  audioEl.play()
})

function togglePlay() {
  const list = playList.value
  // 当播放列表中一首歌也没有或当前歌曲没准备好时不触发
  if (!songReady.value || !list.length) return

  store.commit('setPlayingState', !playing.value)
}

function pause() {
  store.commit('setPlayingState', false)
}

function prev() {
  const list = playList.value

  // 当播放列表中一首歌也没有或当前歌曲没准备好时不触发
  if (!songReady.value || !list.length) return

  // 当播放列表中只有一首歌时
  if (list.length === 1) {
    // 循环播放当前这首歌曲
    loop()
  } else {
    let index = currentIndex.value - 1

    // 当歌曲是第一首歌时，再上一首就是最后一首歌
    if (index === -1) {
      index = list.length - 1
    }

    store.commit('setCurrentIndex', index)

    // 如果当前播放状态是暂停的，需要切换时播放
    if (!playing.value) {
      store.commit('setPlayingState', true)
    }
  }
}

function next() {
  const list = playList.value

  // 当播放列表中一首歌也没有或当前歌曲没准备好时不触发
  if (!songReady.value || !list.length) return

  // 当播放列表中只有一首歌时
  if (list.length === 1) {
    // 循环播放当前这首歌曲
    loop()
  } else {
    let index = currentIndex.value + 1

    // 当歌曲最后一首歌时，再下一首就是第一首歌
    if (index === list.length) {
      index = 0
    }

    store.commit('setCurrentIndex', index)

    // 如果当前播放状态是暂停的，需要切换时播放
    if (!playing.value) {
      store.commit('setPlayingState', true)
    }
  }
}

function loop() {
  const audioEl = audioRef.value
  // 从头播放
  audioEl.currentTime = 0
  audioEl.play()
}

function ready() {
  // 如果歌曲数据已经准备好了，直接返回
  if (songReady.value) return
  songReady.value = true
}

function error() {
  // 处理当歌曲播放失败的时候依旧可以切换歌曲
  songReady.value = true
}

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

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
  }
}
</style>
