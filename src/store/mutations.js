const mutations = {
  /** 设置播放模式 */
  setPlayingState(state, playing) {
    state.playing = playing
  },
  /** 设置原始顺序歌曲列表 */
  setSequenceList(state, list) {
    state.sequenceList = list
  },
  /** 设置播放列表 */
  setPlayList(state, list) {
    state.playlist = list
  },
  /** 设置播放模式 */
  setPlayMode(state, mode) {
    state.playMode = mode
  },
  /** 设置当前播放索引 */
  setCurrentIndex(state, index) {
    state.currentIndex = index
  },
  /** 设置播放器是否全屏播放 */
  setFullScreen(state, fullScreen) {
    state.fullScreen = fullScreen
  },
  /** 设置收藏歌曲列表 */
  setFavoriteList(state, list) {
    state.favoriteList = list
  },
  /** 为歌曲添加歌词 */
  addSongLyric(state, { song, lyric }) {
    state.sequenceList.forEach((item) => {
      if (item.mid === song.mid) {
        item.lyric = lyric
      }
    })
  },
}

export default mutations
