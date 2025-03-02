// stores/auth.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token') || null)
  const user = ref<{ id: string; name: string } | null>(null)

  // 登录方法
  const login = async (credentials: { username: string; password: string }) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
    const data = await response.json()

    // 保存 Token 到 localStorage 和状态
    token.value = data.token
    localStorage.setItem('token', data.token)

    // 获取用户信息
    user.value = await fetchUserInfo(data.token)
  }

  // 自动登录（应用启动时调用）
  const autoLogin = async () => {
    if (token.value) {
      user.value = await fetchUserInfo(token.value)
    }
  }

  // 退出登录
  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return { token, user, login, logout, autoLogin }
})

// 获取用户信息的辅助函数
async function fetchUserInfo(token: string) {
  const response = await fetch('/api/user', {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.json()
}
