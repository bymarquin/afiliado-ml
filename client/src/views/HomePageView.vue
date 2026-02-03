<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import HeroSection from '@/components/functional/HeroSection.vue'
import BenefitsSection from '@/components/functional/BenefitsSection.vue'
import ProductsSection from '@/components/functional/ProductsSection.vue'
import TestimonialsSection from '@/components/functional/TestimonialsSection.vue'
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main>
      <!-- Hero Section -->
      <HeroSection />

      <!-- Benefits Section -->
      <BenefitsSection />

      <!-- Products Section -->
      <ProductsSection />

      <!-- Testimonials Section -->
      <TestimonialsSection />
    </main>

    <!-- Footer (placeholder para expansão futura) -->
    <footer class="py-8 border-t border-gray-100">
      <div class="max-w-[1216px] mx-auto px-4 md:px-6 lg:px-8">
        <p class="text-sm text-gray-400 text-center">
          © 2026 Afiliado ML. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  </div>
</template>
