<template>
  <Header />
  <Tab />
  <RouterView :style="viewStyle" />
  <Player />
</template>

<script setup>
import Header from '@/components/header/index.vue'
import Tab from '@/components/tab/index.vue'
import Player from '@/components/player/index.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const playlist = computed(() => store.state.playlist)
const viewStyle = computed(() => {
  const bottom = playlist.value.length ? '60px' : '0'
  return {
    bottom,
  }
})
</script>

<style lang="scss" scoped></style>
