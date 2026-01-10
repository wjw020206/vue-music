/** 当前正在播放的歌曲信息 */
export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}
