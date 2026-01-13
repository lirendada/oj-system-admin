import axios from 'axios'
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import type { Result } from '@/types/global'
import router from '@/router'

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('admin_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<Result>) => {
    const res = response.data

    // code 为 1000 表示成功
    if (res.code === 1000) {
      return res.data
    }

    // 处理业务错误
    ElMessage.error(res.message || '请求失败')

    // 特殊处理未登录
    if (res.code === 40100) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      router.push('/login')
    }

    return Promise.reject(new Error(res.message || '请求失败'))
  },
  (error: AxiosError) => {
    console.error('请求错误:', error)

    // 处理 HTTP 错误状态码
    if (error.response) {
      const status = error.response.status
      switch (status) {
        case 401:
          ElMessage.error('未授权，请重新登录')
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_user')
          router.push('/login')
          break
        case 403:
          ElMessage.error('拒绝访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(`请求失败: ${error.message}`)
      }
    } else if (error.request) {
      ElMessage.error('网络错误，请检查网络连接')
    } else {
      ElMessage.error(`请求失败: ${error.message}`)
    }

    return Promise.reject(error)
  }
)

export default request
