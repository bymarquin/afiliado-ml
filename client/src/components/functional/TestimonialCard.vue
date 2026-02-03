<script setup>
import { Star, Quote, BadgeCheck } from 'lucide-vue-next'

const props = defineProps({
  testimonial: {
    type: Object,
    required: true
  }
})

// Rating padrão se não vier da API
const rating = props.testimonial.rating || 5
</script>

<template>
  <article
    class="group relative flex flex-col p-6 bg-white border border-gray-100 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/5 hover:border-gray-200 hover:-translate-y-1">

    <!-- Quote Icon Decorativo -->
    <div
      class="absolute -top-3 -right-3 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/25 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-12">
      <Quote class="w-5 h-5 text-white fill-white" />
    </div>

    <!-- Rating Stars with Micro Animations -->
    <div class="flex gap-0.5 mb-4">
      <Star v-for="i in 5" :key="i" class="star-icon w-4 h-4 text-amber-400"
        :class="i <= rating ? 'fill-current' : 'fill-none opacity-30'" :style="{ '--delay': `${(i - 1) * 80}ms` }" />
    </div>

    <!-- Quote Text -->
    <p class="text-sm md:text-base text-gray-700 leading-relaxed mb-6 flex line-clamp-4">
      "{{ testimonial.text }}"
    </p>

    <!-- Author Section -->
    <div class="flex items-center gap-3 mt-auto pt-4 border-t border-gray-50">
      <!-- Avatar -->
      <div
        class="relative w-11 h-11 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm">
        <img v-if="testimonial.avatar" :src="testimonial.avatar" :alt="testimonial.author"
          class="w-full h-full object-cover" loading="lazy" />
        <span v-else class="text-sm font-bold text-gray-500">
          {{ testimonial.author?.charAt(0) || 'U' }}
        </span>
      </div>

      <!-- Author Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-1.5">
          <span class="text-sm font-semibold text-gray-950 truncate">
            {{ testimonial.author }}
          </span>
          <BadgeCheck class="w-4 h-4 text-blue-600 shrink-0" />
        </div>
        <p class="text-xs text-gray-400 font-medium">
          {{ testimonial.role || 'Verified Customer' }}
        </p>
      </div>
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
