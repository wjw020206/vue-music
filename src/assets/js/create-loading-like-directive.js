import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'

const relativeCls = 'g-relative'

/** 创建类似 v-loading 的自定义指令 */
export default function createLoadingLikeDirective(Component) {
  return {
    mounted(el, binding) {
      const app = createApp(Component)

      const instance = app.mount(document.createElement('div'))
      // 获取组件名称
      const name = Component.name

      // 避免多个自定义指令组件相互覆盖实例对象
      if (!el[name]) {
        el[name] = {}
      }
      el[name].instance = instance

      // 使用自定义指令参数作为加载动画的提示文本
      const title = binding.arg
      if (typeof title !== 'undefined') {
        instance.setTitle(title)
      }

      if (binding.value) {
        append(el)
      }
    },
    updated(el, binding) {
      const title = binding.arg
      const name = Component.name

      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }
      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    },
  }

  /** 插入 DOM 节点 */
  function append(el) {
    const name = Component.name
    const style = getComputedStyle(el)

    // 使 v-loading 的绝对定位不完全依赖于元素的 position
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addClass(el, relativeCls)
    }

    el.appendChild(el[name].instance.$el)
  }

  /** 移除 DOM 节点 */
  function remove(el) {
    const name = Component.name
    removeClass(el, relativeCls)
    el.removeChild(el[name].instance.$el)
  }
}
