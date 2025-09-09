import { get } from './base'

export function processSongs(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }

  return get('/api/getSongsUrl', {
    mid: songs.map((song) => {
      return song.mid
    }),
  }).then((result) => {
    const map = result.map

    return songs
      .map((song) => {
        song.url = map[song.mid] ?? ''
        return song
      })
      .filter((song) => {
        // 过滤掉没有 vkey 的歌曲 URL，第三方服务加密需要使用 vkey 解密
        return song.url.indexOf('vkey') > -1
      })
  })
}
