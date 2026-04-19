import { createError, deleteCookie, getCookie, readBody, setCookie } from 'h3'
import type { H3Event } from 'h3'

export const adminCookieName = 'brand_admin_session'
const adminSessionValue = 'brand-admin-session-v1'

export const adminCredentials = {
  username: 'admin',
  password: 'Brand2026'
} as const

const legacyPasswords = ['BrandAdmin2026!', 'admin123']

export const hasAdminSession = (event: H3Event) => {
  return getCookie(event, adminCookieName) === adminSessionValue
}

export const requireAdminSession = (event: H3Event) => {
  if (!hasAdminSession(event)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Требуется авторизация'
    })
  }
}

export const setAdminSession = (event: H3Event) => {
  setCookie(event, adminCookieName, adminSessionValue, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 60 * 60 * 12
  })
}

export const clearAdminSession = (event: H3Event) => {
  deleteCookie(event, adminCookieName, {
    path: '/'
  })
}

export const readAdminLoginBody = async (event: H3Event) => {
  const body = await readBody<{ username?: string; password?: string }>(event)
  return {
    username: body?.username?.trim() ?? '',
    password: body?.password ?? ''
  }
}

export const validateAdminCredentials = (username: string, password: string) => {
  return username === adminCredentials.username
    && [adminCredentials.password, ...legacyPasswords].includes(password)
}
