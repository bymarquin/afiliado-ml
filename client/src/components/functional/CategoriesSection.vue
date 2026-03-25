<script setup>
import { onMounted } from 'vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import CategoryCard from './CategoryCard.vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCategories } from '@/composables/useCategories'

gsap.registerPlugin(ScrollTrigger)

const { categories } = useCategories()

onMounted(() => {
  gsap.set('.bento-card', { autoAlpha: 0, y: 40, scale: 0.95 })

  gsap.to('.bento-card', {
    scrollTrigger: {
      trigger: '.categories-section',
      start: 'top 80%',
      once: true
    },
    y: 0,
    autoAlpha: 1,
    scale: 1,
    duration: 0.8,
    stagger: 0.1,
    ease: 'expo.out'
  })
})
</script>

<template>
  <section id="categories" class="categories-section relative py-20 md:py-32 bg-slate-50/50 overflow-hidden">
    <!-- Background Glows -->
    <div class="absolute top-0 right-0 w-150 h-150 rounded-full bg-blue-300/20 blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
    <div class="absolute bottom-0 left-0 w-125 h-125 rounded-full bg-purple-300/20 blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

    <BaseContainer class="relative z-10">
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
        <div class="max-w-2xl">
          <span class="inline-block px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 shadow-sm">
            Explorar
          </span>
          <h2 class="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            Navegue por <br class="hidden md:block" />
            <span class="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Categorias em Destaque</span>
          </h2>
        </div>

        <p class="text-base text-slate-500 max-w-sm md:text-right">
          A seleção mais refinada de tecnologias. Encontre rapidamente o que você busca na nossa matriz de produtos.
        </p>
      </div>

      <!-- Bento Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px] md:auto-rows-[340px]">
        <CategoryCard 
          v-for="(category, index) in categories" 
          :key="category.id"
          :category="category"
          :index="index"
          :featured="index === 0"
        />
      </div>
    </BaseContainer>
  </section>
</template>
