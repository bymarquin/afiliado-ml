<script setup>
import { onMounted, ref, computed } from 'vue'
import { useMouseInElement } from '@vueuse/core'
import gsap from 'gsap'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { ArrowRight, Play, Star, ShoppingBag } from 'lucide-vue-next'

// Refs
const heroContainer = ref(null)
const heroContent = ref(null)
const heroImageContainer = ref(null)

// Parallax Logic
const { elementX, elementY, isOutside, elementHeight, elementWidth } = useMouseInElement(heroContainer)

const cardStyle = computed(() => {
  if (isOutside.value) return {
    transform: 'rotateX(0deg) rotateY(0deg) translate3d(0,0,0)',
    transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
  }

  const x = elementX.value - elementWidth.value / 2
  const y = elementY.value - elementHeight.value / 2

  const rotateX = (y / elementHeight.value) * -2 // Very subtle
  const rotateY = (x / elementWidth.value) * 2
  const moveX = (x / elementWidth.value) * 10
  const moveY = (y / elementHeight.value) * 10

  return {
    transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${moveX}px, ${moveY}px, 0)`,
    transition: 'transform 0.1s ease-out'
  }
})

onMounted(() => {
  const tl = gsap.timeline()

  gsap.set([heroContent.value.children, heroImageContainer.value], {
    autoAlpha: 0
  })

  tl.to(heroContent.value.children, {
    y: 0,
    autoAlpha: 1,
    duration: 0.8,
    stagger: 0.05,
    ease: 'power2.out'
  })
    .fromTo(heroImageContainer.value,
      { x: 30, autoAlpha: 0, scale: 0.95 },
      { x: 0, autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
      "-=0.6"
    )
})

// Happy person with shopping bags/package - Premium/Elegant
// Candidate 1: Fashionable woman with bags (high reliability)
const heroImage = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop"
const fallbackImage = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"

const handleImageError = (e) => {
  e.target.src = fallbackImage
}
</script>

<template>
  <section ref="heroContainer" class="relative min-h-[85vh] flex items-center bg-white overflow-hidden pt-12 pb-12">
    <!-- Subtle Background Gradient/Blob -->
    <div class="absolute -top-1/5 -left-1/10 w-3/5 h-3/5 rounded-full bg-primary/5 blur-3xl pointer-events-none">
    </div>
    <div class="absolute -bottom-1/5 -right-1/10 w-1/2 h-1/2 rounded-full bg-blue-400/5 blur-3xl pointer-events-none">
    </div>

    <!-- Decorative Pattern (Subtle Dots) -->
    <div class="absolute right-0 top-0 w-1/3 h-full opacity-30 pointer-events-none"
      style="background-image: radial-gradient(#D1D5DB 1px, transparent 1px); background-size: 24px 24px;"></div>


    <BaseContainer class="w-full relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        <!-- Left Column: Content -->
        <div ref="heroContent" class="flex flex-col items-start text-left z-10">

          <!-- Animated Badge -->
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 mb-6 transform translate-y-4 opacity-0">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-900 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-gray-900"></span>
            </span>
            <span class="text-xs font-bold text-gray-900 uppercase tracking-wider">Summer Sale 2026</span>
          </div>

          <!-- Headline -->
          <h1
            class="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-950 leading-[0.95] tracking-tight mb-6 transform translate-y-4 opacity-0 max-w-xl">
            Upgrade your <br class="hidden lg:block"> lifestyle today.
          </h1>

          <!-- Description -->
          <p class="text-base md:text-lg text-gray-500 max-w-lg leading-relaxed mb-8 transform translate-y-4 opacity-0">
            Curated essentials for the modern creator.
            Quality that speaks for itself.
          </p>

          <!-- CTAs -->
          <div
            class="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto transform translate-y-4 opacity-0 mb-10">
            <BaseButton variant="primary" size="lg"
              class="w-full sm:w-auto font-medium shadow-xl shadow-gray-950/10 bg-gray-950! text-white hover:bg-gray-800!">
              Start Shopping
              <ArrowRight class="w-5 h-5 ml-2" />
            </BaseButton>
            <BaseButton variant="outline" size="lg"
              class="w-full sm:w-auto border-gray-200 text-gray-950 hover:bg-gray-50">
              <Play class="w-4 h-4 mr-2 fill-current" />
              How it works
            </BaseButton>
          </div>

          <!-- Social Proof -->
          <div class="flex items-center gap-4 transform translate-y-4 opacity-0">
            <div class="flex -space-x-3">
              <div v-for="i in 4" :key="i"
                class="w-10 h-10 rounded-full border-[3px] border-white bg-gray-100 overflow-hidden shadow-sm">
                <img :src="`https://i.pravatar.cc/100?img=${i + 25}`" alt="User" class="w-full h-full object-cover">
              </div>
            </div>
            <div class="flex flex-col">
              <div class="flex text-yellow-500 text-xs mb-0.5 space-x-0.5">
                <Star v-for="s in 5" :key="s" class="w-4 h-4 fill-current" />
              </div>
              <p class="text-xs font-medium text-gray-600">
                <span class="font-bold text-gray-950">5,000+</span> happy shoppers
              </p>
            </div>
          </div>

        </div>

        <!-- Right Column: Visual (Floating / Organic) -->
        <div ref="heroImageContainer"
          class="relative h-125 lg:h-162.5 w-full flex items-center justify-center lg:justify-end perspective-container">

          <!-- Back Glow to simulate depth -->
          <div
            class="absolute inset-0 bg-linear-to-tr from-blue-100/30 to-transparent blur-3xl opacity-60 rounded-full pointer-events-none scale-90">
          </div>

          <!-- Image Container - No Box, Natural Blend -->
          <div
            class="relative w-full h-9/10 lg:w-9/10 transform transition-all duration-100 ease-out will-change-transform flex items-center justify-center"
            :style="cardStyle">

            <!-- Main Image with mix-blend-multiply to remove white background -->
            <img :src="heroImage" @error="handleImageError" alt="Happy Shopper"
              class="w-full h-full object-contain mix-blend-multiply scale-110 drop-shadow-xl"
              style="mask-image: linear-gradient(to bottom, black 85%, transparent 100%);" />

            <!-- Floating Badge 1: New Arrival -->
            <div
              class="absolute top-20 left-0 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-white/50 z-20 flex items-center gap-3 animate-float-slow">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ShoppingBag class="w-5 h-5" />
              </div>
              <div>
                <p class="text-[10px] uppercase font-bold text-gray-400">Easy Shop</p>
                <p class="text-xs font-bold text-gray-950">Free Returns</p>
              </div>
            </div>

            <!-- Floating Badge 2: Price/Promo -->
            <div
              class="absolute bottom-32 right-0 bg-gray-950 text-white px-5 py-3 rounded-2xl shadow-xl z-20 animate-float-delayed">
              <p class="text-xs text-gray-400 mb-1">Limited Time</p>
              <p class="text-xl font-bold">Free Shipping</p>
            </div>

          </div>
        </div>

      </div>
    </BaseContainer>
  </section>
</template>

<style scoped>
.perspective-container {
  perspective: 1000px;
}

/* Custom Float Animations */
@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-12px);
  }
}

@keyframes float-delayed {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
}

.animate-float-slow {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 7s ease-in-out infinite 1s;
}
</style>
