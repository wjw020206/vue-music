<template>
  <div class="m-tab">
    <RouterLink class="m-tab-item" v-for="tab in tabs" :key="tab.path">
      <span class="tab-link"> {{ tab.name }}</span>
    </RouterLink>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
