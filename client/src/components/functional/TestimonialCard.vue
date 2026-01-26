<script setup>
defineProps({
    testimonial: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <article class="flex flex-col p-6 bg-white border border-gray-100 rounded-xl">
        <!-- Verified Badge -->
        <div class="flex items-center gap-1.5 mb-4">
            <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd" />
            </svg>
            <span class="text-xs font-medium text-green-600">Verified Purchase</span>
        </div>

        <!-- Quote -->
        <p class="text-sm text-gray-800 leading-relaxed mb-6 flex-grow">
            {{ testimonial.text }}
        </p>

        <!-- Author -->
        <div class="flex items-center gap-3 mt-auto">
            <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <img v-if="testimonial.avatar" :src="testimonial.avatar" :alt="testimonial.author"
                    class="w-full h-full object-cover" />
                <svg v-else class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clip-rule="evenodd" />
                </svg>
            </div>
            <span class="text-sm font-medium text-gray-950">
                {{ testimonial.author }}
            </span>
        </div>
    </article>
</template>
