import { get } from './base'

/** 批量为歌曲添加播放 url */
export function processSongs(songs) {
  if (!songs.length) return Promise.reject(songs)

  return get('/api/getSongsUrl', {
    mid: songs.map((song) => song.mid),
  }).then((result) => {
    const map = result.map
    return songs
      .map((song) => {
        song.url = map[song.mid]
        return song
      })
      .filter((song) => song.url.indexOf('vkey') > -1)
  })
}
