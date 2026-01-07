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
  return props.singer && props.singer.pic
})

/** 歌手姓名 */
const title = computed(() => {
  return props.singer && props.singer.name
})

onMounted(async () => {
  const result = await getSingerDetail(props.singer)
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
