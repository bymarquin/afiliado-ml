<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Home,
  LogOut,
  Moon,
  MoreVertical,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Tag,
  User,
  X,
} from 'lucide-vue-next'
import { useDark, useToggle } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  isMobileMenuOpen: {
    type: Boolean,
    required: true,
  },
  activeItem: {
    type: String,
    required: true,
  },
  isCollapsed: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:isMobileMenuOpen', 'update:isCollapsed', 'select-item'])
const router = useRouter()
const authStore = useAuthStore()

const profileName = computed(() => authStore.user?.name || 'Usuário')
const profileEmail = computed(() => authStore.user?.email || 'Sem email')
const profileInitials = computed(() => {
  const name = String(profileName.value || '').trim()
  if (!name) return 'U'
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase()
})

const menuItems = [
  { id: 'home', label: 'Dashboard', icon: Home, to: '/admin' },
  { id: 'products', label: 'Visualizar Produtos', icon: Package, to: '/admin/produtos' },
  {
    id: 'categories',
    label: 'Cadastro de Categorias',
    icon: Tag,
    to: '/admin/categorias/cadastrar',
  },
]

const isProfileMenuOpen = ref(false)
const isDarkMode = useDark()
const toggleDark = useToggle(isDarkMode)

function selectItem(id) {
  const selectedItem = menuItems.find((item) => item.id === id)
  emit('select-item', id)
  if (selectedItem?.to) {
    router.push(selectedItem.to)
  }
  emit('update:isMobileMenuOpen', false)
}

function toggleCollapsed() {
  emit('update:isCollapsed', !props.isCollapsed)
  isProfileMenuOpen.value = false
}

function toggleProfileMenu() {
  isProfileMenuOpen.value = !isProfileMenuOpen.value
}

function handleLogout() {
  authStore.logout()
  isProfileMenuOpen.value = false
  emit('update:isMobileMenuOpen', false)
  router.push('/admin/login')
}

function goToProfile() {
  isProfileMenuOpen.value = false
  emit('update:isMobileMenuOpen', false)
  router.push('/admin/perfil')
}

function toggleDarkMode() {
  toggleDark()
}
</script>

<template>
  <aside
    :class="[
      'fixed top-0 left-0 z-50 h-screen w-64 bg-gray-50 dark:bg-neutral-950 flex flex-col transition-all duration-300 ease-in-out',
      props.isCollapsed ? 'lg:w-20' : 'lg:w-64',
      'lg:translate-x-0',
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <div
      :class="[
        'flex px-4 py-6 mb-2',
        props.isCollapsed
          ? 'lg:flex-col lg:items-center lg:justify-start lg:gap-3'
          : 'items-center justify-between',
      ]"
    >
      <div
        class="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/25"
      >
        <span class="text-white font-bold text-sm">AF</span>
      </div>

      <button
        class="hidden lg:inline-flex items-center justify-center w-9 h-9 rounded-xl text-gray-500 dark:text-neutral-400 hover:text-gray-950 dark:hover:text-neutral-100 hover:bg-gray-200/60 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        :aria-label="props.isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'"
        @click="toggleCollapsed"
      >
        <PanelLeftOpen v-if="props.isCollapsed" class="w-5 h-5" />
        <PanelLeftClose v-else class="w-5 h-5" />
      </button>

      <button
        class="ml-auto lg:hidden text-gray-500 dark:text-neutral-400 hover:text-gray-950 dark:hover:text-neutral-100 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-xl"
        aria-label="Fechar menu"
        @click="emit('update:isMobileMenuOpen', false)"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <nav class="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
      <button
        v-for="item in menuItems"
        :key="item.id"
        :class="[
          'group w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          props.isCollapsed ? 'lg:justify-center lg:px-0 lg:gap-0' : '',
          activeItem === item.id
            ? 'bg-primary text-white shadow-md shadow-primary/25'
            : 'text-gray-500 dark:text-neutral-300 hover:text-gray-950 dark:hover:text-neutral-100 hover:bg-gray-200/50 dark:hover:bg-neutral-800',
        ]"
        @click="selectItem(item.id)"
      >
        <component
          :is="item.icon"
          :class="[
            'w-5 h-5 shrink-0 transition-colors duration-300',
            activeItem === item.id
              ? 'text-white'
              : 'text-gray-400 dark:text-neutral-500 group-hover:text-gray-950 dark:group-hover:text-neutral-100',
          ]"
        />
        <span v-if="!props.isCollapsed">{{ item.label }}</span>
      </button>
    </nav>

    <div class="mt-auto px-4 py-4 border-t border-gray-200 dark:border-neutral-800 relative">
      <div v-if="props.isCollapsed" class="w-full flex items-center justify-center px-2 py-2">
        <button
          class="p-1.5 rounded-xl hover:bg-gray-200/60 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Opções do perfil"
          @click="toggleProfileMenu"
        >
          <div
            class="w-10 h-10 rounded-full shadow-sm bg-primary/10 border border-primary/20 shrink-0 flex items-center justify-center"
          >
            <span class="text-xs font-bold text-primary">{{ profileInitials }}</span>
          </div>
        </button>
      </div>

      <div v-else class="w-full flex items-center justify-between gap-3 px-2 py-2">
        <div class="flex items-center gap-3 min-w-0">
          <div
            class="w-10 h-10 rounded-full shadow-sm bg-primary/10 border border-primary/20 shrink-0 flex items-center justify-center"
          >
            <span class="text-xs font-bold text-primary">{{ profileInitials }}</span>
          </div>
          <div class="flex flex-col min-w-0">
            <span
              class="text-[14px] font-bold text-gray-950 dark:text-neutral-100 leading-tight truncate"
              >{{ profileName }}</span
            >
            <span class="text-xs text-gray-500 dark:text-neutral-400 font-medium truncate">{{
              profileEmail
            }}</span>
          </div>
        </div>
        <button
          class="p-1.5 rounded-xl text-gray-400 dark:text-neutral-500 hover:text-gray-950 dark:hover:text-neutral-100 hover:bg-gray-200/60 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Opções do perfil"
          @click="toggleProfileMenu"
        >
          <MoreVertical class="w-5 h-5 shrink-0" />
        </button>
      </div>

      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0 translate-y-2"
        enter-to-class="transform scale-100 opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100 translate-y-0"
        leave-to-class="transform scale-95 opacity-0 translate-y-2"
      >
        <div
          v-if="isProfileMenuOpen"
          :class="[
            'absolute bottom-[calc(100%-8px)] left-4 right-4 mb-2 rounded-2xl shadow-sm p-1.5 z-50 border',
            isDarkMode ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-gray-100',
          ]"
        >
          <button
            :class="[
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              isDarkMode
                ? 'text-neutral-200 hover:text-white hover:bg-neutral-800'
                : 'text-gray-700 hover:text-gray-950 hover:bg-gray-50',
            ]"
            @click="goToProfile"
          >
            <User :class="['w-4 h-4', isDarkMode ? 'text-neutral-400' : 'text-gray-400']" />
            Ver Perfil
          </button>
          <button
            :class="[
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              isDarkMode
                ? 'text-neutral-200 hover:text-white hover:bg-neutral-800'
                : 'text-gray-700 hover:text-gray-950 hover:bg-gray-50',
            ]"
            @click="toggleDarkMode"
          >
            <Moon v-if="!isDarkMode" class="w-4 h-4 text-neutral-400" />
            <Sun v-else class="w-4 h-4 text-amber-400" />
            {{ isDarkMode ? 'Modo claro' : 'Modo escuro' }}
          </button>
          <div :class="['h-px my-1 mx-2', isDarkMode ? 'bg-neutral-700' : 'bg-gray-100']"></div>
          <button
            class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
            @click="handleLogout"
          >
            <LogOut class="w-4 h-4 text-red-500" />
            Sair
          </button>
        </div>
      </Transition>
    </div>
  </aside>
</template>
