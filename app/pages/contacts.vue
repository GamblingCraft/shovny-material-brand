<script setup lang="ts">
import type { CmsPageData } from '../../shared/types/cms'
import { getFallbackPage } from '~/utils/cms-fallbacks'
import { siteNavItems } from '~/data/internal-pages'

const { data: page } = useFetch<CmsPageData>('/api/cms/pages/contacts', {
  key: 'cms-page-contacts',
  default: () => getFallbackPage('contacts')
})

useSeoMeta({
  title: () => `${page.value?.seoTitle ?? 'Контакты'} | BRAND`,
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

        <InternalLandingPage :page="page" variant="article" />
        <SiteFooter />
      </section>
    </InternalOverlayLayout>
  </main>
</template>
