<script setup lang="ts">
import { catalogCategories, getCategoryBySlug, getProductsByCategory } from '~/data/catalog'
import { siteNavItems } from '~/data/internal-pages'

const route = useRoute()
const categorySlug = computed(() => String(route.params.category ?? ''))
const category = computed(() => getCategoryBySlug(categorySlug.value))

if (!category.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Категория не найдена'
  })
}

const allProducts = computed(() => getProductsByCategory(categorySlug.value))

const activeFilters = reactive({
  priceRange: [] as string[],
  availability: [] as string[],
  size: [] as string[]
})

const priceRanges = [
  { key: 'up-to-1600', label: 'До 1 600 ₽', match: (price: number) => price <= 1600 },
  { key: '1600-2500', label: '1 600-2 500 ₽', match: (price: number) => price > 1600 && price <= 2500 },
  { key: 'from-2500', label: 'От 2 500 ₽', match: (price: number) => price > 2500 }
]

const availabilityOptions = ['В наличии', 'Под заказ'] as const
const sizeOptions = computed(() => Array.from(new Set(allProducts.value.map((product) => product.size))))
const sortMode = ref<'popular' | 'price-asc' | 'price-desc'>('popular')

const toggleFilter = (groupKey: keyof typeof activeFilters, value: string) => {
  const bucket = activeFilters[groupKey]
  activeFilters[groupKey] = bucket.includes(value)
    ? bucket.filter((item) => item !== value)
    : [...bucket, value]
}

const filteredProducts = computed(() => {
  const matched = allProducts.value.filter((product) => {
    const priceMatch =
      activeFilters.priceRange.length === 0 ||
      activeFilters.priceRange.some((rangeKey) => priceRanges.find((range) => range.key === rangeKey)?.match(product.price))

    const availabilityState = product.inStock ? 'В наличии' : 'Под заказ'
    const availabilityMatch =
      activeFilters.availability.length === 0 || activeFilters.availability.includes(availabilityState)

    const sizeMatch = activeFilters.size.length === 0 || activeFilters.size.includes(product.size)

    return priceMatch && availabilityMatch && sizeMatch
  })

  if (sortMode.value === 'price-asc') {
    return [...matched].sort((left, right) => left.price - right.price)
  }

  if (sortMode.value === 'price-desc') {
    return [...matched].sort((left, right) => right.price - left.price)
  }

  return [...matched].sort((left, right) => Number(Boolean(right.isPopular)) - Number(Boolean(left.isPopular)))
})

const resetFilters = () => {
  activeFilters.priceRange = []
  activeFilters.availability = []
  activeFilters.size = []
  sortMode.value = 'popular'
}

useSeoMeta({
  title: `${category.value.seoTitle} | BRAND`,
  description: category.value.seoDescription
})
</script>

<template>
  <main class="catalog-page catalog-page--light">
    <InternalOverlayLayout :nav-items="siteNavItems" :left-image="category?.image">
      <section class="catalog-shell catalog-shell--overlay">
        <nav class="catalog-breadcrumbs" aria-label="Хлебные крошки">
          <NuxtLink to="/">Главная</NuxtLink>
          <span>/</span>
          <NuxtLink to="/catalog">Каталог</NuxtLink>
          <span>/</span>
          <span>{{ category?.title }}</span>
        </nav>

        <section class="catalog-category-hero catalog-category-hero--compact">
          <div class="catalog-category-hero__copy">
            <p class="catalog-heading__eyebrow">Категория</p>
            <h1 class="catalog-category-hero__title">{{ category?.heroTitle }}</h1>
            <p class="catalog-category-hero__lead">{{ category?.heroLead }}</p>
          </div>
        </section>

        <section class="catalog-layout">
          <aside class="catalog-sidebar">
            <div class="catalog-sidebar__section">
              <div class="catalog-sidebar__title-row">
                <h2 class="catalog-sidebar__title">Категории</h2>
                <NuxtLink class="catalog-link-button" to="/catalog">Все категории</NuxtLink>
              </div>

              <div class="catalog-sidebar__links">
                <NuxtLink
                  v-for="item in catalogCategories"
                  :key="item.slug"
                  class="catalog-sidebar__link"
                  :class="{ 'catalog-sidebar__link--active': item.slug === categorySlug }"
                  :to="`/catalog/${item.slug}`"
                >
                  {{ item.title }}
                </NuxtLink>
              </div>
            </div>

            <div class="catalog-sidebar__section">
              <div class="catalog-sidebar__title-row">
                <h2 class="catalog-sidebar__title">Фильтры</h2>
                <button type="button" class="catalog-link-button" @click="resetFilters">Сбросить</button>
              </div>

              <div class="catalog-filter-group">
                <p class="catalog-filter-group__title">Цена</p>
                <label v-for="range in priceRanges" :key="range.key" class="catalog-filter-option">
                  <input type="checkbox" :checked="activeFilters.priceRange.includes(range.key)" @change="toggleFilter('priceRange', range.key)" />
                  <span>{{ range.label }}</span>
                </label>
              </div>

              <div class="catalog-filter-group">
                <p class="catalog-filter-group__title">Наличие</p>
                <label v-for="state in availabilityOptions" :key="state" class="catalog-filter-option">
                  <input type="checkbox" :checked="activeFilters.availability.includes(state)" @change="toggleFilter('availability', state)" />
                  <span>{{ state }}</span>
                </label>
              </div>

              <div class="catalog-filter-group">
                <p class="catalog-filter-group__title">Размер</p>
                <label v-for="size in sizeOptions" :key="size" class="catalog-filter-option">
                  <input type="checkbox" :checked="activeFilters.size.includes(size)" @change="toggleFilter('size', size)" />
                  <span>{{ size }}</span>
                </label>
              </div>
            </div>
          </aside>

          <div class="catalog-products catalog-products--clean">
            <div class="catalog-toolbar">
              <div>
                <p class="catalog-toolbar__count">{{ category?.title }}: {{ filteredProducts.length }} позиций</p>
                <p class="catalog-toolbar__description">{{ category?.description }}</p>
              </div>

              <label class="catalog-toolbar__sort-wrap">
                <span class="catalog-toolbar__sort-label">Сортировка</span>
                <select v-model="sortMode" class="catalog-toolbar__select">
                  <option value="popular">По популярности</option>
                  <option value="price-asc">Сначала дешевле</option>
                  <option value="price-desc">Сначала дороже</option>
                </select>
              </label>
            </div>

            <div class="catalog-product-grid catalog-product-grid--clean">
              <article v-for="product in filteredProducts" :key="product.slug" class="catalog-product-card">
                <NuxtLink
                  class="catalog-product-card__media catalog-product-card__media--link"
                  :to="`/catalog/${product.category}/${product.slug}`"
                  :style="{ backgroundImage: `url('${product.image}')` }"
                >
                  <span class="catalog-product-card__badge">{{ product.badge }}</span>
                </NuxtLink>

                <div class="catalog-product-card__body">
                  <p class="catalog-product-card__subtitle">{{ product.subtitle }}</p>
                  <h2 class="catalog-product-card__title">{{ product.title }}</h2>
                  <p class="catalog-product-card__price">{{ product.priceLabel }}</p>
                  <p class="catalog-product-card__article">Арт. {{ product.article }}</p>

                  <ul class="catalog-product-card__specs">
                    <li>{{ product.size }}</li>
                    <li>{{ product.length }}</li>
                    <li>{{ product.needle }}</li>
                  </ul>

                  <div class="catalog-product-card__stock" :class="{ 'catalog-product-card__stock--out': !product.inStock }">
                    {{ product.inStock ? 'В наличии' : 'Под заказ' }}
                  </div>

                  <div class="catalog-product-card__actions">
                    <NuxtLink class="catalog-product-card__button catalog-product-card__button--primary" :to="`/catalog/${product.category}/${product.slug}`">
                      Открыть карточку
                    </NuxtLink>
                    <a class="catalog-product-card__button catalog-product-card__button--link" href="tel:+79648111118">Запросить цену</a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <SiteFooter />
      </section>
    </InternalOverlayLayout>
  </main>
</template>
