import { load } from '@/assets/js/array-store'
import { PLAY_MODE, SEARCH_KEY } from '@/assets/js/constant'

const state = {
  /** 原始顺序歌曲列表 */
  sequenceList: [],
  /** 播放列表 */
  playlist: [],
  /** 是否正在播放 */
  playing: false,
  /** 播放模式（默认顺序播放） */
  playMode: PLAY_MODE.sequence,
  /** 当前播放歌曲的索引 */
  currentIndex: 0,
  /** 播放器是否全屏播放 */
  fullScreen: false,
  /** 收藏歌曲列表 */
  favoriteList: [],
  /** 搜索历史记录 */
  searchHistory: load(SEARCH_KEY),
  /** 播放历史记录 */
  playHistory: [],
}

export default state
