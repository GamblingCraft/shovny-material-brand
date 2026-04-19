import { requireAdminSession } from '../../../utils/admin-auth'
import { deleteNewsPost } from '../../../utils/cms-store'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  await deleteNewsPost(event.context.params?.id ?? '')
  return { ok: true }
})
