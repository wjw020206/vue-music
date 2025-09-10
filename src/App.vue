<template>
  <MHeader />
  <Tab />
  <RouterView />
  <Player />
</template>

<script setup>
import MHeader from '@/components/m-header/index.vue'
import Tab from '@/components/tab/index.vue'
import Player from '@/components/player/index.vue'
</script>

<style lang="scss" scoped></style>
