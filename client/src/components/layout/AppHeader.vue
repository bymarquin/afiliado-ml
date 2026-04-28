<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import { useNavigation, SECTION_IDS } from '@/composables/useNavigation'
import { useMobileMenu } from '@/composables/useMobileMenu'
import { useActiveSection } from '@/composables/useActiveSection'
import { useDark, useToggle } from '@vueuse/core'
import { Moon, Sun, User, ShieldCheck, LogOut, LayoutDashboard } from 'lucide-vue-next'
import { useScrollStore } from '@/stores/scroll'
import { useAuthStore } from '@/stores/auth'

const { navLinks } = useNavigation()
const { isOpen: isMobileMenuOpen, toggle: toggleMobileMenu, close: closeMobileMenu } = useMobileMenu()
const { activeSection } = useActiveSection(SECTION_IDS)
const route = useRoute()
const router = useRouter()
const isDark = useDark()
const toggleDark = useToggle(isDark)
const scrollStore = useScrollStore()
const authStore = useAuthStore()

// Hidrata estado de auth a partir do localStorage (idempotente)
authStore.init()

const isUserMenuOpen = ref(false)
const userMenuRef = ref(null)

const userInitials = computed(() => {
    const name = authStore.user?.name?.trim() || ''
    if (!name) return '?'
    const parts = name.split(/\s+/).filter(Boolean)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
})

const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value
}

const handleClickOutside = (event) => {
    if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
        isUserMenuOpen.value = false
    }
}

const handleLogout = () => {
    authStore.logout()
    isUserMenuOpen.value = false
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

/**
 * Scroll suave até a seção usando Lenis (se disponível) ou fallback nativo.
 * Fecha o menu mobile automaticamente após o clique.
 */
const isProductsLink = (sectionId) => sectionId === 'products'

const isLinkActive = (sectionId) => {
    if (isProductsLink(sectionId)) {
        return route.path === '/produtos' || (route.path === '/' && activeSection.value === sectionId)
    }

    return route.path === '/' && activeSection.value === sectionId
}

const handleNavClick = async (event, sectionId) => {
    event.preventDefault()

    if (isProductsLink(sectionId)) {
        closeMobileMenu()
        if (route.path !== '/produtos') {
            await router.push('/produtos')
        }
        return
    }

    if (route.path !== '/') {
        closeMobileMenu()
        await router.push({ path: '/', hash: `#${sectionId}` })
        return
    }

    const el = document.getElementById(sectionId)
    if (!el) return

    if (scrollStore.lenis) {
        scrollStore.lenis.scrollTo(el, { offset: -64, duration: 1.2 })
    } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    closeMobileMenu()
}

const handleLogoClick = async (event) => {
    event.preventDefault()

    closeMobileMenu()

    if (route.path === '/produtos') {
        await router.push({ path: '/', hash: '#products' })
        return
    }

    if (route.path === '/categorias') {
        await router.push({ path: '/', hash: '#categories' })
        return
    }

    await router.push('/')
}
</script>

<template>
    <header class="sticky top-0 z-50 bg-surface border-b border-border-sutil transition-colors duration-300">
        <BaseContainer>
            <nav class="flex items-center justify-between h-16">
                <!-- Logo -->
                <a href="/" @click="handleLogoClick" class="flex items-center gap-2 text-xl font-bold text-text-main">
                    <svg class="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="32" height="32" rx="8" class="fill-neutral-950 dark:fill-primary" />
                        <path d="M8 16L16 8L24 16L16 24L8 16Z" fill="#F9D52C" />
                    </svg>
                    <span class="hidden sm:inline">Afiliado</span>
                </a>

                <!-- Desktop Navigation -->
                <ul class="hidden md:flex items-center gap-8">
                    <li v-for="link in navLinks" :key="link.sectionId">
                            <a :href="link.href" @click="handleNavClick($event, link.sectionId)" class="nav-link text-sm font-medium transition-colors relative" :class="isLinkActive(link.sectionId)
                            ? 'text-primary-text'
                            : 'text-text-muted hover:text-text-main'
                            ">
                            {{ link.label }}
                            <!-- Underline animado -->
                            <span class="absolute -bottom-1 left-0 h-0.5 bg-primary rounded-full transition-all duration-300" :class="isLinkActive(link.sectionId) ? 'w-full' : 'w-0'"></span>
                        </a>
                    </li>
                </ul>

                <!-- Actions -->
                <div class="flex items-center gap-2 sm:gap-4">
                    <button
                        class="p-2 text-text-muted hover:text-text-main hover:bg-surface-hover rounded-lg transition-colors"
                        aria-label="Alternar tema"
                        @click="toggleDark()"
                    >
                        <Sun v-if="isDark" class="w-5 h-5" />
                        <Moon v-else class="w-5 h-5" />
                    </button>

                    <!-- User Dropdown -->
                    <div class="relative" ref="userMenuRef">
                        <!-- Trigger: avatar quando autenticado, ícone quando guest -->
                        <button
                            class="flex items-center p-1.5 rounded-lg transition-colors hover:bg-surface-hover"
                            :class="authStore.isAuthenticated ? 'text-primary-text' : 'text-text-muted hover:text-text-main'"
                            aria-label="Minha conta"
                            @click="toggleUserMenu"
                        >
                            <div v-if="authStore.isAuthenticated"
                                class="w-7 h-7 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center transition-all duration-200"
                                :class="isUserMenuOpen ? 'ring-2 ring-primary/30 ring-offset-1 ring-offset-surface' : ''"
                            >
                                <span class="text-[10px] font-bold text-primary-text leading-none">{{ userInitials }}</span>
                            </div>
                            <User v-else class="w-5 h-5" />
                        </button>

                        <Transition
                            enter-active-class="transition duration-200 ease-out origin-top-right"
                            enter-from-class="opacity-0 scale-95 -translate-y-1"
                            enter-to-class="opacity-100 scale-100 translate-y-0"
                            leave-active-class="transition duration-150 ease-in origin-top-right"
                            leave-from-class="opacity-100 scale-100 translate-y-0"
                            leave-to-class="opacity-0 scale-95 -translate-y-1"
                        >
                            <div
                                v-if="isUserMenuOpen"
                                class="absolute right-0 mt-2 w-64 bg-surface border border-border-sutil rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden z-50"
                            >
                                <!-- Cabeçalho: autenticado -->
                                <div v-if="authStore.isAuthenticated" class="px-4 py-3.5 bg-surface-hover border-b border-border-sutil">
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                            <span class="text-xs font-bold text-primary-text">{{ userInitials }}</span>
                                        </div>
                                        <div class="min-w-0">
                                            <p class="text-sm font-semibold text-text-main truncate">{{ authStore.user?.name }}</p>
                                            <p class="text-[11px] text-text-muted truncate">{{ authStore.user?.email }}</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Cabeçalho: guest -->
                                <div v-else class="px-4 py-3 border-b border-border-sutil">
                                    <p class="text-[11px] font-semibold text-text-muted uppercase tracking-widest">Minha Conta</p>
                                </div>

                                <!-- Itens de menu -->
                                <div class="p-1.5">
                                    <RouterLink
                                        v-if="authStore.isAuthenticated"
                                        to="/app"
                                        class="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:text-text-main hover:bg-surface-hover transition-all duration-200"
                                        @click="isUserMenuOpen = false"
                                    >
                                        <div class="w-8 h-8 rounded-lg bg-surface border border-border-sutil group-hover:bg-primary/10 group-hover:border-primary/20 flex items-center justify-center transition-all duration-200 shrink-0">
                                            <LayoutDashboard class="w-4 h-4 group-hover:text-primary-text transition-colors duration-200" />
                                        </div>
                                        <div class="min-w-0">
                                            <span class="block leading-tight">Dashboard</span>
                                            <span class="block text-[11px] text-text-muted/70 leading-tight">Painel administrativo</span>
                                        </div>
                                    </RouterLink>

                                    <RouterLink
                                        v-else
                                        to="/app"
                                        class="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:text-text-main hover:bg-surface-hover transition-all duration-200"
                                        @click="isUserMenuOpen = false"
                                    >
                                        <div class="w-8 h-8 rounded-lg bg-surface border border-border-sutil group-hover:bg-primary/10 group-hover:border-primary/20 flex items-center justify-center transition-all duration-200 shrink-0">
                                            <ShieldCheck class="w-4 h-4 group-hover:text-primary-text transition-colors duration-200" />
                                        </div>
                                        <div class="min-w-0">
                                            <span class="block leading-tight">Acesso Admin</span>
                                            <span class="block text-[11px] text-text-muted/70 leading-tight">Área restrita</span>
                                        </div>
                                    </RouterLink>
                                </div>

                                <!-- Logout — apenas quando autenticado -->
                                <div v-if="authStore.isAuthenticated" class="p-1.5 border-t border-border-sutil">
                                    <button
                                        class="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-500/8 transition-all duration-200"
                                        @click="handleLogout"
                                    >
                                        <div class="w-8 h-8 rounded-lg bg-red-500/8 group-hover:bg-red-500/15 flex items-center justify-center transition-all duration-200 shrink-0">
                                            <LogOut class="w-4 h-4" />
                                        </div>
                                        Sair da conta
                                    </button>
                                </div>
                            </div>
                        </Transition>
                    </div>


                    <!-- Mobile Menu Toggle -->
                    <button
                        class="md:hidden p-2 text-text-muted hover:text-text-main hover:bg-surface-hover rounded-lg transition-colors"
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
                        <li v-for="link in navLinks" :key="link.sectionId">
                            <a :href="link.href" @click="handleNavClick($event, link.sectionId)"
                                class="block py-2 px-3 text-sm font-medium rounded-lg transition-colors"
                                :class="isLinkActive(link.sectionId)
                                    ? 'text-primary-text bg-primary/10'
                                    : 'text-text-muted hover:text-text-main hover:bg-surface-hover'
                                ">
                                {{ link.label }}
                            </a>
                        </li>
                    </ul>
                </div>
            </Transition>
        </BaseContainer>
    </header>
</template>

