import { get } from './base'

/** 获取排行榜列表 */
export function getTopList() {
  return get('/api/getTopList')
}

/** 获取排行榜详情 */
export function getTopDetail(top) {
  return get('/api/getTopDetail', {
    id: top.id,
    period: top.period,
  })
}
