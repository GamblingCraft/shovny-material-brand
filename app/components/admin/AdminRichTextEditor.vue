<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = import.meta.client
  ? new Editor({
      extensions: [StarterKit],
      content: props.modelValue,
      editorProps: {
        attributes: {
          class: 'admin-rich-editor__content prose'
        }
      },
      onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML())
      }
    })
  : null

const isActive = (name: string, attrs?: Record<string, unknown>) =>
  computed(() => editor?.isActive(name, attrs) ?? false)

const toolbar = [
  {
    key: 'paragraph',
    label: 'Текст',
    icon: 'lucide:text',
    action: () => editor?.chain().focus().setParagraph().run(),
    active: isActive('paragraph')
  },
  {
    key: 'heading',
    label: 'H2',
    icon: 'lucide:heading-2',
    action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    active: isActive('heading', { level: 2 })
  },
  {
    key: 'bold',
    label: 'Ж',
    icon: 'lucide:bold',
    action: () => editor?.chain().focus().toggleBold().run(),
    active: isActive('bold')
  },
  {
    key: 'italic',
    label: 'К',
    icon: 'lucide:italic',
    action: () => editor?.chain().focus().toggleItalic().run(),
    active: isActive('italic')
  },
  {
    key: 'bullet',
    label: 'Список',
    icon: 'lucide:list',
    action: () => editor?.chain().focus().toggleBulletList().run(),
    active: isActive('bulletList')
  },
  {
    key: 'ordered',
    label: '1.',
    icon: 'lucide:list-ordered',
    action: () => editor?.chain().focus().toggleOrderedList().run(),
    active: isActive('orderedList')
  },
  {
    key: 'quote',
    label: 'Цитата',
    icon: 'lucide:quote',
    action: () => editor?.chain().focus().toggleBlockquote().run(),
    active: isActive('blockquote')
  },
  {
    key: 'divider',
    label: 'Линия',
    icon: 'lucide:minus',
    action: () => editor?.chain().focus().setHorizontalRule().run(),
    active: computed(() => false)
  }
] as const

watch(
  () => props.modelValue,
  (value) => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '<p></p>', false)
    }
  }
)

onBeforeUnmount(() => {
  editor?.destroy()
})
</script>

<template>
  <div class="admin-rich-editor">
    <div class="admin-rich-editor__toolbar">
      <button
        v-for="item in toolbar"
        :key="item.key"
        class="admin-rich-editor__tool"
        :class="{ 'admin-rich-editor__tool--active': item.active.value }"
        type="button"
        :title="item.label"
        @click="item.action"
      >
        <Icon :name="item.icon" />
      </button>
    </div>

    <EditorContent :editor="editor" />

    <p v-if="placeholder && !modelValue" class="admin-rich-editor__hint">
      {{ placeholder }}
    </p>
  </div>
</template>
