import axios from 'axios'
import store from '@/store'

// create an axios instance
const service = axios.create({
  baseURL: 'http://szt.baoxianxia.com.cn', // url = base url + request url //http://192.168.1.133:7000
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000 // request timeout
})

export default service