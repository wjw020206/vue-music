import { computed, useTemplateRef } from 'vue'

export default function useShortcut(props, groupRef) {
  const ANCHOR_HEIGHT = 18
  const scrollRef = useTemplateRef('scrollRef')

  /** 快速导航列表 */
  const shortcutList = computed(() => props.data.map((group) => group.title))

  const touch = {}

  function onShortcutTouchStart(event) {
    const anchorIndex = parseInt(event.target.dataset.index)
    // 记录第一次手指放置的位置
    touch.y1 = event.touches[0].pageY
    touch.anchorIndex = anchorIndex

    scrollTo(anchorIndex)
  }

  function onShortcutTouchMove(event) {
    // 记录移动时手指放置的位置
    touch.y2 = event.touches[0].pageY
    // 计算移动的锚点个数
    // | 0 写法类似于 Math.floor()，整数向 0 取整
    const delta = ((touch.y2 - touch.y1) / ANCHOR_HEIGHT) | 0
    const anchorIndex = touch.anchorIndex + delta

    scrollTo(anchorIndex)
  }

  /** 滚动到指定下标的元素 */
  function scrollTo(index) {
    // 判断 index 是否是 NaN，解决拖动容器报错的问题
    if (isNaN(index)) return

    // 限制 index 最大值不会超过 shortcutList.value.length - 1，最小值不会小于 0
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetEl = groupRef.value.children[index]
    const scroll = scrollRef.value.scroll
    // 滚动到指定元素
    scroll.scrollToElement(targetEl, 0)
  }

  return {
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove,
  }
}
