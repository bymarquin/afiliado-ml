<script setup>
import HeroSection from '@/components/functional/HeroSection.vue'
import BenefitsSection from '@/components/functional/BenefitsSection.vue'
import ProductsSection from '@/components/functional/ProductsSection.vue'
import TestimonialsSection from '@/components/functional/TestimonialsSection.vue'
import { useLenis } from '@/composables/useLenis'

// Ativa smooth scroll com efeito de inércia apenas nesta página
useLenis({
  lerp: 0.08,        // Mais suave/pesado (padrão 0.1)
  duration: 1.4,     // Duração da animação
  smoothWheel: true,
  smoothTouch: false // Desativa em mobile para melhor UX
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <HeroSection />

    <!-- Benefits Section -->
    <BenefitsSection />

    <!-- Products Section -->
    <ProductsSection />

    <!-- Testimonials Section -->
    <TestimonialsSection />
  </div>
</template>
