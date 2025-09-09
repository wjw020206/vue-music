import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

/** 选择歌曲播放 */
export function selectPlay({ commit }, { list, index }) {
  // 设置播放模式为顺序播放
  commit('setPlayMode', PLAY_MODE.sqeuence)
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
