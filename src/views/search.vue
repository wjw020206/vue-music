<template>
  <div class="search">
    <div class="search-input-wrapper">
      <SearchInput v-model="query" />
    </div>
  </div>
</template>

<script setup>
import SearchInput from '@/components/search/index.vue'
import { ref, watch } from 'vue'

const query = ref('')

watch(query, (newValue) => {
  console.log(newValue)
})
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
}
</style>
