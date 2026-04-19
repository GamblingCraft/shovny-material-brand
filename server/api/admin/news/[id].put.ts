import { readBody } from 'h3'
import { requireAdminSession } from '../../../utils/admin-auth'
import { upsertNewsPost } from '../../../utils/cms-store'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const body = await readBody(event)
  return upsertNewsPost(body, event.context.params?.id)
})
