import { PLAY_MODE } from '@/assets/js/constant'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default function useMode() {
  const store = useStore()

  const playMode = computed(() => store.state.playMode)

  /** 对应模式的图标 */
  const modeIcon = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence
      ? 'icon-sequence'
      : playModeVal === PLAY_MODE.random
      ? 'icon-random'
      : 'icon-loop'
  })

  function changeMode() {
    const mode = (playMode.value + 1) % 3
    store.dispatch('changeMode', mode)
  }

  return {
    playMode,
    modeIcon,
    changeMode,
  }
}
