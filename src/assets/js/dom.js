/** 添加类样式 */
export function addClass(el, className) {
  if (!el.classList.contains(className)) {
    el.classList.add(className)
  }
}

/** 移除类样式 */
export function removeClass(el, className) {
  el.classList.remove(className)
}
