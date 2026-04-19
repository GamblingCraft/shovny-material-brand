<script setup lang="ts">
import IndexPage from '~/pages/index.vue'

const router = useRouter()
const route = useRoute()
const previousPath = useState('page-transition-source', () => '')
const overlayState = useState('internal-overlay-state', () => ({
  closing: false
}))

router.beforeEach((to, from) => {
  previousPath.value = from.path || ''
})

watch(
  () => route.path,
  (path) => {
    if (path !== '/') {
      overlayState.value.closing = false
    }
  },
  { immediate: true }
)

const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const isInternalRoute = computed(() => route.path !== '/' && !isAdminRoute.value)
const overlayTransitionName = computed(() => {
  if (previousPath.value === '/' && isInternalRoute.value) {
    return 'internal-open'
  }

  return 'internal-static'
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />

    <template v-if="isInternalRoute">
      <div class="app-overlay-scene">
        <div class="app-overlay-scene__background" aria-hidden="true">
          <IndexPage />
        </div>

        <Transition :name="overlayTransitionName" appear>
          <div :key="route.fullPath" class="app-overlay-scene__page">
            <NuxtLayout>
              <NuxtPage />
            </NuxtLayout>
          </div>
        </Transition>
      </div>
    </template>

    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
