<script setup>
import { ref } from 'vue'
import { Home, Package, Tag, X, LogOut, MoreVertical, User } from 'lucide-vue-next'

 defineProps({
  isMobileMenuOpen: {
    type: Boolean,
    required: true
  },
  activeItem: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:isMobileMenuOpen', 'select-item'])

const menuItems = [
  { id: 'home', label: 'Área de Início', icon: Home },
  { id: 'products', label: 'Cadastro de Produtos', icon: Package },
  { id: 'categories', label: 'Cadastro de Categorias', icon: Tag },
]

const isProfileMenuOpen = ref(false)

function selectItem(id) {
  emit('select-item', id)
  emit('update:isMobileMenuOpen', false)
}
</script>

<template>
  <aside :class="[
    'fixed top-0 left-0 z-50 h-screen w-64 bg-[#F4F5F7] flex flex-col transition-transform duration-300 ease-in-out',
    'lg:translate-x-0',
    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
  ]">
    <!-- Logo / Branding -->
    <div class="flex items-center gap-3 px-6 py-6 mb-2">
      <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
        <span class="text-white font-bold text-sm">AF</span>
      </div>
      <div>
        <h2 class="text-gray-950 font-bold text-sm tracking-tight">Afiliado ML</h2>
        <span class="text-gray-500 text-xs font-medium">Painel Admin</span>
      </div>
      <button class="ml-auto lg:hidden text-gray-500 hover:text-gray-900 transition-colors" aria-label="Fechar menu"
        @click="emit('update:isMobileMenuOpen', false)">
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Navegação -->
    <nav class="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
      <button v-for="item in menuItems" :key="item.id" :class="[
        'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200',
        activeItem === item.id
          ? 'bg-primary text-white shadow-md shadow-primary/20'
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
      ]" @click="selectItem(item.id)">
        <component :is="item.icon" :class="[
          'w-5 h-5 shrink-0 transition-colors duration-200',
          activeItem === item.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'
        ]" />
        {{ item.label }}
      </button>
    </nav>

    <!-- User Profile & Footer (Dropdown Popover) -->
    <div class="mt-auto px-4 py-4 border-t border-gray-200 relative">
      <div class="w-full flex items-center justify-between gap-3 px-2 py-2">
        <div class="flex items-center gap-3 min-w-0">
           <div class="w-10 h-10 rounded-full shadow-sm overflow-hidden bg-gray-100 shrink-0">
              <img src="https://i.pravatar.cc/150?u=savio" alt="Sávio" class="w-full h-full object-cover" />
           </div>
           <div class="flex flex-col min-w-0">
              <span class="text-[14px] font-bold text-gray-950 leading-tight truncate">Sávio S.</span>
              <span class="text-xs text-gray-500 font-medium truncate">Administrador</span>
           </div>
        </div>
        <button 
          @click="isProfileMenuOpen = !isProfileMenuOpen"
          class="p-1.5 rounded-lg text-gray-400 hover:text-gray-950 hover:bg-gray-200/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Opções do perfil"
        >
          <MoreVertical class="w-5 h-5 shrink-0" />
        </button>
      </div>

      <!-- Dropdown Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0 translate-y-2"
        enter-to-class="transform scale-100 opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100 translate-y-0"
        leave-to-class="transform scale-95 opacity-0 translate-y-2"
      >
        <div v-if="isProfileMenuOpen" class="absolute bottom-[calc(100%-8px)] left-4 right-4 mb-2 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-1.5 z-50">
          <button class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-gray-700 hover:text-gray-950 hover:bg-gray-50 transition-colors">
             <User class="w-4 h-4 text-gray-400" />
             Ver Perfil
          </button>
          <div class="h-px bg-gray-100 my-1 mx-2"></div>
          <button class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
             <LogOut class="w-4 h-4 text-red-500" />
             Sair
          </button>
        </div>
      </Transition>
    </div>
  </aside>
</template>
