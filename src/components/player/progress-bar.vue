<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" :style="progressStyle" />
      <div class="progress-btn-wrapper" :style="btnStyle">
        <div class="progress-btn" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, useTemplateRef, watch } from 'vue'

/** 进度条按钮宽度 */
const progressBtnWidth = 16

const props = defineProps({
  /** 进度 (0 ~ 1) 的数字 */
  progress: {
    type: Number,
    default: 0,
  },
})

const progressBar = useTemplateRef('progressBar')

/** 偏移量 */
const offset = ref(0)

// 监听进度变化
watch(
  () => props.progress,
  (newProgress) => {
    const barWidth = progressBar.value.clientWidth - progressBtnWidth
    offset.value = barWidth * newProgress
  },
)

const progressStyle = computed(() => `width: ${offset.value}px`)
const btnStyle = computed(
  () => `transform: translate3d(${offset.value}px, 0, 0)`,
)
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
