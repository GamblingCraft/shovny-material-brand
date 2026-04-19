<script setup lang="ts">
import type { CmsNewsPost, CmsPageData } from '../../shared/types/cms'
import { getFallbackNewsPosts, getFallbackPage } from '~/utils/cms-fallbacks'
import { siteNavItems } from '~/data/internal-pages'

const currentPage = ref(1)
const itemsPerPage = 5

const { data: page } = useFetch<CmsPageData>('/api/cms/pages/news', {
  key: 'cms-page-news',
  default: () => getFallbackPage('news')
})

const { data } = useFetch<{ items: CmsNewsPost[] }>('/api/cms/news', {
  key: 'cms-news-list',
  default: () => ({
    items: getFallbackNewsPosts()
  })
})

const newsItems = computed(() => data.value?.items ?? [])
const totalPages = computed(() => Math.max(1, Math.ceil(newsItems.value.length / itemsPerPage)))
const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return newsItems.value.slice(start, end)
})

const setPage = (pageNumber: number) => {
  currentPage.value = Math.min(Math.max(pageNumber, 1), totalPages.value)
}

useSeoMeta({
  title: () => `${page.value?.seoTitle ?? 'Новости'} | BRAND`,
  description: () => page.value?.seoDescription ?? ''
})
</script>

<template>
  <main class="catalog-page catalog-page--light">
    <InternalOverlayLayout :nav-items="siteNavItems" :left-image="page?.image">
      <section v-if="page" class="catalog-shell catalog-shell--overlay">
        <nav class="catalog-breadcrumbs" aria-label="Хлебные крошки">
          <NuxtLink to="/">Главная</NuxtLink>
          <span>/</span>
          <span>{{ page.eyebrow }}</span>
        </nav>

        <section class="internal-news-page">
          <header class="internal-news-page__intro">
            <p class="catalog-heading__eyebrow">{{ page.eyebrow }}</p>
            <h1 class="internal-news-page__title">{{ page.title }}</h1>
            <p class="internal-news-page__lead">{{ page.lead }}</p>
          </header>

          <section class="internal-news-list internal-news-list--editorial">
            <article
              v-for="item in paginatedNews"
              :key="item.id"
              class="internal-news-card internal-news-card--editorial"
            >
              <div class="internal-news-card__image" :style="{ backgroundImage: `url('${item.image}')` }" />
              <div class="internal-news-card__content">
                <p class="internal-news-card__date">{{ item.date }}</p>
                <h2>{{ item.title }}</h2>
                <div v-if="item.textHtml" class="internal-news-card__richtext" v-html="item.textHtml" />
                <p v-else>{{ item.text }}</p>
              </div>
            </article>
          </section>

          <nav v-if="totalPages > 1" class="news-pagination" aria-label="Пагинация новостей">
            <button
              class="news-pagination__button"
              type="button"
              :disabled="currentPage === 1"
              @click="setPage(currentPage - 1)"
            >
              Назад
            </button>

            <button
              v-for="pageNumber in totalPages"
              :key="`news-page-${pageNumber}`"
              class="news-pagination__button"
              :class="{ 'news-pagination__button--active': currentPage === pageNumber }"
              type="button"
              @click="setPage(pageNumber)"
            >
              {{ pageNumber }}
            </button>

            <button
              class="news-pagination__button"
              type="button"
              :disabled="currentPage === totalPages"
              @click="setPage(currentPage + 1)"
            >
              Далее
            </button>
          </nav>
        </section>

        <SiteFooter />
      </section>
    </InternalOverlayLayout>
  </main>
</template>
