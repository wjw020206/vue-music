import { computed, nextTick, ref, watch } from 'vue'

export default function useFixed(props) {
  const TITLE_HEIGHT = 30
  const groupRef = ref(null)
  const listHeights = ref([])
  const scrollY = ref(0)
  const currentIndex = ref(0)
  const distance = ref(0)

  /** 获取当前组的固定标题 */
  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  /** 标题偏移量样式 */
  const fixedStyle = computed(() => {
    const distanceValue = distance.value
    const diff =
      distanceValue > 0 && distanceValue < TITLE_HEIGHT
        ? distanceValue - TITLE_HEIGHT
        : 0

    return {
      transform: `translate3d(0, ${diff}px, 0)`,
    }
  })

  watch(
    () => props.data,
    async () => {
      await nextTick()
      calculate()
    }
  )

  watch(scrollY, (newY) => {
    const listHeightsValue = listHeights.value

    for (let i = 0; i < listHeightsValue.length - 1; i++) {
      const heightTop = listHeightsValue[i]
      const heightBottom = listHeightsValue[i + 1]

      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i
        distance.value = heightBottom - newY
      }
    }
  })

  function calculate() {
    const list = groupRef.value.children
    const listHeightsValue = listHeights.value
    let height = 0

    listHeightsValue.length = 0
    listHeightsValue.push(height)

    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeightsValue.push(height)
    }
  }

  function onScroll({ y }) {
    scrollY.value = -y
  }

  return {
    groupRef,
    onScroll,
    fixedTitle,
    fixedStyle,
    currentIndex,
  }
}
