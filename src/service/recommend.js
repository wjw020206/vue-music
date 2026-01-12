import { get } from './base'

/** 获取歌单和轮播图数据 */
export function getRecommend() {
  return get('/api/getRecommend')
}

/** 获取歌单详情 */
export function getAlbum(album) {
  return get('/api/getAlbum', {
    id: album.id,
  })
}
