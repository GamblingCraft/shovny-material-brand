import { readBody } from 'h3'
import { requireAdminSession } from '../../../utils/admin-auth'
import { upsertBlogPost } from '../../../utils/cms-store'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const body = await readBody(event)
  return upsertBlogPost(body, event.context.params?.id)
})
