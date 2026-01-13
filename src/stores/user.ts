import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserEntity } from '@/types/global'

export const useUserStore = defineStore('admin-user', () => {
  // 状态
  const token = ref<string>('')
  const userInfo = ref<UserEntity | null>(null)

  // 设置登录状态
  const setLoginState = (data: { user: UserEntity; token: string }) => {
    token.value = data.token
    userInfo.value = data.user

    // 持久化到 localStorage
    localStorage.setItem('admin_token', data.token)
    localStorage.setItem('admin_user', JSON.stringify(data.user))
  }

  // 登出
  const logout = () => {
    token.value = ''
    userInfo.value = null

    // 清除 localStorage
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
  }

  // 从 localStorage 加载状态
  const loadState = () => {
    try {
      const savedToken = localStorage.getItem('admin_token')
      const savedUser = localStorage.getItem('admin_user')

      if (savedToken) {
        token.value = savedToken
      }

      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        try {
          userInfo.value = JSON.parse(savedUser)
        } catch (e) {
          console.error('解析用户信息失败:', e)
          localStorage.removeItem('admin_user')
        }
      }
    } catch (error) {
      console.error('加载状态失败:', error)
    }
  }

  // 初始化时加载状态
  loadState()

  return {
    token,
    userInfo,
    setLoginState,
    logout,
    loadState
  }
})
