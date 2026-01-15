<template>
  <Teleport to="body">
    <Transition name="slide">
      <div class="add-song" v-show="visible">
        <div class="header">
          <h1 class="title">添加歌曲到列表</h1>
          <div class="close" @click="hide">
            <i class="icon-close" />
          </div>
        </div>
        <div class="search-input-wrapper">
          <SearchInput v-model="query" placeholder="搜索歌曲" />
        </div>
        <div v-show="!query">
          <Switches :items="['最近播放', '搜索历史']" v-model="currentIndex" />
        </div>
        <div class="list-wrapper">
          <Scroll class="list-scroll" v-if="currentIndex === 0">
            <div class="list-inner">
              <SongList :songs="playHistory" />
            </div>
          </Scroll>
          <Scroll class="list-scroll" v-if="currentIndex === 1">
            <div class="list-inner">
              <SearchList :searches="searchHistory" :show-delete="false" />
            </div>
          </Scroll>
        </div>
        <div class="search-result" v-show="query">
          <Suggest :query="query" :show-singer="false" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import SearchInput from '@/components/search/search-input.vue'
import Suggest from '@/components/search/suggest.vue'
import Switches from '@/components/base/switches/index.vue'
import Scroll from '@/components/base/scroll/index.vue'
import SongList from '@/components/base/song-list/index.vue'
import SearchList from '@/components/base/search-list/index.vue'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

/** 是否显示添加歌曲进播放列表弹窗 */
const visible = ref(false)
/** 搜索关键字 */
const query = ref('')
/** 当前切换项的下标 */
const currentIndex = ref(0)

/** 搜索历史记录 */
const searchHistory = computed(() => store.state.searchHistory)
/** 播放历史记录 */
const playHistory = computed(() => store.state.playHistory)

/** 显示 */
function show() {
  visible.value = true
}
/** 隐藏 */
function hide() {
  visible.value = false
}

defineExpose({
  show,
  hide,
})
</script>

<style lang="scss" scoped>
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 300;
  background: $color-background;
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .close {
      position: absolute;
      top: 0;
      right: 8px;
      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }
  .search-input-wrapper {
    margin: 20px;
  }
  .list-wrapper {
    position: absolute;
    top: 165px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
      }
    }
  }
  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
}
</style>
