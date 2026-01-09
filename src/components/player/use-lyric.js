import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'
import { computed, ref, useTemplateRef, watch } from 'vue'
import { useStore } from 'vuex'

/** 歌词逻辑相关代码 */
export default function useLyric({ songReady, currentTime }) {
  /** 歌词滚动组件实例 */
  const lyricScrollRef = useTemplateRef('lyricScrollRef')
  /** 歌词列表实例 */
  const lyricListRef = useTemplateRef('lyricListRef')

  /** 当前歌曲的歌词 */
  const currentLyric = ref(null)
  /** 当前显示的歌词行号 */
  const currentLineNum = ref(0)

  const currentSong = computed(() => store.getters.currentSong)

  const store = useStore()

  // 监听歌曲变化
  watch(currentSong, async (newSong) => {
    // 判断歌曲是否合法
    if (!newSong.url || !newSong.id) return

    const lyric = await getLyric(newSong)
    // 添加歌词到歌曲对象中
    store.commit('addSongLyric', {
      song: newSong,
      lyric,
    })

    // 防止快速切歌时，旧请求返回的歌词与新切换的歌曲歌词错误绑定
    if (currentSong.value.lyric !== lyric) return

    // 创建歌词对象
    currentLyric.value = new Lyric(lyric, handleLyric)

    // 判断歌曲是否准备好播放
    if (songReady.value) {
      playLyric()
    }
  })

  /** 播放歌词 */
  function playLyric() {
    const currentLyricVal = currentLyric.value

    // 判断歌词对象是否创建
    if (currentLyricVal) {
      // 根据时间（毫秒单位）来播放对应的歌词
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  /** 暂停歌词播放 */
  function stopLyric() {
    const currentLyricVal = currentLyric.value

    // 判断歌词对象是否创建
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }

  /** 歌词播放回调（每播放完一行触发一次） */
  function handleLyric({ lineNum }) {
    currentLineNum.value = lineNum
    const scrollComponent = lyricScrollRef.value
    const listElement = lyricListRef.value

    // 判断歌词列表是否存在（当歌词为空时不存在）
    if (!listElement) return

    // 当歌词播放超过 5 行时
    if (lineNum > 5) {
      const lineElement = listElement.children[lineNum - 5]
      // 滚动到对应的元素，1s 滚动动画效果
      scrollComponent.scroll.scrollToElement(lineElement, 1000)
    } else {
      // 滚动到顶部
      scrollComponent.scroll.scrollTo(0, 0, 1000)
    }
  }

  return {
    currentLyric,
    currentLineNum,
    playLyric,
    stopLyric,
  }
}
