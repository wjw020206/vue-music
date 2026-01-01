import { createApp } from 'vue'
import Loading from '@/components/base/loading/index.vue'
import { addClass, removeClass } from '@/assets/js/dom'

const relativeCls = 'g-relative'

const loadingDirective = {
  mounted(el, binding) {
    const app = createApp(Loading)
    const instance = app.mount(document.createElement('div'))
    el.instance = instance

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
    if (typeof title !== 'undefined') {
      el.instance.setTitle(title)
    }
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  },
}

/** 插入 DOM 节点 */
function append(el) {
  const style = getComputedStyle(el)

  // 使 v-loading 的绝对定位不完全依赖于元素的 position
  if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
    addClass(el, relativeCls)
  }

  el.appendChild(el.instance.$el)
}

/** 移除 DOM 节点 */
function remove(el) {
  removeClass(el, relativeCls)
  el.removeChild(el.instance.$el)
}

export default loadingDirective
