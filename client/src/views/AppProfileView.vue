<script setup>
// 1. Vue core
import { computed, onMounted, ref } from 'vue'

// 2. Vue Router
import { useRouter } from 'vue-router'

// 3. Pinia stores
import { useAuthStore } from '@/stores/auth'

// 4. Icons
import { LogOut, RefreshCw, UserRound } from 'lucide-vue-next'

// 5. Components - UI/Layout
import AdminLayout from '@/components/layout/AdminLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

// 6. Refs & reactive
const authStore = useAuthStore()
const router = useRouter()

const isMobileMenuOpen = ref(false)
const activeItem = ref('profile')
const isRefreshing = ref(false)
const errorMessage = ref('')
const isReady = ref(false)

// 7. Computed
const profile = computed(() => authStore.user || null)
const profileStatusLabel = computed(() => (profile.value?.is_active ? 'Ativo' : 'Inativo'))
const initials = computed(() => {
  const name = String(profile.value?.name || '').trim()
  if (!name) return 'U'
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase()
})

function formatDate(value) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

async function refreshProfile() {
  isRefreshing.value = true
  errorMessage.value = ''
  try {
    const me = await authStore.fetchMe()
    if (!me) {
      errorMessage.value = 'Não foi possível carregar os dados do perfil.'
    }
  } catch {
    errorMessage.value = 'Erro ao atualizar perfil.'
  } finally {
    isRefreshing.value = false
    isReady.value = true
  }
}

function logout() {
  authStore.logout()
  router.push('/auth/login')
}

onMounted(refreshProfile)
</script>

<template>
  <AdminLayout
    title="Perfil"
    mobileTitle="Perfil"
    :isMobileMenuOpen="isMobileMenuOpen"
    :activeItem="activeItem"
    @update:isMobileMenuOpen="isMobileMenuOpen = $event"
    @select-item="(id) => (activeItem = id)"
  >
    <template #title-icon>
      <UserRound class="w-7 h-7 text-gray-950 dark:text-neutral-100" :stroke-width="2.25" />
    </template>

    <template #header-actions>
      <div class="flex items-center gap-2">
        <BaseButton
          variant="outline"
          size="sm"
          class="gap-2"
          :disabled="isRefreshing"
          @click="refreshProfile"
        >
          <RefreshCw class="w-4 h-4" />
          {{ isRefreshing ? 'Atualizando...' : 'Atualizar' }}
        </BaseButton>
        <BaseButton variant="secondary" size="sm" class="gap-2" @click="logout">
          <LogOut class="w-4 h-4" />
          Sair
        </BaseButton>
      </div>
    </template>

    <section class="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 md:p-5">
      <div class="flex flex-col md:flex-row md:items-center gap-4 mb-5">
        <div
          class="p-2 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center"
        >
          <span class="text-lg font-bold text-primary">{{ initials }}</span>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-950 dark:text-neutral-100">
            {{ isReady ? profile?.name || 'Usuário' : 'Carregando...' }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-neutral-400">{{ isReady ? profile?.email || '-' : 'Aguarde...' }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <article class="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800 p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400 mb-1">Nome</p>
          <p class="text-sm font-medium text-gray-900 dark:text-neutral-100">{{ profile?.name || '-' }}</p>
        </article>
        <article class="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800 p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400 mb-1">Email</p>
          <p class="text-sm font-medium text-gray-900 dark:text-neutral-100">{{ profile?.email || '-' }}</p>
        </article>
        <article class="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800 p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400 mb-1">Status</p>
          <p class="text-sm font-medium text-gray-900 dark:text-neutral-100">{{ profileStatusLabel }}</p>
        </article>
        <article class="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800 p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400 mb-1">
            Conta criada em
          </p>
          <p class="text-sm font-medium text-gray-900 dark:text-neutral-100">{{ formatDate(profile?.created_at) }}</p>
        </article>
      </div>

      <div
        v-if="errorMessage"
        class="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
      >
        {{ errorMessage }}
      </div>
    </section>
  </AdminLayout>
</template>



