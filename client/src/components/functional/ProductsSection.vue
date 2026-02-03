<script setup>
import { ref, onMounted } from 'vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ProductCard from '@/components/functional/ProductCard.vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Produtos de exemplo - em produção viriam de uma API
const products = ref([
  { id: 1, name: 'Product name', price: 69, variant: 'Variant', image: null },
  { id: 2, name: 'Product name', price: 69, variant: 'Variant', image: null },
  { id: 3, name: 'Product name', price: 69, variant: 'Variant', image: null },
  { id: 4, name: 'Product name', price: 69, variant: 'Variant', image: null },
  { id: 5, name: 'Product name', price: 69, variant: 'Variant', image: null }
])

const scrollContainer = ref(null)

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: -280, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 280, behavior: 'smooth' })
  }
}

onMounted(() => {
  gsap.from('.product-card-wrapper', {
    scrollTrigger: {
      trigger: '.products-section',
      start: 'top 75%',
    },
    x: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: 'power3.out'
  })
})
</script>

<template>
  <section class="products-section py-12 md:py-16">
    <BaseContainer>
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-xl md:text-2xl font-bold text-gray-950 uppercase tracking-wide">
            Products
          </h2>
          <p class="text-sm text-gray-400 mt-1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
        <BaseButton variant="primary" size="sm">
          View All
        </BaseButton>
      </div>

      <!-- Products Grid/Carousel -->
      <div class="relative">
        <div ref="scrollContainer" class="flex gap-4 overflow-x-auto p-4 snap-x snap-mandatory scrollbar-hide">
          <div v-for="product in products" :key="product.id"
            class="product-card-wrapper shrink-0 w-50 md:w-55 snap-start">
            <ProductCard :product="product" />
          </div>
        </div>

        <!-- Navigation Arrows -->
        <div class="flex items-center gap-2 mt-6">
          <button
            class="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full text-gray-800 hover:bg-gray-50 transition-colors"
            aria-label="Anterior" @click="scrollLeft">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            class="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full text-gray-800 hover:bg-gray-50 transition-colors"
            aria-label="Próximo" @click="scrollRight">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>

<style scoped>
/* Hide scrollbar */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
