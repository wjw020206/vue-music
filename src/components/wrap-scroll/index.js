import Scroll from '@/components/base/scroll/index.vue'
import {
  h,
  mergeProps,
  renderSlot,
  withCtx,
  ref,
  computed,
  watch,
  nextTick,
} from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'wrap-scroll',
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx) {
    return h(
      Scroll,
      mergeProps({ ref: 'scrollRef' }, ctx.$props, {
        onScroll: (event) => {
          ctx.$emit('scroll', event)
        },
      }),
      {
        default: withCtx(() => {
          return [renderSlot(ctx.$slots, 'default')]
        }),
      }
    )
  },
  setup() {
    const store = useStore()
    const scrollRef = ref(null)

    const scroll = computed(() => {
      return scrollRef.value.scroll
    })
    const playList = computed(() => store.state.playList)

    watch(playList, async () => {
      await nextTick()
      scroll.value.refresh()
    })

    return {
      scrollRef,
      scroll,
    }
  },
}
