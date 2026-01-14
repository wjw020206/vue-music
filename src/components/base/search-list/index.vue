<template>
  <div class="search-list">
    <TransitionGroup name="list" tag="ul">
      <li
        v-for="item in searches"
        :key="item"
        class="search-item"
        @click="selectItem(item)"
      >
        <span class="text">{{ item }}</span>
        <span class="icon" @click.stop="deleteItem(item)">
          <i class="icon-delete" />
        </span>
      </li>
    </TransitionGroup>
  </div>
</template>

<script setup>
defineProps({
  /** 搜索历史记录 */
  searches: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['select', 'delete'])

/** 选择历史记录 */
function selectItem(item) {
  emit('select', item)
}
/** 删除历史记录 */
function deleteItem(item) {
  emit('delete', item)
}
</script>

<style lang="scss" scoped>
.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;
    .text {
      flex: 1;
      color: $color-text-l;
    }
    .icon {
      @include extend-click();
      .icon-delete {
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
  }
}
</style>
