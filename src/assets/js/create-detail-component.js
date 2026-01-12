import MusicList from '@/components/music-list/index.vue'
import storage from 'good-storage'
import { processSongs } from '@/service/song'

export default function createDetailComponent(name, key, fetch) {
  return {
    /** 组件名 */
    name,
    components: {
      MusicList,
    },
    props: {
      data: {
        type: Object,
      },
    },
    data() {
      return {
        /** 歌曲列表 */
        songs: [],
        /** 是否加载完成 */
        loading: true,
      }
    },
    computed: {
      /** 封面 */
      pic() {
        const data = this.computedData
        return data && data.pic
      },
      /** 页面标题 */
      title() {
        const data = this.computedData
        return data && (data.name || data.title)
      },
      /** 详情数据（自动判断是从 props 还是 session 获取） */
      computedData() {
        let result = null
        const data = this.data

        // 判断是否是 props 传递的 data
        if (data) {
          result = data
        } else {
          const cached = storage.session.get(key)

          if (
            cached &&
            (cached.mid || String(cached.id)) === this.$route.params.id
          ) {
            result = cached
          }
        }

        return result
      },
    },
    async created() {
      const data = this.computedData

      if (!data) {
        const path = this.$route.matched[0].path
        this.$router.push(path)
        return
      }

      const result = await fetch(data)
      this.songs = await processSongs(result.songs)
      this.loading = false
    },
  }
}
