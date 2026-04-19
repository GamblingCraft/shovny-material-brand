<script setup lang="ts">
import { siteNavItems } from '~/data/internal-pages'

const sections = [
  {
    id: 'hero',
    eyebrow: 'Хирургический шовный материал',
    title: 'Хирургический шовный материал высшей пробы',
    lead: 'Надежные решения для хирургии, стабильное качество поставок и современный подход к работе с клиниками, дилерами и медицинскими учреждениями.',
    metrics: ['Каталог', 'Производство', 'Контакты']
  },
  {
    id: 'production',
    eyebrow: 'Производство',
    title: 'Собственный цикл производства и лабораторный контроль',
    lead: 'Производственный цикл выстроен вокруг точности, чистоты процессов и многоступенчатого контроля, чтобы каждая партия соответствовала медицинским требованиям.',
    metrics: ['Контроль сырья', 'Лабораторный контроль', 'Серионное производство']
  },
  {
    id: 'catalog',
    eyebrow: 'Каталог',
    title: 'Каталог решений для различных направлений хирургии',
    lead: 'Ассортимент охватывает востребованные позиции для разных клинических задач, позволяя быстро подобрать нужный материал под профиль вмешательства.',
    metrics: ['Рассасывающиеся', 'Нерассасывающиеся', 'Монофиламентные', 'Плетеные', 'Атравматические', 'Офтальмологические']
  },
  {
    id: 'quality',
    eyebrow: 'Качество',
    title: 'Аргументы для клиник, врачей и отделов закупок',
    lead: 'Система качества опирается на подтвержденные стандарты, прозрачную документацию и ответственное сопровождение клиентов на каждом этапе сотрудничества.',
    metrics: ['Сертификаты', 'Документация', 'Гарантия качества']
  },
  {
    id: 'partners',
    eyebrow: 'Партнерам',
    title: 'Отдельный сценарий для учреждений, дилеров и корпоративных клиентов',
    lead: 'Для каждого формата сотрудничества предусмотрен понятный сценарий взаимодействия: от прямых поставок в учреждения до работы с дилерской сетью.',
    metrics: ['Учреждениям', 'Дилерам', 'Оптовые закупки']
  },
  {
    id: 'contacts',
    eyebrow: 'Контакты',
    title: 'Быстрый выход на связь и офлайн-присутствие компании',
    lead: 'Свяжитесь с нами удобным способом, чтобы обсудить поставки, получить консультацию по продукции и уточнить условия сотрудничества.',
    metrics: ['Позвонить', 'Написать', 'Проложить маршрут']
  }
] as const

const activeSection = ref(sections[0].id)
const isDrawerOpen = ref(false)
const scrollContainer = useTemplateRef<HTMLElement>('scrollContainer')
let sectionObserver: IntersectionObserver | null = null
let wheelReleaseTimer: ReturnType<typeof setTimeout> | null = null
let wheelLocked = false
let wheelDeltaAccumulator = 0

const activeSectionIndex = computed(() => {
  return Math.max(
    0,
    sections.findIndex((section) => section.id === activeSection.value)
  )
})

const scrollToSection = (sectionId: string) => {
  if (!import.meta.client) {
    return
  }

  isDrawerOpen.value = false

  document.getElementById(sectionId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

const getScrollSections = () => {
  if (!import.meta.client) {
    return []
  }

  return Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-target]'))
}

const scrollToSectionByIndex = (nextIndex: number) => {
  const items = getScrollSections()
  const boundedIndex = Math.min(Math.max(nextIndex, 0), items.length - 1)
  const nextSection = items[boundedIndex]

  if (!nextSection) {
    return
  }

  wheelLocked = true
  wheelDeltaAccumulator = 0
  nextSection.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })

  if (wheelReleaseTimer) {
    clearTimeout(wheelReleaseTimer)
  }

  wheelReleaseTimer = setTimeout(() => {
    wheelLocked = false
  }, 900)
}

const handleWheelSnap = (event: WheelEvent) => {
  if (!scrollContainer.value || window.innerWidth <= 900) {
    return
  }

  if (wheelLocked) {
    event.preventDefault()
    return
  }

  wheelDeltaAccumulator += event.deltaY

  if (Math.abs(wheelDeltaAccumulator) < 45) {
    event.preventDefault()
    return
  }

  const direction = wheelDeltaAccumulator > 0 ? 1 : -1
  const nextIndex = activeSectionIndex.value + direction
  const items = getScrollSections()

  if (nextIndex < 0 || nextIndex >= items.length) {
    wheelDeltaAccumulator = 0
    return
  }

  event.preventDefault()
  scrollToSectionByIndex(nextIndex)
}

const goToCatalog = () => {
  navigateTo('/catalog')
}

onMounted(() => {
  const observedSections = document.querySelectorAll<HTMLElement>('[data-section]')
  sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0]

      if (visibleEntry?.target instanceof HTMLElement) {
        activeSection.value = visibleEntry.target.id
      }
    },
    {
      threshold: [0.35, 0.55, 0.75],
      rootMargin: '-8% 0px -8% 0px'
    }
  )

  observedSections.forEach((section) => sectionObserver?.observe(section))
  scrollContainer.value?.addEventListener('wheel', handleWheelSnap, { passive: false })
})

onBeforeUnmount(() => {
  sectionObserver?.disconnect()
  scrollContainer.value?.removeEventListener('wheel', handleWheelSnap)

  if (wheelReleaseTimer) {
    clearTimeout(wheelReleaseTimer)
  }
})

useSeoMeta({
  title: 'BRAND | Хирургический шовный материал',
  description: 'Производитель хирургического шовного материала: полный цикл производства, каталог решений, производство и контакты.'
})
</script>

<template>
  <div class="page-shell">
    <header class="topbar">
      <div class="brand-block">
        <span class="brand-mark">A</span>
        <div>
          <p class="brand-name">BRAND</p>
          <p class="brand-subtitle">Хирургический шовный материал</p>
        </div>
      </div>

      <button
        class="burger-button"
        :class="{ 'burger-button--active': isDrawerOpen }"
        type="button"
        aria-label="Открыть меню"
        @click="isDrawerOpen = !isDrawerOpen"
      >
        <span />
        <span />
        <span />
      </button>

      <nav class="topbar-nav" aria-label="Основная навигация">
        <NuxtLink v-for="item in siteNavItems" :key="item.label" class="topbar-link" :to="item.to">
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="topbar-contact">
        <a href="tel:+79648111118">+7 (964) 811-11-18</a>
        <a href="mailto:info@brand.ru">info@brand.ru</a>
      </div>
    </header>

    <SiteDrawer v-model="isDrawerOpen" :nav-items="siteNavItems" light />

    <aside class="section-sidebar" aria-label="Навигация по секциям">
      <div class="section-sidebar__list">
        <button
          v-for="(section, index) in sections"
          :key="section.id"
          class="section-dot"
          :class="{ 'section-dot--active': activeSection === section.id }"
          type="button"
          :aria-current="activeSection === section.id ? 'true' : 'false'"
          @click="scrollToSection(section.id)"
        >
          <span class="section-dot__index">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="section-dot__label">{{ section.eyebrow }}</span>
        </button>
      </div>
    </aside>

    <aside class="scroll-rail" aria-label="Дополнительная навигация по секциям">
      <div class="scroll-rail__track">
        <span
          class="scroll-rail__thumb"
          :style="{ transform: `translateY(calc(${activeSectionIndex} * (1.7rem + 0.55rem)))` }"
        />
        <button
          v-for="section in sections"
          :key="`rail-${section.id}`"
          class="scroll-rail__dot"
          :class="{ 'scroll-rail__dot--active': activeSection === section.id }"
          type="button"
          :aria-label="section.eyebrow"
          @click="scrollToSection(section.id)"
        />
      </div>
    </aside>

    <main ref="scrollContainer" class="snap-scroll">
      <section
        v-for="(section, index) in sections"
        :id="section.id"
        :key="section.id"
        class="landing-section"
        :class="[`landing-section--${section.id}`, { 'landing-section--hero': index === 0 }]"
        data-section
        data-scroll-target
      >
        <div class="landing-section__backdrop" />
        <div class="landing-section__content">
          <div class="landing-section__header">
            <p class="landing-section__eyebrow">{{ section.eyebrow }}</p>
          </div>

          <div class="landing-section__body">
            <div class="landing-section__copy">
              <h1 v-if="index === 0" class="landing-section__title">
                {{ section.title }}
              </h1>
              <h2 v-else class="landing-section__title">
                {{ section.title }}
              </h2>

              <p class="landing-section__lead">
                {{ section.lead }}
              </p>
            </div>

            <div v-if="index === 0" class="hero-cta-card">
              <p class="hero-cta-card__eyebrow">Обратный звонок</p>
              <h2 class="hero-cta-card__title">Оставьте контакты и мы свяжемся с вами</h2>
              <form class="hero-cta-form" @submit.prevent="scrollToSection('contacts')">
                <label class="hero-cta-form__field">
                  <span class="hero-cta-form__label">Имя</span>
                  <input type="text" name="name" placeholder="Ваше имя" />
                </label>

                <label class="hero-cta-form__field">
                  <span class="hero-cta-form__label">Телефон</span>
                  <input type="tel" name="phone" placeholder="+7 (___) ___-__-__" />
                </label>

                <label class="hero-cta-form__field">
                  <span class="hero-cta-form__label">Комментарий</span>
                  <textarea name="comment" rows="3" placeholder="Коротко опишите запрос" />
                </label>

                <button class="landing-section__cta landing-section__cta--hero" type="submit">
                  Обсудить поставку
                </button>
              </form>
            </div>

            <div v-else-if="section.id === 'catalog'" class="landing-section__meta landing-section__meta--catalog">
              <div class="landing-section__meta-group">
                <button
                  v-for="metric in section.metrics"
                  :key="metric"
                  class="landing-section__tag"
                  type="button"
                  @click="goToCatalog"
                >
                  {{ metric }}
                </button>
              </div>

              <button class="landing-section__cta landing-section__cta--catalog" type="button" @click="goToCatalog">
                Перейти в каталог
              </button>
            </div>

            <div v-else class="landing-section__meta">
              <button
                v-for="metric in section.metrics"
                :key="metric"
                class="landing-section__tag"
                type="button"
                @click="scrollToSection(section.id === 'contacts' ? 'map' : 'contacts')"
              >
                {{ metric }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="map" class="map-section" data-scroll-target>
        <div class="map-section__intro">
          <p class="map-section__eyebrow">Карта</p>
          <h2 class="map-section__title">Контакты и расположение компании</h2>
          <p class="map-section__lead">
            Свяжитесь с нами по телефону или приезжайте в Иркутск для обсуждения поставок, сотрудничества и ассортимента продукции.
          </p>
        </div>

        <div class="map-section__layout">
          <div class="map-section__card">
            <p>Адрес</p>
            <strong>Иркутск</strong>
            <span>Работаем с медицинскими учреждениями, дилерами и корпоративными заказчиками.</span>
          </div>

          <div class="map-section__card">
            <p>Телефон</p>
            <strong>+7 (964) 811-11-18</strong>
            <span>Свяжитесь с нами, чтобы обсудить поставку, условия сотрудничества и доступный ассортимент.</span>
          </div>

          <div class="map-section__embed">
            <iframe
              title="Карта"
              src="https://www.openstreetmap.org/export/embed.html?bbox=104.18%2C52.24%2C104.42%2C52.34&amp;layer=mapnik"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>