import { PLAY_MODE } from '@/assets/js/constant'

const state = {
  /** 原始顺序的歌曲列表 */
  sequenceList: [],
  /** 播放列表 */
  playList: [],
  /** 是否正在播放 */
  playing: false,
  /** 播放模式 */
  playMode: PLAY_MODE.sqeuence,
  /** 当前播放歌曲索引 */
  currentIndex: 0,
  /** 播放器是否全屏 */
  fullScreen: false,
}

export default state
