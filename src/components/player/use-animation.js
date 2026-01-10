import { useTemplateRef } from 'vue'
import animations from 'create-keyframe-animation'

export default function useAnimation() {
  const cdWrapperRef = useTemplateRef('cdWrapperRef')

  /** 进入中的标志位 */
  let entering = false
  /** 离开中的标志位 */
  let leaving = false

  /** 进入动画 */
  function enter(_, done) {
    // 判断离开过渡动画没有完成时触发了进入动画
    if (leaving) {
      // 手动触发离开动画完成回调，清除离开动画的相关样式，终止正在进行的离开动画
      afterLeave()
    }

    entering = true

    const { x, y, scale } = getPositionAndScale()

    const animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
      },
      100: {
        transform: 'translate3d(0, 0, 0) scale(1)',
      },
    }

    // 注册动画
    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 600, // 动画时长（毫秒）
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)', // 缓动效果
      },
    })

    // 运行动画并且监听动画执行完成回调
    animations.runAnimation(cdWrapperRef.value, 'move', done)
  }

  /** 进入动画完成后 */
  function afterEnter() {
    entering = false
    // 取消动画注册
    animations.unregisterAnimation('move')
    cdWrapperRef.value.style.animation = ''
  }

  /** 离开动画 */
  function leave(_, done) {
    // 判断进入过渡动画没有完成时触发了离开动画
    if (entering) {
      // 手动触发进入动画完成回调，确保进入动画取消注册，终止正在进行的进入动画
      afterEnter()
    }

    leaving = true
    const { x, y, scale } = getPositionAndScale()

    const cdWrapperEl = cdWrapperRef.value

    cdWrapperEl.style.transition = 'all 0.6s cubic-bezier(0.45, 0, 0.55, 1)'
    cdWrapperEl.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
    cdWrapperEl.addEventListener('transitionend', next)

    function next() {
      cdWrapperEl.removeEventListener('transitionend', next)
      done()
    }
  }

  /** 离开动画完成后 */
  function afterLeave() {
    leaving = false
    const cdWrapperEl = cdWrapperRef.value

    cdWrapperEl.style.transition = ''
    cdWrapperEl.style.transform = ''
  }

  /** 计算偏移距离以及缩放 */
  function getPositionAndScale() {
    /** 迷你播放器 CD 的宽度 */
    const targetWidth = 40
    /** 迷你播放器 CD 距离左边的偏移量 */
    const paddingLeft = 40
    /** 迷你播放器 CD 距离底部的偏移量 */
    const paddingBottom = 30
    /** 全屏播放器 CD 距离顶部的偏移量 */
    const paddingTop = 80
    /** 全屏播放器 CD 的宽度 */
    const width = window.innerWidth * 0.8
    /** 全屏播放器 CD 往左偏移到迷你播放器 CD */
    const x = -(window.innerWidth / 2 - paddingLeft)
    /** 全屏播放器 CD 往下偏移到迷你播放器 CD */
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
    /** 计算全屏播放器 CD 与迷你播放器 CD 的缩放比例 */
    const scale = targetWidth / width

    return {
      x,
      y,
      scale,
    }
  }

  return {
    enter,
    afterEnter,
    leave,
    afterLeave,
  }
}
