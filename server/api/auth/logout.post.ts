import { defineEventHandler, deleteCookie } from 'h3'

export default defineEventHandler((event) => {
  deleteCookie(event, 'cfo_auth_token', { path: '/' })
  deleteCookie(event, 'cfo_user', { path: '/' })

  return {
    status: 'LOGGED_OUT'
  }
})
