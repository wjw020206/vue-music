import axios from 'axios'

const ERR_OK = 0
// 此处替换为实际的接口请求地址
const baseURL =
  process.env.NODE_ENV === 'production' ? 'http://127.0.0.1/' : '/'

axios.defaults.baseURL = baseURL

export function get(url, params) {
  return axios
    .get(url, {
      params,
    })
    .then((res) => {
      const serverData = res.data
      if (serverData.code === ERR_OK) {
        return serverData.result
      }
    })
    .catch((e) => {
      console.log(e)
    })
}
