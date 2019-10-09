import axios from "axios"
import { Message } from "element-ui"
import vue from "@/main"


const server = axios.create({
  baseURL: process.env.BASE_URL,
  withCredentials: true,
  timeout: process.env.TIMEOUT
})


server.interceptors.request.use( config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})

server.interceptors.response.use( 
  response => {
    //console.log('响应拦截器：', response)
    // 所有请求完成后都要执行的操作
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          Message({
            message: error.response.data.msg,
            type: 'error'
          })
          break
        case 403:
          sessionStorage.removeItem('token')
          vue.$router.push({
            name: 'login'
          })
          break
      }
    }

    return Promise.reject(error)
  }
)

export default server
