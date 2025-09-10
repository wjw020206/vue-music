import { remove, save } from '@/assets/js/array-store'
import { FAVROITE_KEY } from '@/assets/js/constant'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default function useFavorite() {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)
  const maxLength = 100

  /** 获取收藏状态图标 */
  function getFavoriteIcon(song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  /** 切换歌曲收藏状态 */
  function toggleFavorite(song) {
    let list
    // 判断是否已收藏歌曲
    if (isFavorite(song)) {
      list = remove(FAVROITE_KEY, compare)
    } else {
      list = save(song, FAVROITE_KEY, compare, maxLength)
    }

    function compare(item) {
      return item.id === song.id
    }

    store.commit('setFavoriteList', list)
  }

  /** 判断歌曲是否已经被收藏 */
  function isFavorite(song) {
    return (
      favoriteList.value.findIndex((item) => {
        return item.id === song.id
      }) > -1
    )
  }

  return {
    favoriteList,
    getFavoriteIcon,
    toggleFavorite,
  }
}
