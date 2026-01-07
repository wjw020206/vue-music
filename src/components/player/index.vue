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
      <div class="bottom">
        <div class="operators">
          <div class="icon i-left">
            <i class="icon-sequence" />
          </div>
          <div class="icon i-left">
            <i class="icon-prev" />
          </div>
          <div @click="togglePlay" class="icon i-center">
            <i :class="playIcon" />
          </div>
          <div class="icon i-right">
            <i class="icon-next" />
          </div>
          <div class="icon i-right">
            <i class="icon-not-favorite" />
          </div>
        </div>
      </div>
    </div>
    <audio ref="audioRef" @pause="pause" />
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

/** 是否正在播放歌曲 */
const playing = computed(() => {
  return store.state.playing
})

const playIcon = computed(() => {
  return playing.value ? 'icon-pause' : 'icon-play'
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

// 监听歌曲播放状态的变化
watch(playing, (newPlaying) => {
  const audioEl = audioRef.value
  newPlaying ? audioEl.play() : audioEl.pause()
})

/** 隐藏播放器全屏播放 */
function goBack() {
  store.commit('setFullScreen', false)
}

/** 切换播放状态 */
function togglePlay() {
  store.commit('setPlayingState', !playing.value)
}

/** audio 元素原生歌曲播放暂停事件 */
// 电脑待机或者睡眠等情况会触发（系统暂停而非用户手动暂停）
function pause() {
  store.commit('setPlayingState', false)
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
