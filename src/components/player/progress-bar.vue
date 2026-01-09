<template>
  <div class="progress-bar" ref="progressBar" @click="onClick">
    <div class="bar-inner">
      <div class="progress" :style="progressStyle" ref="progressRef" />
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, useTemplateRef, watch } from 'vue'

/** 进度条按钮宽度 */
const progressBtnWidth = 16
/** 进度条按钮滑动共享数据对象 */
let touch = {}

const props = defineProps({
  /** 进度 (0 ~ 1) 的数字 */
  progress: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['progress-changing', 'progress-changed'])

const progressBar = useTemplateRef('progressBar')
const progressRef = useTemplateRef('progressRef')

/** 偏移量 */
const offset = ref(0)

// 监听进度变化
watch(
  () => props.progress,
  (newProgress) => {
    setOffset(newProgress)
  },
)

const progressStyle = computed(() => `width: ${offset.value}px`)
const btnStyle = computed(
  () => `transform: translate3d(${offset.value}px, 0, 0)`,
)

function onTouchStart(event) {
  // 记录起始的位置
  touch.x1 = event.touches[0].pageX
  // 记录已经播放进度条的初始宽度
  touch.beginWidth = progressRef.value.clientWidth
}
function onTouchMove(event) {
  // 计算与起始位置偏移量
  const delta = event.touches[0].pageX - touch.x1
  // 计算新的已经播放进度条的宽度
  const tempWidth = touch.beginWidth + delta
  const barWidth = progressBar.value.clientWidth - progressBtnWidth
  // 计算进度并限制进度在 0 ~ 1 之间
  const progress = Math.min(Math.max(tempWidth / barWidth, 0), 1)
  // 通知外部组件新的进度
  emit('progress-changing', progress)
}
function onTouchEnd() {
  const barWidth = progressBar.value.clientWidth - progressBtnWidth
  // 计算进度
  const progress = progressRef.value.clientWidth / barWidth
  emit('progress-changed', progress)
  touch = {}
}
/** 点击进度条 */
function onClick(event) {
  const rect = progressBar.value.getBoundingClientRect()
  const offsetWidth = event.pageX - rect.left
  const barWidth = progressBar.value.clientWidth - progressBtnWidth
  // 计算进度
  const progress = offsetWidth / barWidth
  emit('progress-changed', progress)
}
/** 设置偏移量 */
function setOffset(progress) {
  const barWidth = progressBar.value.clientWidth - progressBtnWidth
  offset.value = barWidth * progress
}

defineExpose({
  setOffset,
})
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
