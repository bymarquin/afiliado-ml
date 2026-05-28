<script setup>
import { useRoute, useRouter } from 'vue-router'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import { useNavigation, SECTION_IDS } from '@/composables/useNavigation'
import { useMobileMenu } from '@/composables/useMobileMenu'
import { useActiveSection } from '@/composables/useActiveSection'
import { useDark, useToggle } from '@vueuse/core'
import { Moon, Sun } from 'lucide-vue-next'
import { useScrollStore } from '@/stores/scroll'
import { useAuthStore } from '@/stores/auth'
import logoLinearBlack from '@/assets/linear-black.svg'
import logoLinearWhite from '@/assets/linear-white.svg'

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
                <a href="/" @click="handleLogoClick" class="inline-flex items-center">
                    <img
                        :src="isDark ? logoLinearWhite : logoLinearBlack"
                        alt="Afiliado ML"
                        class="h-[3.25rem] sm:h-[3.5rem] md:h-16 w-auto max-w-[350px] sm:max-w-[410px]"
                    />
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
