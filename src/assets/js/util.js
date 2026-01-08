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

/** 格式化时间
 * @param {number} interval 秒
 */
export function formatTime(interval) {
  // 将毫秒数向下取整
  interval = interval | 0

  // 计算分钟部分
  const minute = (((interval / 60) | 0) + '').padStart(2, '0')
  const second = ((interval % 60) + '').padStart(2, '0')

  return `${minute}:${second}`
}

/** 随机获取一个整数值（取 0 ~ max 之间的值） */
function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1))
}

/** 交换数组中的元素位置 */
function swap(arr, i, j) {
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
}
