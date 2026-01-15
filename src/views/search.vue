<template>
  <div class="search">
    <div class="search-input-wrapper">
      <SearchInput v-model="query" />
    </div>
    <Scroll ref="scrollRef" class="search-content" v-show="!query">
      <div>
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              class="item"
              v-for="item in hotKeys"
              :key="item.id"
              @click="addQuery(item.key)"
            >
              <span>{{ item.key }}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear" />
            </span>
          </h1>
          <Confirm
            ref="confirmRef"
            text="是否清空所有搜索历史"
            confirm-btn-text="清空"
            @confirm="clearSearch"
          />
          <SearchList
            :searches="searchHistory"
            @select="addQuery"
            @delete="deleteSearch"
          />
        </div>
      </div>
    </Scroll>
    <div class="search-result" v-show="query">
      <Suggest :query @select-song="selectSong" @select-singer="selectSinger" />
    </div>
    <!-- 在路由组件上实现过渡动画 -->
    <RouterView v-slot="{ Component }">
      <Transition appear name="slide">
        <Component :is="Component" :data="selectedSinger" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup>
import SearchInput from '@/components/search/index.vue'
import Suggest from '@/components/search/suggest.vue'
import SearchList from '@/components/base/search-list/index.vue'
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'
import { getHotKeys } from '@/service/search'
import { useStore } from 'vuex'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
import { useRouter } from 'vue-router'
import useSearchHistory from '@/components/search/use-search-history'
import Scroll from '@/components/wrap-scroll'
import Confirm from '@/components/base/confirm/index.vue'

const store = useStore()
const router = useRouter()
const { saveSearch, deleteSearch, clearSearch } = useSearchHistory()

const scrollRef = useTemplateRef('scrollRef')
const confirmRef = useTemplateRef('confirmRef')

/** 搜索关键词 */
const query = ref('')
/** 热门关键词 */
const hotKeys = ref([])
/** 选择的歌手 */
const selectedSinger = ref(null)

/** 搜索历史记录 */
const searchHistory = computed(() => store.state.searchHistory)

onMounted(async () => {
  const result = await getHotKeys()
  hotKeys.value = result.hotKeys
})

// 监听关键词变化
watch(query, async (newQuery) => {
  // 当关键词为空时，显示搜索结果列表，此时调用 Scroll 的 refresh 方法重新计算
  if (!newQuery) {
    await nextTick()
    refreshScroll()
  }
})

function refreshScroll() {
  scrollRef.value.scroll.refresh()
}
function addQuery(value) {
  query.value = value
}
function selectSong(song) {
  saveSearch(query.value)
  store.dispatch('addSong', song)
}
function selectSinger(singer) {
  saveSearch(query.value)
  selectedSinger.value = singer
  cacheSinger(singer)
  router.push({
    path: `/search/${singer.mid}`,
  })
}
/** 缓存选择的歌手详情数据 */
function cacheSinger(singer) {
  storage.session.set(SINGER_KEY, singer)
}
/** 显示清空搜索历史确认弹窗 */
function showConfirm() {
  confirmRef.value.show()
}
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-l;
        .text {
          flex: 1;
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
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
