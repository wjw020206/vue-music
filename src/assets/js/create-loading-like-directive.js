import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'

const relativeClass = 'g-relative'

export default function createLoadingLikeDirective(component) {
  return {
    mounted(el, binding) {
      // 创建的新的 Vue 实例，并挂载到一个动态的 div 元素上
      const app = createApp(component)
      const instance = app.mount(document.createElement('div'))

      const name = component.name
      if (!el[name]) {
        el[name] = {}
      }

      el[name].instance = instance

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
      const name = component.name

      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }

      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    },
  }

  /** 插入loading */
  function append(el) {
    const style = getComputedStyle(el)
    const name = component.name

    if (!['absolute', 'fixed', 'relative'].includes(style.position)) {
      addClass(el, relativeClass)
    }
    el.appendChild(el[name].instance.$el)
  }

  /** 删除loading */
  function remove(el) {
    const name = component.name
    el.removeChild(el[name].instance.$el)
    removeClass(el, relativeClass)
  }
}
