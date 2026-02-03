<script setup>
import { onMounted } from 'vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import TestimonialCard from '@/components/functional/TestimonialCard.vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
    {
        id: 1,
        text: 'Lorem ipsum dolor sit amet, consect adipiscing elit. Varius enim in eros elementum tristique.',
        author: 'John Doe',
        avatar: null
    },
    {
        id: 2,
        text: 'Lorem ipsum dolor sit amet, consect adipiscing edit. Varius enim in eros elementum tristique.',
        author: 'Jane Smith',
        avatar: null
    },
    {
        id: 3,
        text: 'Lorem ipsum dolor sit amet, consect adipiscing edit. Varius enim in eros elementum tristique.',
        author: 'Robert Fox',
        avatar: null
    },
    {
        id: 4,
        text: 'Lorem ipsum dolor sit amet, consect adipiscing edit. Varius enim in eros elementum tristique.',
        author: 'Emily Davis',
        avatar: null
    },
    {
        id: 5,
        text: 'Lorem ipsum dolor sit amet, consect adipiscing edit. Varius enim in eros elementum tristique.',
        author: 'Michael Brown',
        avatar: null
    },
    {
        id: 6,
        text: 'Lorem ipsum dolor sit amet, consect adipiscing edit. Varius enim in eros elementum tristique.',
        author: 'Sarah Wilson',
        avatar: null
    }
]

// Tripled for smoother longer screens
const infiniteList = [...testimonials, ...testimonials, ...testimonials]

onMounted(() => {
    // Reveal Section
    gsap.from('.testimonial-section-container', {
        scrollTrigger: {
            trigger: '.testimonial-section',
            start: 'top 80%',
        },
        y: 60,
        opacity: 0,
        duration: 1.0,
        ease: 'power3.out'
    })

    // Reveal Rows staggered
    gsap.from('.marquee-row', {
        scrollTrigger: {
            trigger: '.testimonial-section',
            start: 'top 70%',
        },
        x: -50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power2.out'
    })
})
</script>

<template>
    <section class="testimonial-section py-16 md:py-24 bg-gray-50 overflow-hidden">
        <BaseContainer class="testimonial-section-container px-0! max-w-none">

            <div class="relative w-full flex flex-col gap-8 md:gap-12">
                <!-- Fade Edges -->
                <div
                    class="absolute inset-y-0 left-0 w-20 md:w-32 bg-linear-to-r from-gray-50 to-transparent z-10 pointer-events-none">
                </div>
                <div
                    class="absolute inset-y-0 right-0 w-20 md:w-32 bg-linear-to-l from-gray-50 to-transparent z-10 pointer-events-none">
                </div>

                <!-- Row 1: Left -->
                <div class="marquee-row flex w-max animate-marquee hover:[animation-play-state:paused] gap-6 px-6">
                    <div v-for="(t, index) in infiniteList" :key="`row1-${index}`" class="w-75 md:w-100 shrink-0">
                        <TestimonialCard :testimonial="t" />
                    </div>
                </div>

                <!-- Row 2: Right (Reverse) -->
                <div
                    class="marquee-row flex w-max animate-marquee-reverse hover:[animation-play-state:paused] gap-6 px-6">
                    <div v-for="(t, index) in infiniteList" :key="`row2-${index}`" class="w-75 md:w-100 shrink-0">
                        <TestimonialCard :testimonial="t" />
                    </div>
                </div>
            </div>

        </BaseContainer>
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
    animation: marquee 60s linear infinite;
    will-change: transform;
}

.animate-marquee-reverse {
    animation: marquee-reverse 60s linear infinite;
    will-change: transform;
}
</style>
