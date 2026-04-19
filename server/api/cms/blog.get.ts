import { listBlogPosts } from '../../utils/cms-store'

export default defineEventHandler(async () => {
  return {
    items: await listBlogPosts()
  }
})

