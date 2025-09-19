import { computed, ref } from 'vue'

export default function useShortcout(props, groupRef) {
  const ANCHOR_HEIGHT = 18
  const scrollRef = ref(null)

  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title
    })
  })

  const touch = {}

  function onShortcutTouchStart(event) {
    const anchorIndex = parseInt(event.target.dataset.index)
    touch.y1 = event.touches[0].pageY
    touch.anchorIndex = anchorIndex

    scrollTo(anchorIndex)
  }

  function onShortcutTouchMove(event) {
    touch.y2 = event.touches[0].pageY
    // | 0 写法用于向下取整整数，计算手指移动过的锚点数
    const delta = ((touch.y2 - touch.y1) / ANCHOR_HEIGHT) | 0
    // 计算移动后的目标索引位置
    const anchorIndex = touch.anchorIndex + delta

    scrollTo(anchorIndex)
  }

  function scrollTo(index) {
    if (isNaN(index)) return
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetElement = groupRef.value.children[index]
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(targetElement, 0)
  }

  return {
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove,
    scrollRef,
  }
}
