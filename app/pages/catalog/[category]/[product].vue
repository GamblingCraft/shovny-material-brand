<script setup lang="ts">
import { getCategoryBySlug, getProductByCategoryAndSlug, getProductsByCategory } from '~/data/catalog'
import { siteNavItems } from '~/data/internal-pages'

const route = useRoute()
const categorySlug = computed(() => String(route.params.category ?? ''))
const productSlug = computed(() => String(route.params.product ?? ''))

const category = computed(() => getCategoryBySlug(categorySlug.value))
const product = computed(() => getProductByCategoryAndSlug(categorySlug.value, productSlug.value))

if (!category.value || !product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Товар не найден'
  })
}

const relatedProducts = computed(() =>
  getProductsByCategory(categorySlug.value).filter((item) => item.slug !== productSlug.value).slice(0, 3)
)

const activeImage = ref(product.value.gallery[0] ?? category.value.image)
const isLightboxOpen = ref(false)

watch(
  () => product.value.slug,
  () => {
    activeImage.value = product.value.gallery[0] ?? category.value.image
    isLightboxOpen.value = false
  }
)

const openLightbox = () => {
  isLightboxOpen.value = true
}

const closeLightbox = () => {
  isLightboxOpen.value = false
}

useSeoMeta({
  title: `${product.value.title} | ${category.value.seoTitle} | BRAND`,
  description: `${product.value.summary} Артикул ${product.value.article}, ${product.value.priceLabel.toLowerCase()}, ${product.value.inStock ? 'в наличии' : 'под заказ'}.`
})
</script>

<template>
  <main class="product-page">
    <InternalOverlayLayout :nav-items="siteNavItems" :left-image="activeImage || category?.image">
      <section class="product-shell product-shell--overlay">
        <nav class="catalog-breadcrumbs" aria-label="Хлебные крошки">
          <NuxtLink to="/">Главная</NuxtLink>
          <span>/</span>
          <NuxtLink to="/catalog">Каталог</NuxtLink>
          <span>/</span>
          <NuxtLink :to="`/catalog/${categorySlug}`">{{ category?.title }}</NuxtLink>
          <span>/</span>
          <span>{{ product?.title }}</span>
        </nav>

        <NuxtLink class="product-back" :to="`/catalog/${categorySlug}`">Назад в категорию</NuxtLink>

        <div class="product-layout product-layout--editorial">
          <div class="product-gallery">
            <button
              class="product-gallery__main"
              type="button"
              :style="{ backgroundImage: `url('${activeImage}')` }"
              @click="openLightbox"
            >
              <span class="product-gallery__zoom-label">Увеличить фото</span>
            </button>

            <div class="product-gallery__thumbs">
              <button
                v-for="image in product?.gallery"
                :key="image"
                class="product-gallery__thumb"
                :class="{ 'product-gallery__thumb--active': image === activeImage }"
                type="button"
                :style="{ backgroundImage: `url('${image}')` }"
                @click="activeImage = image"
              />
            </div>
          </div>

          <div class="product-summary">
            <p class="product-summary__eyebrow">{{ category?.title }}</p>
            <h1 class="product-summary__title">{{ product?.title }}</h1>
            <p class="product-summary__subtitle">{{ product?.subtitle }}</p>
            <p class="product-summary__text">{{ product?.summary }}</p>

            <div class="product-summary__hero-meta">
              <div>
                <span>Артикул</span>
                <strong>{{ product?.article }}</strong>
              </div>
              <div>
                <span>Цена</span>
                <strong>{{ product?.priceLabel }}</strong>
              </div>
              <div>
                <span>Наличие</span>
                <strong>{{ product?.inStock ? 'В наличии' : 'Под заказ' }}</strong>
              </div>
            </div>

            <div class="product-summary__meta">
              <div class="product-summary__meta-item">
                <span>Размер</span>
                <strong>{{ product?.size }}</strong>
              </div>
              <div class="product-summary__meta-item">
                <span>Длина</span>
                <strong>{{ product?.length }}</strong>
              </div>
              <div class="product-summary__meta-item">
                <span>Игла</span>
                <strong>{{ product?.needle }}</strong>
              </div>
              <div class="product-summary__meta-item">
                <span>Применение</span>
                <strong>{{ product?.application }}</strong>
              </div>
            </div>

            <form class="product-request-form" @submit.prevent>
              <div class="product-request-form__header">
                <h2 class="product-request-form__title">Заявка по товару</h2>
                <p class="product-request-form__lead">
                  Оставьте контакты, и мы свяжемся с вами по поставке, наличию и условиям.
                </p>
              </div>

              <div class="product-request-form__grid">
                <input type="text" name="name" placeholder="Имя" />
                <input type="tel" name="phone" placeholder="+7 (___) ___-__-__" />
                <input type="text" name="company" placeholder="Клиника / компания" />
                <input type="text" :value="product?.article" readonly />
              </div>

              <textarea name="comment" rows="4" placeholder="Комментарий по заявке" />

              <div class="product-summary__actions">
                <button class="catalog-button catalog-button--primary" type="submit">Обсудить поставку</button>
                <a class="catalog-button catalog-button--secondary" href="tel:+79648111118">Позвонить сейчас</a>
              </div>
            </form>
          </div>
        </div>

        <ProductCarousel
          v-if="relatedProducts.length"
          title="Похожие товары категории"
          eyebrow="Рядом по категории"
          :products="relatedProducts"
          :view-all-to="`/catalog/${categorySlug}`"
        />
        <SiteFooter />
      </section>
    </InternalOverlayLayout>

    <Teleport to="body">
      <div v-if="isLightboxOpen" class="product-lightbox" @click.self="closeLightbox">
        <button class="product-lightbox__close" type="button" @click="closeLightbox">Закрыть</button>
        <div class="product-lightbox__image-wrap">
          <img class="product-lightbox__image" :src="activeImage" :alt="product?.title" />
        </div>
      </div>
    </Teleport>
  </main>
</template>
