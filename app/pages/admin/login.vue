<script setup lang="ts">
const route = useRoute()
const username = ref('admin')
const password = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

const login = async () => {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    await $fetch('/api/admin/session', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value
      }
    })

    await navigateTo(typeof route.query.redirect === 'string' ? route.query.redirect : '/admin')
  }
  catch {
    errorMessage.value = 'Неверный логин или пароль.'
  }
  finally {
    isSubmitting.value = false
  }
}

useSeoMeta({
  title: 'Вход в админку | BRAND',
  description: 'Авторизация в административной панели BRAND.'
})
</script>

<template>
  <main class="admin-login">
    <section class="admin-login__panel">
      <div class="admin-login__intro">
        <p class="admin-login__eyebrow">ADMIN</p>
      </div>

      <form class="admin-login__form" @submit.prevent="login">
        <label class="admin-form__field">
          <span>Логин</span>
          <input v-model="username" type="text" autocomplete="username" required />
        </label>

        <label class="admin-form__field">
          <span>Пароль</span>
          <input v-model="password" type="password" autocomplete="current-password" required />
        </label>

        <p v-if="errorMessage" class="admin-login__error">
          {{ errorMessage }}
        </p>

        <button class="admin-action-button admin-action-button--full" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Входим...' : 'Войти' }}
        </button>
      </form>
    </section>
  </main>
</template>
