import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import { onActivated, onDeactivated, onUnmounted } from 'vue'
import { onMounted, ref } from 'vue'

BScroll.use(Slide)

export default function useSlider(wrapperRef) {
  /** 轮播图实例 */
  const slider = ref(null)
  /** 轮播图当前展示图片的下标 */
  const currentPageIndex = ref(0)

  onMounted(() => {
    const sliderVal = (slider.value = new BScroll(wrapperRef.value, {
      click: true,
      scrollX: true,
      scrollY: false,
      momentum: false, // 是否开启滚动动画
      bounce: false, // 是否开启滚动超边缘时的回弹动画
      probeType: 2, // 仅仅当手指按在滚动区域上，一直派发 scroll 事件
      slide: true, // 是否启用轮播图的默认配置
    }))

    sliderVal.on('slideWillChange', (page) => {
      currentPageIndex.value = page.pageX
    })
  })

  onUnmounted(() => {
    slider.value.destroy()
  })

  // 因为 KeepAlive 缓存
  // 组件首次挂载并且每次从缓存中被重新插入时触发
  onActivated(() => {
    slider.value.enable()
    slider.value.refresh()
  })

  // 从 DOM 上移除、进入缓存以及组件卸载时调用
  onDeactivated(() => {
    slider.value.disable()
  })

  return {
    slider,
    currentPageIndex,
  }
}
