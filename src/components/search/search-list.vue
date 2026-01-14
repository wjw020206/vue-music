<template>
  <div class="search-list">
    <TransitionGroup name="list" tag="ul">
      <li v-for="item in searches" :key="item" class="search-item">
        <span class="text">{{ item }}</span>
        <span class="icon">
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
