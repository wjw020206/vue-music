import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'
import { computed, watch, ref } from 'vue'
import { useStore } from 'vuex'

export default function useLyric({ songReady, currentTime }) {
  /** 当前歌词实例 */
  const currentLyric = ref(null)
  /** 当前播放歌词行号 */
  const currentLineNum = ref(0)
  /** 纯音乐歌词 */
  const pureMusicLyric = ref('')
  /** 当前正在播放的歌词 */
  const playingLyric = ref('')
  /** 歌词滚动容器实例 */
  const lyricScrollRef = ref(null)
  /** 歌词列表实例 */
  const lyricListRef = ref(null)

  const store = useStore()

  const currentSong = computed(() => store.getters.currentSong)

  watch(currentSong, async (newSong) => {
    // 判断歌曲是否合法
    if (!newSong.url || !newSong.id) return

    // 每次切换歌曲暂停歌词播放，重置歌词数据
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0
    pureMusicLyric.value = 0
    playingLyric.value = 0

    const lyric = await getLyric(newSong)
    store.commit('addSongLyric', {
      song: newSong,
      lyric,
    })

    // 判断歌词是否跟歌曲匹配，用于切换歌曲后，阻止之后的不对应当前歌曲的逻辑
    if (currentSong.value.lyric !== lyric) return

    currentLyric.value = new Lyric(lyric, handleLyric)

    const hasLyric = currentLyric.value.lines.length

    // 判断是否是纯音乐
    if (hasLyric) {
      if (songReady.value) {
        playLyric()
      }
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(
        /\[(\d{2}):(\d{2}):(\d{2})\]/g,
        ''
      )
    }
  })

  /** 播放歌词 */
  function playLyric() {
    const currentLyricValue = currentLyric.value

    if (currentLyricValue) {
      currentLyricValue.seek(currentTime.value * 1000)
    }
  }

  function stopLyric() {
    const currentLyricValue = currentLyric.value

    if (currentLyricValue) {
      currentLyricValue.stop()
    }
  }

  function handleLyric({ lineNum, txt }) {
    currentLineNum.value = lineNum
    playingLyric.value = txt
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value

    // 判断是否已加载歌词列表
    if (!listEl) {
      return
    }

    // 判断歌词滚动是否已经超过五行
    if (lineNum > 5) {
      const lineEL = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEL, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }

  return {
    currentLyric,
    currentLineNum,
    playLyric,
    lyricScrollRef,
    lyricListRef,
    stopLyric,
    pureMusicLyric,
    playingLyric,
  }
}
