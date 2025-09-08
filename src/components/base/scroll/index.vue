<template>
  <div ref="rootRef"><slot /></div>
</template>

<script setup>
import useScroll from './use-scroll'
import { ref } from 'vue'

const props = defineProps({
  click: {
    type: Boolean,
    default: true,
  },
})

const rootRef = ref(null)
useScroll(rootRef, props)
</script>

<style lang="scss" scoped></style>
