import type { CmsNewsPost, CmsPageData } from '../../shared/types/cms'
import { internalPages, type InternalPageSlug } from '~/data/internal-pages'

export const getFallbackPage = (slug: InternalPageSlug): CmsPageData => {
  return internalPages[slug] as CmsPageData
}

export const getFallbackNewsPosts = (): CmsNewsPost[] => {
  return (internalPages.news.news ?? []).map((item, index) => ({
    id: `news-${index + 1}`,
    slug: `novost-${index + 1}`,
    title: item.title,
    date: item.date,
    publishedAt: `2026-04-${String(index + 1).padStart(2, '0')}`,
    excerpt: item.text,
    text: item.text,
    image: item.image
  }))
}
