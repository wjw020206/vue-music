<template>
  <div class="singer" v-loading="!singers.length">
    <IndexList :data="singers" @select="selectSinger" />
    <!-- 在路由组件上实现过渡动画 -->
    <RouterView v-slot="{ Component }">
      <Transition appear name="slide">
        <Component :is="Component" :data="selectedSinger" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup>
import { SINGER_KEY } from '@/assets/js/constant'
import IndexList from '@/components/index-list/index.vue'
import { getSingerList } from '@/service/singer'
import storage from 'good-storage'
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
  cacheSinger(singer)
  router.push({
    path: `/singer/${singer.mid}`,
  })
}
/** 缓存选择的歌手详情数据 */
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
