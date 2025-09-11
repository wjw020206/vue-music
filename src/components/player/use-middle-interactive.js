import { ref } from 'vue'

export default function useMiddleInteractive() {
  /** 当前显示界面 */
  const currentShow = ref('cd')
  /** CD 样式 */
  const middleLStyle = ref(null)
  /** 歌词样式 */
  const middleRStyle = ref(null)

  let touch = {}
  let currentView = 'cd'

  function onMiddleTouchStart(event) {
    touch.startX = event.touches[0].pageX
    touch.startY = event.touches[0].pageY
    // 滑动方向锁
    touch.directionLocked = ''
  }

  function onMiddleTouchMove(event) {
    const deltaX = event.touches[0].pageX - touch.startX
    const deltaY = event.touches[0].pageY - touch.startY

    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    if (!touch.directionLocked) {
      touch.directionLocked = absDeltaX >= absDeltaY ? 'h' : 'v'
    }

    // 判断是否是纵向偏移
    if (touch.directionLocked === 'v') {
      return
    }

    const left = currentView === 'cd' ? 0 : -window.innerWidth
    const offsetWidth = Math.min(0, Math.max(left + deltaX, -window.innerWidth))
    touch.percent = Math.abs(offsetWidth / window.innerWidth)

    if (currentView === 'cd') {
      if (touch.percent > 0.2) {
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    } else {
      if (touch.percent < 0.8) {
        currentShow.value = 'cd'
      } else {
        currentShow.value = 'lyric'
      }
    }

    middleLStyle.value = {
      opacity: 1 - touch.percent,
    }

    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
    }
  }

  function onMiddleTouchEnd() {
    let offsetWidth
    let opacity

    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }

    const duration = 300

    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`,
    }

    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: `${duration}ms`,
    }

    touch = {}
  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd,
  }
}
