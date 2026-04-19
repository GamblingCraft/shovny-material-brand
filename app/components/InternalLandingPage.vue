<script setup lang="ts">
import type { CmsPageData } from '../../shared/types/cms'

defineProps<{
  page: CmsPageData
  variant?: 'default' | 'article'
}>()
</script>

<template>
  <section class="internal-landing" :class="{ 'internal-landing--article': variant === 'article' }">
    <div class="internal-landing__intro">
      <div class="internal-landing__copy">
        <p class="catalog-heading__eyebrow">{{ page.eyebrow }}</p>
        <h1 class="internal-landing__title">{{ page.title }}</h1>
        <p class="internal-landing__lead">{{ page.lead }}</p>
      </div>

      <div v-if="variant !== 'article'" class="internal-landing__stats">
        <div v-for="stat in page.stats" :key="`${stat.value}-${stat.label}`" class="internal-landing__stat">
          <strong>{{ stat.value }}</strong>
          <span>{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <div v-if="variant === 'article'" class="internal-landing__hero-image" :style="{ backgroundImage: `url('${page.image}')` }" />

    <div class="internal-landing__body">
      <div class="internal-landing__article">
        <div v-if="variant === 'article'" class="internal-landing__stats internal-landing__stats--inline">
          <div v-for="stat in page.stats" :key="`${stat.value}-${stat.label}`" class="internal-landing__stat">
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </div>
        </div>

        <div v-if="page.bodyHtml" class="internal-landing__richtext" v-html="page.bodyHtml" />
        <template v-else>
          <p v-for="paragraph in page.body" :key="paragraph">{{ paragraph }}</p>
        </template>
      </div>

      <div v-if="variant !== 'article'" class="internal-landing__image" :style="{ backgroundImage: `url('${page.image}')` }" />
    </div>

    <div class="internal-landing__features">
      <article v-for="feature in page.features" :key="feature.title" class="internal-landing__feature">
        <h2>{{ feature.title }}</h2>
        <p>{{ feature.text }}</p>
      </article>
    </div>

    <section v-if="page.news?.length" class="internal-news-list">
      <article v-for="item in page.news" :key="`${item.date}-${item.title}`" class="internal-news-card">
        <div class="internal-news-card__image" :style="{ backgroundImage: `url('${item.image}')` }" />
        <div class="internal-news-card__content">
          <p class="internal-news-card__date">{{ item.date }}</p>
          <h2>{{ item.title }}</h2>
          <p>{{ item.text }}</p>
        </div>
      </article>
    </section>

    <section v-if="page.contacts" class="internal-contacts-grid">
      <article class="internal-contacts-card">
        <p>Адрес</p>
        <strong>{{ page.contacts.addressTitle }}</strong>
        <span>{{ page.contacts.addressText }}</span>
      </article>

      <article class="internal-contacts-card">
        <p>Телефон</p>
        <strong>{{ page.contacts.phone }}</strong>
        <span>{{ page.contacts.phoneText }}</span>
      </article>

      <article class="internal-contacts-card">
        <p>Email</p>
        <strong>{{ page.contacts.email }}</strong>
        <span>{{ page.contacts.emailText }}</span>
      </article>
    </section>

    <div class="internal-landing__cta">
      <NuxtLink class="catalog-button catalog-button--primary" :to="page.ctaTo">{{ page.ctaLabel }}</NuxtLink>
    </div>
  </section>
</template>
