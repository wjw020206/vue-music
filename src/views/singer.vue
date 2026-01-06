<template>
  <div class="singer" v-loading="!singers.length">
    <IndexList :data="singers" />
  </div>
</template>

<script setup>
import IndexList from '@/components/base/index-list/index.vue'
import { getSingerList } from '@/service/singer'
import { onMounted, ref } from 'vue'

/** 歌手列表数据 */
const singers = ref([])

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
