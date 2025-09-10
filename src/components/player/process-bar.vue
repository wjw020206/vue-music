<template>
  <div class="progress-bar" ref="progressBarRef" @click="onClick">
    <div class="bar-inner">
      <div class="progress" ref="progressRef" :style="progressStyle"></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const progressBtnWidth = 16

const props = defineProps({
  progress: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['progress-changing', 'progress-changed'])

const offset = ref(0)
const progressBarRef = ref(null)
const progressRef = ref(null)
let touch = {}

watch(
  () => props.progress,
  (newProgress) => {
    const barWidth = progressBarRef.value.clientWidth - progressBtnWidth
    offset.value = barWidth * newProgress
  }
)

const progressStyle = computed(() => {
  return `width: ${offset.value}px`
})

const btnStyle = computed(() => {
  return `transform: translate3d(${offset.value}px, 0, 0)`
})

function onTouchStart(event) {
  touch.x1 = event.touches[0].pageX
  touch.beginWidth = progressRef.value.clientWidth
}

function onTouchMove(event) {
  const delta = event.touches[0].pageX - touch.x1
  const tempWidth = touch.beginWidth + delta
  const barWidth = progressBarRef.value.clientWidth - progressBtnWidth
  // 限制进度的值在 0~1 之间
  const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))
  offset.value = barWidth * progress
  emit('progress-changing', progress)
}

function onTouchEnd() {
  touch = {}
  const barWidth = progressBarRef.value.clientWidth - progressBtnWidth
  const progress = progressRef.value.clientWidth / barWidth
  emit('progress-changed', progress)
}

function onClick(event) {
  const rect = progressBarRef.value.getBoundingClientRect()
  const offsetWidth = event.pageX - rect.left
  const barWidth = progressBarRef.value.clientWidth - progressBtnWidth
  const progress = offsetWidth / barWidth
  emit('progress-changed', progress)
}
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
