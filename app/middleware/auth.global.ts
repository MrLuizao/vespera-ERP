export default defineNuxtRouteMiddleware((to) => {
  const tokenCookie = useCookie<string | null>('cfo_auth_token')
  const userCookie = useCookie<any>('cfo_user')

  const isAuthenticated = !!tokenCookie.value && !!userCookie.value

  // Si no está autenticado y no está en la pantalla de login, redirigir forzosamente al login
  if (!isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }

  // Si ya está autenticado e intenta ir a /login o a la raíz /, dirigirlo al panel principal
  if (isAuthenticated && (to.path === '/login' || to.path === '/')) {
    return navigateTo('/main')
  }
})
