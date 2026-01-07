<template>
  <div class="singer" v-loading="!singers.length">
    <IndexList :data="singers" @select="selectSinger" />
    <RouterView :singer="selectedSinger" />
  </div>
</template>

<script setup>
import IndexList from '@/components/base/index-list/index.vue'
import { getSingerList } from '@/service/singer'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/** 歌手列表数据 */
const singers = ref([])
/** 当前查看的歌手详情数据 */
const selectedSinger = ref(null)

/** 选择要查看的歌手详情 */
function selectSinger(singer) {
  selectedSinger.value = singer
  router.push({
    path: `/singer/${singer.mid}`,
  })
}

onMounted(async () => {
  const result = await getSingerList()
  singers.value = result.singers
})
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
