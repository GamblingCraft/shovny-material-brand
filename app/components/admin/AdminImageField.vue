<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  label?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isUploading = ref(false)
const uploadError = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const openFileDialog = () => {
  fileInput.value?.click()
}

const handleChange = async (event: Event) => {
  const target = event.target as HTMLInputElement | null
  const file = target?.files?.[0]

  if (!file) {
    return
  }

  const formData = new FormData()
  formData.append('file', file)

  isUploading.value = true
  uploadError.value = ''

  try {
    const response = await $fetch<{ url: string }>('/api/admin/upload', {
      method: 'POST',
      body: formData
    })

    emit('update:modelValue', response.url)
  }
  catch {
    uploadError.value = 'Не удалось загрузить изображение.'
  }
  finally {
    isUploading.value = false

    if (target) {
      target.value = ''
    }
  }
}
</script>

<template>
  <div class="admin-image-field">
    <div class="admin-image-field__preview" :class="{ 'admin-image-field__preview--empty': !props.modelValue }">
      <img v-if="props.modelValue" :src="props.modelValue" :alt="label || 'Изображение'" />
      <div v-else class="admin-image-field__placeholder">
        <Icon name="heroicons:photo" />
        <span>Изображение не выбрано</span>
      </div>
    </div>

    <div class="admin-image-field__controls">
      <label class="admin-form__field">
        <span>{{ label || 'Изображение' }}</span>
        <input
          :value="props.modelValue"
          type="url"
          placeholder="https:// или /uploads/..."
          @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        />
      </label>

      <div class="admin-image-field__actions">
        <input
          ref="fileInput"
          class="admin-image-field__input"
          type="file"
          accept="image/*"
          @change="handleChange"
        />

        <button class="admin-secondary-button" type="button" :disabled="isUploading" @click="openFileDialog">
          <Icon name="heroicons:arrow-up-tray" />
          <span>{{ isUploading ? 'Загрузка...' : 'Загрузить файл' }}</span>
        </button>
      </div>

      <p v-if="uploadError" class="admin-image-field__error">{{ uploadError }}</p>
    </div>
  </div>
</template>
