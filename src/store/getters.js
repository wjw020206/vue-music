/** 当前播放歌曲 */
export const currentSong = (state) => {
  return state.platlist[state.currentIndex]
}
