<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { ArrowLeft, CheckCircle2, FolderPlus, Save, Tag, AtSign, FolderTree } from 'lucide-vue-next'

import http from '@/services/http'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const isMobileMenuOpen = ref(false)
const activeItem = ref('categories')
const isLoading = ref(false)
const isLoadingParents = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const categories = ref([])

const form = ref({
  name: '',
  slug: '',
  parent_category_id: '',
  is_active: true,
})

function toSlug(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

const generatedSlug = computed(() => toSlug(form.value.slug || form.value.name))

watch(
  () => form.value.name,
  () => {
    if (!form.value.slug.trim()) return
    form.value.slug = toSlug(form.value.slug)
  },
)

function resetForm() {
  form.value = {
    name: '',
    slug: '',
    parent_category_id: '',
    is_active: true,
  }
  errorMessage.value = ''
}

async function loadParentCategories() {
  isLoadingParents.value = true
  try {
    const { data } = await http.get('/categorias')
    categories.value = data?.data || []
  } catch {
    categories.value = []
  } finally {
    isLoadingParents.value = false
  }
}

async function submitForm() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.value.name.trim()) {
    errorMessage.value = 'Nome da categoria é obrigatório.'
    return
  }

  const payload = {
    name: form.value.name.trim(),
    slug: form.value.slug.trim() ? toSlug(form.value.slug) : undefined,
    parent_category_id: form.value.parent_category_id
      ? Number(form.value.parent_category_id)
      : null,
    is_active: Boolean(form.value.is_active),
  }

  isLoading.value = true
  try {
    const { data } = await http.post('/categorias', payload)

    successMessage.value = data?.message || 'Categoria cadastrada com sucesso.'
    resetForm()
    await loadParentCategories()
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Erro ao cadastrar categoria.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadParentCategories)
</script>

<template>
  <AdminLayout
    title="Cadastrar Categoria"
    mobileTitle="Nova Categoria"
    :isMobileMenuOpen="isMobileMenuOpen"
    :activeItem="activeItem"
    @update:isMobileMenuOpen="isMobileMenuOpen = $event"
    @select-item="(id) => (activeItem = id)"
  >
    <template #title-icon>
      <FolderPlus class="w-7 h-7 text-gray-950 dark:text-neutral-100" :stroke-width="2.25" />
    </template>

    <template #header-actions>
      <BaseButton variant="outline" size="sm" class="gap-2" to="/admin">
        <ArrowLeft class="w-4 h-4" />
        Voltar ao Dashboard
      </BaseButton>
    </template>

    <section
      class="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 md:p-5"
    >
      <div class="mb-5">
        <h2 class="text-base md:text-lg font-semibold text-gray-950 dark:text-neutral-100">
          Nova categoria
        </h2>
        <p class="text-sm text-gray-500 dark:text-neutral-400 mt-1">
          Cadastre categorias principais ou subcategorias para organizar os produtos.
        </p>
      </div>

      <div
        class="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 md:p-5 shadow-sm mb-5"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label class="flex flex-col gap-1.5 md:col-span-2">
            <span class="text-sm font-medium text-gray-700 dark:text-neutral-300"
              >Nome da categoria *</span
            >
            <div class="relative">
              <Tag
                class="w-4 h-4 text-gray-400 dark:text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2"
              />
              <input
                v-model="form.name"
                type="text"
                placeholder="Ex.: Eletrônicos"
                class="w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 pl-10 pr-3 py-2.5 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-sm font-medium text-gray-700 dark:text-neutral-300"
              >Slug (opcional)</span
            >
            <div class="relative">
              <AtSign
                class="w-4 h-4 text-gray-400 dark:text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2"
              />
              <input
                v-model="form.slug"
                type="text"
                placeholder="ex.: eletronicos"
                class="w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 pl-10 pr-3 py-2.5 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <span class="text-xs text-gray-500 dark:text-neutral-400"
              >Slug final: {{ generatedSlug || '-' }}</span
            >
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-sm font-medium text-gray-700 dark:text-neutral-300"
              >Categoria pai</span
            >
            <div class="relative">
              <FolderTree
                class="w-4 h-4 text-gray-400 dark:text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <select
                v-model="form.parent_category_id"
                class="w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 pl-10 pr-3 py-2.5 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:bg-gray-50 dark:disabled:bg-neutral-900 disabled:text-gray-400 dark:disabled:text-neutral-500 disabled:cursor-not-allowed"
                :disabled="isLoadingParents"
              >
                <option value="">Nenhuma (categoria raiz)</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </label>

          <label class="flex items-center gap-2 mt-2">
            <input v-model="form.is_active" type="checkbox" class="accent-primary w-4 h-4" />
            <span class="text-sm text-gray-700 dark:text-neutral-300">Categoria ativa</span>
          </label>
        </div>
      </div>

      <div
        v-if="errorMessage"
        class="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 mb-5"
      >
        {{ errorMessage }}
      </div>

      <div
        v-if="successMessage"
        class="rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300 flex items-start gap-2 mb-5"
      >
        <CheckCircle2 class="w-4 h-4 mt-0.5 shrink-0" />
        <p>{{ successMessage }}</p>
      </div>

      <div
        class="pt-5 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-end gap-2"
      >
        <BaseButton variant="outline" size="sm" :disabled="isLoading" @click="resetForm"
          >Limpar</BaseButton
        >
        <BaseButton
          variant="primary"
          size="sm"
          class="gap-2"
          :disabled="isLoading"
          @click="submitForm"
        >
          <Save class="w-4 h-4" />
          {{ isLoading ? 'Salvando...' : 'Salvar Categoria' }}
        </BaseButton>
      </div>
    </section>
  </AdminLayout>
</template>
