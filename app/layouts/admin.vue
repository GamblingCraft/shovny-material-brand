<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const navGroups = [
  {
    label: 'Контент',
    items: [
      { label: 'Блог', to: '/admin/blog', icon: 'lucide:newspaper' },
      { label: 'Новости', to: '/admin/news', icon: 'lucide:megaphone' },
      { label: 'Страницы', to: '/admin/pages', icon: 'lucide:file-text' }
    ]
  }
] as const

const currentTitle = computed(() => {
  if (route.path === '/admin') {
    return 'Главная'
  }

  if (route.path === '/admin/login') {
    return 'Вход'
  }

  if (route.path.startsWith('/admin/blog')) {
    return route.path === '/admin/blog' ? 'Главная / Блог' : 'Главная / Блог / Редактор'
  }

  if (route.path.startsWith('/admin/news')) {
    return route.path === '/admin/news' ? 'Главная / Новости' : 'Главная / Новости / Редактор'
  }

  if (route.path.startsWith('/admin/pages')) {
    return route.path === '/admin/pages' ? 'Главная / Страницы' : 'Главная / Страницы / Редактор'
  }

  return 'Главная / Контент'
})

const isSectionActive = (to: string) => route.path === to || route.path.startsWith(`${to}/`)

const logout = async () => {
  await $fetch('/api/admin/session', {
    method: 'DELETE'
  })

  await router.push('/admin/login')
}
</script>

<template>
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <NuxtLink class="admin-sidebar__brand" to="/admin">
        <span class="admin-sidebar__brand-mark">BRAND</span>
      </NuxtLink>

      <nav class="admin-sidebar__nav" aria-label="Навигация админки">
        <NuxtLink
          class="admin-sidebar__link"
          :class="{ 'admin-sidebar__link--active': route.path === '/admin' }"
          to="/admin"
        >
          <span class="admin-sidebar__link-content">
            <Icon name="lucide:house" />
            <span>Главная</span>
          </span>
        </NuxtLink>

        <div v-for="group in navGroups" :key="group.label" class="admin-sidebar__group">
          <button class="admin-sidebar__group-button" type="button">
            <span class="admin-sidebar__link-content">
              <Icon name="lucide:panel-left" />
              <span>{{ group.label }}</span>
            </span>
            <Icon class="admin-sidebar__group-caret" name="lucide:chevron-down" />
          </button>

          <div class="admin-sidebar__subnav">
            <NuxtLink
              v-for="item in group.items"
              :key="item.to"
              class="admin-sidebar__sublink"
              :class="{ 'admin-sidebar__sublink--active': isSectionActive(item.to) }"
              :to="item.to"
            >
              <Icon :name="item.icon" />
              <span>{{ item.label }}</span>
            </NuxtLink>
          </div>
        </div>

        <div class="admin-sidebar__ghost">
          <span class="admin-sidebar__link-content">
            <Icon name="lucide:shopping-cart" />
            <span>Магазин</span>
          </span>
          <small>Скоро</small>
        </div>
      </nav>

      <div class="admin-sidebar__footer">
        <div class="admin-sidebar__utility">
          <Icon name="lucide:file-code-2" />
          <span>robots.txt</span>
        </div>

        <button class="admin-sidebar__utility-button" type="button">
          Генерация Sitemap.xml
        </button>
      </div>
    </aside>

    <div class="admin-main">
      <header class="admin-topbar">
        <p class="admin-topbar__title">{{ currentTitle }}</p>

        <div class="admin-topbar__profile">
          <button class="admin-topbar__icon-button" type="button" aria-label="Уведомления">
            <Icon name="lucide:bell" />
          </button>

          <button class="admin-topbar__user" type="button" @click="logout">
            <span class="admin-topbar__user-name">Администратор</span>
            <span class="admin-topbar__user-email">admin@brand.ru</span>
            <Icon name="lucide:chevron-down" />
          </button>
        </div>
      </header>

      <main class="admin-content">
        <slot />
      </main>
    </div>
  </div>
</template>
