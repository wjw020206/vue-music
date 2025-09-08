<template>
  <div class="recommend">
    <div class="slider-wrapper">
      <div class="slider-content">
        <Slider v-if="sliders.length" :sliders="sliders" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { getRecommend } from '@/service/recommend'
import { onMounted, ref } from 'vue'
import Slider from '@/components/base/slider/index.vue'

const sliders = ref([])

onMounted(async () => {
  const result = await getRecommend()
  sliders.value = result.sliders
})
</script>

<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: scroll;
  .slider-wrapper {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 40%;
    overflow: hidden;
    .slider-content {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
