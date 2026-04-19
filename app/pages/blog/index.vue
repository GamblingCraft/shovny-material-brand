<script setup lang="ts">
import type { CmsBlogPost } from '../../../shared/types/cms'
import { blogPlaceholderImage } from '~/data/blog'
import { siteNavItems } from '~/data/internal-pages'

const route = useRoute()
const currentPage = ref(1)
const itemsPerPage = 3

const { data } = await useFetch<{ items: CmsBlogPost[] }>('/api/cms/blog', {
  key: 'cms-blog-list'
})

const articles = computed(() => data.value?.items ?? [])
const allTags = computed(() => Array.from(new Set(articles.value.flatMap((article) => article.tags))))
const activeTag = computed(() => {
  const tag = route.query.tag
  return typeof tag === 'string' ? tag : ''
})
const filteredArticles = computed(() => {
  if (!activeTag.value) {
    return articles.value
  }

  return articles.value.filter((article) => article.tags.includes(activeTag.value))
})
const totalPages = computed(() => Math.max(1, Math.ceil(filteredArticles.value.length / itemsPerPage)))
const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredArticles.value.slice(start, start + itemsPerPage)
})
const featuredArticle = computed(() => filteredArticles.value[0] ?? articles.value[0] ?? null)

const setPage = (pageNumber: number) => {
  currentPage.value = Math.min(Math.max(pageNumber, 1), totalPages.value)
}

watch(activeTag, () => {
  currentPage.value = 1
})

useSeoMeta({
  title: 'Блог | BRAND',
  description:
    'Блог BRAND: статьи, обзоры и материалы о шовном материале, ассортименте и структуре каталога.'
})
</script>

<template>
  <main class="catalog-page catalog-page--light">
    <InternalOverlayLayout :nav-items="siteNavItems" :left-image="blogPlaceholderImage">
      <section class="catalog-shell catalog-shell--overlay">
        <nav class="catalog-breadcrumbs" aria-label="Хлебные крошки">
          <NuxtLink to="/">Главная</NuxtLink>
          <span>/</span>
          <span>Блог</span>
        </nav>

        <section class="blog-page">
          <header class="blog-page__intro">
            <p class="catalog-heading__eyebrow">Блог</p>
            <h1 class="blog-page__title">Статьи и материалы о продукции, ассортименте и структуре каталога</h1>
            <p class="blog-page__lead">
              Раздел для публикаций, экспертных заметок и материалов бренда. Здесь можно размещать статьи,
              которые помогают пользователю лучше ориентироваться в категориях, выборе товара и логике сайта.
            </p>
          </header>

          <nav class="blog-tag-cloud" aria-label="Теги блога">
            <NuxtLink class="blog-tag-cloud__tag" :class="{ 'blog-tag-cloud__tag--active': !activeTag }" to="/blog">
              Все статьи
            </NuxtLink>

            <NuxtLink
              v-for="tag in allTags"
              :key="tag"
              class="blog-tag-cloud__tag"
              :class="{ 'blog-tag-cloud__tag--active': activeTag === tag }"
              :to="{ path: '/blog', query: { tag } }"
            >
              {{ tag }}
            </NuxtLink>
          </nav>

          <article v-if="featuredArticle" class="blog-featured-card">
            <div class="blog-featured-card__copy">
              <p class="blog-featured-card__meta">
                <span>{{ featuredArticle.category }}</span>
                <span>{{ featuredArticle.date }}</span>
                <span>{{ featuredArticle.readTime }}</span>
              </p>
              <h2>{{ featuredArticle.title }}</h2>
              <p>{{ featuredArticle.excerpt }}</p>
              <NuxtLink class="blog-featured-card__link" :to="`/blog/${featuredArticle.slug}`">
                Читать статью
              </NuxtLink>
            </div>
            <div class="blog-featured-card__image" :style="{ backgroundImage: `url('${featuredArticle.cover}')` }" />
          </article>

          <section class="blog-grid">
            <article v-for="article in paginatedArticles" :key="article.id" class="blog-card">
              <div class="blog-card__image" :style="{ backgroundImage: `url('${article.cover}')` }" />
              <div class="blog-card__content">
                <p class="blog-card__meta">
                  <span>{{ article.category }}</span>
                  <span>{{ article.date }}</span>
                </p>
                <h2>{{ article.title }}</h2>
                <p>{{ article.excerpt }}</p>

                <div class="blog-card__author">
                  <div class="blog-card__avatar" :style="{ backgroundImage: `url('${article.author.avatar}')` }" />
                  <div>
                    <strong>{{ article.author.name }}</strong>
                    <span>{{ article.readTime }}</span>
                  </div>
                </div>

                <NuxtLink class="blog-card__link" :to="`/blog/${article.slug}`">
                  Открыть статью
                </NuxtLink>
              </div>
            </article>
          </section>

          <p v-if="activeTag" class="blog-page__filter-note">
            Показаны материалы по тегу: <strong>{{ activeTag }}</strong>
          </p>

          <nav v-if="totalPages > 1" class="news-pagination" aria-label="Пагинация блога">
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
              :key="`blog-page-${pageNumber}`"
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
