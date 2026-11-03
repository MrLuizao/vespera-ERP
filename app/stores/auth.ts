import { defineStore } from 'pinia'
import { useCfoStore } from './cfo'

export interface CfoAuthUser {
  id: string
  username: string
  email: string
  name: string
  role: 'Socio Director' | 'Socio Capitalista' | 'Socio Operador' | 'Director Financiero (CFO)'
  equityPct: number
  investedCapital: number
  avatarInitials: string
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    const tokenCookie = useCookie<string | null>('cfo_auth_token')
    const userCookie = useCookie<CfoAuthUser | null>('cfo_user')

    return {
      token: tokenCookie.value || null,
      user: userCookie.value || null,
      isLoading: false,
      authError: ''
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    currentUser: (state) => state.user,
    userRole: (state) => state.user?.role || 'Socio Inversionista'
  },

  actions: {
    async login(usernameOrEmail: string, password?: string) {
      this.isLoading = true
      this.authError = ''

      try {
        const response = await $fetch<{ status: string; token: string; user: CfoAuthUser }>('/api/auth/login', {
          method: 'POST',
          body: {
            username: usernameOrEmail,
            password: password || 'socio2026'
          }
        })

        if (response && response.token) {
          const tokenCookie = useCookie<string | null>('cfo_auth_token', { maxAge: 60 * 60 * 24 * 7, path: '/' })
          const userCookie = useCookie<CfoAuthUser | null>('cfo_user', { maxAge: 60 * 60 * 24 * 7, path: '/' })

          tokenCookie.value = response.token
          userCookie.value = response.user

          this.token = response.token
          this.user = response.user

          // Sincronizar el socio activo en cfoStore
          const cfoStore = useCfoStore()
          cfoStore.setPartner(response.user.id)

          return { success: true, user: response.user }
        }

        throw new Error('Respuesta de autenticación incompleta')
      } catch (err: any) {
        const msg = err.data?.statusMessage || err.message || 'Error de autenticación'
        this.authError = msg
        return { success: false, error: msg }
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        await $fetch('/api/auth/logout', { method: 'POST' })
      } catch {
        // Ignorar fallo de red en logout
      } finally {
        const tokenCookie = useCookie<string | null>('cfo_auth_token')
        const userCookie = useCookie<CfoAuthUser | null>('cfo_user')

        tokenCookie.value = null
        userCookie.value = null

        this.token = null
        this.user = null

        await navigateTo('/login')
      }
    }
  }
})
