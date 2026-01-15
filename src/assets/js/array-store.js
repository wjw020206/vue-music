import storage from 'good-storage'

/** 往数组中插入元素 */
function insertArray(array, value, compare, maxLength) {
  const index = array.findIndex(compare)

  // 判断元素是否已经在数组中存在
  if (index > -1) return

  // 当元素在数组中不存在则首部插入进数组
  array.unshift(value)

  // 如果设置了最大长度限制并且数组个数超出最大长度限制
  if (maxLength && array.length > maxLength) {
    // 移除数组中的最后一个元素
    array.pop()
  }
}

/** 从数组中移除子元素 */
function deleteFromArray(array, compare) {
  const index = array.findIndex(compare)

  // 判断元素是否已经在数组中存在
  if (index > -1) {
    array.splice(index, 1)
  }
}

/** 添加子元素后持久化存储 */
export function save(item, key, compare, maxLength) {
  // 如果没有存储过对应的 key，则默认为一个空数组
  const items = storage.get(key, [])
  insertArray(items, item, compare, maxLength)
  storage.set(key, items)
  return items
}

/** 移除子元素后持久化存储 */
export function remove(key, compare) {
  const items = storage.get(key, [])
  deleteFromArray(items, compare)
  storage.set(key, items)
  return items
}

/** 加载对应 key 的持久化存储 */
export function load(key) {
  return storage.get(key, [])
}

/** 清空某个 key 下的所有数据 */
export function clear(key) {
  storage.remove(key)
  return []
}
