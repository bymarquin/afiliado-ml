<script setup>
import { ref } from 'vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import TestimonialCard from '@/components/functional/TestimonialCard.vue'

const testimonials = ref([
    {
        id: 1,
        text: 'Lorem ipsum dolor sit amet, consect adipiscing elit. Varius enim in eros elementum tristique.',
        author: 'John Doe',
        avatar: null
    },
    {
        id: 2,
        text: 'Lorem ipsum dolor sit amet, consect adipiscing edit. Varius enim in eros elementum tristique.',
        author: 'John Doe',
        avatar: null
    },
    {
        id: 3,
        text: 'Lorem ipsum dolor sit amet, consect adipiscing edit. Varius enim in eros elementum tristique.',
        author: 'John Doe',
        avatar: null
    },
    {
        id: 4,
        text: 'Lorem ipsum dolor sit amet, consect adipiscing edit. Varius enim in eros elementum tristique.',
        author: 'John Doe',
        avatar: null
    },
    {
        id: 5,
        text: 'Lorem ipsum dolor sit amet, consect adipiscing edit. Varius enim in eros elementum tristique.',
        author: 'John Doe',
        avatar: null
    },
    {
        id: 6,
        text: 'Lorem ipsum dolor sit amet, consect adipiscing edit. Varius enim in eros elementum tristique.',
        author: 'John Doe',
        avatar: null
    }
])

// Dividir em duas linhas para o efeito de ticker
const row1 = testimonials.value.slice(0, 3)
const row2 = testimonials.value.slice(3, 6)
</script>

<template>
    <section class="py-12 md:py-16 overflow-hidden bg-gray-50">
        <BaseContainer>
            <!-- Row 1 - Scroll Left -->
            <div class="relative mb-6">
                <div class="flex gap-4 animate-scroll-left">
                    <TestimonialCard v-for="testimonial in [...row1, ...row1]"
                        :key="`r1-${testimonial.id}-${Math.random()}`" :testimonial="testimonial"
                        class="flex-shrink-0 w-[300px] md:w-[350px]" />
                </div>
            </div>

            <!-- Row 2 - Scroll Right -->
            <div class="relative">
                <div class="flex gap-4 animate-scroll-right">
                    <TestimonialCard v-for="testimonial in [...row2, ...row2]"
                        :key="`r2-${testimonial.id}-${Math.random()}`" :testimonial="testimonial"
                        class="flex-shrink-0 w-[300px] md:w-[350px]" />
                </div>
            </div>
        </BaseContainer>
    </section>
</template>

<style scoped>
@keyframes scroll-left {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-50%);
    }
}

@keyframes scroll-right {
    0% {
        transform: translateX(-50%);
    }

    100% {
        transform: translateX(0);
    }
}

.animate-scroll-left {
    animation: scroll-left 30s linear infinite;
}

.animate-scroll-right {
    animation: scroll-right 30s linear infinite;
}

.animate-scroll-left:hover,
.animate-scroll-right:hover {
    animation-play-state: paused;
}
</style>
