<script setup>
import { onMounted } from 'vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ProductCard from '@/components/functional/ProductCard.vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-vue-next'
import { useProducts, useProductCarousel } from '@/composables/useProducts'

gsap.registerPlugin(ScrollTrigger)

const { products } = useProducts()
const { scrollContainer, scrollLeft, scrollRight } = useProductCarousel()

onMounted(() => {
  gsap.set('.product-card-wrapper', { autoAlpha: 1, x: 0, filter: 'blur(0px)' })

  gsap.from('.product-card-wrapper', {
    scrollTrigger: {
      trigger: '.products-section',
      start: 'top 80%',
      once: true
    },
    x: 60,
    autoAlpha: 0,
    filter: 'blur(8px)',
    duration: 1,
    stagger: 0.1,
    ease: 'power3.out'
  })
})
</script>

<template>
  <section id="products" class="products-section relative py-20 md:py-28 bg-gray-50/50 overflow-hidden">
    <!-- Subtle Background -->
    <div class="absolute -top-1/3 -left-1/4 w-1/2 h-1/2 rounded-full bg-blue-50/30 blur-3xl pointer-events-none">
    </div>

    <BaseContainer class="relative z-10">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <span class="text-xs font-bold text-blue-600 uppercase tracking-wider">Featured</span>
          </span>
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-950 tracking-tight">
            Trending Products
          </h2>
          <p class="text-base text-gray-500 mt-2 max-w-md">
            Discover our most popular items loved by thousands of customers.
          </p>
        </div>

        <BaseButton variant="secondary" size="md"
          class="shrink-0 border-gray-200 text-gray-950 hover:bg-gray-100 group">
          View All Products
          <ArrowRight class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </BaseButton>
      </div>

      <!-- Products Carousel -->
      <div class="relative">
        <!-- Navigation Arrows - Desktop -->
        <button
          class="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center bg-white rounded-full shadow-lg border border-gray-100 text-gray-700 hover:bg-gray-950 hover:text-white hover:border-gray-950 transition-all duration-300"
          aria-label="Anterior" @click="scrollLeft">
          <ChevronLeft class="w-5 h-5" />
        </button>

        <button
          class="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center bg-white rounded-full shadow-lg border border-gray-100 text-gray-700 hover:bg-gray-950 hover:text-white hover:border-gray-950 transition-all duration-300"
          aria-label="Próximo" @click="scrollRight">
          <ChevronRight class="w-5 h-5" />
        </button>

        <!-- Cards Container -->
        <div ref="scrollContainer"
          class="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
          <div v-for="product in products" :key="product.id"
            class="product-card-wrapper shrink-0 w-64 md:w-72 snap-start">
            <ProductCard :product="product" />
          </div>
        </div>

        <!-- Navigation Arrows - Mobile -->
        <div class="flex lg:hidden items-center justify-center gap-3 mt-4">
          <button
            class="w-11 h-11 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-950 hover:text-white hover:border-gray-950 transition-all duration-300"
            aria-label="Anterior" @click="scrollLeft">
            <ChevronLeft class="w-5 h-5" />
          </button>
          <button
            class="w-11 h-11 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-950 hover:text-white hover:border-gray-950 transition-all duration-300"
            aria-label="Próximo" @click="scrollRight">
            <ChevronRight class="w-5 h-5" />
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
