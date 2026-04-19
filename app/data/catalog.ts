export type CatalogCategory = {
  slug: string
  title: string
  shortDescription: string
  description: string
  heroTitle: string
  heroLead: string
  image: string
  seoTitle: string
  seoDescription: string
}

export type CatalogProduct = {
  slug: string
  title: string
  subtitle: string
  badge: string
  article: string
  price: number
  priceLabel: string
  image: string
  gallery: string[]
  category: string
  absorbability: string
  construction: string
  application: string
  size: string
  length: string
  needle: string
  summary: string
  inStock: boolean
  isNew?: boolean
  isPopular?: boolean
  isRecommended?: boolean
}

const placeholderImage =
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=80'

const placeholderGallery = [placeholderImage, placeholderImage, placeholderImage]

const categorySlugs = ['absorbable', 'non-absorbable', 'monofilament', 'braided', 'atraumatic', 'ophthalmic']

export const catalogCategories: CatalogCategory[] = categorySlugs.map((slug, index) => {
  const categoryNumber = index + 1

  return {
    slug,
    title: `Категория ${categoryNumber}`,
    shortDescription: 'Шовный материал в формате универсальной заглушки для наполнения каталога.',
    description:
      'Раздел используется как временная структура каталога. Здесь будет размещаться шовный материал с реальными характеристиками, фото и логикой подбора.',
    heroTitle: `Категория ${categoryNumber}`,
    heroLead:
      'Временная категория для демонстрации структуры каталога. После наполнения здесь появятся реальные группы продукции, фильтры и подробные описания шовного материала.',
    image: placeholderImage,
    seoTitle: `Категория ${categoryNumber} шовного материала`,
    seoDescription:
      'Временная SEO-страница категории шовного материала. Позже здесь будут размещены реальные товары, характеристики и ассортимент.'
  }
})

export const catalogProducts: CatalogProduct[] = [
  {
    slug: 'polysorb-rapid-3-0',
    title: 'Товар 1',
    subtitle: 'Шовный материал',
    badge: 'Новинка',
    article: 'BR-001',
    price: 1490,
    priceLabel: 'от 1 490 ₽',
    image: placeholderImage,
    gallery: placeholderGallery,
    category: 'absorbable',
    absorbability: 'Шовный материал',
    construction: 'Шовный материал',
    application: 'Шовный материал',
    size: 'Размер 1',
    length: '70 см',
    needle: 'Игла 1',
    summary: 'Универсальная заглушка товара для будущего наполнения каталога шовного материала.',
    inStock: true,
    isNew: true,
    isRecommended: true
  },
  {
    slug: 'soft-tissue-glyco-4-0',
    title: 'Товар 2',
    subtitle: 'Шовный материал',
    badge: 'Хит',
    article: 'BR-002',
    price: 1590,
    priceLabel: 'от 1 590 ₽',
    image: placeholderImage,
    gallery: placeholderGallery,
    category: 'absorbable',
    absorbability: 'Шовный материал',
    construction: 'Шовный материал',
    application: 'Шовный материал',
    size: 'Размер 2',
    length: '75 см',
    needle: 'Игла 2',
    summary: 'Временная карточка товара для проверки сетки, фильтров и визуала в каталоге.',
    inStock: true,
    isNew: true
  },
  {
    slug: 'monocare-prolene-4-0',
    title: 'Товар 3',
    subtitle: 'Шовный материал',
    badge: 'Популярный',
    article: 'BR-003',
    price: 1690,
    priceLabel: 'от 1 690 ₽',
    image: placeholderImage,
    gallery: placeholderGallery,
    category: 'non-absorbable',
    absorbability: 'Шовный материал',
    construction: 'Шовный материал',
    application: 'Шовный материал',
    size: 'Размер 3',
    length: '80 см',
    needle: 'Игла 3',
    summary: 'Унифицированная заглушка для демонстрации внутренней страницы и карточки товара.',
    inStock: true,
    isPopular: true
  },
  {
    slug: 'vascular-nylon-6-0',
    title: 'Товар 4',
    subtitle: 'Шовный материал',
    badge: 'Под заказ',
    article: 'BR-004',
    price: 1790,
    priceLabel: 'от 1 790 ₽',
    image: placeholderImage,
    gallery: placeholderGallery,
    category: 'non-absorbable',
    absorbability: 'Шовный материал',
    construction: 'Шовный материал',
    application: 'Шовный материал',
    size: 'Размер 4',
    length: '65 см',
    needle: 'Игла 4',
    summary: 'Заглушка товара без реальной номенклатуры, пока не подключены настоящие позиции.',
    inStock: false
  },
  {
    slug: 'monoline-nylon-5-0',
    title: 'Товар 5',
    subtitle: 'Шовный материал',
    badge: 'В наличии',
    article: 'BR-005',
    price: 1890,
    priceLabel: 'от 1 890 ₽',
    image: placeholderImage,
    gallery: placeholderGallery,
    category: 'monofilament',
    absorbability: 'Шовный материал',
    construction: 'Шовный материал',
    application: 'Шовный материал',
    size: 'Размер 5',
    length: '90 см',
    needle: 'Игла 5',
    summary: 'Карточка используется как тестовая единица для каталога и будущей SEO-структуры.',
    inStock: true
  },
  {
    slug: 'mono-skin-pro-4-0',
    title: 'Товар 6',
    subtitle: 'Шовный материал',
    badge: 'Рекомендуем',
    article: 'BR-006',
    price: 1990,
    priceLabel: 'от 1 990 ₽',
    image: placeholderImage,
    gallery: placeholderGallery,
    category: 'monofilament',
    absorbability: 'Шовный материал',
    construction: 'Шовный материал',
    application: 'Шовный материал',
    size: 'Размер 6',
    length: '85 см',
    needle: 'Игла 6',
    summary: 'Упрощенная карточка товара, чтобы спокойно отстраивать визуал до реального наполнения.',
    inStock: true,
    isRecommended: true
  },
  {
    slug: 'steriflex-2-0',
    title: 'Товар 7',
    subtitle: 'Шовный материал',
    badge: 'Популярный',
    article: 'BR-007',
    price: 2090,
    priceLabel: 'от 2 090 ₽',
    image: placeholderImage,
    gallery: placeholderGallery,
    category: 'braided',
    absorbability: 'Шовный материал',
    construction: 'Шовный материал',
    application: 'Шовный материал',
    size: 'Размер 7',
    length: '70 см',
    needle: 'Игла 7',
    summary: 'Временная позиция каталога с одинаковым визуалом для аккуратной демонстрации интерфейса.',
    inStock: true,
    isPopular: true
  },
  {
    slug: 'braid-control-3-0',
    title: 'Товар 8',
    subtitle: 'Шовный материал',
    badge: 'В наличии',
    article: 'BR-008',
    price: 2190,
    priceLabel: 'от 2 190 ₽',
    image: placeholderImage,
    gallery: placeholderGallery,
    category: 'braided',
    absorbability: 'Шовный материал',
    construction: 'Шовный материал',
    application: 'Шовный материал',
    size: 'Размер 8',
    length: '60 см',
    needle: 'Игла 8',
    summary: 'Техническая заглушка товара для проверки страниц категорий, карточек и перелинковки.',
    inStock: true
  },
  {
    slug: 'cardio-support-1',
    title: 'Товар 9',
    subtitle: 'Шовный материал',
    badge: 'Премиум',
    article: 'BR-009',
    price: 2290,
    priceLabel: 'от 2 290 ₽',
    image: placeholderImage,
    gallery: placeholderGallery,
    category: 'atraumatic',
    absorbability: 'Шовный материал',
    construction: 'Шовный материал',
    application: 'Шовный материал',
    size: 'Размер 9',
    length: '95 см',
    needle: 'Игла 9',
    summary: 'Демо-товар в каталоге, пока ассортимент и реальные фотографии еще не подключены.',
    inStock: true,
    isRecommended: true
  },
  {
    slug: 'micro-atra-6-0',
    title: 'Товар 10',
    subtitle: 'Шовный материал',
    badge: 'Новинка',
    article: 'BR-010',
    price: 2390,
    priceLabel: 'от 2 390 ₽',
    image: placeholderImage,
    gallery: placeholderGallery,
    category: 'atraumatic',
    absorbability: 'Шовный материал',
    construction: 'Шовный материал',
    application: 'Шовный материал',
    size: 'Размер 10',
    length: '55 см',
    needle: 'Игла 10',
    summary: 'Заглушка товара, которую можно безопасно использовать до загрузки реальных данных.',
    inStock: false,
    isNew: true
  },
  {
    slug: 'ophtha-fine-8-0',
    title: 'Товар 11',
    subtitle: 'Шовный материал',
    badge: 'Спецкатегория',
    article: 'BR-011',
    price: 2490,
    priceLabel: 'от 2 490 ₽',
    image: placeholderImage,
    gallery: placeholderGallery,
    category: 'ophthalmic',
    absorbability: 'Шовный материал',
    construction: 'Шовный материал',
    application: 'Шовный материал',
    size: 'Размер 11',
    length: '50 см',
    needle: 'Игла 11',
    summary: 'Универсальная демонстрационная карточка для настройки каталога и карточки товара.',
    inStock: true,
    isRecommended: true
  },
  {
    slug: 'vision-pro-10-0',
    title: 'Товар 12',
    subtitle: 'Шовный материал',
    badge: 'Популярный',
    article: 'BR-012',
    price: 2590,
    priceLabel: 'от 2 590 ₽',
    image: placeholderImage,
    gallery: placeholderGallery,
    category: 'ophthalmic',
    absorbability: 'Шовный материал',
    construction: 'Шовный материал',
    application: 'Шовный материал',
    size: 'Размер 12',
    length: '45 см',
    needle: 'Игла 12',
    summary: 'Последняя временная карточка в наборе заглушек для тестирования каталога и фильтров.',
    inStock: true,
    isPopular: true
  }
]

export const getCategoryBySlug = (slug: string) => {
  return catalogCategories.find((category) => category.slug === slug) ?? null
}

export const getProductsByCategory = (categorySlug: string) => {
  return catalogProducts.filter((product) => product.category === categorySlug)
}

export const getProductByCategoryAndSlug = (categorySlug: string, productSlug: string) => {
  return catalogProducts.find((product) => product.category === categorySlug && product.slug === productSlug) ?? null
}
