<template>
  <Teleport to="body">
    <Transition name="list-fade">
      <div class="playlist" v-show="visible && playlist.length" @click="hide">
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <!-- 播放模式 -->
            <h1 class="title">
              <i class="icon" :class="modeIcon" @click="changeMode" />
              <span class="text">{{ modeText }}</span>
            </h1>
          </div>
          <Scroll class="list-content" ref="scrollRef">
            <TransitionGroup name="list" tag="ul" ref="listRef">
              <li
                class="item"
                v-for="song in sequenceList"
                :key="song.id"
                @click="selectItem(song)"
              >
                <i class="current" :class="getCurrentIcon(song)" />
                <span class="text">{{ song.name }}</span>
                <!-- 收藏按钮 -->
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)" />
                </span>
                <span
                  class="delete"
                  @click.stop="removeSong(song)"
                  :class="{
                    disable: removing,
                  }"
                >
                  <i class="icon-delete" />
                </span>
              </li>
            </TransitionGroup>
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
const listRef = useTemplateRef('listRef')

/** 播放列表的显示状态 */
const visible = ref(false)
/** 删除歌曲中 */
const removing = ref(false)

const store = useStore()
const { modeIcon, changeMode, modeText } = useMode()
const { getFavoriteIcon, toggleFavorite } = useFavorite()

const playlist = computed(() => store.state.playlist)
const sequenceList = computed(() => store.state.sequenceList)
const currentSong = computed(() => store.getters.currentSong)

watch(currentSong, async (newSong) => {
  // 判断播放列表是否显示
  if (!visible.value || !newSong.id) return

  await nextTick()
  scrollToCurrent()
})

/** 显示播放列表 */
async function show() {
  visible.value = true
  await nextTick()
  refreshScroll()
  scrollToCurrent()
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
/** 滚动播放列表到当前播放的歌曲的位置 */
function scrollToCurrent() {
  // 查找当前播放歌曲在播放列表中的索引
  const index = sequenceList.value.findIndex((song) => {
    return currentSong.value.id === song.id
  })

  if (index === -1) return

  const target = listRef.value.$el.children[index]
  scrollRef.value.scroll.scrollToElement(target, 300)
}
/** 选择一首歌播放 */
function selectItem(song) {
  // 在播放列表中找到对应歌曲的下标
  const index = playlist.value.findIndex((item) => {
    return item.id === song.id
  })
  // 设置当前播放的歌曲下标并开始播放
  store.commit('setCurrentIndex', index)
  store.commit('setPlayingState', true)
}
/** 从播放列表中移除歌曲 */
function removeSong(song) {
  // 判断是否正在删除歌曲
  if (removing.value) return

  removing.value = true
  store.dispatch('removeSong', song)

  // 动画持续时间为 300ms，动画结束后调整状态
  setTimeout(() => {
    removing.value = false
  }, 300)
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
