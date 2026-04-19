<script setup lang="ts">
type NavItem = {
  label: string
  to?: string
  href?: string
}

const props = withDefaults(
  defineProps<{
    navItems: readonly NavItem[] | NavItem[]
    leftImage?: string
    closeTo?: string
  }>(),
  {
    leftImage:
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1400&q=80',
    closeTo: '/'
  }
)

const router = useRouter()
const isDrawerOpen = ref(false)
const overlayState = useState('internal-overlay-state', () => ({
  closing: false
}))

const closeOverlay = async () => {
  if (overlayState.value.closing) {
    return
  }

  isDrawerOpen.value = false
  overlayState.value.closing = true
  await new Promise((resolve) => setTimeout(resolve, 560))
  await router.push(props.closeTo)
  overlayState.value.closing = false
}
</script>

<template>
  <div class="internal-overlay" :class="{ 'internal-overlay--closing': overlayState.closing }">
    <aside class="internal-overlay__media">
      <img class="internal-overlay__media-image" :src="leftImage" alt="" />
      <div class="internal-overlay__brand">
        <p>BRAND</p>
        <span>Хирургический шовный материал</span>
      </div>
    </aside>

    <section class="internal-overlay__panel">
      <header class="internal-overlay__header">
        <nav class="internal-overlay__nav" aria-label="Внутренняя навигация">
          <template v-for="item in navItems" :key="`${item.label}-${item.to ?? item.href}`">
            <NuxtLink v-if="item.to" class="internal-overlay__link" :to="item.to">{{ item.label }}</NuxtLink>
            <a v-else class="internal-overlay__link" :href="item.href">{{ item.label }}</a>
          </template>
        </nav>

        <div class="internal-overlay__actions">
          <button
            class="burger-button burger-button--light burger-button--inline"
            :class="{ 'burger-button--active': isDrawerOpen }"
            type="button"
            aria-label="Открыть меню"
            @click="isDrawerOpen = !isDrawerOpen"
          >
            <span />
            <span />
            <span />
          </button>

          <div class="internal-overlay__contacts">
            <a href="tel:+79648111118">+7 (964) 811-11-18</a>
            <a href="mailto:info@brand.ru">info@brand.ru</a>
          </div>

          <button class="internal-overlay__close" type="button" aria-label="Закрыть" @click="closeOverlay">x</button>
        </div>
      </header>

      <SiteDrawer v-model="isDrawerOpen" :nav-items="navItems" light />

      <div class="internal-overlay__scroll">
        <div class="internal-overlay__content">
          <slot />
        </div>
      </div>
    </section>
  </div>
</template>
