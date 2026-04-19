<script setup lang="ts">
import type { CmsBlogPost } from '../../../../shared/types/cms'
import { blogPlaceholderImage } from '~/data/blog'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

type BlogFormState = {
  title: string
  slug: string
  seoTitle: string
  seoDescription: string
  excerpt: string
  category: string
  publishedAt: string
  readTime: string
  cover: string
  authorName: string
  authorRole: string
  authorAvatar: string
  tags: string
  bodyHtml: string
}

const route = useRoute()
const router = useRouter()
const isNew = computed(() => route.params.id === 'new')

const createEmptyForm = (): BlogFormState => ({
  title: '',
  slug: '',
  seoTitle: '',
  seoDescription: '',
  excerpt: '',
  category: '',
  publishedAt: '',
  readTime: '',
  cover: blogPlaceholderImage,
  authorName: 'Редакция BRAND',
  authorRole: 'Контент-команда',
  authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
  tags: '',
  bodyHtml: '<p></p>'
})

const form = reactive<BlogFormState>(createEmptyForm())
const statusMessage = ref('')
const statusTone = ref<'idle' | 'success' | 'error'>('idle')
const isSubmitting = ref(false)

const { data, refresh } = await useFetch<{ items: CmsBlogPost[] }>('/api/admin/blog', {
  key: `admin-blog-editor-${String(route.params.id)}`
})

const posts = computed(() => data.value?.items ?? [])
const currentPost = computed(() => posts.value.find(item => item.id === route.params.id) ?? null)

const applyForm = (post?: CmsBlogPost | null) => {
  if (!post) {
    Object.assign(form, createEmptyForm())
    return
  }

  Object.assign(form, {
    title: post.title,
    slug: post.slug,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    excerpt: post.excerpt,
    category: post.category,
    publishedAt: post.publishedAt,
    readTime: post.readTime,
    cover: post.cover,
    authorName: post.author.name,
    authorRole: post.author.role,
    authorAvatar: post.author.avatar,
    tags: post.tags.join(', '),
    bodyHtml: post.bodyHtml ?? post.body.map(item => `<p>${item}</p>`).join('')
  })
}

watch(
  currentPost,
  (post) => {
    if (isNew.value) {
      applyForm(null)
      return
    }

    if (post) {
      applyForm(post)
    }
  },
  { immediate: true }
)

if (!isNew.value && !currentPost.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Статья не найдена'
  })
}

const savePost = async () => {
  isSubmitting.value = true
  statusMessage.value = ''

  try {
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      seoTitle: form.seoTitle.trim(),
      seoDescription: form.seoDescription.trim(),
      excerpt: form.excerpt.trim(),
      category: form.category.trim(),
      publishedAt: form.publishedAt,
      readTime: form.readTime.trim(),
      cover: form.cover.trim() || blogPlaceholderImage,
      author: {
        name: form.authorName.trim(),
        role: form.authorRole.trim(),
        avatar: form.authorAvatar.trim()
      },
      tags: form.tags.split(',').map(item => item.trim()).filter(Boolean),
      body: [],
      bodyHtml: form.bodyHtml
    }

    if (isNew.value) {
      const created = await $fetch<CmsBlogPost>('/api/admin/blog', {
        method: 'POST',
        body: payload
      })
      await refresh()
      await router.replace(`/admin/blog/${created.id}`)
    }
    else {
      await $fetch(`/api/admin/blog/${route.params.id}`, {
        method: 'PUT',
        body: payload
      })
      await refresh()
    }

    statusMessage.value = 'Статья сохранена.'
    statusTone.value = 'success'
  }
  catch {
    statusMessage.value = 'Не удалось сохранить статью.'
    statusTone.value = 'error'
  }
  finally {
    isSubmitting.value = false
  }
}

const removePost = async () => {
  if (!currentPost.value) {
    return
  }

  if (!window.confirm(`Удалить статью "${currentPost.value.title}"?`)) {
    return
  }

  await $fetch(`/api/admin/blog/${currentPost.value.id}`, {
    method: 'DELETE'
  })

  await router.push('/admin/blog')
}

useSeoMeta({
  title: computed(() => `${isNew.value ? 'Новая статья' : form.title || 'Редактор статьи'} | BRAND`),
  description: 'Редактирование статьи блога в админке BRAND.'
})
</script>

<template>
  <section class="admin-page admin-page--compact">
    <header class="admin-editor-header">
      <div>
        <NuxtLink class="admin-editor-header__back" to="/admin/blog">
          <Icon name="lucide:arrow-left" />
          <span>К списку статей</span>
        </NuxtLink>
        <h1 class="admin-entity-header__title">{{ isNew ? 'Новая статья' : (form.title || 'Редактор статьи') }}</h1>
      </div>

      <div class="admin-editor-header__actions">
        <NuxtLink
          v-if="!isNew && currentPost"
          class="admin-secondary-button"
          :to="`/blog/${currentPost.slug}`"
          target="_blank"
        >
          <Icon name="lucide:square-arrow-out-up-right" />
          <span>Открыть на сайте</span>
        </NuxtLink>
        <button v-if="!isNew" class="admin-secondary-button admin-secondary-button--danger" type="button" @click="removePost">
          <Icon name="lucide:trash-2" />
          <span>Удалить</span>
        </button>
      </div>
    </header>

    <section class="admin-form-card admin-form-card--editor">
      <div v-if="statusMessage" class="admin-form-status" :class="`admin-form-status--${statusTone}`">
        {{ statusMessage }}
      </div>

      <form class="admin-form admin-form--compact" @submit.prevent="savePost">
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
            <span>SEO title</span>
            <input v-model="form.seoTitle" type="text" />
          </label>

          <label class="admin-form__field">
            <span>SEO description</span>
            <textarea v-model="form.seoDescription" rows="3" />
          </label>
        </div>

        <label class="admin-form__field">
          <span>Краткое описание</span>
          <textarea v-model="form.excerpt" rows="3" required />
        </label>

        <div class="admin-form__grid admin-form__grid--three">
          <label class="admin-form__field">
            <span>Категория</span>
            <input v-model="form.category" type="text" required />
          </label>

          <label class="admin-form__field">
            <span>Дата публикации</span>
            <input v-model="form.publishedAt" type="date" required />
          </label>

          <label class="admin-form__field">
            <span>Время чтения</span>
            <input v-model="form.readTime" type="text" placeholder="5 мин чтения" required />
          </label>
        </div>

        <div class="admin-form__grid admin-form__grid--two">
          <div class="admin-form__field">
            <span>Обложка статьи</span>
            <AdminImageField v-model="form.cover" label="Обложка статьи" />
          </div>

          <div class="admin-form__grid">
            <label class="admin-form__field">
              <span>Автор</span>
              <input v-model="form.authorName" type="text" required />
            </label>

            <label class="admin-form__field">
              <span>Роль автора</span>
              <input v-model="form.authorRole" type="text" required />
            </label>

            <label class="admin-form__field">
              <span>Аватар автора</span>
              <input v-model="form.authorAvatar" type="url" required />
            </label>
          </div>
        </div>

        <label class="admin-form__field">
          <span>Теги</span>
          <input v-model="form.tags" type="text" placeholder="Через запятую" />
        </label>

        <div class="admin-form__field">
          <span>Текст статьи</span>
          <ClientOnly>
            <AdminRichTextEditor v-model="form.bodyHtml" placeholder="Начните писать текст статьи" />
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
