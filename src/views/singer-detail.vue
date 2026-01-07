<template>
  <div class="singer-detail">
    <MusicList :songs :pic :title :loading />
  </div>
</template>

<script setup>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import MusicList from '@/components/music-list/index.vue'
import { computed, onMounted, ref } from 'vue'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const props = defineProps({
  singer: {
    type: Object,
  },
})

/** 歌曲列表 */
const songs = ref([])
/** 是否加载完成 */
const loading = ref(true)

/** 歌手封面 */
const pic = computed(() => {
  const singer = computedSinger.value
  return singer && singer.pic
})

/** 歌手姓名 */
const title = computed(() => {
  const singer = computedSinger.value
  return singer && singer.name
})

/** 歌手详情数据（自动判断是从 props 还是 session 获取） */
const computedSinger = computed(() => {
  let result = null
  const singer = props.singer

  // 判断是否是 props 传递的 singer
  if (singer) {
    result = singer
  } else {
    const cacheSinger = storage.session.get(SINGER_KEY)
    if (cacheSinger && cacheSinger.mid === route.params.id) {
      result = cacheSinger
    }
  }

  return result
})

onMounted(async () => {
  const singer = computedSinger.value

  if (!singer) {
    const path = route.matched[0].path
    router.push(path)
    return
  }

  const result = await getSingerDetail(singer)
  songs.value = await processSongs(result.songs)
  loading.value = false
})
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
