import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import { onMounted, onUnmounted, ref } from 'vue'

BScroll.use(Slide)

export default function useSlider(wrapperRef) {
  const slider = ref(null)
  // 轮播图当前页的下标
  const currentPageIndex = ref(0)

  onMounted(() => {
    const sliderInstance = (slider.value = new BScroll(wrapperRef.value, {
      click: true,
      scrollX: true,
      scrollY: false,
      momentum: false,
      bounce: false,
      probeType: 2,
      slide: true,
    }))

    sliderInstance.on('slideWillChange', ({ pageX }) => {
      currentPageIndex.value = pageX
    })
  })

  onUnmounted(() => {
    slider.value.destroy()
  })

  return {
    slider,
    currentPageIndex,
  }
}
