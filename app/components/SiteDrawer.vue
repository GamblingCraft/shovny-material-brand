<script setup lang="ts">
type NavItem = {
  label: string
  to?: string
  href?: string
}

withDefaults(
  defineProps<{
    modelValue: boolean
    navItems: readonly NavItem[] | NavItem[]
    light?: boolean
  }>(),
  {
    light: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const closeDrawer = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <transition name="menu-fade">
    <button
      v-if="modelValue"
      class="site-drawer__backdrop"
      type="button"
      aria-label="Закрыть меню"
      @click="closeDrawer"
    />
  </transition>

  <aside class="site-drawer" :class="{ 'site-drawer--open': modelValue, 'site-drawer--light': light }" aria-label="Навигационное меню">
    <div class="site-drawer__header">
      <div class="site-drawer__brand">
        <p>BRAND</p>
        <span>Хирургический шовный материал</span>
      </div>

      <button type="button" class="site-drawer__close" aria-label="Закрыть меню" @click="closeDrawer">
        Закрыть
      </button>
    </div>

    <nav class="site-drawer__nav" aria-label="Навигация по сайту">
      <template v-for="item in navItems" :key="`${item.label}-${item.to ?? item.href}`">
        <NuxtLink v-if="item.to" class="site-drawer__link" :to="item.to" @click="closeDrawer">{{ item.label }}</NuxtLink>
        <a v-else class="site-drawer__link" :href="item.href" @click="closeDrawer">{{ item.label }}</a>
      </template>
    </nav>

    <div class="site-drawer__contacts">
      <a href="tel:+79648111118">+7 (964) 811-11-18</a>
      <a href="mailto:info@brand.ru">info@brand.ru</a>
    </div>
  </aside>
</template>
