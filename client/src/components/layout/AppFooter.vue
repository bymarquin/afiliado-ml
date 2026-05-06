<script setup>
import BaseContainer from '@/components/ui/BaseContainer.vue'
import { Mail, MapPin } from 'lucide-vue-next'
import { useNavigation } from '@/composables/useNavigation'
import { useSocialLinks } from '@/composables/useSocialLinks'
import { useScrollStore } from '@/stores/scroll'
import logoSplitBlack from '@/assets/logo_split_black.svg'
import logoSplitWhite from '@/assets/logo_split_white.svg'

const currentYear = new Date().getFullYear()

const { navLinks, supportLinks } = useNavigation()
const { socialLinks } = useSocialLinks()
const scrollStore = useScrollStore()

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
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12 md:mb-16">

          <!-- Brand Column -->
          <div class="lg:col-span-1">
            <!-- Logo -->
            <a href="/" class="inline-flex items-center mb-5">
              <img
                :src="logoSplitBlack"
                alt="Afiliado ML"
                class="h-10 w-auto max-w-[180px] dark:hidden"
              />
              <img
                :src="logoSplitWhite"
                alt="Afiliado ML"
                class="hidden dark:block h-10 w-auto max-w-[180px]"
              />
            </a>

            <!-- Description -->
            <p class="text-sm text-text-muted leading-relaxed mb-6 max-w-xs">
              Essenciais selecionados para o estilo de vida moderno. Produtos de qualidade premium entregues com cuidado.
            </p>

            <!-- Contact Info -->
            <div class="space-y-3">
              <a href="mailto:contato@afiliado.com"
                class="flex items-center gap-2 text-sm text-text-muted hover:text-text-main transition-colors">
                <Mail class="w-4 h-4" />
                contato@afiliado.com
              </a>
              <div class="flex items-center gap-2 text-sm text-text-muted">
                <MapPin class="w-4 h-4" />
                São Paulo, Brasil
              </div>
            </div>
          </div>

          <!-- Navigation Column -->
          <div>
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
          <div>
            <h4 class="text-sm font-semibold text-text-main uppercase tracking-wider mb-5">
              Suporte
            </h4>
            <ul class="space-y-3">
              <li v-for="link in supportLinks" :key="link.label">
                <a :href="link.href"
                  class="text-sm text-text-muted hover:text-text-main transition-colors inline-flex items-center gap-1 group">
                  <span class="w-0 h-px bg-primary transition-all group-hover:w-4"></span>
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Newsletter Column -->
          <div>
            <h4 class="text-sm font-semibold text-text-main uppercase tracking-wider mb-5">
              Fique Atualizado
            </h4>
            <p class="text-sm text-text-muted mb-4">
              Inscreva-se para receber ofertas especiais e atualizações.
            </p>

            <!-- Newsletter Form -->
            <form @submit.prevent class="flex gap-2 mb-6">
              <input type="email" placeholder="Seu e-mail"
                class="flex-1 px-4 py-2.5 bg-surface-hover border border-border-sutil rounded-xl text-sm text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              <button type="submit"
                class="px-4 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-colors shrink-0 shadow-lg shadow-primary/20">
                Inscrever-se
              </button>
            </form>

            <!-- Social Links -->
            <div class="flex gap-3">
              <a v-for="social in socialLinks" :key="social.name" :href="social.href" target="_blank"
                rel="noopener noreferrer" :aria-label="social.name"
                class="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-hover border border-border-sutil text-text-muted hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-primary/20">
                <!-- Instagram -->
                <svg v-if="social.icon === 'instagram'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
                <!-- Twitter/X -->
                <svg v-else-if="social.icon === 'twitter'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <!-- Facebook -->
                <svg v-else-if="social.icon === 'facebook'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <!-- LinkedIn -->
                <svg v-else-if="social.icon === 'linkedin'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="pt-8 border-t border-white/10">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="text-sm text-neutral-500">
              © {{ currentYear }} Afiliado ML. Todos os direitos reservados.
            </p>

            <!-- Payment Methods -->
            <div class="flex items-center gap-3">
              <span class="text-xs text-neutral-500 mr-2">Aceitamos:</span>
              <div class="flex gap-2">
                <!-- Visa -->
                <div class="w-10 h-6 bg-white/10 rounded flex items-center justify-center">
                  <span class="text-[10px] font-bold text-neutral-400">VISA</span>
                </div>
                <!-- Mastercard -->
                <div class="w-10 h-6 bg-white/10 rounded flex items-center justify-center">
                  <span class="text-[10px] font-bold text-neutral-400">MC</span>
                </div>
                <!-- PIX -->
                <div class="w-10 h-6 bg-white/10 rounded flex items-center justify-center">
                  <span class="text-[10px] font-bold text-neutral-400">PIX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseContainer>
    </div>
  </footer>
</template>
