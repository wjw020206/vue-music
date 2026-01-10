<template>
  <Teleport to="body">
    <Transition name="list-fade">
      <div class="playlist" v-show="visible && playlist.length" @click="hide">
        <div class="list-wrapper">
          <div class="list-header">
            <!-- 播放模式 -->
            <h1 class="title">
              <i class="icon" :class="modeIcon" @click.stop="changeMode" />
              <span class="text">{{ modeText }}</span>
            </h1>
          </div>
          <Scroll class="list-content" ref="scrollRef">
            <ul>
              <li class="item" v-for="song in sequenceList" :key="song.id">
                <i class="current" :class="getCurrentIcon(song)" />
                <span class="text">{{ song.name }}</span>
                <!-- 收藏按钮 -->
                <span class="favorite">
                  <i
                    :class="getFavoriteIcon(song)"
                    @click.stop="toggleFavorite"
                  />
                </span>
              </li>
            </ul>
          </Scroll>
          <div class="list-footer" @click.stop="hide">
            <span>关闭</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import Scroll from '@/components/base/scroll/index.vue'
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import { useStore } from 'vuex'
import useMode from './use-mode'
import useFavorite from './use-favorite'

const scrollRef = useTemplateRef('scrollRef')

/** 播放列表的显示状态 */
const visible = ref(false)

const store = useStore()
const { modeIcon, changeMode, modeText } = useMode()
const { getFavoriteIcon, toggleFavorite } = useFavorite()

const playlist = computed(() => store.state.playlist)
const sequenceList = computed(() => store.state.sequenceList)
const currentSong = computed(() => store.getters.currentSong)

/** 显示播放列表 */
async function show() {
  visible.value = true
  await nextTick()
  refreshScroll()
}
/** 隐藏播放列表 */
function hide() {
  visible.value = false
}
// 判断歌曲列表中当前正在播放的歌曲
function getCurrentIcon(song) {
  if (song.id === currentSong.value.id) {
    return 'icon-play'
  }
}
/** 重新计算滚动列表 */
function refreshScroll() {
  scrollRef.value.scroll.refresh()
}

defineExpose({
  hide,
  show,
})
</script>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter-from,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
      }
    }
    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
