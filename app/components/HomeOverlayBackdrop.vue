<script setup lang="ts">
import { siteNavItems } from '~/data/internal-pages'
</script>

<template>
  <div class="overlay-home-backdrop">
    <header class="topbar overlay-home-backdrop__topbar">
      <div class="brand-block">
        <span class="brand-mark">A</span>
        <div>
          <p class="brand-name">BRAND</p>
          <p class="brand-subtitle">Хирургический шовный материал</p>
        </div>
      </div>

      <nav class="topbar-nav" aria-label="Основная навигация">
        <span v-for="item in siteNavItems" :key="item.label" class="topbar-link">
          {{ item.label }}
        </span>
      </nav>

      <div class="topbar-contact">
        <a href="tel:+79648111118" tabindex="-1">+7 (964) 811-11-18</a>
        <a href="mailto:info@brand.ru" tabindex="-1">info@brand.ru</a>
      </div>
    </header>

    <section class="overlay-home-backdrop__hero">
      <div class="overlay-home-backdrop__image" />
      <div class="overlay-home-backdrop__copy">
        <p class="landing-section__eyebrow">Хирургический шовный материал</p>
        <h1 class="landing-section__title">BRAND. Хирургический шовный материал высшей пробы</h1>
      </div>
    </section>
  </div>
</template>
