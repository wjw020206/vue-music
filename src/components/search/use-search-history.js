import { save } from '@/assets/js/array-store'
import { SEARCH_KEY } from '@/assets/js/constant'
import { useStore } from 'vuex'

export default function useSearchHistory() {
  const maxLength = 200

  const store = useStore()

  /** 持久化存储搜索关键词 */
  function saveSearch(query) {
    const searches = save(
      query,
      SEARCH_KEY,
      (item) => {
        return item === query
      },
      maxLength,
    )
    store.commit('setSearchHistory', searches)
  }

  return {
    saveSearch,
  }
}
