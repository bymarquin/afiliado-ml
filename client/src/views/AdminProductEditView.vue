<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ArrowLeft, CheckCircle2, Save, FolderTree, ChevronDown, Search, CornerDownRight, Edit3 } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'

import http from '@/services/http'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const productId = route.params.id

const isMobileMenuOpen = ref(false)
const activeItem = ref('products')
const isSaving = ref(false)
const isLoadingProduct = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const categories = ref([])
const isSelectOpen = ref(false)
const selectSearch = ref('')
const selectContainerRef = ref(null)
const isLoadingParents = ref(false)

const form = ref({
  title: '',
  price: '',
  original_price: '',
  image_url: '',
  affiliate_url: '',
  status: 'active',
  featured: false,
  category_id: '',
})

// Build hierarchy tree
const categoriesTree = computed(() => {
  const cats = categories.value || []
  
  const map = {}
  cats.forEach(c => {
    map[c.id] = { ...c, children: [] }
  })
  
  const roots = []
  cats.forEach(c => {
    if (c.parent_category_id && map[c.parent_category_id]) {
      map[c.parent_category_id].children.push(map[c.id])
    } else {
      roots.push(map[c.id])
    }
  })
  
  const flat = []
  function flatten(nodes, depth) {
    nodes.sort((a, b) => a.name.localeCompare(b.name))
    nodes.forEach(node => {
      flat.push({ ...node, depth })
      flatten(node.children, depth + 1)
    })
  }
  
  flatten(roots, 0)
  return flat
})

// Filter tree based on search
const filteredCategoriesTree = computed(() => {
  if (!selectSearch.value.trim()) return categoriesTree.value
  
  const term = selectSearch.value.toLowerCase()
  return categoriesTree.value.filter(cat => cat.name.toLowerCase().includes(term))
})

const selectedCategoryName = computed(() => {
  if (!form.value.category_id) return 'Selecionar categoria...'
  
  let current = categories.value.find(c => c.id === form.value.category_id)
  if (!current) return 'Selecionar categoria...'

  const path = []
  while (current) {
    path.unshift(current.name)
    current = current.parent_category_id 
      ? categories.value.find(c => c.id === current.parent_category_id) 
      : null
  }

  if (path.length <= 3) {
    return path.join(' / ')
  }
  return `${path[0]} / ... / ${path[path.length - 2]} / ${path[path.length - 1]}`
})

// Close custom select on click outside
function handleClickOutside(event) {
  if (selectContainerRef.value && !selectContainerRef.value.contains(event.target)) {
    isSelectOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  loadCategories()
  loadProduct()
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

function toggleSelect() {
  isSelectOpen.value = !isSelectOpen.value
  if (isSelectOpen.value) {
    selectSearch.value = ''
  }
}

function selectCategory(id) {
  form.value.category_id = id
  isSelectOpen.value = false
}

async function loadCategories() {
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

async function loadProduct() {
  isLoadingProduct.value = true
  errorMessage.value = ''
  try {
    const { data } = await http.get(`/produtos/${productId}`)
    if (data && data.data) {
      const p = data.data
      form.value = {
        title: p.title || '',
        price: p.price || '',
        original_price: p.original_price || '',
        image_url: p.image_url || '',
        affiliate_url: p.affiliate_url || '',
        status: p.status || 'active',
        featured: p.featured || false,
        category_id: p.categories?.[0]?.id || '',
      }
    }
  } catch {
    errorMessage.value = 'Erro ao carregar os dados do produto.'
  } finally {
    isLoadingProduct.value = false
  }
}

function normalizeNumber(value) {
  if (value === '' || value === null || value === undefined) return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

const canSave = computed(() => {
  return Boolean(form.value.title.trim() && form.value.price !== '')
})

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
      title: form.value.title.trim(),
      price: normalizeNumber(form.value.price),
      original_price: normalizeNumber(form.value.original_price),
      image_url: form.value.image_url.trim() || null,
      affiliate_url: form.value.affiliate_url.trim(),
      status: form.value.status,
      featured: form.value.featured,
      category_ids: form.value.category_id ? [form.value.category_id] : [],
    }

    const { data } = await http.put(`/produtos/${productId}`, payload)
    successMessage.value = data?.message || 'Produto atualizado com sucesso.'
    
    setTimeout(() => {
      router.push('/admin/produtos')
    }, 1500)
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message || error?.response?.data?.error || 'Erro ao atualizar produto.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <AdminLayout
    title="Editar Produto"
    mobileTitle="Editar Produto"
    :isMobileMenuOpen="isMobileMenuOpen"
    :activeItem="activeItem"
    @update:isMobileMenuOpen="isMobileMenuOpen = $event"
    @select-item="(id) => (activeItem = id)"
  >
    <template #title-icon>
      <Edit3 class="w-7 h-7 text-gray-950 dark:text-neutral-100" :stroke-width="2.25" />
    </template>

    <template #header-actions>
      <BaseButton variant="outline" size="sm" class="gap-2" to="/admin/produtos">
        <ArrowLeft class="w-4 h-4" />
        Voltar para lista
      </BaseButton>
    </template>

    <section class="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 md:p-5">
      <div class="mb-5">
        <h2 class="text-base md:text-lg font-semibold text-gray-950 dark:text-neutral-100">Editar Produto</h2>
        <p class="text-sm text-gray-500 dark:text-neutral-400 mt-1">
          Modifique as informações do produto, preços, links e categoria.
        </p>
      </div>

      <div v-if="isLoadingProduct" class="flex justify-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 lg:grid-cols-[88px_1fr] gap-4 rounded-2xl border border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800 p-4 mb-5 items-center">
          <div
            class="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex-shrink-0"
          >
            <img
              v-if="form.image_url"
              :src="form.image_url"
              :alt="form.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-[10px] text-gray-400 text-center">
              Sem imagem
            </div>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-400 font-semibold">
              Prévia do Produto
            </p>
            <p class="text-sm font-semibold text-gray-900 dark:text-neutral-100 mt-1 truncate">{{ form.title || 'Sem título' }}</p>
            <div class="text-xs text-gray-600 dark:text-neutral-300 mt-2">
              {{ form.price ? `R$ ${form.price}` : 'Preço não definido' }}
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 md:p-5 mb-5 shadow-sm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <label class="flex flex-col gap-1.5 md:col-span-2 min-w-0">
            <span class="text-sm font-medium text-gray-700 dark:text-neutral-300">Título *</span>
            <input
              v-model="form.title"
              type="text"
              placeholder="Nome do produto"
              class="w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2.5 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors hover:border-gray-300 dark:hover:border-neutral-600"
            />
          </label>

          <label class="flex flex-col gap-1.5 min-w-0">
            <span class="text-sm font-medium text-gray-700 dark:text-neutral-300">Preço *</span>
            <input
              v-model="form.price"
              type="number"
              step="0.01"
              min="0"
              placeholder="199.90"
              class="w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2.5 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors hover:border-gray-300 dark:hover:border-neutral-600"
            />
          </label>

          <label class="flex flex-col gap-1.5 min-w-0">
            <span class="text-sm font-medium text-gray-700 dark:text-neutral-300">Preço original</span>
            <input
              v-model="form.original_price"
              type="number"
              step="0.01"
              min="0"
              placeholder="249.90"
              class="w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2.5 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors hover:border-gray-300 dark:hover:border-neutral-600"
            />
          </label>

          <label class="flex flex-col gap-1.5 md:col-span-2 min-w-0">
            <span class="text-sm font-medium text-gray-700 dark:text-neutral-300">URL da Imagem</span>
            <input
              v-model="form.image_url"
              type="url"
              placeholder="https://http2.mlstatic.com/D_NQ_NP_..."
              class="w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2.5 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors hover:border-gray-300 dark:hover:border-neutral-600"
            />
          </label>

          <label class="flex flex-col gap-1.5 md:col-span-2 min-w-0">
            <span class="text-sm font-medium text-gray-700 dark:text-neutral-300">URL afiliada</span>
            <input
              v-model="form.affiliate_url"
              type="url"
              placeholder="https://seu-link-afiliado..."
              class="w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2.5 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors hover:border-gray-300 dark:hover:border-neutral-600"
            />
          </label>

          <label class="flex flex-col gap-1.5 md:col-span-2 min-w-0" ref="selectContainerRef">
            <span class="text-sm font-medium text-gray-700 dark:text-neutral-300">Categoria</span>
            <div class="relative">
              <FolderTree class="w-4 h-4 text-gray-400 dark:text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              
              <!-- Custom Select Trigger -->
              <div 
                class="w-full flex items-center justify-between rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 pl-10 pr-3 py-2.5 text-sm cursor-pointer transition-colors"
                :class="[
                  isSelectOpen ? 'ring-2 ring-primary/20 border-primary' : 'hover:border-gray-300 dark:hover:border-neutral-600',
                  isLoadingParents ? 'bg-gray-50 dark:bg-neutral-900 cursor-not-allowed' : ''
                ]"
                @click="!isLoadingParents && toggleSelect()"
              >
                <span :class="form.category_id ? 'text-gray-900 dark:text-neutral-100' : 'text-gray-400'">
                  {{ selectedCategoryName }}
                </span>
                <ChevronDown class="w-4 h-4 text-gray-400 transition-transform" :class="{ 'rotate-180': isSelectOpen }" />
              </div>

              <!-- Custom Select Dropdown -->
              <div 
                v-if="isSelectOpen"
                class="absolute z-20 w-full mt-1 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-lg overflow-hidden flex flex-col max-h-64"
              >
                <!-- Search Input -->
                <div class="p-2 border-b border-gray-100 dark:border-neutral-700 shrink-0 sticky top-0 bg-white dark:bg-neutral-800 z-10">
                  <div class="relative">
                    <Search class="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input 
                      v-model="selectSearch"
                      type="text" 
                      placeholder="Buscar categoria..."
                      class="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      @click.stop
                    />
                  </div>
                </div>

                <!-- Options List -->
                <div class="overflow-y-auto p-1 flex-1">
                  <div 
                    class="px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                    :class="{ 'bg-primary/10 text-primary font-medium': form.category_id === '' }"
                    @click="selectCategory('')"
                  >
                    Nenhuma (sem categoria)
                  </div>
                  
                  <div v-if="filteredCategoriesTree.length === 0" class="px-3 py-4 text-center text-sm text-gray-500">
                    Nenhuma categoria encontrada
                  </div>
                  
                  <div 
                    v-for="category in filteredCategoriesTree" 
                    :key="category.id"
                    class="flex items-center px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                    :class="{ 'bg-primary/10 text-primary font-medium': form.category_id === category.id }"
                    @click="selectCategory(category.id)"
                  >
                    <div class="flex items-center gap-2" :style="{ paddingLeft: selectSearch ? '0' : `${category.depth * 1.25}rem` }">
                      <CornerDownRight
                        v-if="category.depth > 0 && !selectSearch"
                        class="w-3 h-3 text-gray-400 shrink-0"
                      />
                      <span>{{ category.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </label>

          <label class="flex flex-col gap-1.5 min-w-0">
            <span class="text-sm font-medium text-gray-700 dark:text-neutral-300">Status</span>
            <select v-model="form.status" class="w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2.5 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors hover:border-gray-300 dark:hover:border-neutral-600">
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="out_of_stock">Sem estoque</option>
            </select>
          </label>

          <label class="flex items-center gap-2 mt-6">
            <input v-model="form.featured" type="checkbox" class="accent-primary w-4 h-4 cursor-pointer" />
            <span class="text-sm text-gray-700 dark:text-neutral-300 select-none cursor-pointer">Produto em destaque</span>
          </label>
        </div>
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
        <BaseButton
          variant="primary"
          size="sm"
          class="gap-2"
          :disabled="!canSave || isSaving"
          @click="submitForm"
        >
          <Save class="w-4 h-4" />
          {{ isSaving ? 'Salvando...' : 'Salvar Produto' }}
        </BaseButton>
      </div>
    </section>
  </AdminLayout>
</template>

