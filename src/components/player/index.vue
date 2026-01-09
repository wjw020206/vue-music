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
      <div class="middle">
        <div class="middle-l">
          <div class="cd-wrapper">
            <div class="cd" ref="cdRef">
              <img
                class="image"
                :class="cdCls"
                :src="currentSong.pic"
                ref="cdImageRef"
              />
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{ playingLyric }}</div>
          </div>
        </div>
        <Scroll class="middle-r" ref="lyricScrollRef">
          <div class="lyric-wrapper">
            <div v-if="currentLyric" ref="lyricListRef">
              <p
                class="text"
                :class="{ current: currentLineNum === index }"
                v-for="(line, index) in currentLyric.lines"
                :key="line.num"
              >
                {{ line.txt }}
              </p>
            </div>
            <!-- 纯音乐无歌词的提示 -->
            <div class="pure-music" v-show="pureMusicLyric">
              <p>{{ pureMusicLyric }}</p>
            </div>
          </div>
        </Scroll>
      </div>
      <div class="bottom">
        <div class="progress-wrapper">
          <span class="time time-l">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar-wrapper">
            <ProgressBar
              :progress
              @progress-changing="onProgressChanging"
              @progress-changed="onProgressChanged"
            />
          </div>
          <span class="time time-r">{{
            formatTime(currentSong.duration)
          }}</span>
        </div>
        <div class="operators">
          <div class="icon i-left">
            <i :class="modeIcon" @click="changeMode" />
          </div>
          <div class="icon i-left" :class="disableCls">
            <i class="icon-prev" @click="prev" />
          </div>
          <div class="icon i-center" :class="disableCls">
            <i :class="playIcon" @click="togglePlay" />
          </div>
          <div class="icon i-right" :class="disableCls">
            <i class="icon-next" @click="next" />
          </div>
          <div class="icon i-right">
            <i
              :class="getFavoriteIcon(currentSong)"
              @click="toggleFavorite(currentSong)"
            />
          </div>
        </div>
      </div>
    </div>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    />
  </div>
</template>

<script setup>
import { computed, ref, useTemplateRef, watch } from 'vue'
import { useStore } from 'vuex'
import useMode from './use-mode'
import useFavorite from './use-favorite'
import ProgressBar from './progress-bar.vue'
import { formatTime } from '@/assets/js/util'
import { PLAY_MODE } from '@/assets/js/constant'
import useCd from './use-cd'
import useLyric from './use-lyric'
import Scroll from '@/components/base/scroll/index.vue'

/** 进度条是否正在拖动的标志位 */
let progressChanging = false

const audioRef = useTemplateRef('audioRef')

/** 歌曲是否准备好播放 */
const songReady = ref(false)
/** 当前歌曲已经播放的时长 */
const currentTime = ref(0)

/** 播放器是否全屏播放 */
const fullScreen = computed(() => store.state.fullScreen)
/** 当前播放的歌曲 */
const currentSong = computed(() => store.getters.currentSong)
/** 是否正在播放歌曲 */
const playing = computed(() => store.state.playing)
/** 根据正在播放状态切换对应状态的图标 */
const playIcon = computed(() => (playing.value ? 'icon-pause' : 'icon-play'))
/** 当前播放歌曲的下标 */
const currentIndex = computed(() => store.state.currentIndex)
/** 播放列表 */
const playList = computed(() => store.state.playList)
/** 根据歌曲准备状态显示对应的按钮是否可用状态 */
const disableCls = computed(() => (songReady.value ? '' : 'disable'))
/** 当前歌曲播放的进度 */
const progress = computed(() => currentTime.value / currentSong.value.duration)

const store = useStore()
const { modeIcon, changeMode, playMode } = useMode()
const { getFavoriteIcon, toggleFavorite } = useFavorite()
const { cdCls } = useCd()
const {
  currentLyric,
  currentLineNum,
  playLyric,
  stopLyric,
  pureMusicLyric,
  playingLyric,
} = useLyric({
  songReady,
  currentTime,
})

// 监听当前播放歌曲是否发生变化
watch(currentSong, (newSong) => {
  // 判断歌曲是否合法（没有 id 或者没有播放地址为不合法歌曲数据）
  if (!newSong.id || !newSong.url) return

  // 歌曲切换时已经播放的时间设为 0
  currentTime.value = 0
  // 歌曲切换时重置歌曲准备状态标识符
  songReady.value = false
  const audioEl = audioRef.value
  audioEl.src = newSong.url
  // 播放
  audioEl.play()
})
// 监听歌曲播放状态的变化
watch(playing, (newPlaying) => {
  // 判断当前歌曲是否已经准备好播放
  if (!songReady.value) return
  const audioEl = audioRef.value
  if (newPlaying) {
    // 播放歌曲
    audioEl.play()
    // 播放歌词
    playLyric()
  } else {
    // 暂停歌曲
    audioEl.pause()
    // 暂停歌词
    stopLyric()
  }
})

/** 隐藏播放器全屏播放 */
function goBack() {
  store.commit('setFullScreen', false)
}
/** 切换播放状态 */
function togglePlay() {
  // 判断当前歌曲是否已经准备好播放
  if (!songReady.value) return
  store.commit('setPlayingState', !playing.value)
}
/** audio 元素原生歌曲播放暂停事件 */
// 电脑待机或者睡眠等情况会触发（系统暂停而非用户手动暂停）
function pause() {
  store.commit('setPlayingState', false)
}
/** 切换上一首歌曲 */
function prev() {
  const list = playList.value

  // 判断播放列表是否为空以及判断当前歌曲是否已经准备好播放
  if (!songReady.value || !list.length) return

  // 判断播放列表中是否只有一首歌
  if (list.length === 1) {
    loop()
  } else {
    let index = currentIndex.value - 1

    // 判断是否是播放列表中第一首歌（index 为 0）
    if (index === -1) {
      index = list.length - 1
    }

    store.commit('setCurrentIndex', index)

    // 判断当前播放状态是否为暂停状态
    if (!playing.value) {
      store.commit('setPlayingState', true)
    }
  }
}
/** 切换下一首歌曲 */
function next() {
  const list = playList.value

  // 判断播放列表是否为空以及判断当前歌曲是否已经准备好播放
  if (!songReady.value || !list.length) return

  // 判断播放列表中是否只有一首歌
  if (list.length === 1) {
    loop()
  } else {
    let index = currentIndex.value + 1

    // 判断是否是播放列表中最后一首歌
    if (index === list.length) {
      index = 0
    }

    store.commit('setCurrentIndex', index)

    // 判断当前播放状态是否为暂停状态
    if (!playing.value) {
      store.commit('setPlayingState', true)
    }
  }
}
/** 循环播放正在播放的歌曲 */
function loop() {
  const audioEl = audioRef.value
  // 设置歌曲重头播放
  audioEl.currentTime = 0
  audioEl.play()
  store.commit('setPlayingState', true)
}
/** 歌曲缓冲准备好时回调 */
function ready() {
  // 如果歌曲已经准备好播放就不需要执行
  if (songReady.value) return
  songReady.value = true

  // 当歌曲准备好时，播放歌词
  playLyric()
}
/** 当歌曲播放出错时的回调 */
function error() {
  // 防止歌曲播放出错时无法切歌
  songReady.value = true
}
/** 歌曲播放时间更新回调 */
function updateTime(event) {
  // 当手指拖动进度条时不自动更新播放时间
  if (!progressChanging) {
    currentTime.value = event.target.currentTime
  }
}
/** 进度条正在拖动回调 */
function onProgressChanging(propgress) {
  progressChanging = true
  currentTime.value = currentSong.value.duration * propgress

  // 同步歌词位置
  // 播放歌词
  playLyric()
  // 暂停歌词播放
  stopLyric()
}
/** 进度条拖动结束回调 */
function onProgressChanged(propgress) {
  progressChanging = false
  audioRef.value.currentTime = currentTime.value =
    currentSong.value.duration * propgress

  // 判断是否暂停播放
  if (!playing.value) {
    // 如果暂停了，拖动进度条后让它播放
    store.commit('setPlayingState', true)
  }

  // 同步歌词位置
  // 播放歌词
  playLyric()
}
/** 歌曲播放结束回调 */
function end() {
  currentTime.value = 0

  // 判断是否是循环播放模式
  if (playMode.value === PLAY_MODE.loop) {
    loop()
  } else {
    next()
  }
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
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
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
