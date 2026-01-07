/** 洗牌 */
export function shuffle(source) {
  // 复制新数组
  const arr = source.slice()

  // 使用洗牌算法打乱
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }

  return arr
}

/** 随机获取一个整数值（取 0 ~ max 之间的值） */
function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1))
}

/** 交换数组中的元素位置 */
function swap(arr, i, j) {
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
}
