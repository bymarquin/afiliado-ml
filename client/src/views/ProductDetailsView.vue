<script setup>
import { ref, onMounted } from 'vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import ProductHeroSection from '@/components/functional/product/ProductHeroSection.vue'

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

  // Reviews de usuários
  reviews: [
    {
      id: 1,
      text: 'Não compre pensando que vai jogar gta 6 rsrs, essa placa é para quem não tem vídeo na placa mãe e precisa de uma solução barata.',
      rating: 4
    },
    {
      id: 2,
      text: 'A placa é ótima, serve bem a sua função. Quanto a instalação, se você tiver uma placa mais antiga, pode precisar de adaptador.',
      rating: 5
    },
    {
      id: 3,
      text: 'Placa boa, problema que não é compatível com Windows 11, deveria estar especificado lá na descrição.',
      rating: 3
    }
  ]
})

const isLoading = ref(true)

onMounted(() => {
  // Simulate API call
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})
</script>

<template>
  <div class="min-h-screen bg-white pb-20">
    <!-- Breadcrumb / Back Navigation -->
    <div class="border-b border-gray-100 bg-white sticky top-0 z-30">
      <BaseContainer>
        <div class="py-4">
          <RouterLink to="/"
            class="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para a Home
          </RouterLink>
        </div>
      </BaseContainer>
    </div>

    <!-- Product Hero Section -->
    <ProductHeroSection :product="product" :isLoading="isLoading" />
  </div>
</template>
