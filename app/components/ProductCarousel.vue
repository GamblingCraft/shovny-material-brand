<script setup lang="ts">
import type { CatalogProduct } from '~/data/catalog'

defineProps<{
  title: string
  eyebrow?: string
  products: CatalogProduct[]
  viewAllTo?: string
}>()

const rail = useTemplateRef<HTMLElement>('rail')

const scrollRail = (direction: number) => {
  rail.value?.scrollBy({
    left: direction * 320,
    behavior: 'smooth'
  })
}
</script>

<template>
  <section class="catalog-carousel">
    <div class="catalog-carousel__header">
      <div>
        <p v-if="eyebrow" class="catalog-carousel__eyebrow">{{ eyebrow }}</p>
        <h2 class="catalog-carousel__title">{{ title }}</h2>
      </div>

      <div class="catalog-carousel__actions">
        <NuxtLink v-if="viewAllTo" class="catalog-link-button" :to="viewAllTo">Смотреть все</NuxtLink>
        <button class="catalog-carousel__arrow" type="button" aria-label="Назад" @click="scrollRail(-1)">‹</button>
        <button class="catalog-carousel__arrow" type="button" aria-label="Вперёд" @click="scrollRail(1)">›</button>
      </div>
    </div>

    <div ref="rail" class="catalog-carousel__rail">
      <article v-for="product in products" :key="product.slug" class="catalog-product-card catalog-product-card--slider">
        <NuxtLink
          class="catalog-product-card__media catalog-product-card__media--link"
          :to="`/catalog/${product.category}/${product.slug}`"
          :style="{ backgroundImage: `url('${product.image}')` }"
        >
          <span class="catalog-product-card__badge">{{ product.badge }}</span>
        </NuxtLink>

        <div class="catalog-product-card__body">
          <p class="catalog-product-card__subtitle">{{ product.subtitle }}</p>
          <h3 class="catalog-product-card__title">{{ product.title }}</h3>
          <p class="catalog-product-card__price">{{ product.priceLabel }}</p>
          <p class="catalog-product-card__article">Арт. {{ product.article }}</p>

          <div class="catalog-product-card__actions">
            <NuxtLink class="catalog-product-card__button catalog-product-card__button--primary" :to="`/catalog/${product.category}/${product.slug}`">
              Открыть карточку
            </NuxtLink>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
