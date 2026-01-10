import { PLAY_MODE } from '@/assets/js/constant'
import { computed } from 'vue'
import { useStore } from 'vuex'

/** 播放器播放模式相关代码 */
export default function useMode() {
  const store = useStore()

  /** 当前播放模式 */
  const playMode = computed(() => store.state.playMode)

  /** 根据当前播放模式获取对应的图标 */
  const modeIcon = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence
      ? 'icon-sequence'
      : playModeVal === PLAY_MODE.random
        ? 'icon-random'
        : 'icon-loop'
  })

  /** 播放模式对应的文字 */
  const modeText = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence
      ? '顺序播放'
      : playModeVal === PLAY_MODE.random
        ? '随机播放'
        : '单曲循环'
  })

  /** 改变当前播放模式 */
  function changeMode() {
    const mode = (playMode.value + 1) % 3
    store.dispatch('changeMode', mode)
  }

  return {
    modeIcon,
    changeMode,
    playMode,
    modeText,
  }
}
