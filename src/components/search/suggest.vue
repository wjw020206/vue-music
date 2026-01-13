<template>
  <div class="suggest" v-loading:[loadingText]="!singer && !songs.length">
    <ul class="suggest-list">
      <li class="suggest-item" v-if="singer">
        <div class="icon">
          <i class="icon-mine" />
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li class="suggest-item" v-for="song in songs" :key="song.id">
        <div class="icon">
          <i class="icon-music" />
        </div>
        <div class="name">
          <p class="text">{{ song.singer }}-{{ song.name }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { search } from '@/service/search'
import { processSongs } from '@/service/song'
import { ref, watch } from 'vue'

const loadingText = ''

const props = defineProps({
  /** 搜索关键词 */
  query: String,
  /** 是否显示歌手相关数据 */
  showSinger: {
    type: Boolean,
    default: true,
  },
})

/** 歌手信息 */
const singer = ref(null)
/** 歌手的歌曲列表 */
const songs = ref([])
/** 是否有更多数据（分页用） */
const hasMore = ref(true)
/** 分页页码 */
const page = ref(1)

watch(
  () => props.query,
  async (newQuery) => {
    // 判断搜索关键词是否为空
    if (!newQuery) return
    await searchFirst()
  },
)

/** 首次搜索 */
async function searchFirst() {
  // 重置数据和分页
  page.value = 1
  songs.value = []
  singer.value = null
  hasMore.value = true

  const result = await search(props.query, page.value, props.showSinger)
  songs.value = await processSongs(result.songs)
  singer.value = result.singer
  hasMore.value = result.hasMore
}
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^='icon-'] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
