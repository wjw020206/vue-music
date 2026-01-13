import { get } from './base'

/** 批量为歌曲添加播放 url */
export function processSongs(songs) {
  if (!songs.length) return Promise.resolve(songs)

  return get('/api/getSongsUrl', {
    mid: songs.map((song) => song.mid),
  }).then((result) => {
    const map = result.map
    return songs
      .map((song) => {
        song.url = map[song.mid]
        return song
      })
      .filter((song) => song.url && song.url.indexOf('vkey') > -1)
  })
}

const lyricMap = {}

/** 根据歌曲获取歌词 */
export function getLyric(song) {
  // 当歌曲有添加歌词，则直接返回歌词
  if (song.lyric) return Promise.resolve(song.lyric)

  const mid = song.mid
  // 其它地方的歌曲对象通过 mid 获取对应歌曲的歌词
  const lyric = lyricMap[mid]
  if (lyric) {
    return Promise.resolve(lyric)
  }

  return get('/api/getLyric', {
    mid,
  }).then((result) => {
    const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    // 缓存对应 mid 的歌曲的歌词
    lyricMap[mid] = lyric
    return lyric
  })
}
