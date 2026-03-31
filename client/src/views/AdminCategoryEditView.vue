<script setup>
import { computed, onMounted, ref, watch, onUnmounted } from 'vue'
import { ArrowLeft, CheckCircle2, Save, Tag, FolderTree, ChevronDown, Search, CornerDownRight, Edit3 } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'

import http from '@/services/http'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()
const router = useRouter()

const isMobileMenuOpen = ref(false)
const activeItem = ref('categories')
const isLoading = ref(false)
const isLoadingParents = ref(false)
const isLoadingCategory = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const categories = ref([])
const categoryId = route.params.id

// Custom Select State
const isSelectOpen = ref(false)
const selectSearch = ref('')
const selectContainerRef = ref(null)

const form = ref({
  name: '',
  slug: '',
  parent_category_id: '',
  is_active: true,
})

// Close custom select on click outside
function handleClickOutside(event) {
  if (selectContainerRef.value && !selectContainerRef.value.contains(event.target)) {
    isSelectOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  loadParentCategories()
  loadCategory()
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

function selectParentCategory(id) {
  form.value.parent_category_id = id
  isSelectOpen.value = false
}

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
  // We want to skip adding the current category and its children
  // to avoid cyclic parenting.
  function flatten(nodes, depth) {
    nodes.sort((a, b) => a.name.localeCompare(b.name))
    nodes.forEach(node => {
      // Do not include the category we are currently editing
      if (node.id === Number(categoryId)) return
      
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

const selectedParentName = computed(() => {
  if (!form.value.parent_category_id) return 'Nenhuma (categoria raiz)'
  
  let current = categories.value.find(c => c.id === form.value.parent_category_id)
  if (!current) return 'Nenhuma (categoria raiz)'

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

function toSlug(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

watch(
  () => form.value.name,
  () => {
    if (!form.value.slug.trim()) return
    form.value.slug = toSlug(form.value.slug)
  },
)

async function loadCategory() {
  isLoadingCategory.value = true
  errorMessage.value = ''
  try {
    const { data } = await http.get(`/categorias/${categoryId}`)
    if (data && data.data) {
      form.value = {
        name: data.data.name || '',
        slug: data.data.slug || '',
        parent_category_id: data.data.parent_category_id || '',
        is_active: data.data.is_active !== false,
      }
    }
  } catch {
    errorMessage.value = 'Erro ao carregar os dados da categoria.'
  } finally {
    isLoadingCategory.value = false
  }
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
    const { data } = await http.put(`/categorias/${categoryId}`, payload)

    successMessage.value = data?.message || 'Categoria atualizada com sucesso.'
    await loadParentCategories()
    
    // Redirect back to list after short delay
    setTimeout(() => {
      router.push('/admin/categorias')
    }, 1500)
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Erro ao atualizar categoria.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <AdminLayout
    title="Editar Categoria"
    mobileTitle="Editar Categoria"
    :isMobileMenuOpen="isMobileMenuOpen"
    :activeItem="activeItem"
    @update:isMobileMenuOpen="isMobileMenuOpen = $event"
    @select-item="(id) => (activeItem = id)"
  >
    <template #title-icon>
      <Edit3 class="w-7 h-7 text-gray-950 dark:text-neutral-100" :stroke-width="2.25" />
    </template>

    <template #header-actions>
      <BaseButton variant="outline" size="sm" class="gap-2" to="/admin/categorias">
        <ArrowLeft class="w-4 h-4" />
        Voltar para Categorias
      </BaseButton>
    </template>

    <section
      class="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 md:p-5"
    >
      <div class="mb-5">
        <h2 class="text-base md:text-lg font-semibold text-gray-950 dark:text-neutral-100">
          Editar categoria
        </h2>
        <p class="text-sm text-gray-500 dark:text-neutral-400 mt-1">
          Modifique as informações desta categoria.
        </p>
      </div>

      <div v-if="isLoadingCategory" class="flex justify-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>

      <div v-else>
        <div class="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 md:p-5 shadow-sm mb-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="flex flex-col gap-1.5 md:col-span-2">
              <span class="text-sm font-medium text-gray-700 dark:text-neutral-300">Nome da categoria *</span>
              <div class="relative">
                <Tag class="w-4 h-4 text-gray-400 dark:text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Ex.: Eletrônicos"
                  class="w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 pl-10 pr-3 py-2.5 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors hover:border-gray-300 dark:hover:border-neutral-600"
                />
              </div>
            </label>

            <label class="flex flex-col gap-1.5" ref="selectContainerRef">
              <span class="text-sm font-medium text-gray-700 dark:text-neutral-300">Categoria pai</span>
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
                  <span :class="form.value?.parent_category_id ? 'text-gray-900 dark:text-neutral-100' : 'text-gray-900 dark:text-neutral-100'">
                    {{ selectedParentName }}
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
                      :class="{ 'bg-primary/10 text-primary font-medium': form.parent_category_id === '' }"
                      @click="selectParentCategory('')"
                    >
                      Nenhuma (categoria raiz)
                    </div>
                    
                    <div v-if="filteredCategoriesTree.length === 0" class="px-3 py-4 text-center text-sm text-gray-500">
                      Nenhuma categoria encontrada
                    </div>
                    
                    <div 
                      v-for="category in filteredCategoriesTree" 
                      :key="category.id"
                      class="flex items-center px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                      :class="{ 'bg-primary/10 text-primary font-medium': form.parent_category_id === category.id }"
                      @click="selectParentCategory(category.id)"
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

            <div class="flex items-center md:col-span-2 mt-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="form.is_active" type="checkbox" class="accent-primary w-4 h-4 cursor-pointer" />
                <span class="text-sm text-gray-700 dark:text-neutral-300 select-none">Categoria ativa</span>
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

        <div
          class="pt-5 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-end gap-2"
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
      </div>
    </section>
  </AdminLayout>
</template>
