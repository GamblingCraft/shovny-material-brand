<script setup lang="ts">
import type { CmsBlogPost } from '../../../../shared/types/cms'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const searchQuery = ref('')

const { data, refresh } = await useFetch<{ items: CmsBlogPost[] }>('/api/admin/blog', {
  key: 'admin-blog-list'
})

const posts = computed(() => data.value?.items ?? [])
const filteredPosts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return posts.value
  }

  return posts.value.filter(post =>
    post.title.toLowerCase().includes(query)
    || post.slug.toLowerCase().includes(query)
    || post.category.toLowerCase().includes(query)
  )
})

const removePost = async (post: CmsBlogPost) => {
  if (!window.confirm(`Удалить статью "${post.title}"?`)) {
    return
  }

  await $fetch(`/api/admin/blog/${post.id}`, {
    method: 'DELETE'
  })

  await refresh()
}

useSeoMeta({
  title: 'Админка блога | BRAND',
  description: 'Управление статьями блога BRAND.'
})
</script>

<template>
  <section class="admin-page admin-page--compact">
    <header class="admin-entity-header">
      <div>
        <h1 class="admin-entity-header__title">Блог</h1>
      </div>

      <NuxtLink class="admin-action-button admin-action-button--danger" to="/admin/blog/new">
        <Icon name="lucide:plus" />
        <span>Добавить статью</span>
      </NuxtLink>
    </header>

    <section class="admin-entity-table-card">
      <div class="admin-entity-toolbar">
        <label class="admin-entity-search">
          <Icon name="lucide:search" />
          <input v-model="searchQuery" type="search" placeholder="Поиск по статьям" />
        </label>
      </div>

      <div class="admin-entity-table-wrap">
        <table class="admin-entity-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Категория</th>
              <th>Дата</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in filteredPosts" :key="post.id">
              <td>{{ post.id }}</td>
              <td>
                <NuxtLink class="admin-entity-table__title-link" :to="`/admin/blog/${post.id}`">
                  {{ post.title }}
                </NuxtLink>
              </td>
              <td>{{ post.category }}</td>
              <td>{{ post.date }}</td>
              <td class="admin-entity-table__actions">
                <NuxtLink class="admin-entity-table__link" :to="`/blog/${post.slug}`" target="_blank" @click.stop>
                  <Icon name="lucide:square-arrow-out-up-right" />
                </NuxtLink>
                <NuxtLink class="admin-entity-table__link" :to="`/admin/blog/${post.id}`" @click.stop>
                  <Icon name="lucide:pencil" />
                </NuxtLink>
                <button class="admin-entity-table__delete" type="button" @click.stop="removePost(post)">
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
