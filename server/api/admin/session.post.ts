import { createError } from 'h3'
import { adminCredentials, readAdminLoginBody, setAdminSession, validateAdminCredentials } from '../../utils/admin-auth'

export default defineEventHandler(async (event) => {
  const { username, password } = await readAdminLoginBody(event)

  if (!validateAdminCredentials(username, password)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Неверный логин или пароль'
    })
  }

  setAdminSession(event)

  return {
    authenticated: true,
    username: adminCredentials.username
  }
})
