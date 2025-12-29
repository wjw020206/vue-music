<template>
  <div class="recommend">
    <div class="slider-wrapper">
      <div class="slider-content">
        <!-- 当有轮播图数据时，才渲染（BetterScroll要求渲染时至少有一条数据） -->
        <Slider v-if="sliders.length" :sliders="sliders" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { getRecommend } from '@/service/recommend'
import { onMounted } from 'vue'
import Slider from '@/components/base/slider/index.vue'
import { ref } from 'vue'

/** 轮播图数据 */
const sliders = ref([])

onMounted(async () => {
  const result = await getRecommend()
  sliders.value = result.sliders
  console.log(result)
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
