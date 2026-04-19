import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { internalPages } from '../../app/data/internal-pages'
import type { CmsBlogPost, CmsNewsPost, CmsPageData, CmsStore } from '../../shared/types/cms'

const cmsFilePath = join(process.cwd(), 'server', 'data', 'cms.json')

const blogPlaceholderImage =
  'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=1600&q=80'

const defaultCmsStore: CmsStore = {
  blog: [
    {
      id: 'blog-1',
      slug: 'statya-1',
      title: 'Статья 1. Как выбирать шовный материал под профиль вмешательства',
      seoTitle: 'Статья 1 | Как выбирать шовный материал',
      seoDescription:
        'Тестовая статья для раздела блога: базовые ориентиры по выбору шовного материала под тип клинической задачи.',
      excerpt:
        'Короткий материал о том, как системно подойти к выбору шовного материала, если нужно быстро сопоставить задачу, свойства нити и требования учреждения.',
      category: 'Экспертный материал',
      date: '16 апреля 2026',
      publishedAt: '2026-04-16',
      readTime: '5 мин чтения',
      cover: blogPlaceholderImage,
      author: {
        name: 'Редакция BRAND',
        role: 'Контент-команда',
        avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80'
      },
      tags: ['Шовный материал', 'Категории', 'Практика'],
      body: [
        'Выбор шовного материала обычно начинается не с бренда, а с клинической задачи. Важно понимать тип ткани, ожидаемую нагрузку на шов, необходимость длительной поддержки и предпочтительный сценарий заживления.',
        'На практике удобнее всего собирать решение через несколько опорных параметров: рассасываемость, структура нити, диаметр, формат иглы и доступность позиции в регулярной поставке. Такой подход помогает быстрее согласовать рабочий ассортимент между врачом, отделом закупок и поставщиком.',
        'Если каталог выстроен логично, пользователь двигается от категории к конкретному товару без лишних шагов. Поэтому хороший блоговый материал может не только давать экспертный контекст, но и подводить читателя к подходящей категории ассортимента.'
      ]
    },
    {
      id: 'blog-2',
      slug: 'statya-2',
      title: 'Статья 2. Что важно учесть при формировании базового ассортимента',
      seoTitle: 'Статья 2 | Базовый ассортимент шовного материала',
      seoDescription:
        'Тестовая статья о том, как формировать стартовый ассортимент по категориям, запасу и сценариям использования.',
      excerpt:
        'Разбираем, как собрать понятную матрицу ассортимента для регулярных закупок и не перегрузить каталог лишними позициями на старте.',
      category: 'Ассортимент',
      date: '15 апреля 2026',
      publishedAt: '2026-04-15',
      readTime: '6 мин чтения',
      cover: blogPlaceholderImage,
      author: {
        name: 'Анна Петрова',
        role: 'Медицинский редактор',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=80'
      },
      tags: ['Закупки', 'Ассортимент', 'Поставка'],
      body: [
        'Базовый ассортимент должен покрывать типовые сценарии без избыточного числа дублирующих позиций. На старте обычно достаточно выстроить понятную сетку категорий, внутри которой легко выбирать товар по ключевым параметрам.',
        'Для закупочной команды особенно важны стабильность наличия, прозрачные характеристики и предсказуемость сроков поставки. Если эти параметры учтены заранее, каталог становится рабочим инструментом, а не просто витриной.',
        'В блоге такую тему удобно раскрывать через практические примеры: какие группы товаров действительно нужны в регулярной работе, какие позиции стоит вынести в отдельные категории и как не перегружать пользователя выбором.'
      ]
    },
    {
      id: 'blog-3',
      slug: 'statya-3',
      title: 'Статья 3. Почему структура каталога влияет на конверсию обращения',
      seoTitle: 'Статья 3 | Структура каталога и конверсия',
      seoDescription:
        'Тестовая статья о том, как архитектура каталога влияет на удобство пользователя и количество обращений.',
      excerpt:
        'Показываем, как понятная структура категорий, карточек товара и внутренней навигации помогает доводить пользователя до заявки.',
      category: 'Маркетинг и UX',
      date: '14 апреля 2026',
      publishedAt: '2026-04-14',
      readTime: '4 мин чтения',
      cover: blogPlaceholderImage,
      author: {
        name: 'Игорь Смирнов',
        role: 'Редактор раздела',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80'
      },
      tags: ['UX', 'Каталог', 'Конверсия'],
      body: [
        'Когда пользователь попадает в каталог из посадочной страницы, ему нужен предсказуемый маршрут: категория, фильтры, карточка товара, форма обращения. Если на любом этапе логика ломается, растёт вероятность ухода без действия.',
        'Блог помогает подсветить ценность этой структуры. Через статьи можно объяснить принципы выбора, показать разницу между категориями и дать дополнительный контекст для принятия решения.',
        'Даже тестовый раздел блога уже полезен как часть общей архитектуры сайта: он расширяет семантику, усиливает внутреннюю перелинковку и создаёт ещё одну точку входа в каталог и контактные страницы.'
      ]
    }
  ],
  news: [
    {
      id: 'news-1',
      slug: 'novost-1',
      title: 'BRAND расширяет линейку хирургического шовного материала',
      date: '16 апреля 2026',
      publishedAt: '2026-04-16',
      excerpt: 'Компания обновляет блок продуктовых позиций для деликатных и точных вмешательств.',
      text: 'Компания обновляет блок продуктовых позиций для деликатных и точных вмешательств, включая категории для специализированных процедур и рабочих сценариев медицинских учреждений.',
      image:
        'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'news-2',
      slug: 'novost-2',
      title: 'Участие в отраслевой выставке и встречи с партнёрами',
      date: '13 апреля 2026',
      publishedAt: '2026-04-13',
      excerpt: 'Команда представила каталог и обсудила сценарии поставок с учреждениями и дилерами.',
      text: 'На профильном мероприятии команда представила продуктовую структуру каталога, обсудила поставки и собрала обратную связь от учреждений и дилеров.',
      image:
        'https://images.unsplash.com/photo-1581594549595-35f6edc7b762?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'news-3',
      slug: 'novost-3',
      title: 'Обновление внутренней архитектуры сайта и контентных страниц',
      date: '10 апреля 2026',
      publishedAt: '2026-04-10',
      excerpt: 'Сайт развивается как единая система посадочных страниц, каталога и контентных разделов.',
      text: 'Сайт развивается как единая система посадочных страниц, каталога и контентных разделов, чтобы пользователям было удобнее двигаться по разделам и быстрее доходить до заявки.',
      image:
        'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80'
    }
  ],
  pages: Object.values(internalPages) as CmsPageData[]
}

const formatDateLabel = (date: string) => {
  const dateValue = new Date(date)

  if (Number.isNaN(dateValue.getTime())) {
    return date
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Irkutsk'
  }).format(dateValue)
}

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-zа-я0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

const htmlToPlainText = (value?: string) => {
  if (!value) {
    return ''
  }

  return value
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|blockquote|h1|h2|h3|h4|h5|h6)>/gi, '\n\n')
    .replace(/<li>/gi, '• ')
    .replace(/<hr\s*\/?>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

const htmlToParagraphs = (value?: string) =>
  htmlToPlainText(value)
    .split(/\n{2,}/)
    .map(item => item.trim())
    .filter(Boolean)

const ensureCmsFile = async () => {
  try {
    await access(cmsFilePath)
  }
  catch {
    await mkdir(dirname(cmsFilePath), { recursive: true })
    await writeFile(cmsFilePath, JSON.stringify(defaultCmsStore, null, 2), 'utf8')
  }
}

export const readCmsStore = async () => {
  await ensureCmsFile()
  const file = await readFile(cmsFilePath, 'utf8')
  const parsed = JSON.parse(file) as Partial<CmsStore>
  const normalized: CmsStore = {
    blog: Array.isArray(parsed.blog)
      ? parsed.blog.map(item => ({
          ...item,
          bodyHtml: item.bodyHtml ?? item.body.map(paragraph => `<p>${paragraph}</p>`).join('')
        }))
      : defaultCmsStore.blog,
    news: Array.isArray(parsed.news)
      ? parsed.news.map(item => ({
          ...item,
          textHtml: item.textHtml ?? `<p>${item.text}</p>`
        }))
      : defaultCmsStore.news,
    pages: Array.isArray(parsed.pages)
      ? parsed.pages.map(item => ({
          ...item,
          bodyHtml: item.bodyHtml ?? item.body.map(paragraph => `<p>${paragraph}</p>`).join('')
        }))
      : defaultCmsStore.pages
  }

  if (
    !Array.isArray(parsed.blog)
    || !Array.isArray(parsed.news)
    || !Array.isArray(parsed.pages)
  ) {
    await writeCmsStore(normalized)
  }

  return normalized
}

export const writeCmsStore = async (store: CmsStore) => {
  await mkdir(dirname(cmsFilePath), { recursive: true })
  await writeFile(cmsFilePath, JSON.stringify(store, null, 2), 'utf8')
}

export const listBlogPosts = async () => {
  const store = await readCmsStore()
  return [...store.blog].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt))
}

export const getBlogPostBySlug = async (slug: string) => {
  const posts = await listBlogPosts()
  return posts.find((item) => item.slug === slug)
}

export const listNewsPosts = async () => {
  const store = await readCmsStore()
  return [...store.news].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt))
}

export const listPages = async () => {
  const store = await readCmsStore()
  return [...store.pages]
}

export const getPageBySlug = async (slug: string) => {
  const pages = await listPages()
  return pages.find((item) => item.slug === slug)
}

export const upsertBlogPost = async (
  payload: Partial<CmsBlogPost> & {
    title: string
    excerpt: string
    category: string
    publishedAt: string
    readTime: string
    cover: string
    author: CmsBlogPost['author']
    tags: string[]
    body: string[]
    bodyHtml?: string
  },
  id?: string
) => {
  const store = await readCmsStore()
  const nextItem: CmsBlogPost = {
    id: id ?? payload.id ?? randomUUID(),
    slug: payload.slug?.trim() || slugify(payload.title),
    title: payload.title,
    seoTitle: payload.seoTitle?.trim() || payload.title,
    seoDescription: payload.seoDescription?.trim() || payload.excerpt,
    excerpt: payload.excerpt,
    category: payload.category,
    date: formatDateLabel(payload.publishedAt),
    publishedAt: payload.publishedAt,
    readTime: payload.readTime,
    cover: payload.cover,
    author: payload.author,
    tags: payload.tags,
    body: payload.bodyHtml ? htmlToParagraphs(payload.bodyHtml) : payload.body,
    bodyHtml: payload.bodyHtml
  }

  const index = store.blog.findIndex((item) => item.id === nextItem.id)

  if (index >= 0) {
    store.blog[index] = nextItem
  }
  else {
    store.blog.push(nextItem)
  }

  await writeCmsStore(store)
  return nextItem
}

export const deleteBlogPost = async (id: string) => {
  const store = await readCmsStore()
  store.blog = store.blog.filter((item) => item.id !== id)
  await writeCmsStore(store)
}

export const upsertNewsPost = async (
  payload: Partial<CmsNewsPost> & {
    title: string
    excerpt: string
    text: string
    textHtml?: string
    publishedAt: string
    image: string
  },
  id?: string
) => {
  const store = await readCmsStore()
  const nextItem: CmsNewsPost = {
    id: id ?? payload.id ?? randomUUID(),
    slug: payload.slug?.trim() || slugify(payload.title),
    title: payload.title,
    date: formatDateLabel(payload.publishedAt),
    publishedAt: payload.publishedAt,
    excerpt: payload.excerpt,
    text: payload.textHtml ? htmlToPlainText(payload.textHtml) : payload.text,
    textHtml: payload.textHtml,
    image: payload.image
  }

  const index = store.news.findIndex((item) => item.id === nextItem.id)

  if (index >= 0) {
    store.news[index] = nextItem
  }
  else {
    store.news.push(nextItem)
  }

  await writeCmsStore(store)
  return nextItem
}

export const deleteNewsPost = async (id: string) => {
  const store = await readCmsStore()
  store.news = store.news.filter((item) => item.id !== id)
  await writeCmsStore(store)
}

export const upsertPage = async (payload: CmsPageData, slug?: string) => {
  const store = await readCmsStore()
  const nextItem: CmsPageData = {
    ...payload,
    slug: slug ?? payload.slug
  }

  const index = store.pages.findIndex((item) => item.slug === nextItem.slug)

  if (index >= 0) {
    store.pages[index] = nextItem
  }
  else {
    store.pages.push(nextItem)
  }

  await writeCmsStore(store)
  return nextItem
}
