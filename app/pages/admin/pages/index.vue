<script setup lang="ts">
import type { CmsPageData } from '../../../../shared/types/cms'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const searchQuery = ref('')

const { data } = await useFetch<{ items: CmsPageData[] }>('/api/admin/pages', {
  key: 'admin-pages-list'
})

const pages = computed(() => data.value?.items ?? [])
const filteredPages = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return pages.value
  }

  return pages.value.filter(page =>
    page.title.toLowerCase().includes(query)
    || page.slug.toLowerCase().includes(query)
    || page.eyebrow.toLowerCase().includes(query)
  )
})

useSeoMeta({
  title: 'Админка страниц | BRAND',
  description: 'Управление посадочными страницами сайта BRAND.'
})
</script>

<template>
  <section class="admin-page admin-page--compact">
    <header class="admin-entity-header">
      <div>
        <h1 class="admin-entity-header__title">Страницы</h1>
      </div>
    </header>

    <section class="admin-entity-table-card">
      <div class="admin-entity-toolbar">
        <label class="admin-entity-search">
          <Icon name="lucide:search" />
          <input v-model="searchQuery" type="search" placeholder="Поиск по страницам" />
        </label>
      </div>

      <div class="admin-entity-table-wrap">
        <table class="admin-entity-table">
          <thead>
            <tr>
              <th>Рубрика</th>
              <th>Название</th>
              <th>Slug</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="page in filteredPages" :key="page.slug">
              <td>{{ page.eyebrow }}</td>
              <td>
                <NuxtLink class="admin-entity-table__title-link" :to="`/admin/pages/${page.slug}`">
                  {{ page.title }}
                </NuxtLink>
              </td>
              <td>/{{ page.slug }}</td>
              <td class="admin-entity-table__actions">
                <NuxtLink class="admin-entity-table__link" :to="`/${page.slug}`" target="_blank" @click.stop>
                  <Icon name="lucide:square-arrow-out-up-right" />
                </NuxtLink>
                <NuxtLink class="admin-entity-table__link" :to="`/admin/pages/${page.slug}`" @click.stop>
                  <Icon name="lucide:pencil" />
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>
