import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

/** 选择歌曲播放 */
export function selectPlay({ commit }, { list, index }) {
  // 设置播放模式为顺序播放
  commit('setPlayMode', PLAY_MODE.sequence)
  // 添加原始歌曲顺序列表
  commit('setSequenceList', list)
  // 改变播放状态
  commit('setPlayingState', true)
  // 设置为全屏播放
  commit('setFullScreen', true)
  // 设置，播放列表，顺序播放情况下，播放列表与原始顺序播放列表相同
  commit('setPlayingList', list)
  // 设置当前选择播放歌曲的索引
  commit('setCurrentIndex', index)
}

export function randomPlay({ commit }, list) {
  // 设置播放模式为随机播放
  commit('setPlayMode', PLAY_MODE.random)
  // 添加原始歌曲顺序列表
  commit('setSequenceList', list)
  // 改变播放状态
  commit('setPlayingState', true)
  // 设置为全屏播放
  commit('setFullScreen', true)
  // 打乱播放列表的顺序
  commit('setPlayingList', shuffle(list))
  // 随机播放打乱播放列表顺序后的第一首歌曲
  commit('setCurrentIndex', 0)
}

/** 改变播放模式 */
export function changeMode({ commit, state, getters }, mode) {
  const currentId = getters.currentSong.id

  if (mode === PLAY_MODE.random) {
    commit('setPlayingList', shuffle(state.sequenceList))
  } else {
    commit('setPlayingList', state.sequenceList)
  }

  const index = state.playList.findIndex((song) => {
    return song.id === currentId
  })

  // 确保改变播放模式后当前播放歌曲不切换
  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}

/** 移除播放列表和原生歌曲列表中的指定歌曲 */
export function removeSong({ commit, state }, song) {
  const sequenceList = state.sequenceList.slice()
  const playList = state.playList.slice()

  const sequenceIndex = findIndex(sequenceList, song)
  const playIndex = findIndex(playList, song)

  if (sequenceIndex < 0 || playIndex < 0) return

  sequenceList.splice(sequenceIndex, 1)
  playList.splice(playIndex, 1)

  // 当删除正在播放歌曲的前面的歌曲时，调整正在播放歌曲的索引，确保依旧是播放同一首歌
  let currentIndex = state.currentIndex
  if (playIndex < currentIndex || currentIndex === playList.length) {
    currentIndex--
  }

  commit('setSequenceList', sequenceList)
  commit('setPlayingList', playList)
  commit('setCurrentIndex', currentIndex)

  // 判断播放列表是否为空
  if (!playList.length) {
    commit('setPlayingState', false)
  }
}

/** 清空歌曲列表 */
export function clearSongList({ commit }) {
  commit('setSequenceList', [])
  commit('setPlayingList', [])
  commit('setCurrentIndex', 0)
  commit('setPlayingState', false)
}

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
