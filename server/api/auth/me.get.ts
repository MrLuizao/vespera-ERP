import { defineEventHandler, getCookie, createError } from 'h3'
import type { CfoUser } from './login.post'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'cfo_auth_token')
  const rawUser = getCookie(event, 'cfo_user')

  if (!token || !rawUser) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No autenticado'
    })
  }

  try {
    const user = JSON.parse(rawUser) as CfoUser
    return {
      authenticated: true,
      user
    }
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Sesión corrupta'
    })
  }
})
