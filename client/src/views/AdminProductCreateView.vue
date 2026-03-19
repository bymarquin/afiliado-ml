<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { ArrowLeft, CheckCircle2, Link, Plus, Save } from 'lucide-vue-next'

import http from '@/services/http'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const isMobileMenuOpen = ref(false)
const activeItem = ref('products')
const isScraping = ref(false)
const isSaving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const scrapeDebounce = ref(null)
const lastScrapedUrl = ref('')

const form = ref({
  url: '',
  title: '',
  price: '',
  original_price: '',
  affiliate_url: '',
  status: 'active',
  featured: false,
})

const preview = ref(null)

const canSave = computed(() => {
  return Boolean(form.value.url.trim() && form.value.title.trim() && form.value.price !== '')
})

function resetForm() {
  form.value = {
    url: '',
    title: '',
    price: '',
    original_price: '',
    affiliate_url: '',
    status: 'active',
    featured: false,
  }
  preview.value = null
  lastScrapedUrl.value = ''
  errorMessage.value = ''
}

function resetAll() {
  resetForm()
  successMessage.value = ''
}

function normalizeNumber(value) {
  if (value === '' || value === null || value === undefined) return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

function canTriggerScraping(url) {
  try {
    const parsed = new URL(url)
    return /mercadolivre\.com(\.br)?$/i.test(parsed.hostname)
  } catch {
    return false
  }
}

async function runScraping() {
  const targetUrl = form.value.url.trim()
  if (!targetUrl || targetUrl === lastScrapedUrl.value) return

  isScraping.value = true
  try {
    const { data } = await http.get('/produtos/scraping', {
      params: { url: targetUrl },
    })

    const scraped = data?.data?.[0]
    if (!scraped) {
      errorMessage.value = 'Não foi possível extrair os dados do produto.'
      return
    }

    preview.value = scraped
    lastScrapedUrl.value = targetUrl
    form.value.title = scraped.title || ''
    form.value.price = scraped.price ?? ''
    form.value.original_price = scraped.original_price ?? ''
    form.value.affiliate_url = form.value.affiliate_url || form.value.url
    form.value.status = 'active'
    form.value.featured = false
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message || error?.response?.data?.error || 'Erro ao fazer scraping.'
  } finally {
    isScraping.value = false
  }
}

async function submitForm() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!canSave.value) {
    errorMessage.value = 'Preencha os campos obrigatórios antes de salvar.'
    return
  }

  isSaving.value = true
  try {
    const payload = {
      url: form.value.url.trim(),
      title: form.value.title.trim(),
      price: normalizeNumber(form.value.price),
      original_price: normalizeNumber(form.value.original_price),
      affiliate_url: form.value.affiliate_url.trim() || form.value.url.trim(),
      status: form.value.status,
      featured: form.value.featured,
    }

    const { data } = await http.post('/produtos/scraping', payload)
    successMessage.value = data?.message || 'Produto criado com sucesso.'
    const preservedUrl = form.value.url
    resetForm()
    form.value.url = preservedUrl
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message || error?.response?.data?.error || 'Erro ao cadastrar produto.'
  } finally {
    isSaving.value = false
  }
}

watch(
  () => form.value.url,
  (newUrl) => {
    errorMessage.value = ''
    successMessage.value = ''

    if (scrapeDebounce.value) {
      clearTimeout(scrapeDebounce.value)
    }

    const trimmedUrl = newUrl.trim()

    if (!trimmedUrl) {
      preview.value = null
      lastScrapedUrl.value = ''
      return
    }

    if (trimmedUrl !== lastScrapedUrl.value) {
      preview.value = null
      form.value.title = ''
      form.value.price = ''
      form.value.original_price = ''
    }

    if (!canTriggerScraping(trimmedUrl)) return

    scrapeDebounce.value = setTimeout(() => {
      runScraping()
    }, 700)
  },
)

onBeforeUnmount(() => {
  if (scrapeDebounce.value) {
    clearTimeout(scrapeDebounce.value)
  }
})
</script>

<template>
  <AdminLayout
    title="Cadastrar Produto"
    mobileTitle="Novo Produto"
    :isMobileMenuOpen="isMobileMenuOpen"
    :activeItem="activeItem"
    @update:isMobileMenuOpen="isMobileMenuOpen = $event"
    @select-item="(id) => (activeItem = id)"
  >
    <template #title-icon>
      <Plus class="w-7 h-7 text-gray-950 dark:text-neutral-100" :stroke-width="2.25" />
    </template>

    <template #header-actions>
      <BaseButton variant="outline" size="sm" class="gap-2" to="/admin/produtos">
        <ArrowLeft class="w-4 h-4" />
        Voltar para lista
      </BaseButton>
    </template>

    <section class="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 md:p-5">
      <div class="mb-5">
        <h2 class="text-base md:text-lg font-semibold text-gray-950 dark:text-neutral-100">Cadastro com Scraping</h2>
        <p class="text-sm text-gray-500 dark:text-neutral-400 mt-1">
          Informe o link, aguarde o scraping automático e ajuste o básico antes de salvar.
        </p>
      </div>

      <div class="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 md:p-5 mb-5 shadow-sm">
        <div class="flex items-center justify-between gap-3 mb-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">Etapa 1</p>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-neutral-100">Buscar dados por scraping</h3>
            <p class="text-xs text-gray-500 dark:text-neutral-400 mt-1">Scraping automático ao informar a URL.</p>
          </div>
        </div>

        <label class="flex flex-col gap-1.5">
          <span class="text-sm font-medium text-gray-700 dark:text-neutral-300">URL do produto Mercado Livre *</span>
          <div class="relative">
            <Link class="w-4 h-4 text-gray-400 dark:text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              v-model="form.url"
              type="url"
              placeholder="https://www.mercadolivre.com.br/..."
              class="input-field input-field-with-icon"
            />
          </div>
        </label>
      </div>

      <div v-if="preview" class="grid grid-cols-1 lg:grid-cols-[88px_1fr] gap-4 rounded-2xl border border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800 p-4 mb-5">
        <div
          class="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex-shrink-0"
        >
          <img
            v-if="preview.image"
            :src="preview.image"
            :alt="preview.title"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="min-w-0">
          <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-400 font-semibold">
            Prévia do scraping
          </p>
          <p class="text-sm font-semibold text-gray-900 dark:text-neutral-100 mt-1 truncate">{{ preview.title }}</p>
          <p class="text-xs text-gray-500 dark:text-neutral-400 mt-1 truncate">{{ preview.url }}</p>
          <p class="text-xs text-gray-600 dark:text-neutral-300 mt-2">Preço encontrado: {{ preview.price ?? '-' }}</p>
        </div>
      </div>

      <div v-if="preview" class="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 md:p-5 mb-5 shadow-sm">
        <div class="mb-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">Etapa 2</p>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-neutral-100">Ajustar dados básicos</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label class="flex flex-col gap-1.5 md:col-span-2">
            <span class="text-sm font-medium text-gray-700 dark:text-neutral-300">Título *</span>
            <input
              v-model="form.title"
              type="text"
              placeholder="Nome do produto"
              class="input-field"
            />
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-sm font-medium text-gray-700 dark:text-neutral-300">Preço *</span>
            <input
              v-model="form.price"
              type="number"
              step="0.01"
              min="0"
              placeholder="199.90"
              class="input-field"
            />
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-sm font-medium text-gray-700 dark:text-neutral-300">Preço original</span>
            <input
              v-model="form.original_price"
              type="number"
              step="0.01"
              min="0"
              placeholder="249.90"
              class="input-field"
            />
          </label>

          <label class="flex flex-col gap-1.5 md:col-span-2">
            <span class="text-sm font-medium text-gray-700 dark:text-neutral-300">URL afiliada</span>
            <input
              v-model="form.affiliate_url"
              type="url"
              placeholder="https://seu-link-afiliado..."
              class="input-field"
            />
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-sm font-medium text-gray-700 dark:text-neutral-300">Status</span>
            <select v-model="form.status" class="input-field">
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="out_of_stock">Sem estoque</option>
            </select>
          </label>

          <label class="flex items-center gap-2 mt-6">
            <input v-model="form.featured" type="checkbox" class="accent-primary w-4 h-4" />
            <span class="text-sm text-gray-700 dark:text-neutral-300">Produto em destaque</span>
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

      <div class="pt-5 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-end gap-2">
        <BaseButton variant="outline" size="sm" :disabled="isScraping || isSaving" @click="resetAll"
          >Limpar</BaseButton
        >
        <BaseButton
          variant="primary"
          size="sm"
          class="gap-2"
          :disabled="!preview || isScraping || isSaving"
          @click="submitForm"
        >
          <Save class="w-4 h-4" />
          {{ isSaving ? 'Salvando...' : 'Salvar Produto' }}
        </BaseButton>
      </div>
    </section>
  </AdminLayout>
</template>

<style scoped>
.input-field {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid var(--color-gray-200);
  background: #fff;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  color: var(--color-gray-950);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.input-field-with-icon {
  padding-left: 2.75rem;
}

.input-field::placeholder {
  color: var(--color-gray-400);
}

.input-field:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
}

:global(.dark) .input-field {
  border-color: rgb(64 64 64);
  background: rgb(38 38 38);
  color: rgb(245 245 245);
}

:global(.dark) .input-field::placeholder {
  color: rgb(163 163 163);
}
</style>
