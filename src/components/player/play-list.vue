<template>
  <Teleport to="body">
    <Transition name="list-fade">
      <div class="playlist" v-show="visible && playList.length" @click="hide">
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i class="icon" :class="modeIcon" @click="changeMode"></i>
              <span class="text">{{ modeText }}</span>
              <div class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </div>
            </h1>
          </div>
          <Scroll ref="scrollRef" class="list-content">
            <TransitionGroup ref="listRef" name="list" tag="ul">
              <li
                class="item"
                v-for="song in sequenceList"
                :key="song.id"
                @click="selectItem(song)"
              >
                <i class="current" :class="getCurrentIcon(song)"></i>
                <span class="text">{{ song.name }}</span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)"></i>
                </span>
                <span
                  class="delete"
                  @click.stop="removeSong(song)"
                  :class="{
                    disable: removing,
                  }"
                >
                  <i class="icon-delete"></i>
                </span>
              </li>
            </TransitionGroup>
          </Scroll>
          <div class="list-footer" @click="hide">
            <span>关闭</span>
          </div>
          <Confirm
            ref="confirmRef"
            text="是否清空播放列表"
            confirm-btn-text="清空"
            @confirm="confirmClear"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import Scroll from '@/components/base/scroll/index.vue'
import { computed, nextTick, ref, watch } from 'vue'
import { useStore } from 'vuex'
import useMode from './use-mode'
import useFavorite from './use-favorite'
import Confirm from '@/components/base/confirm/index.vue'

const visible = ref(false)
const removing = ref(false)
const scrollRef = ref(null)
const listRef = ref(null)
const confirmRef = ref(null)

const store = useStore()
const { modeIcon, changeMode, modeText } = useMode()
const { getFavoriteIcon, toggleFavorite } = useFavorite()

const playList = computed(() => store.state.playList)
const sequenceList = computed(() => store.state.sequenceList)
const currentSong = computed(() => store.getters.currentSong)

watch(currentSong, async (newSong) => {
  if (!visible.value || newSong.id) {
    return
  }

  await nextTick()
  scrollToCurrent()
})

/** 隐藏 */
function hide() {
  visible.value = false
}

/** 选择要播放的歌曲 */
function selectItem(song) {
  const index = playList.value.findIndex((item) => {
    return item.id === song.id
  })

  store.commit('setCurrentIndex', index)
  store.commit('setPlayingState', true)
}

/** 显示 */
async function show() {
  visible.value = true

  await nextTick()
  refreshScroll()
  scrollToCurrent()
}

/** 获取当前正在播放歌前面的图标 */
function getCurrentIcon(song) {
  if (song.id === currentSong.value.id) {
    return 'icon-play'
  }
}

/** 刷新 BScroll 组件 */
function refreshScroll() {
  scrollRef.value.scroll.refresh()
}

/** 滚动到当前正在播放的歌曲 */
function scrollToCurrent() {
  const index = sequenceList.value.findIndex((song) => {
    return currentSong.value.id === song.id
  })

  if (index === -1) return

  const target = listRef.value.$el.children[index]

  scrollRef.value.scroll.scrollToElement(target, 300)
}

/** 移除播放列表中的指定歌曲 */
function removeSong(song) {
  if (removing.value) return

  removing.value = true
  store.dispatch('removeSong', song)
  if (!playList.value.length) {
    hide()
  }
  setTimeout(() => {
    removing.value = false
  }, 300)
}

/** 显示确认弹窗 */
function showConfirm() {
  confirmRef.value.show()
}

/** 清空歌曲 */
function confirmClear() {
  store.dispatch('clearSongList')
  hide()
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
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
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
        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
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
