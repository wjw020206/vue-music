import { get } from './base'

/** 获取热门关键词 */
export function getHotKeys() {
  return get('/api/getHotKeys')
}

/** 搜索歌曲或歌手 */
export function search(query, page, showSinger) {
  return get('/api/search', {
    query,
    page,
    showSinger,
  })
}
