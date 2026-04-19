export type CmsAuthor = {
  name: string
  role: string
  avatar: string
}

export type CmsBlogPost = {
  id: string
  slug: string
  title: string
  seoTitle: string
  seoDescription: string
  excerpt: string
  category: string
  date: string
  publishedAt: string
  readTime: string
  cover: string
  author: CmsAuthor
  tags: string[]
  body: string[]
  bodyHtml?: string
}

export type CmsNewsPost = {
  id: string
  slug: string
  title: string
  date: string
  publishedAt: string
  excerpt: string
  text: string
  textHtml?: string
  image: string
}

export type CmsPageFeature = {
  title: string
  text: string
}

export type CmsPageStat = {
  value: string
  label: string
}

export type CmsPageNewsItem = {
  title: string
  date: string
  text: string
  image: string
}

export type CmsPageContacts = {
  addressTitle: string
  addressText: string
  phone: string
  phoneText: string
  email: string
  emailText: string
}

export type CmsPageData = {
  slug: string
  title: string
  seoTitle: string
  seoDescription: string
  eyebrow: string
  lead: string
  body: string[]
  bodyHtml?: string
  image: string
  stats: CmsPageStat[]
  features: CmsPageFeature[]
  ctaLabel: string
  ctaTo: string
  news?: CmsPageNewsItem[]
  contacts?: CmsPageContacts
}

export type CmsStore = {
  blog: CmsBlogPost[]
  news: CmsNewsPost[]
  pages: CmsPageData[]
}
