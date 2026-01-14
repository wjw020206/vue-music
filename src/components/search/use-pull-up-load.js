import BScroll from '@better-scroll/core'
import Pullup from '@better-scroll/pull-up'
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'

BScroll.use(Pullup)
BScroll.use(ObserveDOM)

/** 上拉加载相关逻辑 */
export default function usePullUpLoad(requestData, preventPullUpLoad) {
  const rootRef = useTemplateRef('rootRef')

  const scroll = ref(null)
  /** 是否正在上拉获取数据 */
  const isPullUpLoad = ref(false)

  onMounted(() => {
    const scrollVal = (scroll.value = new BScroll(rootRef.value, {
      pullUpLoad: true,
      observeDOM: true,
      click: true,
    }))

    scrollVal.on('pullingUp', pullingUpHandler)

    /** 上拉回调 */
    async function pullingUpHandler() {
      // 避免在页面加载时触发再次触发上拉加载
      if (preventPullUpLoad.value) {
        scrollVal.finishPullUp()
        return
      }

      isPullUpLoad.value = true
      await requestData()
      scrollVal.finishPullUp()
      scrollVal.refresh()
      isPullUpLoad.value = false
    }
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })

  return {
    isPullUpLoad,
    scroll,
  }
}
