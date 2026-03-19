<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { PackageSearch, Plus, RefreshCw, Search, Star } from 'lucide-vue-next'

import http from '@/services/http'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const isMobileMenuOpen = ref(false)
const activeItem = ref('products')
const selectedStatus = ref('all')
const searchTerm = ref('')
const currentPage = ref(1)
const limit = ref(10)

const isLoading = ref(false)
const errorMessage = ref('')
const products = ref([])
const searchDebounce = ref(null)
const pagination = ref({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
})

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value) || 0)
}

function formatDate(date) {
  if (!date) return '-'
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(date))
}

function statusBadge(status) {
  const map = {
    active: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30',
    inactive: 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-700',
    out_of_stock: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30',
  }
  return map[status] || 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-700'
}

function statusLabel(status) {
  const map = {
    active: 'Ativo',
    inactive: 'Inativo',
    out_of_stock: 'Sem estoque',
  }
  return map[status] || 'Desconhecido'
}

async function loadProducts() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const params = {
      page: currentPage.value,
      limit: limit.value,
      order: 'updated_at',
      direction: 'DESC',
    }

    if (selectedStatus.value !== 'all') {
      params.status = selectedStatus.value
    }

    if (searchTerm.value.trim()) {
      params.search = searchTerm.value.trim()
    }

    const { data } = await http.get('/produtos', { params })
    products.value = data?.data || []
    pagination.value = data?.pagination || pagination.value
  } catch (error) {
    errorMessage.value = error?.response?.data?.error || 'Não foi possível carregar os produtos.'
    products.value = []
  } finally {
    isLoading.value = false
  }
}

function nextPage() {
  if (currentPage.value < pagination.value.totalPages) {
    currentPage.value += 1
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}

const totalClicks = computed(() =>
  products.value.reduce((acc, product) => acc + (product.click_count || 0), 0),
)
const averageRating = computed(() => {
  if (!products.value.length) return 0
  const ratedProducts = products.value.filter((product) => Number(product.rating) > 0)
  if (!ratedProducts.length) return 0
  const sum = ratedProducts.reduce((acc, product) => acc + Number(product.rating || 0), 0)
  return sum / ratedProducts.length
})

watch([selectedStatus, currentPage], loadProducts)
watch(searchTerm, () => {
  if (searchDebounce.value) {
    clearTimeout(searchDebounce.value)
  }
  currentPage.value = 1
  searchDebounce.value = setTimeout(() => {
    loadProducts()
  }, 300)
})

onMounted(loadProducts)
</script>

<template>
  <AdminLayout
    title="Visualizar Produtos"
    mobileTitle="Produtos"
    :isMobileMenuOpen="isMobileMenuOpen"
    :activeItem="activeItem"
    @update:isMobileMenuOpen="isMobileMenuOpen = $event"
    @select-item="(id) => (activeItem = id)"
  >
    <template #title-icon>
      <PackageSearch class="w-7 h-7 text-gray-950 dark:text-neutral-100" :stroke-width="2.25" />
    </template>

    <template #header-actions>
      <div class="flex items-center gap-2">
        <BaseButton variant="primary" size="sm" class="gap-2" to="/admin/produtos/cadastrar">
          <Plus class="w-4 h-4" />
          Cadastrar Produto
        </BaseButton>
        <BaseButton
          variant="outline"
          size="sm"
          class="gap-2"
          :disabled="isLoading"
          @click="loadProducts"
        >
          <RefreshCw class="w-4 h-4" />
          Atualizar
        </BaseButton>
      </div>
    </template>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6">
      <article class="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800 p-4">
        <p class="text-xs text-gray-500 dark:text-neutral-400 font-medium uppercase tracking-wide">Total listados</p>
        <p class="text-2xl font-semibold text-gray-950 dark:text-neutral-100 mt-2">{{ pagination.total }}</p>
      </article>
      <article class="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800 p-4">
        <p class="text-xs text-gray-500 dark:text-neutral-400 font-medium uppercase tracking-wide">Cliques (página)</p>
        <p class="text-2xl font-semibold text-gray-950 dark:text-neutral-100 mt-2">{{ totalClicks }}</p>
      </article>
      <article class="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800 p-4">
        <p class="text-xs text-gray-500 dark:text-neutral-400 font-medium uppercase tracking-wide">Nota média (página)</p>
        <p class="text-2xl font-semibold text-gray-950 dark:text-neutral-100 mt-2 flex items-center gap-2">
          <Star class="w-5 h-5 text-amber-500 fill-amber-500" />
          {{ averageRating.toFixed(1) }}
        </p>
      </article>
    </section>

    <section class="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 md:p-5 mb-5">
      <div class="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3">
        <label class="relative">
          <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar por nome do produto..."
            class="w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 pl-10 pr-3 py-2.5 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </label>

        <select
          v-model="selectedStatus"
          class="w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2.5 text-sm text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        >
          <option value="all">Todos os status</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
          <option value="out_of_stock">Sem estoque</option>
        </select>
      </div>
    </section>

    <section class="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
      <div v-if="errorMessage" class="p-4 border-b border-red-100 bg-red-50 text-sm text-red-700">
        {{ errorMessage }}
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[860px]">
          <thead class="bg-gray-50 dark:bg-neutral-800 border-b border-gray-100 dark:border-neutral-700">
            <tr>
              <th
                class="text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider px-4 py-3"
              >
                Produto
              </th>
              <th
                class="text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider px-4 py-3"
              >
                Categoria
              </th>
              <th
                class="text-right text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider px-4 py-3"
              >
                Preço
              </th>
              <th
                class="text-center text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider px-4 py-3"
              >
                Status
              </th>
              <th
                class="text-right text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider px-4 py-3"
              >
                Cliques
              </th>
              <th
                class="text-right text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider px-4 py-3"
              >
                Rating
              </th>
              <th
                class="text-right text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider px-4 py-3"
              >
                Atualizado em
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="7" class="px-4 py-12 text-sm text-center text-gray-500 dark:text-neutral-400">
                Carregando produtos...
              </td>
            </tr>

            <tr v-else-if="!products.length">
              <td colspan="7" class="px-4 py-12 text-sm text-center text-gray-500 dark:text-neutral-400">
                <div class="flex flex-col items-center gap-3">
                  <PackageSearch class="w-14 h-14 text-gray-300 dark:text-neutral-600" />
                  Nenhum produto encontrado com os filtros atuais.
                </div>
              </td>
            </tr>

            <tr
              v-for="product in products"
              :key="product.id"
              class="border-t border-gray-100 dark:border-neutral-800 hover:bg-gray-50/70 dark:hover:bg-neutral-800/60 transition-colors"
            >
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shrink-0"
                  >
                    <img
                      v-if="product.image_url"
                      :src="product.image_url"
                      :alt="product.title"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-gray-950 dark:text-neutral-100 truncate">{{ product.title }}</p>
                    <p class="text-xs text-gray-500 dark:text-neutral-400 truncate">ML: {{ product.meli_id || '-' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3.5 text-sm text-gray-700 dark:text-neutral-300">
                {{ product.categories?.[0]?.name || 'Sem categoria' }}
              </td>
              <td class="px-4 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-neutral-100">
                {{ formatCurrency(product.price) }}
              </td>
              <td class="px-4 py-3.5 text-center">
                <span
                  class="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold"
                  :class="statusBadge(product.status)"
                >
                  {{ statusLabel(product.status) }}
                </span>
              </td>
              <td class="px-4 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-neutral-100">
                {{ product.click_count || 0 }}
              </td>
              <td class="px-4 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-neutral-100">
                {{ Number(product.rating || 0).toFixed(1) }}
              </td>
              <td class="px-4 py-3.5 text-right text-xs text-gray-500 dark:text-neutral-400">
                {{ formatDate(product.updated_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer
        class="border-t border-gray-100 dark:border-neutral-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <p class="text-xs text-gray-500 dark:text-neutral-400">
          Página {{ pagination.page }} de {{ pagination.totalPages }} • {{ pagination.total }} itens
        </p>
        <div class="flex items-center gap-2">
          <BaseButton
            variant="outline"
            size="sm"
            :disabled="currentPage <= 1 || isLoading"
            @click="previousPage"
          >
            Anterior
          </BaseButton>
          <BaseButton
            variant="primary"
            size="sm"
            :disabled="currentPage >= pagination.totalPages || isLoading"
            @click="nextPage"
          >
            Próxima
          </BaseButton>
        </div>
      </footer>
    </section>
  </AdminLayout>
</template>
