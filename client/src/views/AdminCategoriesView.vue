<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, RefreshCw, FolderTree, Tag, CornerDownRight, Folder, Pencil, Trash2, ChevronDown } from 'lucide-vue-next'

import http from '@/services/http'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const isMobileMenuOpen = ref(false)
const activeItem = ref('categories')

const isLoading = ref(false)
const errorMessage = ref('')
const categories = ref([])
const openGroups = ref({})

const categoryGroups = computed(() => {
  const cats = categories.value || []

  const map = {}
  cats.forEach((c) => {
    map[c.id] = { ...c, children: [] }
  })

  const roots = []

  cats.forEach((c) => {
    if (c.parent_category_id && map[c.parent_category_id]) {
      map[c.parent_category_id].children.push(map[c.id])
    } else {
      roots.push(map[c.id])
    }
  })

  const sortNodes = (nodes) => {
    nodes.sort((a, b) => a.name.localeCompare(b.name))
    nodes.forEach((node) => sortNodes(node.children))
  }

  sortNodes(roots)

  function flattenChildren(nodes, depth = 1) {
    const flat = []

    nodes.forEach((node) => {
      flat.push({ ...node, depth, hasChildren: node.children.length > 0 })
      flat.push(...flattenChildren(node.children, depth + 1))
    })

    return flat
  }

  return roots.map((root) => ({
    ...root,
    hasChildren: root.children.length > 0,
    descendants: flattenChildren(root.children),
  }))
})

function statusBadge(isActive) {
  if (isActive) {
    return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
  }
  return 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-700'
}

function statusLabel(isActive) {
  return isActive ? 'Ativo' : 'Inativo'
}

function editCategory(id) {
  router.push(`/admin/categorias/editar/${id}`)
}

function toggleGroup(groupId) {
  openGroups.value[groupId] = !openGroups.value[groupId]
}

async function deleteCategory(id) {
  if (!window.confirm('Tem certeza que deseja excluir esta categoria? Os produtos associados poderão perder o vínculo. Esta ação não pode ser desfeita.')) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  try {
    await http.delete(`/categorias/${id}`)
    await loadCategories()
  } catch (error) {
    errorMessage.value = error?.response?.data?.error || 'Erro ao excluir categoria.'
  } finally {
    isLoading.value = false
  }
}

async function loadCategories() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const { data } = await http.get('/categorias')
    categories.value = data?.data || []
  } catch (error) {
    errorMessage.value = error?.response?.data?.error || 'Não foi possível carregar as categorias.'
    categories.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(loadCategories)

watch(
  categoryGroups,
  (groups) => {
    const nextState = { ...openGroups.value }
    groups.forEach((group) => {
      if (nextState[group.id] === undefined) {
        nextState[group.id] = true
      }
    })
    openGroups.value = nextState
  },
  { immediate: true },
)
</script>

<template>
  <AdminLayout
    title="Visualizar Categorias"
    mobileTitle="Categorias"
    :isMobileMenuOpen="isMobileMenuOpen"
    :activeItem="activeItem"
    @update:isMobileMenuOpen="isMobileMenuOpen = $event"
    @select-item="(id) => (activeItem = id)"
  >
    <template #title-icon>
      <FolderTree class="w-7 h-7 text-gray-950 dark:text-neutral-100" :stroke-width="2.25" />
    </template>

    <template #header-actions>
      <div class="flex items-center gap-2">
        <BaseButton variant="primary" size="sm" class="gap-2" to="/admin/categorias/cadastrar">
          <Plus class="w-4 h-4" />
          Cadastrar Categoria
        </BaseButton>
        <BaseButton
          variant="outline"
          size="sm"
          class="gap-2"
          :disabled="isLoading"
          @click="loadCategories"
        >
          <RefreshCw class="w-4 h-4" />
          Atualizar
        </BaseButton>
      </div>
    </template>

    <section class="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 md:p-6 mb-5">
      <div v-if="errorMessage" class="mb-4 p-4 border border-red-100 rounded-xl bg-red-50 text-sm text-red-700">
        {{ errorMessage }}
      </div>

      <div v-if="isLoading" class="py-12 flex flex-col items-center justify-center gap-3">
        <RefreshCw class="w-6 h-6 text-primary animate-spin" />
        <p class="text-sm text-gray-500 dark:text-neutral-400">Carregando categorias...</p>
      </div>

      <div v-else-if="!categories.length" class="py-12 flex flex-col items-center justify-center gap-3">
        <FolderTree class="w-12 h-12 text-gray-300 dark:text-neutral-600" />
        <p class="text-sm text-gray-500 dark:text-neutral-400">Nenhuma categoria encontrada.</p>
        <BaseButton variant="primary" size="sm" to="/admin/categorias/cadastrar" class="mt-2">
          Cadastrar a primeira
        </BaseButton>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="group in categoryGroups"
          :key="group.id"
          class="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-gray-50/40 dark:bg-neutral-800/20 overflow-hidden"
        >
          <div class="p-4 border-b border-gray-100 dark:border-neutral-800">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div
                  class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 border border-gray-200 dark:border-neutral-700"
                >
                  <FolderTree class="w-5 h-5 text-gray-500 dark:text-neutral-400" />
                </div>

                <div class="min-w-0">
                  <p class="text-sm font-semibold text-gray-950 dark:text-neutral-100 truncate">
                    {{ group.name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-neutral-400 truncate mt-0.5">
                    {{ group.slug }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3 shrink-0 pl-2">
                <span
                  class="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold"
                  :class="statusBadge(group.is_active)"
                >
                  {{ statusLabel(group.is_active) }}
                </span>
                <button
                  class="p-1.5 text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                  :title="openGroups[group.id] ? 'Recolher card' : 'Expandir card'"
                  @click="toggleGroup(group.id)"
                >
                  <ChevronDown
                    class="w-4 h-4 transition-transform"
                    :class="openGroups[group.id] ? 'rotate-180' : ''"
                  />
                </button>
                <div class="flex items-center gap-1">
                  <button
                    class="p-1.5 text-gray-400 hover:text-[#3483fa] dark:text-neutral-500 dark:hover:text-[#3483fa] hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                    title="Editar categoria"
                    @click="editCategory(group.id)"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button
                    class="p-1.5 text-gray-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
                    title="Excluir categoria"
                    @click="deleteCategory(group.id)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="openGroups[group.id] && group.descendants.length" class="p-2 space-y-1">
            <div
              v-for="category in group.descendants"
              :key="category.id"
              class="flex items-center justify-between p-2.5 rounded-xl hover:bg-white dark:hover:bg-neutral-800/70 transition-colors group border border-transparent hover:border-gray-100 dark:hover:border-neutral-700"
              :style="{ marginLeft: `${category.depth * 1}rem` }"
            >
              <div class="flex items-center gap-3 min-w-0">
                <CornerDownRight class="w-4 h-4 text-gray-300 dark:text-neutral-600 shrink-0" />

                <div
                  class="w-8 h-8 rounded-lg bg-white dark:bg-neutral-900 flex items-center justify-center shrink-0 border border-gray-200 dark:border-neutral-700"
                >
                  <Folder v-if="category.hasChildren" class="w-4 h-4 text-gray-500 dark:text-neutral-400" />
                  <Tag v-else class="w-4 h-4 text-gray-400 dark:text-neutral-500" />
                </div>

                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-neutral-100 truncate">
                    {{ category.name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-neutral-400 truncate mt-0.5">
                    {{ category.slug }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-4 shrink-0 pl-4">
                <span
                  class="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold"
                  :class="statusBadge(category.is_active)"
                >
                  {{ statusLabel(category.is_active) }}
                </span>
                <div class="flex items-center gap-1">
                  <button
                    class="p-1.5 text-gray-400 hover:text-[#3483fa] dark:text-neutral-500 dark:hover:text-[#3483fa] hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                    title="Editar categoria"
                    @click="editCategory(category.id)"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button
                    class="p-1.5 text-gray-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
                    title="Excluir categoria"
                    @click="deleteCategory(category.id)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="openGroups[group.id]" class="px-4 py-10">
            <div class="flex flex-col items-center justify-center gap-3 text-center">
              <Tag class="w-10 h-10 text-gray-300 dark:text-neutral-600" />
              <p class="text-sm text-gray-500 dark:text-neutral-400">
                Nenhuma subcategoria encontrada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </AdminLayout>
</template>
