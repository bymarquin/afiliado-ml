<script setup>
import { onMounted } from 'vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useBenefits } from '@/composables/useBenefits'
import { useTiltCard } from '@/composables/useTiltCard'

gsap.registerPlugin(ScrollTrigger)

const { benefits, iconComponents } = useBenefits()

// Criar instâncias de tilt para cada card
const tiltCards = benefits.map(() => useTiltCard({
  rotateAmplitude: 10,
  scaleOnHover: 1.03,
  transitionDuration: 0.3
}))

onMounted(() => {
  // Garante que os cards estejam visíveis inicialmente
  gsap.set('.benefit-card', { autoAlpha: 1, y: 0, filter: 'blur(0px)' })

  gsap.from('.benefit-card', {
    scrollTrigger: {
      trigger: '.benefits-grid',
      start: 'top 85%',
      once: true
    },
    y: 40,
    autoAlpha: 0,
    filter: 'blur(6px)',
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out'
  })
})
</script>

<template>
  <section class="relative py-20 md:py-28 bg-white overflow-hidden">
    <!-- Subtle Background Elements -->
    <div class="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-blue-50/50 blur-3xl pointer-events-none">
    </div>
    <div class="absolute -bottom-1/4 -left-1/4 w-1/3 h-1/3 rounded-full bg-gray-100/50 blur-3xl pointer-events-none">
    </div>

    <BaseContainer class="relative z-10">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
          <span class="text-xs font-bold text-blue-600 uppercase tracking-wider">Why Choose Us</span>
        </span>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-950 tracking-tight">
          Benefits of shopping with us
        </h2>
      </div>

      <!-- Benefits Grid -->
      <div class="benefits-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <div v-for="(benefit, index) in benefits" :key="benefit.title"
          :ref="el => { if (el) tiltCards[index].elementRef.value = el }" :style="tiltCards[index].style.value"
          @mousemove="tiltCards[index].onMouseMove" @mouseenter="tiltCards[index].onMouseEnter"
          @mouseleave="tiltCards[index].onMouseLeave"
          class="benefit-card group relative bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 hover:border-blue-100 transition-colors duration-300 hover:shadow-xl hover:shadow-blue-500/5">

          <!-- Icon Circle with Gradient Background on Hover -->
          <div
            class="w-14 h-14 mb-5 flex items-center justify-center rounded-xl bg-gray-50 group-hover:bg-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/25">
            <component :is="iconComponents[benefit.icon]"
              class="w-6 h-6 text-gray-700 group-hover:text-white transition-colors duration-300" />
          </div>

          <!-- Content -->
          <h3 class="text-lg font-bold text-gray-950 mb-2 group-hover:text-blue-600 transition-colors">
            {{ benefit.title }}
          </h3>
          <p class="text-sm text-gray-500 leading-relaxed">
            {{ benefit.description }}
          </p>

          <!-- Hover Indicator -->
          <div
            class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-blue-600 rounded-full transition-all duration-300 group-hover:w-12">
          </div>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>

<style scoped>
/* Subtle card shine effect on hover */
.benefit-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, transparent 40%, rgba(255, 255, 255, 0.8) 50%, transparent 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.benefit-card:hover::before {
  opacity: 1;
  animation: shine 0.6s ease-out forwards;
}

@keyframes shine {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(100%);
  }
}
</style>
