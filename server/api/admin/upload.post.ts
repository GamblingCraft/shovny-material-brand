import { mkdir, writeFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { createError, readMultipartFormData } from 'h3'
import { requireAdminSession } from '../../utils/admin-auth'

const uploadDirectory = join(process.cwd(), 'public', 'uploads', 'content')

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const formData = await readMultipartFormData(event)
  const file = formData?.find(item => item.name === 'file')

  if (!file?.data || !file.filename) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Файл не передан'
    })
  }

  const mimeType = file.type || ''

  if (!mimeType.startsWith('image/')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Разрешены только изображения'
    })
  }

  const extension = extname(file.filename) || '.jpg'
  const filename = `${randomUUID()}${extension.toLowerCase()}`

  await mkdir(uploadDirectory, { recursive: true })
  await writeFile(join(uploadDirectory, filename), file.data)

  return {
    url: `/uploads/content/${filename}`
  }
})
