<script setup>
import { ref } from 'vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'

const isMobileMenuOpen = ref(false)

const navLinks = [
    { label: 'Shop', href: '#' },
    { label: 'Categories', href: '#' },
    { label: 'Sell', href: '#' },
    { label: 'Contact us', href: '#' }
]

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
    <header class="sticky top-0 z-50 bg-white border-b border-gray-100">
        <BaseContainer>
            <nav class="flex items-center justify-between h-16">
                <!-- Logo -->
                <a href="/" class="flex items-center gap-2 text-xl font-bold text-gray-950">
                    <svg class="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="32" height="32" rx="8" fill="#0F1113" />
                        <path d="M8 16L16 8L24 16L16 24L8 16Z" fill="#F9D52C" />
                    </svg>
                    <span class="hidden sm:inline">Afiliado</span>
                </a>

                <!-- Desktop Navigation -->
                <ul class="hidden md:flex items-center gap-8">
                    <li v-for="link in navLinks" :key="link.label">
                        <a :href="link.href"
                            class="text-sm font-medium text-gray-800 hover:text-gray-950 transition-colors">
                            {{ link.label }}
                        </a>
                    </li>
                </ul>

                <!-- Actions -->
                <div class="flex items-center gap-4">
                    <!-- Search -->
                    <button class="p-2 text-gray-800 hover:text-gray-950 hover:bg-gray-50 rounded-lg transition-colors"
                        aria-label="Buscar produtos">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>

                    <!-- User -->
                    <button
                        class="hidden sm:flex p-2 text-gray-800 hover:text-gray-950 hover:bg-gray-50 rounded-lg transition-colors"
                        aria-label="Minha conta">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </button>


                    <!-- Mobile Menu Toggle -->
                    <button
                        class="md:hidden p-2 text-gray-800 hover:text-gray-950 hover:bg-gray-50 rounded-lg transition-colors"
                        aria-label="Abrir menu" @click="toggleMobileMenu">
                        <svg v-if="!isMobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </nav>

            <!-- Mobile Menu -->
            <Transition enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2">
                <div v-if="isMobileMenuOpen" class="md:hidden pb-4">
                    <ul class="flex flex-col gap-2">
                        <li v-for="link in navLinks" :key="link.label">
                            <a :href="link.href"
                                class="block py-2 px-3 text-sm font-medium text-gray-800 hover:text-gray-950 hover:bg-gray-50 rounded-lg transition-colors">
                                {{ link.label }}
                            </a>
                        </li>
                    </ul>
                </div>
            </Transition>
        </BaseContainer>
    </header>
</template>
