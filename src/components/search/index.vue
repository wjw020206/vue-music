<template>
  <div class="search-input">
    <i class="icon-search" />
    <input class="input-inner" v-model="query" />
    <i class="icon-dismiss" v-show="query" @click="clear" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { debounce } from 'throttle-debounce'

const props = defineProps({
  modelValue: {
    type: String,
  },
})

const emit = defineEmits(['update:modelValue'])

const query = ref(props.modelValue)

watch(
  query,
  debounce(300, (newQuery) => {
    // 去除输入内容两边的空格
    emit('update:modelValue', newQuery.trim())
  }),
)

watch(
  () => props.modelValue,
  (newValue) => {
    query.value = newValue
  },
)

function clear() {
  query.value = ''
}
</script>

<style lang="scss" scoped>
.search-input {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 32px;
  background: $color-highlight-background;
  border-radius: 6px;
  .icon-search {
    font-size: 24px;
    color: $color-text-d;
  }
  .input-inner {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline: 0;
    &::placeholder {
      color: $color-text-d;
    }
  }
  .icon-dismiss {
    font-size: 16px;
    color: $color-text-d;
  }
}
</style>
