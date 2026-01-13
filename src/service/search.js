import { get } from './base'

/** 获取热门关键词 */
export function getHotKeys() {
  return get('/api/getHotKeys')
}
