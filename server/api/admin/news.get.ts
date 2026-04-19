import { requireAdminSession } from '../../utils/admin-auth'
import { listNewsPosts } from '../../utils/cms-store'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  return {
    items: await listNewsPosts()
  }
})
