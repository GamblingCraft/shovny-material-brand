<script setup lang="ts">
import type { CmsBlogPost } from '../../../../shared/types/cms'
import { blogPlaceholderImage } from '~/data/blog'
import { siteNavItems } from '~/data/internal-pages'

const route = useRoute()

const { data: article } = await useFetch<CmsBlogPost>(`/api/cms/blog/${route.params.slug}`, {
  key: `cms-blog-${route.params.slug}`
})

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Статья не найдена'
  })
}

const { data: allPosts } = await useFetch<{ items: CmsBlogPost[] }>('/api/cms/blog', {
  key: 'cms-blog-list-related'
})

const relatedArticles = computed(() => {
  return (allPosts.value?.items ?? []).filter((item) => item.slug !== article.value?.slug).slice(0, 2)
})

useSeoMeta({
  title: `${article.value.seoTitle} | BRAND`,
  description: article.value.seoDescription
})
</script>

<template>
  <main class="catalog-page catalog-page--light">
    <InternalOverlayLayout :nav-items="siteNavItems" :left-image="blogPlaceholderImage">
      <article class="catalog-shell catalog-shell--overlay blog-article">
        <nav class="catalog-breadcrumbs" aria-label="Хлебные крошки">
          <NuxtLink to="/">Главная</NuxtLink>
          <span>/</span>
          <NuxtLink to="/blog">Блог</NuxtLink>
          <span>/</span>
          <span>{{ article.title }}</span>
        </nav>

        <header class="blog-article__hero">
          <p class="catalog-heading__eyebrow">{{ article.category }}</p>
          <h1 class="blog-article__title">{{ article.title }}</h1>
          <p class="blog-article__lead">{{ article.excerpt }}</p>

          <div class="blog-article__meta">
            <div class="blog-article__author">
              <div class="blog-article__avatar" :style="{ backgroundImage: `url('${article.author.avatar}')` }" />
              <div>
                <strong>{{ article.author.name }}</strong>
                <span>{{ article.author.role }}</span>
              </div>
            </div>

            <div class="blog-article__details">
              <span>{{ article.date }}</span>
              <span>{{ article.readTime }}</span>
            </div>
          </div>
        </header>

        <div class="blog-article__cover" :style="{ backgroundImage: `url('${article.cover}')` }" />

        <section class="blog-article__body">
          <div class="blog-article__content">
            <div v-if="article.bodyHtml" class="blog-article__richtext" v-html="article.bodyHtml" />
            <template v-else>
              <p v-for="paragraph in article.body" :key="paragraph">
                {{ paragraph }}
              </p>
            </template>
          </div>

          <aside class="blog-article__sidebar">
            <section class="blog-article__box">
              <p>Опубликовано</p>
              <strong>{{ article.date }}</strong>
              <span>Материал опубликован в блоге бренда и доступен для дальнейшего редактирования через админку.</span>
            </section>

            <section class="blog-article__box">
              <p>Теги</p>
              <div class="blog-article__tags">
                <NuxtLink
                  v-for="tag in article.tags"
                  :key="tag"
                  class="blog-article__tag-link"
                  :to="{ path: '/blog', query: { tag } }"
                >
                  {{ tag }}
                </NuxtLink>
              </div>
            </section>
          </aside>
        </section>

        <section v-if="relatedArticles.length" class="blog-related">
          <div class="blog-related__header">
            <p class="catalog-heading__eyebrow">Ещё материалы</p>
            <h2>Другие статьи раздела</h2>
          </div>

          <div class="blog-related__grid">
            <article v-for="item in relatedArticles" :key="item.id" class="blog-related-card">
              <div class="blog-related-card__image" :style="{ backgroundImage: `url('${item.cover}')` }" />
              <div class="blog-related-card__content">
                <p>{{ item.date }} · {{ item.readTime }}</p>
                <h3>{{ item.title }}</h3>
                <NuxtLink :to="`/blog/${item.slug}`">Читать</NuxtLink>
              </div>
            </article>
          </div>
        </section>

        <SiteFooter />
      </article>
    </InternalOverlayLayout>
  </main>
</template>
