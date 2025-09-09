<template>
  <div class="singer-detail">
    <MusicList :loading="loading" :pic="pic" :songs="songs" :title="title" />
  </div>
</template>

<script setup>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import { computed, onMounted, ref } from 'vue'
import MusicList from '@/components/music-list/index.vue'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const props = defineProps({
  singer: {
    type: Object,
  },
})

const songs = ref([])

const loading = ref(true)

const pic = computed(() => {
  const singer = computedSinger.value
  return singer && singer.pic
})

const title = computed(() => {
  const singer = computedSinger.value
  return singer && singer.name
})

const computedSinger = computed(() => {
  let result = null
  const singer = props.singer

  // 判断是否通过 props 传入歌手信息
  if (singer) {
    result = singer
  } else {
    // 如果没有传入则通过本地 session 缓存中查找
    const cachedSinger = storage.session.get(SINGER_KEY)

    if (cachedSinger && cachedSinger.mid === route.params.id) {
      result = cachedSinger
    }
  }

  return result
})

onMounted(async () => {
  if (!computedSinger.value) {
    const path = route.matched[0].path

    router.push({
      path,
    })
    return
  }
  const result = await getSingerDetail(computedSinger.value)
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
