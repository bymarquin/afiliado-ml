import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import http from '@/services/http'

const TOKEN_KEY = 'token'
const USER_KEY = 'usuario'
const LEGACY_TOKEN_KEY = 'auth_token'
const LEGACY_USER_KEY = 'auth_user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY) || '')
  const user = ref(null)
  const isLoading = ref(false)
  const isInitialized = ref(false)

  function hydrateUserFromStorage() {
    const raw = localStorage.getItem(USER_KEY) || localStorage.getItem(LEGACY_USER_KEY)
    if (!raw) {
      user.value = null
      return
    }

    try {
      user.value = JSON.parse(raw)
    } catch {
      user.value = null
    }
  }

  function setSession(nextToken, nextUser) {
    token.value = nextToken || ''
    user.value = nextUser || null

    if (token.value) {
      localStorage.setItem(TOKEN_KEY, token.value)
      localStorage.removeItem(LEGACY_TOKEN_KEY)
    } else {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(LEGACY_TOKEN_KEY)
    }

    if (user.value) {
      localStorage.setItem(USER_KEY, JSON.stringify(user.value))
      localStorage.removeItem(LEGACY_USER_KEY)
    } else {
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(LEGACY_USER_KEY)
    }
  }

  async function login(email, password) {
    isLoading.value = true
    try {
      const { data } = await http.post('/usuarios/login', {
        email: String(email || '').trim(),
        password: String(password || ''),
      })

      const payload = data?.data
      setSession(payload?.token || '', {
        id: payload?.id,
        name: payload?.name,
        email: payload?.email,
      })
      return payload
    } finally {
      isLoading.value = false
    }
  }

  async function fetchMe() {
    if (!token.value) return null

    try {
      const { data } = await http.get('/usuarios/me')
      const me = data?.data || null
      if (!me) return null
      user.value = me
      localStorage.setItem(USER_KEY, JSON.stringify(me))
      return me
    } catch {
      logout()
      return null
    }
  }

  function logout() {
    setSession('', null)
  }

  function init() {
    if (isInitialized.value) return
    hydrateUserFromStorage()
    isInitialized.value = true
  }

  async function ensureSession() {
    init()
    if (token.value && !user.value) {
      await fetchMe()
    }
  }

  const isAuthenticated = computed(() => Boolean(token.value))

  return {
    token,
    user,
    isLoading,
    isInitialized,
    isAuthenticated,
    init,
    ensureSession,
    login,
    fetchMe,
    logout,
  }
})
