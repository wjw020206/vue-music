import {
  h,
  mergeProps,
  withCtx,
  renderSlot,
  computed,
  watch,
  nextTick,
  useTemplateRef,
} from 'vue'
import Scroll from '@/components/base/scroll/index.vue'
import { useStore } from 'vuex'

/** Scroll 的高阶组件 */
export default {
  name: 'WrapScroll',
  props: Scroll.props,
  emits: Scroll.emits,
  /** 渲染函数
   * @param {Object} ctx 上下文
   */
  render(ctx) {
    return h(
      Scroll,
      mergeProps(
        { ref: 'scrollRef' },
        ctx.$props, // props 部分
        {
          // 事件部分
          onScroll: (event) => {
            ctx.$emit('scroll', event)
          },
        },
      ),
      {
        // 插槽部分的渲染
        // withCtx 确保上下文是正确的
        default: withCtx(() => [renderSlot(ctx.$slots, 'default')]),
      },
    )
  },
  setup() {
    const scrollRef = useTemplateRef('scrollRef')

    const store = useStore()

    const playlist = computed(() => store.state.playlist)
    const scroll = computed(() => scrollRef.value.scroll)

    // 监听播放列表的变化
    watch(playlist, async () => {
      await nextTick()
      // 让 BScroll 重新计算高度
      scroll.value.refresh()
    })

    return {
      scroll,
    }
  },
}
