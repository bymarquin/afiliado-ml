<script setup>
import { ref } from 'vue'
import { Menu } from 'lucide-vue-next'
import AdminSidebar from '@/components/layout/AdminSidebar.vue'

const props = defineProps({
  isMobileMenuOpen: {
    type: Boolean,
    required: true
  },
  activeItem: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Dashboard'
  },
  mobileTitle: {
    type: String,
    default: 'Painel Admin'
  }
})

const emit = defineEmits(['update:isMobileMenuOpen', 'select-item'])
const isSidebarCollapsed = ref(false)

function openMobileMenu() {
  emit('update:isMobileMenuOpen', true)
}

function closeMobileMenu() {
  emit('update:isMobileMenuOpen', false)
}

function handleSidebarSelect(id) {
  emit('select-item', id)
}
</script>

<template>
  <div class="h-screen bg-gray-50 flex overflow-hidden">
    <Transition name="fade">
      <div
        v-if="props.isMobileMenuOpen"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden"
        @click="closeMobileMenu"
      />
    </Transition>

    <AdminSidebar
      :isMobileMenuOpen="props.isMobileMenuOpen"
      :activeItem="props.activeItem"
      :isCollapsed="isSidebarCollapsed"
      @update:isMobileMenuOpen="emit('update:isMobileMenuOpen', $event)"
      @update:isCollapsed="isSidebarCollapsed = $event"
      @select-item="handleSidebarSelect"
    />

    <div
      :class="[
        'flex-1 flex flex-col h-screen',
        isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64',
        'lg:py-6 lg:pr-6'
      ]"
    >
      <header class="lg:hidden sticky top-0 z-30 bg-gray-50 border-b border-gray-200">
        <div class="flex items-center justify-between px-4 py-3">
          <button
            class="p-2 -ml-2 rounded-xl text-gray-800 hover:bg-gray-200 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Abrir menu"
            @click="openMobileMenu"
          >
            <Menu class="w-5 h-5" />
          </button>
          <span class="text-sm font-semibold text-gray-950">{{ props.mobileTitle }}</span>
          <div class="w-9" />
        </div>
      </header>

      <section
        class="flex flex-col min-[601px]:flex-row min-[601px]:items-center min-[601px]:justify-between gap-4 px-5 md:px-8 lg:px-10 py-6 lg:pt-0 lg:pb-6 shrink-0"
      >
        <div>
          <h1 class="text-2xl md:text-3xl font-semibold text-gray-950 tracking-tight flex items-center gap-2">
            <slot name="title-icon" />
            {{ props.title }}
          </h1>
        </div>
        <div class="flex items-center gap-4 shrink-0">
          <slot name="header-actions" />
        </div>
      </section>

      <div class="flex-1 mx-4 mb-4 sm:mx-5 sm:mb-5 lg:mx-0 lg:mb-0 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        <main class="flex-1 p-5 md:p-8 lg:p-10 w-full overflow-y-auto">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
