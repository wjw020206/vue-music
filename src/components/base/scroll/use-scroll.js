import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { onUnmounted, onMounted, ref, onActivated, onDeactivated } from 'vue'

BScroll.use(ObserveDOM)

export default function useScroll(wrapperRef, options, emit) {
  /** 滚动实例 */
  const scroll = ref(null)

  onMounted(() => {
    const scrollVal = (scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true, // 开启 observe-dom 插件（对 content 以及 content 子元素 DOM 改变的探测）
      ...options,
    }))

    if (options.probeType > 0) {
      scrollVal.on('scroll', (position) => {
        emit('scroll', position)
      })
    }
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })

  // 因为 KeepAlive 缓存
  // 组件首次挂载并且每次从缓存中被重新插入时触发
  onActivated(() => {
    scroll.value.enable()
    scroll.value.refresh()
  })

  // 从 DOM 上移除、进入缓存以及组件卸载时调用
  onDeactivated(() => {
    scroll.value.disable()
  })

  return scroll
}
