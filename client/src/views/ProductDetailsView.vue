<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import ProductHeroSection from '@/components/functional/product/ProductHeroSection.vue'
import ProductReviewCard from '@/components/functional/product/ProductReviewCard.vue'
import { MessageCircle } from 'lucide-vue-next'

gsap.registerPlugin(ScrollTrigger)

// Mock Data - Estrutura baseada nos dados reais do Mercado Livre
const product = ref({
  // Dados básicos
  id: 'MLB26912068',
  title: 'Placa de Video Revenger Nvidia GT 210 1GB DDR3 HDMI DVI VGA',
  image: 'https://http2.mlstatic.com/D_NQ_NP_945686-MLA99943262235_112025-O.webp',
  url: 'https://www.mercadolivre.com.br/placa-de-video-revenger-nvidia-gt-210-1gb-ddr3-hdmi-dvi-vga/p/MLB26912068',

  // Avaliação e preço
  rate: 4.8,
  rateCount: 822,
  price: 124.9,

  // Descrição
  description: 'Tamanho da memória: 1 GB. | Interface PCI-Express 2.0. | Memória gráfica DDR3 de 600MHz.',

  // Reviews de usuários (sem dados de autor - anônimo)
  reviews: [
    {
      id: 1,
      text: 'Não compre pensando que vai jogar GTA 6 rsrs, essa placa é para quem não tem vídeo na placa mãe e precisa de uma solução barata. Cumpre o prometido!',
      rating: 4
    },
    {
      id: 2,
      text: 'A placa é ótima, serve bem a sua função. Quanto a instalação, se você tiver uma placa mais antiga, pode precisar de adaptador. Excelente custo-benefício!',
      rating: 5
    },
    {
      id: 3,
      text: 'Placa boa, mas não é compatível com Windows 11. Deveria estar especificado na descrição. Tirando isso, funciona muito bem!',
      rating: 3
    }
  ]
})

const isLoading = ref(true)
const reviewsSection = ref(null)

onMounted(() => {
  // Simulate API call
  setTimeout(() => {
    isLoading.value = false
  }, 500)

  // Animate reviews section on scroll
  gsap.from('.reviews-section-content', {
    scrollTrigger: {
      trigger: '.reviews-section',
      start: 'top 85%',
      once: true
    },
    y: 40,
    autoAlpha: 0,
    duration: 0.8,
    ease: 'power2.out'
  })

  // Stagger reveal cards
  gsap.from('.review-card', {
    scrollTrigger: {
      trigger: '.reviews-section',
      start: 'top 80%',
      once: true
    },
    y: 30,
    autoAlpha: 0,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power2.out'
  })
})
</script>

<template>
  <div class="bg-white">
    <!-- Product Hero Section -->
    <ProductHeroSection :product="product" :isLoading="isLoading" />

    <!-- Reviews Section (Premium Style) -->
    <section ref="reviewsSection" class="reviews-section relative py-16 md:py-24 bg-gray-50 overflow-hidden">
      <!-- Subtle Background Blobs -->
      <div class="absolute -top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-blue-50/40 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-1/4 right-1/4 w-1/3 h-1/3 rounded-full bg-amber-50/30 blur-3xl pointer-events-none">
      </div>

      <BaseContainer class="reviews-section-content">
        <!-- Section Header -->
        <div class="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <MessageCircle class="w-4 h-4 text-blue-600" />
            <span class="text-xs font-bold text-blue-600 uppercase tracking-wider">Avaliações</span>
          </span>
          <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-950 tracking-tight mb-3">
            O que dizem os compradores
          </h2>
          <p class="text-sm md:text-base text-gray-500">
            Veja as experiências de quem já adquiriu este produto.
          </p>
        </div>

        <!-- Reviews Grid -->
        <div v-if="product.reviews?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          <div v-for="review in product.reviews" :key="review.id" class="review-card">
            <ProductReviewCard :review="review" />
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <p class="text-gray-400">Nenhuma avaliação disponível ainda.</p>
        </div>
      </BaseContainer>
    </section>
  </div>
</template>
