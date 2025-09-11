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

const lyricMap = {}

export function getLyric(song) {
  // 如果歌曲已经有歌词了就不再请求
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }

  const mid = song.mid
  const lyric = lyricMap[mid]

  if (lyric) {
    return Promise.resolve(lyric)
  }

  return get('/api/getLyric', {
    mid,
  }).then((result) => {
    const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    // 根据歌曲的 mid 保存歌词
    lyricMap[mid] = lyric
    return lyric
  })
}
