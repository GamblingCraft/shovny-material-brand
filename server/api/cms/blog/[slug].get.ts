import { createError } from 'h3'
import { getBlogPostBySlug } from '../../../utils/cms-store'

export default defineEventHandler(async (event) => {
  const item = await getBlogPostBySlug(event.context.params?.slug ?? '')

  if (!item) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Статья не найдена'
    })
  }

  return item
})

