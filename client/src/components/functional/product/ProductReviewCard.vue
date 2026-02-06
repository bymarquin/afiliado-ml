<script setup>
import { Star, Quote } from 'lucide-vue-next'

const props = defineProps({
    review: {
        type: Object,
        required: true
    }
})

// Rating padrão se não vier da API
const rating = props.review.rating || 5
</script>

<template>
    <article
        class="group relative flex flex-col p-5 md:p-6 bg-white border border-gray-100 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/5 hover:border-gray-200 hover:-translate-y-1">

        <!-- Quote Icon Decorativo -->
        <div
            class="absolute -top-3 -right-3 w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/25 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-12">
            <Quote class="w-4 h-4 text-white fill-white" />
        </div>

        <!-- Rating Stars with Micro Animations -->
        <div class="flex gap-0.5 mb-4">
            <Star v-for="i in 5" :key="i" class="star-icon w-4 h-4 text-amber-400"
                :class="i <= rating ? 'fill-current' : 'fill-none opacity-30'"
                :style="{ '--delay': `${(i - 1) * 80}ms` }" />
        </div>

        <!-- Quote Text -->
        <p class="text-sm md:text-base text-gray-700 leading-relaxed line-clamp-4">
            "{{ review.text }}"
        </p>

        <!-- Anonymous Badge -->
        <div class="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
            </div>
            <span class="text-xs text-gray-400 font-medium">Comprador anônimo</span>
        </div>
    </article>
</template>

<style scoped>
/* Star entrance animation */
.star-icon {
    animation: star-appear 0.5s ease-out backwards;
    animation-delay: var(--delay, 0ms);
    transition: transform 0.2s ease;
}

/* Hover effect - wave pulse */
.group:hover .star-icon {
    animation: star-pulse 0.4s ease-out;
    animation-delay: var(--delay, 0ms);
}

@keyframes star-appear {
    0% {
        opacity: 0;
        transform: scale(0) rotate(-180deg);
    }

    100% {
        opacity: 1;
        transform: scale(1) rotate(0deg);
    }
}

@keyframes star-pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.25);
    }
}
</style>
