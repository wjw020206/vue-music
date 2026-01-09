import { ref } from 'vue'

/** 歌词与 CD 页面切换的相关逻辑 */
export default function useMiddleInteractive() {
  /** 当前显示的页面(最终) */
  const currentShow = ref('cd')
  /** CD 页面的样式 */
  const middleLStyle = ref(null)
  /** 歌词页面的样式 */
  const middleRStyle = ref(null)

  let touch = {}

  /** 当前显示的页面(手指滑动时过渡用的变量) */
  let currentView = 'cd' // 如果直接使用 currentShow 会导致在 onMiddleTouchMove 中页面反复发生变化

  function onMiddleTouchStart(event) {
    touch.startX = event.touches[0].pageX
    touch.startY = event.touches[0].pageY
    // 定义手指移动的方向锁
    touch.directionLocked = ''
  }

  function onMiddleTouchMove(event) {
    const deltaX = event.touches[0].pageX - touch.startX
    const deltaY = event.touches[0].pageY - touch.startY

    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // 判断是否设置了方向锁
    if (!touch.directionLocked) {
      // 判断如果横向滚动的距离大于垂直滚动的距离，则设置对应方向的方向锁
      touch.directionLocked = absDeltaX >= absDeltaY ? 'h' : 'v'
    }

    // 判断是否是纵向偏移
    if (touch.directionLocked === 'v') return

    const left = currentView === 'cd' ? 0 : -window.innerWidth
    // 偏移距离在 -window.innerWidth ~ 0 范围之间
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
    // 计算偏移比例
    touch.percent = Math.abs(offsetWidth / window.innerWidth)

    // 判断当前是否是 cd 页面
    if (currentView === 'cd') {
      // 当从右往左滑动比例超过 20%，则判定为显示歌词页面
      if (touch.percent > 0.2) {
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    } else {
      // 当从左往右滑动比例超过 20%，则判定为显示 cd 页面
      if (touch.percent < 0.8) {
        currentShow.value = 'cd'
      } else {
        currentShow.value = 'lyric'
      }
    }

    middleLStyle.value = {
      opacity: 1 - touch.percent,
      transitionDuration: '0ms', // 手指拖动时不需要缓动动画
    }

    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: '0ms',
    }
  }

  function onMiddleTouchEnd() {
    let offsetWidth
    let opacity
    /** 过渡时间（单位 ms） */
    const duration = 300

    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }

    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`, // 手指松开后使用缓动动画
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
