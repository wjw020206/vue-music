import { createApp } from 'vue'
import Loading from './index.vue'
import { addClass } from '@/assets/js/dom'

const relativeClass = 'g-relative'

const loadingDirective = {
  mounted(el, binding) {
    // 创建的新的 Vue 实例，并挂载到一个动态的 div 元素上
    const app = createApp(Loading)
    const instance = app.mount(document.createElement('div'))
    el.instance = instance

    // 从指令参数中获取加载显示的文字内容
    const title = binding.arg

    if (typeof title !== 'undefined') {
      instance.setTitle(title)
    }

    if (binding.value) {
      append(el)
    }
  },
  updated(el, binding) {
    // 从指令参数中获取加载显示的文字内容
    const title = binding.arg

    if (typeof title !== 'undefined') {
      el.instance.setTitle(title)
    }

    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  },
}

/** 插入loading */
function append(el) {
  const style = getComputedStyle(el)

  if (!['absolute', 'fixed', 'relative'].includes(style.position)) {
    addClass(el, relativeClass)
  }
  el.appendChild(el.instance.$el)
}

/** 删除loading */
function remove(el) {
  el.removeChild(el.instance.$el)
  addClass(el, relativeClass)
}

export default loadingDirective
