import { requireAdminSession } from '../../utils/admin-auth'
import { listPages } from '../../utils/cms-store'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  return {
    items: await listPages()
  }
})
