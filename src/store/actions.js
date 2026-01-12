import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

/** 选择单首歌曲播放 */
export function selectPlay({ commit }, { list, index }) {
  // 设置顺序播放模式
  commit('setPlayMode', PLAY_MODE.sequence)
  // 设置原始顺序歌曲列表
  commit('setSequenceList', list)
  // 设置播放状态为正在播放
  commit('setPlayingState', true)
  // 设置播放器全屏播放
  commit('setFullScreen', true)
  // 设置播放列表
  commit('setPlaylist', list)
  // 设置当前播放歌曲索引
  commit('setCurrentIndex', index)
}

/** 随机播放所有歌曲 */
export function randomPlay({ commit }, list) {
  // 设置随机播放模式
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  // 设置播放列表
  commit('setPlaylist', shuffle(list))
  // 播放列表中的第一首歌
  commit('setCurrentIndex', 0)
}

/** 修改播放器的播放模式 */
export function changeMode({ commit, state, getters }, mode) {
  // 获取当前正在播放歌曲的 id
  const currentId = getters.currentSong.id
  // 判断是否是随机播放模式
  if (mode === PLAY_MODE.random) {
    // 设置随机顺序的播放列表
    commit('setPlaylist', shuffle(state.sequenceList))
  } else {
    // 设置原始顺序的播放列表
    commit('setPlaylist', state.sequenceList)
  }

  // 找到播放列表切换后当前播放歌曲的新索引
  const index = state.playlist.findIndex((song) => song.id === currentId)

  // 设置当前播放歌曲的新索引
  commit('setCurrentIndex', index)
  // 设置模式
  commit('setPlayMode', mode)
}

/** 移除歌曲 */
export function removeSong({ commit, state }, song) {
  // 拷贝数组，避免直接修改 state 中的数据
  const sequenceList = state.sequenceList.slice()
  const playlist = state.playlist.slice()

  const sequenceIndex = findIndex(sequenceList, song)
  const playlistIndex = findIndex(playlist, song)

  sequenceList.splice(sequenceIndex, 1)
  playlist.splice(playlistIndex, 1)

  let currentIndex = state.currentIndex

  // 判断删除的歌曲索引是否在当前播放索引之前，以及是否是最后一首歌
  if (playlistIndex < currentIndex || currentIndex === playlist.length) {
    // 前面的歌曲删除后，下标往前移动一位
    // 保证当前播放的歌曲不受删除歌曲的影响
    currentIndex--
  }

  commit('setSequenceList', sequenceList)
  commit('setPlaylist', playlist)
  commit('setCurrentIndex', currentIndex)
}

/** 从歌曲列表中找到对应歌曲的索引 */
function findIndex(list, song) {
  return list.findIndex((item) => item.id === song.id)
}
