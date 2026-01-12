import { get } from './base'

/** 获取排行榜列表 */
export function getTopList() {
  return get('/api/getTopList')
}
