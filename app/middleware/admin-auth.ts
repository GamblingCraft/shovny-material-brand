export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) {
    return
  }

  const session = await $fetch<{ authenticated: boolean }>('/api/admin/session').catch(() => ({
    authenticated: false
  }))

  if (to.path === '/admin/login') {
    if (session.authenticated) {
      return navigateTo('/admin')
    }

    return
  }

  if (!session.authenticated) {
    return navigateTo('/admin/login')
  }
})
