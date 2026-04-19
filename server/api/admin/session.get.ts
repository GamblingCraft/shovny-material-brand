import { hasAdminSession, requireAdminSession, adminCredentials } from '../../utils/admin-auth'

export default defineEventHandler((event) => {
  if (!hasAdminSession(event)) {
    return {
      authenticated: false
    }
  }

  requireAdminSession(event)

  return {
    authenticated: true,
    username: adminCredentials.username
  }
})
