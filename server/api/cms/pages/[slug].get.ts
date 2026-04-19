import { createError } from 'h3'
import { getPageBySlug } from '../../../utils/cms-store'

export default defineEventHandler(async (event) => {
  const page = await getPageBySlug(event.context.params?.slug ?? '')

  if (!page) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Страница не найдена'
    })
  }

  return page
})
