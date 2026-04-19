<script setup lang="ts">
import type { CmsNewsPost } from '../../../../shared/types/cms'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const searchQuery = ref('')

const { data, refresh } = await useFetch<{ items: CmsNewsPost[] }>('/api/admin/news', {
  key: 'admin-news-list'
})

const newsItems = computed(() => data.value?.items ?? [])
const filteredItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return newsItems.value
  }

  return newsItems.value.filter(item =>
    item.title.toLowerCase().includes(query)
    || item.slug.toLowerCase().includes(query)
  )
})

const removeItem = async (item: CmsNewsPost) => {
  if (!window.confirm(`Удалить новость "${item.title}"?`)) {
    return
  }

  await $fetch(`/api/admin/news/${item.id}`, {
    method: 'DELETE'
  })

  await refresh()
}

useSeoMeta({
  title: 'Админка новостей | BRAND',
  description: 'Управление новостями BRAND.'
})
</script>

<template>
  <section class="admin-page admin-page--compact">
    <header class="admin-entity-header">
      <div>
        <h1 class="admin-entity-header__title">Новости</h1>
      </div>

      <NuxtLink class="admin-action-button admin-action-button--danger" to="/admin/news/new">
        <Icon name="lucide:plus" />
        <span>Добавить новость</span>
      </NuxtLink>
    </header>

    <section class="admin-entity-table-card">
      <div class="admin-entity-toolbar">
        <label class="admin-entity-search">
          <Icon name="lucide:search" />
          <input v-model="searchQuery" type="search" placeholder="Поиск по новостям" />
        </label>
      </div>

      <div class="admin-entity-table-wrap">
        <table class="admin-entity-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Дата</th>
              <th>Slug</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item.id">
              <td>{{ item.id }}</td>
              <td>
                <NuxtLink class="admin-entity-table__title-link" :to="`/admin/news/${item.id}`">
                  {{ item.title }}
                </NuxtLink>
              </td>
              <td>{{ item.date }}</td>
              <td>{{ item.slug }}</td>
              <td class="admin-entity-table__actions">
                <NuxtLink class="admin-entity-table__link" to="/news" target="_blank" @click.stop>
                  <Icon name="lucide:square-arrow-out-up-right" />
                </NuxtLink>
                <NuxtLink class="admin-entity-table__link" :to="`/admin/news/${item.id}`" @click.stop>
                  <Icon name="lucide:pencil" />
                </NuxtLink>
                <button class="admin-entity-table__delete" type="button" @click.stop="removeItem(item)">
                  <Icon name="lucide:trash-2" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>
