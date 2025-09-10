const mutations = {
  /** 设置播放状态 */
  setPlayingState(state, playing) {
    state.playing = playing
  },
  /** 设置顺序播放列表 */
  setSequenceList(state, list) {
    state.sequenceList = list
  },
  /** 设置播放列表 */
  setPlayingList(state, list) {
    state.playList = list
  },
  /** 设置播放模式 */
  setPlayMode(state, mode) {
    state.playMode = mode
  },
  /** 设置当前播放索引 */
  setCurrentIndex(state, index) {
    state.currentIndex = index
  },
  /** 设置播放是否全屏 */
  setFullScreen(state, fullScreen) {
    state.fullScreen = fullScreen
  },
  /** 设置收藏歌曲列表 */
  setFavoriteList(state, list) {
    state.favoriteList = list
  },
}

export default mutations
