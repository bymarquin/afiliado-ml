<script setup>
import { onMounted } from 'vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import TestimonialCard from '@/components/functional/TestimonialCard.vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTestimonials } from '@/composables/useTestimonials'

gsap.registerPlugin(ScrollTrigger)

const { infiniteList } = useTestimonials()

onMounted(() => {
    gsap.set('.testimonial-section-container', { autoAlpha: 1, y: 0 })
    gsap.set('.marquee-row', { autoAlpha: 1, x: 0 })

    // Reveal Section
    gsap.from('.testimonial-section-container', {
        scrollTrigger: {
            trigger: '.testimonial-section',
            start: 'top 85%',
            once: true
        },
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power2.out'
    })

    // Reveal Rows staggered
    gsap.from('.marquee-row', {
        scrollTrigger: {
            trigger: '.testimonial-section',
            start: 'top 80%',
            once: true
        },
        x: -30,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
    })
})
</script>

<template>
    <section class="testimonial-section relative py-20 md:py-28 bg-gray-50 overflow-hidden">
        <!-- Subtle Background -->
        <div class="absolute -top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-blue-50/40 blur-3xl pointer-events-none">
        </div>
        <div
            class="absolute -bottom-1/4 right-1/4 w-1/3 h-1/3 rounded-full bg-amber-50/30 blur-3xl pointer-events-none">
        </div>

        <BaseContainer class="testimonial-section-container mb-12">
            <!-- Section Header -->
            <div class="text-center max-w-2xl mx-auto">
                <span
                    class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
                    <span class="text-xs font-bold text-blue-600 uppercase tracking-wider">Testimonials</span>
                </span>
                <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-950 tracking-tight mb-4">
                    Loved by thousands
                </h2>
                <p class="text-base md:text-lg text-gray-500">
                    See what our customers are saying about their experience with us.
                </p>
            </div>
        </BaseContainer>

        <!-- Marquee Container -->
        <div class="relative w-full flex flex-col gap-6 md:gap-8">
            <!-- Fade Edges -->
            <div
                class="absolute inset-y-0 left-0 w-24 md:w-40 bg-linear-to-r from-gray-50 to-transparent z-10 pointer-events-none">
            </div>
            <div
                class="absolute inset-y-0 right-0 w-24 md:w-40 bg-linear-to-l from-gray-50 to-transparent z-10 pointer-events-none">
            </div>

            <!-- Row 1: Left -->
            <div class="marquee-row flex w-max animate-marquee hover:[animation-play-state:paused] gap-5 px-6">
                <div v-for="(t, index) in infiniteList" :key="`row1-${index}`" class="w-80 md:w-96 shrink-0">
                    <TestimonialCard :testimonial="t" />
                </div>
            </div>

            <!-- Row 2: Right (Reverse) -->
            <div class="marquee-row flex w-max animate-marquee-reverse hover:[animation-play-state:paused] gap-5 px-6">
                <div v-for="(t, index) in infiniteList" :key="`row2-${index}`" class="w-80 md:w-96 shrink-0">
                    <TestimonialCard :testimonial="t" />
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
@keyframes marquee {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-50%);
    }
}

@keyframes marquee-reverse {
    0% {
        transform: translateX(-50%);
    }

    100% {
        transform: translateX(0);
    }
}

.animate-marquee {
    animation: marquee 80s linear infinite;
    will-change: transform;
}

.animate-marquee-reverse {
    animation: marquee-reverse 80s linear infinite;
    will-change: transform;
}
</style>
