import { requireAdminSession } from '../../../utils/admin-auth'
import { deleteBlogPost } from '../../../utils/cms-store'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  await deleteBlogPost(event.context.params?.id ?? '')
  return { ok: true }
})
