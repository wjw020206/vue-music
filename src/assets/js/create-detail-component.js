import MusicList from '@/components/music-list/index.vue'
import { processSongs } from '@/service/song'
import storage from 'good-storage'
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    components: {
      MusicList,
    },
    props: {
      data: {
        type: Object,
      },
    },
    setup(props) {
      const route = useRoute()
      const router = useRouter()

      const songs = ref([])

      const loading = ref(true)

      const pic = computed(() => {
        const data = computedData.value
        return data && data.pic
      })

      const title = computed(() => {
        const data = computedData.value
        return data && (data.name || data.title)
      })

      const computedData = computed(() => {
        let result = null
        const data = props.data

        // 判断是否通过 props 传入歌手信息
        if (data) {
          result = data
        } else {
          // 如果没有传入则通过本地 session 缓存中查找
          const cached = storage.session.get(key)

          if (cached && (cached.mid || cached.id + '') === route.params.id) {
            result = cached
          }
        }

        return result
      })

      onMounted(async () => {
        const data = computedData.value
        if (!data) {
          const path = route.matched[0].path

          router.push({
            path,
          })
          return
        }
        const result = await fetch(data)
        songs.value = await processSongs(result.songs)
        loading.value = false
      })

      return {
        pic,
        title,
        loading,
        songs,
      }
    },
  }
}
