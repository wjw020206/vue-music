<template>
  <Teleport to="body">
    <Transition name="slide-down">
      <div class="message" v-show="visible" @click="hide">
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  /** 消息显示时长 */
  delay: {
    type: Number,
    default: 2000,
  },
})

/** 是否显示消息弹窗 */
const visible = ref(false)
const timer = ref(null)

/** 显示 */
function show() {
  visible.value = true

  // 避免 show 方法调用多次创建多个定时器
  clearTimeout(timer.value)
  timer.value = setTimeout(() => {
    hide()
  }, props.delay)
}
/** 隐藏 */
function hide() {
  clearTimeout(timer.value)
  visible.value = false
}

defineExpose({
  show,
  hide,
})
</script>

<style lang="scss" scoped>
.message {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 400;
  background: $color-dialog-background;

  &.slide-down-enter-active,
  &.slide-down-leave-active {
    transition: all 0.3s;
  }

  &.slide-down-enter-from,
  &.slide-down-leave-to {
    transform: translate3d(0, -100%, 0);
  }
}
</style>
