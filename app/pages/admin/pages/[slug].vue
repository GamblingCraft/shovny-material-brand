<script setup lang="ts">
import type { CmsPageData } from '../../../../shared/types/cms'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

type PageFormState = {
  slug: string
  title: string
  seoTitle: string
  seoDescription: string
  eyebrow: string
  lead: string
  image: string
  ctaLabel: string
  ctaTo: string
  bodyHtml: string
  statsText: string
  featuresText: string
  newsText: string
  addressTitle: string
  addressText: string
  phone: string
  phoneText: string
  email: string
  emailText: string
}

const route = useRoute()

const createEmptyForm = (): PageFormState => ({
  slug: '',
  title: '',
  seoTitle: '',
  seoDescription: '',
  eyebrow: '',
  lead: '',
  image: '',
  ctaLabel: '',
  ctaTo: '',
  bodyHtml: '<p></p>',
  statsText: '',
  featuresText: '',
  newsText: '',
  addressTitle: '',
  addressText: '',
  phone: '',
  phoneText: '',
  email: '',
  emailText: ''
})

const form = reactive<PageFormState>(createEmptyForm())
const statusMessage = ref('')
const statusTone = ref<'idle' | 'success' | 'error'>('idle')
const isSubmitting = ref(false)

const { data, refresh } = await useFetch<{ items: CmsPageData[] }>('/api/admin/pages', {
  key: `admin-page-editor-${String(route.params.slug)}`
})

const pages = computed(() => data.value?.items ?? [])
const currentPage = computed(() => pages.value.find(item => item.slug === route.params.slug) ?? null)

const serializeStats = (items: CmsPageData['stats']) =>
  items.map(item => `${item.value} | ${item.label}`).join('\n')

const serializeFeatures = (items: CmsPageData['features']) =>
  items.map(item => `${item.title} | ${item.text}`).join('\n')

const serializeNews = (items: NonNullable<CmsPageData['news']>) =>
  items.map(item => `${item.date} | ${item.title} | ${item.text} | ${item.image}`).join('\n')

const parsePairLines = (value: string) =>
  value
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => line.split('|').map(item => item.trim()))

const applyForm = (page: CmsPageData) => {
  Object.assign(form, {
    slug: page.slug,
    title: page.title,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    eyebrow: page.eyebrow,
    lead: page.lead,
    image: page.image,
    ctaLabel: page.ctaLabel,
    ctaTo: page.ctaTo,
    bodyHtml: page.bodyHtml ?? page.body.map(item => `<p>${item}</p>`).join(''),
    statsText: serializeStats(page.stats),
    featuresText: serializeFeatures(page.features),
    newsText: page.news?.length ? serializeNews(page.news) : '',
    addressTitle: page.contacts?.addressTitle ?? '',
    addressText: page.contacts?.addressText ?? '',
    phone: page.contacts?.phone ?? '',
    phoneText: page.contacts?.phoneText ?? '',
    email: page.contacts?.email ?? '',
    emailText: page.contacts?.emailText ?? ''
  })
}

watch(
  currentPage,
  (page) => {
    if (page) {
      applyForm(page)
    }
  },
  { immediate: true }
)

if (!currentPage.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Страница не найдена'
  })
}

const savePage = async () => {
  if (!currentPage.value) {
    return
  }

  isSubmitting.value = true
  statusMessage.value = ''

  try {
    const parsedStats = parsePairLines(form.statsText)
      .filter(item => item.length >= 2)
      .map(([value, label]) => ({ value, label }))

    const parsedFeatures = parsePairLines(form.featuresText)
      .filter(item => item.length >= 2)
      .map(([title, text]) => ({ title, text }))

    const parsedNews = parsePairLines(form.newsText)
      .filter(item => item.length >= 4)
      .map(([date, title, text, image]) => ({ date, title, text, image }))

    const payload: CmsPageData = {
      slug: form.slug,
      title: form.title.trim(),
      seoTitle: form.seoTitle.trim(),
      seoDescription: form.seoDescription.trim(),
      eyebrow: form.eyebrow.trim(),
      lead: form.lead.trim(),
      image: form.image.trim(),
      ctaLabel: form.ctaLabel.trim(),
      ctaTo: form.ctaTo.trim(),
      body: [],
      bodyHtml: form.bodyHtml,
      stats: parsedStats,
      features: parsedFeatures,
      news: parsedNews.length ? parsedNews : undefined,
      contacts: currentPage.value.slug === 'contacts'
        ? {
            addressTitle: form.addressTitle.trim(),
            addressText: form.addressText.trim(),
            phone: form.phone.trim(),
            phoneText: form.phoneText.trim(),
            email: form.email.trim(),
            emailText: form.emailText.trim()
          }
        : undefined
    }

    await $fetch(`/api/admin/pages/${route.params.slug}`, {
      method: 'PUT',
      body: payload
    })

    await refresh()
    statusMessage.value = 'Страница сохранена.'
    statusTone.value = 'success'
  }
  catch {
    statusMessage.value = 'Не удалось сохранить страницу.'
    statusTone.value = 'error'
  }
  finally {
    isSubmitting.value = false
  }
}

useSeoMeta({
  title: computed(() => `${form.title || 'Редактор страницы'} | BRAND`),
  description: 'Редактирование посадочной страницы в админке BRAND.'
})
</script>

<template>
  <section class="admin-page admin-page--compact">
    <header class="admin-editor-header">
      <div>
        <NuxtLink class="admin-editor-header__back" to="/admin/pages">
          <Icon name="lucide:arrow-left" />
          <span>К списку страниц</span>
        </NuxtLink>
        <h1 class="admin-entity-header__title">{{ form.title || 'Редактор страницы' }}</h1>
      </div>

      <div class="admin-editor-header__actions">
        <NuxtLink class="admin-secondary-button" :to="`/${form.slug}`" target="_blank">
          <Icon name="lucide:square-arrow-out-up-right" />
          <span>Открыть на сайте</span>
        </NuxtLink>
      </div>
    </header>

    <section class="admin-form-card admin-form-card--editor">
      <div v-if="statusMessage" class="admin-form-status" :class="`admin-form-status--${statusTone}`">
        {{ statusMessage }}
      </div>

      <form class="admin-form admin-form--compact" @submit.prevent="savePage">
        <div class="admin-form__grid admin-form__grid--two">
          <label class="admin-form__field">
            <span>Заголовок</span>
            <input v-model="form.title" type="text" required />
          </label>

          <label class="admin-form__field admin-form__field--readonly">
            <span>Slug</span>
            <input v-model="form.slug" type="text" readonly />
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

        <div class="admin-form__grid admin-form__grid--two">
          <label class="admin-form__field">
            <span>Рубрика</span>
            <input v-model="form.eyebrow" type="text" required />
          </label>

          <div class="admin-form__field">
            <span>Изображение слева</span>
            <AdminImageField v-model="form.image" label="Изображение страницы" />
          </div>
        </div>

        <label class="admin-form__field">
          <span>Лид</span>
          <textarea v-model="form.lead" rows="3" required />
        </label>

        <div class="admin-form__field">
          <span>Основной текст</span>
          <ClientOnly>
            <AdminRichTextEditor v-model="form.bodyHtml" placeholder="Заполните основной текст страницы" />
          </ClientOnly>
        </div>

        <div class="admin-form__grid admin-form__grid--two">
          <label class="admin-form__field">
            <span>Статистика</span>
            <textarea v-model="form.statsText" rows="5" placeholder="Значение | Подпись" required />
          </label>

          <label class="admin-form__field">
            <span>Преимущества</span>
            <textarea v-model="form.featuresText" rows="5" placeholder="Заголовок | Текст" required />
          </label>
        </div>

        <div class="admin-form__grid admin-form__grid--two">
          <label class="admin-form__field">
            <span>Текст кнопки</span>
            <input v-model="form.ctaLabel" type="text" required />
          </label>

          <label class="admin-form__field">
            <span>Ссылка кнопки</span>
            <input v-model="form.ctaTo" type="text" required />
          </label>
        </div>

        <label v-if="form.slug === 'news'" class="admin-form__field">
          <span>Новостные карточки</span>
          <textarea v-model="form.newsText" rows="6" placeholder="Дата | Заголовок | Текст | Изображение" />
        </label>

        <div v-if="form.slug === 'contacts'" class="admin-form__block">
          <div class="admin-panel-heading admin-panel-heading--subtle">
            <p>Контактный блок</p>
            <strong>Данные страницы контактов</strong>
          </div>

          <div class="admin-form__grid admin-form__grid--two">
            <label class="admin-form__field">
              <span>Заголовок адреса</span>
              <input v-model="form.addressTitle" type="text" />
            </label>

            <label class="admin-form__field">
              <span>Телефон</span>
              <input v-model="form.phone" type="text" />
            </label>
          </div>

          <label class="admin-form__field">
            <span>Описание адреса</span>
            <textarea v-model="form.addressText" rows="3" />
          </label>

          <label class="admin-form__field">
            <span>Описание телефона</span>
            <textarea v-model="form.phoneText" rows="3" />
          </label>

          <div class="admin-form__grid admin-form__grid--two">
            <label class="admin-form__field">
              <span>Email</span>
              <input v-model="form.email" type="email" />
            </label>

            <label class="admin-form__field">
              <span>Описание email</span>
              <textarea v-model="form.emailText" rows="3" />
            </label>
          </div>
        </div>

        <div class="admin-form__actions">
          <button class="admin-action-button" type="submit" :disabled="isSubmitting">
            <Icon name="lucide:check" />
            <span>{{ isSubmitting ? 'Сохранение...' : 'Сохранить страницу' }}</span>
          </button>
        </div>
      </form>
    </section>
  </section>
</template>
