import { computed, useTemplateRef, watch } from 'vue'
import { useStore } from 'vuex'

export default function useCd() {
  const store = useStore()

  const cdRef = useTemplateRef('cdRef')
  const cdImageRef = useTemplateRef('cdImageRef')

  const playing = computed(() => store.state.playing)
  const cdCls = computed(() => (playing.value ? 'playing' : ''))

  watch(playing, (newPlaying) => {
    // 当播放暂停时
    if (!newPlaying) {
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })

  /** 同步 CD 内外层的 Transform 旋转角度样式 */
  function syncTransform(wrapper, inner) {
    // 外层容器在第二次播放暂停时也可能会初始的角度偏移
    const wrapperTransform = getComputedStyle(wrapper).transform
    // 当播放暂停时，记录内层的旋转角度
    const innerTransform = getComputedStyle(inner).transform
    // 将记录的旋转角度赋值给外层
    // 如果外层已经存在角度，那就进行角度叠加
    wrapper.style.transform =
      wrapperTransform === 'none'
        ? innerTransform
        : innerTransform.concat(' ', wrapperTransform)
  }

  return {
    cdCls,
  }
}
