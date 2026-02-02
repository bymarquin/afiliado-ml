<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()
const productId = route.params.id

// Mock Data - In a real app this would come from a store or API
const product = ref({
  id: productId,
  name: 'Smart Watch Series 7',
  price: 399.00,
  originalPrice: 499.00,
  description: 'Experimente a tecnologia vestível mais avançada com o Smart Watch Series 7. Monitore sua saúde, acompanhe seus treinos e mantenha-se conectado com estilo. Com uma tela retina sempre ativa e resistência à água, é o parceiro perfeito para o seu dia a dia.',
  features: [
    'Tela Retina Sempre Ativa',
    'Monitoramento de Oxigênio no Sangue',
    'ECG no pulso',
    'Resistente à água (50m)',
    'Bateria de longa duração'
  ],
  images: [
    null // Placeholder
  ],
  rating: 4.8,
  reviews: 124,
  affiliateUrl: 'https://mercadolivre.com.br' // Example URL
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
    <div class="border-b border-gray-100 bg-white">
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

    <BaseContainer class="mt-8 md:mt-12">
      <div v-if="isLoading" class="flex items-center justify-center min-h-100">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
        <!-- Left Column: Images -->
        <div class="space-y-4">
          <div
            class="aspect-square bg-gray-50 rounded-3xl overflow-hidden flex items-center justify-center relative group">
            <img v-if="product.images[0]" :src="product.images[0]" :alt="product.name"
              class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
              <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Right Column: Product Info -->
        <div class="flex flex-col">
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-4">
              <div class="flex text-yellow-400 text-sm">
                <span v-for="i in 5" :key="i">★</span>
              </div>
              <span class="text-sm text-gray-500 font-medium">{{ product.reviews }} avaliações</span>
            </div>

            <h1 class="text-3xl md:text-4xl font-bold text-gray-950 mb-4 leading-tight">
              {{ product.name }}
            </h1>

            <div class="flex items-baseline gap-4 mb-6">
              <span class="text-3xl font-bold text-gray-950">${{ product.price }}</span>
              <span class="text-lg text-gray-400 line-through">${{ product.originalPrice }}</span>
              <span
                class="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide">
                {{ Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) }}% OFF
              </span>
            </div>

            <p class="text-gray-600 leading-relaxed mb-8">
              {{ product.description }}
            </p>

            <div class="border-t border-gray-100 pt-8 mb-8">
              <h3 class="text-sm font-bold text-gray-950 uppercase tracking-wide mb-4">Destaques</h3>
              <ul class="space-y-3">
                <li v-for="feature in product.features" :key="feature" class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-gray-600">{{ feature }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="mt-auto">
            <BaseButton :href="product.affiliateUrl" target="_blank" variant="primary" size="lg"
              class="w-full md:w-auto min-w-75 shadow-xl shadow-primary/20 hover:shadow-primary/40">
              Comprar Agora no Mercado Livre
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </BaseButton>
            <p class="text-xs text-gray-400 mt-4 text-center md:text-left">
              Ao clicar em comprar, você será redirecionado para o Mercado Livre.
            </p>
          </div>
        </div>
      </div>
    </BaseContainer>
  </div>
</template>
