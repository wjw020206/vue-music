<template>
  <div class="singer" v-loading="!singers.length">
    <IndexList :data="singers" @select="selectSinger" />
    <RouterView v-slot="{ Component }">
      <Transition appear name="slide">
        <component :is="Component" :data="selectedSinger" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup>
import { getSingerList } from '@/service/singer'
import { onMounted, ref } from 'vue'
import IndexList from '@/components/index-list/index.vue'
import { useRouter } from 'vue-router'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'

const router = useRouter()

const singers = ref([])

const selectedSinger = ref(null)

function selectSinger(singer) {
  selectedSinger.value = singer
  // 缓存歌手信息
  cacheSinger(singer)
  router.push({
    path: `/singer/${singer.mid}`,
  })
}

function cacheSinger(singer) {
  storage.session.set(SINGER_KEY, singer)
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
