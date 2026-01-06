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
  /** 是否可点击 */
  click: {
    type: Boolean,
    default: true,
  },
  /** 是否派发 scroll 事件 */
  // https://better-scroll.github.io/docs/zh-CN/guide/base-scroll-options.html#probetype
  probeType: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['scroll'])

const rootRef = useTemplateRef('rootRef')
const scroll = useScroll(rootRef, props, emit)

defineExpose({
  scroll,
})
</script>

<style lang="scss" scoped></style>
