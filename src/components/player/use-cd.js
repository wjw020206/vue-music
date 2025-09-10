import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

export default function useCD() {
  const store = useStore()
  const cdRef = ref(null)
  const cdImageRef = ref(null)

  const playing = computed(() => store.state.playing)

  const cdClassName = computed(() => {
    return playing.value ? 'playing' : ''
  })

  watch(playing, (newPlaying) => {
    // 播放暂停时记录 CD 唱片已旋转的角度
    if (!newPlaying) {
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })

  function syncTransform(wrapper, inner) {
    const wrapperTransform = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform
    wrapper.style.transform =
      wrapperTransform === 'none'
        ? innerTransform
        : innerTransform.concat(' ', wrapperTransform)
  }

  return {
    cdClassName,
    cdRef,
    cdImageRef,
  }
}
