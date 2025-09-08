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
  probeType: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['scroll'])

const rootRef = ref(null)
const scroll = useScroll(rootRef, props, emit)

defineExpose({
  scroll,
})
</script>

<style lang="scss" scoped></style>
