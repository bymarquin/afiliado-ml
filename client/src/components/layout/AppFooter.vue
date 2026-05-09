<script setup>
import BaseContainer from '@/components/ui/BaseContainer.vue'
import { Mail, MapPin } from 'lucide-vue-next'
import { useNavigation } from '@/composables/useNavigation'
import { useScrollStore } from '@/stores/scroll'
import logoSplitBlack from '@/assets/logo_split_black.svg'
import logoSplitWhite from '@/assets/logo_split_white.svg'

const currentYear = new Date().getFullYear()

const { navLinks, supportLinks } = useNavigation()
const scrollStore = useScrollStore()

const isInternalLink = (href) => typeof href === 'string' && href.startsWith('/')

/**
 * Scroll suave até a seção (reutiliza Lenis via store se disponível)
 */
const scrollToSection = (event, sectionId) => {
    if (!sectionId) return

    event.preventDefault()
    const el = document.getElementById(sectionId)
    if (!el) return

    if (scrollStore.lenis) {
        scrollStore.lenis.scrollTo(el, { offset: -64, duration: 1.2 })
    } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}
</script>

<template>
  <footer class="relative bg-surface text-text-main overflow-hidden border-t border-border-sutil transition-colors duration-300">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none"
      style="background-image: radial-gradient(currentColor 1px, transparent 1px); background-size: 32px 32px;"></div>

    <!-- Main Footer Content -->
    <div class="relative z-10 pt-16 md:pt-20 pb-8">
      <BaseContainer>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12 md:mb-14">

          <!-- Brand Column -->
          <div class="md:col-span-2 lg:col-span-6">
            <!-- Logo -->
            <a href="/" class="inline-flex items-center mb-5">
              <img
                :src="logoSplitBlack"
                alt="Click Certo"
                class="h-10 w-auto max-w-[180px] dark:hidden"
              />
              <img
                :src="logoSplitWhite"
                alt="Click Certo"
                class="hidden dark:block h-10 w-auto max-w-[180px]"
              />
            </a>

            <!-- Description -->
            <p class="text-sm text-text-muted leading-relaxed mb-6 max-w-md">
              Essenciais selecionados para o estilo de vida moderno. Produtos de qualidade premium entregues com cuidado.
            </p>

            <!-- Contact Info -->
            <div class="space-y-3">
              <a href="mailto:contato@afiliado.com"
                class="flex items-center gap-2 text-sm text-text-muted hover:text-text-main transition-colors">
                <Mail class="w-4 h-4" />
                dalberson522@gmail.com
              </a>
              <div class="flex items-center gap-2 text-sm text-text-muted">
                <MapPin class="w-4 h-4" />
                Juazeiro do Norte, CE, Brasil
              </div>
            </div>
          </div>

          <!-- Navigation Column -->
          <div class="lg:col-span-3">
            <h4 class="text-sm font-semibold text-text-main uppercase tracking-wider mb-5">
              Navegação
            </h4>
            <ul class="space-y-3">
              <li v-for="link in navLinks" :key="link.sectionId">
                <a :href="link.href" @click="scrollToSection($event, link.sectionId)"
                  class="text-sm text-text-muted hover:text-text-main transition-colors inline-flex items-center gap-1 group">
                  <span class="w-0 h-px bg-primary transition-all group-hover:w-4"></span>
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Support Column -->
          <div class="lg:col-span-3">
            <h4 class="text-sm font-semibold text-text-main uppercase tracking-wider mb-5">
              Suporte
            </h4>
            <ul class="space-y-3">
              <li v-for="link in supportLinks" :key="link.label">
                <component
                  :is="isInternalLink(link.href) ? 'RouterLink' : 'a'"
                  :to="isInternalLink(link.href) ? link.href : null"
                  :href="!isInternalLink(link.href) ? link.href : null"
                  class="text-sm text-text-muted hover:text-text-main transition-colors inline-flex items-center gap-1 group"
                >
                  <span class="w-0 h-px bg-primary transition-all group-hover:w-4"></span>
                  {{ link.label }}
                </component>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="pt-7 border-t border-border-sutil">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="text-sm text-neutral-500">
              © {{ currentYear }} Click Certo. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </BaseContainer>
    </div>
  </footer>
</template>
