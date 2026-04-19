<script setup lang="ts">
import { catalogCategories, catalogProducts } from '~/data/catalog'
import { siteNavItems } from '~/data/internal-pages'

const featuredNew = computed(() => catalogProducts.filter((product) => product.isNew))
const featuredPopular = computed(() => catalogProducts.filter((product) => product.isPopular))
const featuredRecommended = computed(() => catalogProducts.filter((product) => product.isRecommended))

useSeoMeta({
  title: 'Каталог хирургического шовного материала | BRAND',
  description:
    'Каталог хирургического шовного материала BRAND: категории, новинки, популярные позиции, рекомендуемые товары, цены и карточки продукции.'
})
</script>

<template>
  <main class="catalog-page catalog-page--light">
    <InternalOverlayLayout :nav-items="siteNavItems">
      <section class="catalog-shell catalog-shell--overlay">
        <div class="catalog-heading catalog-heading--wide">
          <h1 class="catalog-heading__title">Каталог</h1>
          <p class="catalog-heading__lead">
            В каталоге собраны основные категории продукции для медицинских учреждений, дилеров и корпоративных
            заказчиков. Выберите нужное направление, чтобы перейти к ассортименту, характеристикам и доступным
            позициям.
          </p>
        </div>

        <nav class="catalog-heading__links" aria-label="Основные категории каталога">
          <NuxtLink
            v-for="category in catalogCategories.slice(0, 4)"
            :key="`${category.slug}-quick`"
            class="catalog-heading__quick-link"
            :to="`/catalog/${category.slug}`"
          >
            {{ category.title }}
          </NuxtLink>
        </nav>

        <section id="catalog-categories" class="catalog-category-tiles">
          <NuxtLink
            v-for="category in catalogCategories"
            :key="category.slug"
            class="catalog-category-tile"
            :to="`/catalog/${category.slug}`"
          >
            <div class="catalog-category-tile__image" :style="{ backgroundImage: `url('${category.image}')` }" />
            <div class="catalog-category-tile__body">
              <span class="catalog-category-tile__label">{{ category.title }}</span>
              <span class="catalog-category-tile__meta">{{ category.shortDescription }}</span>
            </div>
          </NuxtLink>
        </section>

        <section class="catalog-promo-banner">
          <div>
            <p class="catalog-promo-banner__eyebrow">Акция</p>
            <h2 class="catalog-promo-banner__title">Специальные условия на стартовые закупки для клиник и дилеров</h2>
            <p class="catalog-promo-banner__text">Подберём линейку под клинический профиль, объём закупки и формат сотрудничества.</p>
          </div>
          <NuxtLink class="catalog-button catalog-button--primary" to="/catalog/absorbable">Перейти в категорию</NuxtLink>
        </section>

        <div class="catalog-showcase">
          <ProductCarousel title="Новинки" eyebrow="Витрина" :products="featuredNew" view-all-to="/catalog/absorbable" />
          <ProductCarousel title="Популярные" eyebrow="Витрина" :products="featuredPopular" view-all-to="/catalog/non-absorbable" />
          <ProductCarousel title="Рекомендуем" eyebrow="Витрина" :products="featuredRecommended" view-all-to="/catalog/atraumatic" />
        </div>

        <section id="catalog-seo" class="catalog-seo">
          <h2 class="catalog-seo__title">Каталог шовного материала для разных клинических задач</h2>
          <p class="catalog-seo__text">
            На странице каталога собраны ключевые направления ассортимента: рассасывающиеся, нерассасывающиеся, монофиламентные, плетёные,
            атравматические и офтальмологические решения. Каждая категория открывается по отдельному SEO-адресу и ведёт к собственной товарной
            сетке с фильтрами.
          </p>
          <p class="catalog-seo__text">
            Такая структура позволяет поисковым системам и пользователям отдельно индексировать категорию и каждую карточку товара, а также
            удобно масштабировать каталог по мере роста ассортимента, фото, цен и технических характеристик.
          </p>
        </section>

        <SiteFooter />
      </section>
    </InternalOverlayLayout>
  </main>
</template>
