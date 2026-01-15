import { save } from '@/assets/js/array-store'
import { PLAY_KEY } from '@/assets/js/constant'
import { useStore } from 'vuex'

/** 播放历史记录相关逻辑 */
export default function usePlayHistory() {
  /** 播放历史记录列表的最大歌曲数 */
  const maxLength = 200

  const store = useStore()

  /** 持久化存储播放历史记录 */
  function savePlay(song) {
    const songs = save(
      song,
      PLAY_KEY,
      (item) => {
        return item.id === song.id
      },
      maxLength,
    )
    store.commit('setPlayHistory', songs)
  }

  return {
    savePlay,
  }
}
