<template>
  <Header />
  <Tab />
  <RouterView />
  <Player />
</template>

<script setup>
import Header from '@/components/header/index.vue'
import Tab from '@/components/tab/index.vue'
import Player from '@/components/player/index.vue'
</script>

<style lang="scss" scoped></style>
