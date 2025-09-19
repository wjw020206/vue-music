import animations from 'create-keyframe-animation'
import { ref } from 'vue'

export default function useAnimation() {
  const cdWrapperRef = ref(null)
  let entering = false
  let leaving = false

  function enter(el, done) {
    // 判断是否正在离开动画中，如果是则手动触发 afterLeave 回调
    if (leaving) {
      afterLeave()
    }
    entering = true
    const { x, y, scale } = getPosAndScale()

    const animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
      },
      100: {
        transform: 'translate3d(0, 0, 0) scale(1)',
      },
    }

    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 600,
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)',
      },
    })

    animations.runAnimation(cdWrapperRef.value, 'move', done)
  }

  function afterEnter() {
    entering = false
    animations.unregisterAnimation('move')
    cdWrapperRef.value.animation = ''
  }

  function leave(el, done) {
    // 判断是否正在进入动画中，如果是则手动触发 afterEnter 回调
    if (entering) {
      afterEnter()
    }
    leaving = true
    const { x, y, scale } = getPosAndScale()
    const cdWrapperEl = cdWrapperRef.value

    cdWrapperEl.style.transition = 'all 0.6s cubic-bezier(0.45, 0, 0.55, 1)'
    cdWrapperEl.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale}`
    cdWrapperEl.addEventListener('transitionend', next)

    function next() {
      cdWrapperEl.removeEventListener('transitionend', next)
      done()
    }
  }

  function afterLeave() {
    leaving = false
    const cdWrapperEl = cdWrapperRef.value
    cdWrapperEl.style.transition = ''
    cdWrapperEl.style.transform = ''
  }

  function getPosAndScale() {
    // 小 CD 的宽度
    const targetWidth = 40
    // 小 CD 圆心距离左侧的距离
    const paddingLeft = 40
    // 小 CD 圆心距离底部的距离
    const paddingBottom = 30
    // 大 CD 距离顶部的距离
    const paddingTop = 85
    // 大 CD 的宽度
    const width = window.innerWidth * 0.8

    // 计算大 CD 移动到 小 CD 位置的横向偏移量
    const x = -(window.innerWidth / 2 - paddingLeft)
    // 计算大 CD 移动到 小 CD 位置的纵向偏移量
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom

    // 缩放比例
    const scale = targetWidth / width

    return {
      x,
      y,
      scale,
    }
  }

  return {
    cdWrapperRef,
    enter,
    afterEnter,
    afterLeave,
    leave,
  }
}
