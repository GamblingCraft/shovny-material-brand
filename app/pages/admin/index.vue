<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

useSeoMeta({
  title: 'Админка | BRAND',
  description: 'Панель управления контентом сайта BRAND.'
})
</script>

<template>
  <section class="admin-dashboard-empty">
    <div class="admin-dashboard-empty__panel" />
    <div class="admin-dashboard-empty__panel admin-dashboard-empty__panel--secondary" />
  </section>
</template>
