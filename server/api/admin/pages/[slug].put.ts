import { readBody } from 'h3'
import { requireAdminSession } from '../../../utils/admin-auth'
import { upsertPage } from '../../../utils/cms-store'
import type { CmsPageData } from '../../../../shared/types/cms'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const body = await readBody<CmsPageData>(event)

  return upsertPage(body, event.context.params?.slug)
})
