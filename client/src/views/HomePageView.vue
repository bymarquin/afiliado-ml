<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
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

    <!-- Footer -->
    <AppFooter />
  </div>
</template>
