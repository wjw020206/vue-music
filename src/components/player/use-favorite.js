import { save, remove } from '@/assets/js/array-store'
import { FAVORITE_KEY } from '@/assets/js/constant'
import { computed } from 'vue'
import { useStore } from 'vuex'

/** 收藏歌曲相关逻辑 */
export default function useFavorite() {
  /** 收藏歌曲列表的最大歌曲数 */
  const maxLength = 100

  const store = useStore()

  /** 收藏歌曲列表 */
  const favoriteList = computed(() => store.state.favoriteList)

  /** 根据歌曲收藏状态返回对应按钮图标 */
  function getFavoriteIcon(song) {
    return isFavorite(song) > -1 ? 'icon-favorite' : 'icon-not-favorite'
  }

  /** 判断歌曲是否收藏 */
  function isFavorite(song) {
    return favoriteList.value.findIndex((item) => {
      return song.id === item.id
    })
  }

  /** 切换歌曲收藏状态 */
  function toggleFavorite(song) {
    let list
    // 判断歌曲是否已经收藏
    if (isFavorite(song) > -1) {
      list = remove(FAVORITE_KEY, compare)
    } else {
      list = save(song, FAVORITE_KEY, compare, maxLength)
    }

    store.commit('setFavoriteList', list)

    function compare(item) {
      return item.id === song.id
    }
  }

  return {
    getFavoriteIcon,
    toggleFavorite,
  }
}
