<template>
  <ul class="switches">
    <li
      class="switch-item"
      v-for="(item, index) in items"
      :key="item"
      :class="{ active: model === index }"
      @click="switchItem(index)"
    >
      <span>{{ item }}</span>
    </li>
    <div class="active-bar" :style="activeStyle" />
  </ul>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** 文案数组 */
  items: {
    type: Array,
    default: () => [],
  },
})

/** 选中项的下标 */
const model = defineModel({ type: Number, default: 0 })

const activeStyle = computed(() => {
  const x = 120 * model.value
  return {
    transform: `translate3d(${x}px, 0, 0)`,
  }
})

/** 选择切换 */
function switchItem(index) {
  model.value = index
}
</script>

<style lang="scss" scoped>
.switches {
  display: flex;
  position: relative;
  align-items: center;
  width: 240px;
  margin: 0 auto;
  border: 1px solid $color-highlight-background;
  border-radius: 5px;
  .switch-item {
    position: relative;
    z-index: 10;
    flex: 1;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: $font-size-medium;
    color: $color-text-d;
    &.active {
      color: $color-text;
    }
  }
  .active-bar {
    position: absolute;
    left: 0;
    top: 0;
    width: 120px;
    height: 30px;
    transition: transform 0.3s;
    border-radius: 5px;
    background: $color-highlight-background;
  }
}
</style>
