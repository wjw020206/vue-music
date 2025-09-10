import { load } from '@/assets/js/array-store'
import { FAVROITE_KEY, PLAY_MODE } from '@/assets/js/constant'

const state = {
  /** 原始顺序的歌曲列表 */
  sequenceList: [],
  /** 播放列表 */
  playList: [],
  /** 是否正在播放 */
  playing: false,
  /** 播放模式 */
  playMode: PLAY_MODE.sequence,
  /** 当前播放歌曲索引 */
  currentIndex: 0,
  /** 播放器是否全屏 */
  fullScreen: false,
  /** 已收藏歌曲列表 */
  favoriteList: load(FAVROITE_KEY),
}

export default state
