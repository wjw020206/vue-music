import storage from 'good-storage'

function insertArray(arr, value, compare, maxLength) {
  const index = arr.findIndex(compare)

  // 如果在数组中已经存在，则不操作
  if (index > -1) {
    return
  }

  arr.unshift(value)

  if (maxLength && arr.length > maxLength) {
    arr.pop()
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)

  // 如果在数组中已经存在，则不操作
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function save(item, key, compare, maxLength) {
  const items = storage.get(key, [])
  insertArray(items, item, compare)
  storage.set(key, items)
  return items
}

export function remove(key, compare) {
  const items = storage.get(key, [])
  deleteFromArray(items, compare)
  storage.set(key, items)
  return items
}

export function load(key) {
  return storage.get(key, [])
}
