<script setup lang="ts">
import type { CmsNewsPost } from '../../../../shared/types/cms'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const newsPlaceholderImage =
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1400&q=80'

type NewsFormState = {
  title: string
  slug: string
  publishedAt: string
  excerpt: string
  textHtml: string
  image: string
}

const route = useRoute()
const router = useRouter()
const isNew = computed(() => route.params.id === 'new')

const createEmptyForm = (): NewsFormState => ({
  title: '',
  slug: '',
  publishedAt: '',
  excerpt: '',
  textHtml: '<p></p>',
  image: newsPlaceholderImage
})

const form = reactive<NewsFormState>(createEmptyForm())
const statusMessage = ref('')
const statusTone = ref<'idle' | 'success' | 'error'>('idle')
const isSubmitting = ref(false)

const { data, refresh } = await useFetch<{ items: CmsNewsPost[] }>('/api/admin/news', {
  key: `admin-news-editor-${String(route.params.id)}`
})

const newsItems = computed(() => data.value?.items ?? [])
const currentItem = computed(() => newsItems.value.find(item => item.id === route.params.id) ?? null)

const applyForm = (item?: CmsNewsPost | null) => {
  if (!item) {
    Object.assign(form, createEmptyForm())
    return
  }

  Object.assign(form, {
    title: item.title,
    slug: item.slug,
    publishedAt: item.publishedAt,
    excerpt: item.excerpt,
    textHtml: item.textHtml ?? `<p>${item.text}</p>`,
    image: item.image
  })
}

watch(
  currentItem,
  (item) => {
    if (isNew.value) {
      applyForm(null)
      return
    }

    if (item) {
      applyForm(item)
    }
  },
  { immediate: true }
)

if (!isNew.value && !currentItem.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Новость не найдена'
  })
}

const saveItem = async () => {
  isSubmitting.value = true
  statusMessage.value = ''

  try {
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      publishedAt: form.publishedAt,
      excerpt: form.excerpt.trim(),
      text: '',
      textHtml: form.textHtml,
      image: form.image.trim() || newsPlaceholderImage
    }

    if (isNew.value) {
      const created = await $fetch<CmsNewsPost>('/api/admin/news', {
        method: 'POST',
        body: payload
      })
      await refresh()
      await router.replace(`/admin/news/${created.id}`)
    }
    else {
      await $fetch(`/api/admin/news/${route.params.id}`, {
        method: 'PUT',
        body: payload
      })
      await refresh()
    }

    statusMessage.value = 'Новость сохранена.'
    statusTone.value = 'success'
  }
  catch {
    statusMessage.value = 'Не удалось сохранить новость.'
    statusTone.value = 'error'
  }
  finally {
    isSubmitting.value = false
  }
}

const removeItem = async () => {
  if (!currentItem.value) {
    return
  }

  if (!window.confirm(`Удалить новость "${currentItem.value.title}"?`)) {
    return
  }

  await $fetch(`/api/admin/news/${currentItem.value.id}`, {
    method: 'DELETE'
  })

  await router.push('/admin/news')
}

useSeoMeta({
  title: computed(() => `${isNew.value ? 'Новая новость' : form.title || 'Редактор новости'} | BRAND`),
  description: 'Редактирование новости в админке BRAND.'
})
</script>

<template>
  <section class="admin-page admin-page--compact">
    <header class="admin-editor-header">
      <div>
        <NuxtLink class="admin-editor-header__back" to="/admin/news">
          <Icon name="lucide:arrow-left" />
          <span>К списку новостей</span>
        </NuxtLink>
        <h1 class="admin-entity-header__title">{{ isNew ? 'Новая новость' : (form.title || 'Редактор новости') }}</h1>
      </div>

      <div class="admin-editor-header__actions">
        <NuxtLink v-if="!isNew" class="admin-secondary-button" to="/news" target="_blank">
          <Icon name="lucide:square-arrow-out-up-right" />
          <span>Открыть на сайте</span>
        </NuxtLink>
        <button v-if="!isNew" class="admin-secondary-button admin-secondary-button--danger" type="button" @click="removeItem">
          <Icon name="lucide:trash-2" />
          <span>Удалить</span>
        </button>
      </div>
    </header>

    <section class="admin-form-card admin-form-card--editor">
      <div v-if="statusMessage" class="admin-form-status" :class="`admin-form-status--${statusTone}`">
        {{ statusMessage }}
      </div>

      <form class="admin-form admin-form--compact" @submit.prevent="saveItem">
        <div class="admin-form__grid admin-form__grid--two">
          <label class="admin-form__field">
            <span>Заголовок</span>
            <input v-model="form.title" type="text" required />
          </label>

          <label class="admin-form__field">
            <span>Slug</span>
            <input v-model="form.slug" type="text" placeholder="Автоматически из заголовка" />
          </label>
        </div>

        <div class="admin-form__grid admin-form__grid--two">
          <label class="admin-form__field">
            <span>Дата публикации</span>
            <input v-model="form.publishedAt" type="date" required />
          </label>

          <div class="admin-form__field">
            <span>Изображение</span>
            <AdminImageField v-model="form.image" label="Обложка новости" />
          </div>
        </div>

        <label class="admin-form__field">
          <span>Краткое описание</span>
          <textarea v-model="form.excerpt" rows="3" required />
        </label>

        <div class="admin-form__field">
          <span>Полный текст новости</span>
          <ClientOnly>
            <AdminRichTextEditor v-model="form.textHtml" placeholder="Напишите новость с форматированием" />
          </ClientOnly>
        </div>

        <div class="admin-form__actions">
          <button class="admin-action-button" type="submit" :disabled="isSubmitting">
            <Icon name="lucide:check" />
            <span>{{ isSubmitting ? 'Сохранение...' : 'Сохранить' }}</span>
          </button>
        </div>
      </form>
    </section>
  </section>
</template>
