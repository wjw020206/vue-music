<template>
  <MHeader />
  <Tab />
  <RouterView :style="viewStyle" />
  <Player />
</template>

<script setup>
import MHeader from '@/components/m-header/index.vue'
import Tab from '@/components/tab/index.vue'
import Player from '@/components/player/index.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const playList = computed(() => store.state.playList)

const viewStyle = computed(() => {
  const bottom = playList.value.length ? '60px' : '0'

  return {
    bottom,
  }
})
</script>

<style lang="scss" scoped></style>
