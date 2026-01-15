<template>
  <Header />
  <Tab />
  <RouterView :style="viewStyle"></RouterView>
  <!-- https://router.vuejs.org/zh/guide/essentials/named-views.html -->
  <!-- 命名视图 -->
  <RouterView v-slot="{ Component }" name="user">
    <Transition appear name="slide">
      <Component :is="Component" :style="viewStyle" />
    </Transition>
  </RouterView>
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
