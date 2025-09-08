import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted, ref } from 'vue'

BScroll.use(ObserveDOM)

export default function useScroll(wrapperRef, options, emit) {
  const scroll = ref(null)

  onMounted(() => {
    const scrollValue = (scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true, // 监听 DOM 变化来计算滚动高度
      ...options,
    }))

    if (options.probeType > 0) {
      scrollValue.on('scroll', (postion) => {
        emit('scroll', postion)
      })
    }
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })

  return scroll
}
