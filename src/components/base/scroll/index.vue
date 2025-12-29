<template>
  <div ref="rootRef">
    <slot />
  </div>
</template>

<script setup>
import useScroll from './use-scroll'
import { useTemplateRef } from 'vue'

/** 滚动组件默认的配置项 */
const props = defineProps({
  click: {
    type: Boolean,
    default: true,
  },
})

const rootRef = useTemplateRef('rootRef')
useScroll(rootRef, props)
</script>

<style lang="scss" scoped></style>
