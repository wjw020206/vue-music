import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import {
  computed,
  nextTick,
  onActivated,
  onDeactivated,
  onMounted,
  onUnmounted,
  ref,
  useTemplateRef,
  watch,
} from 'vue'
import { useStore } from 'vuex'

BScroll.use(Slide)

/** 迷你播放器左侧滑动切歌的相关逻辑 */
export default function useMiniSlider() {
  const sliderWrapperRef = useTemplateRef('sliderWrapperRef')

  const slider = ref(null)

  const store = useStore()

  const fullScreen = computed(() => store.state.fullScreen)
  const playlist = computed(() => store.state.playlist)
  const sliderShow = computed(() => !fullScreen.value && playlist.value.length)
  const currentIndex = computed(() => store.state.currentIndex)

  onMounted(() => {
    let sliderVal
    watch(sliderShow, async (newSilderShow) => {
      // 如果迷你播放组件左侧滑动区域存在
      if (newSilderShow) {
        await nextTick()

        // 判断是否已经创建过 slider 实例
        // 防止迷你播放器和全屏播放器来回切换重复创建 slider 实例
        if (!sliderVal) {
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true,
            },
          })
          // slider 滑动结束回调
          // https://better-scroll.github.io/docs/zh-CN/plugins/slide.html#slidepagechanged
          sliderVal.on('slidePageChanged', ({ pageX }) => {
            store.commit('setCurrentIndex', pageX)
          })
        } else {
          // 重新计算
          sliderVal.refresh()
        }

        // slider 实例初始完之后，滚动到当前播放歌曲的位置
        sliderVal.goToPage(currentIndex.value, 0, 0)
      }
    })

    // 监听 currentIndex 的变化
    watch(currentIndex, (newIndex) => {
      // 判断 slider 实例是否存在并且 sliderShow 为 true
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0)
      }
    })

    // 监听 playlist 的变化
    watch(playlist, async (newList) => {
      // 判断滑动组件初始化并且迷你播放器显示
      if (sliderVal && sliderShow.value && newList.length) {
        await nextTick()
        sliderVal.refresh()
      }
    })
  })

  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy()
    }
  })

  // 因为 KeepAlive 缓存
  // 组件首次挂载并且每次从缓存中被重新插入时触发
  onActivated(() => {
    slider.value.enable()
    slider.value.refresh()
  })

  // 从 DOM 上移除、进入缓存以及组件卸载时调用
  onDeactivated(() => {
    slider.value.disable()
  })

  return {
    slider,
  }
}
