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
  commit('setPlayList', list)
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
  commit('setPlayList', shuffle(list))
  // 播放列表中的第一首歌
  commit('setCurrentIndex', 0)
}
