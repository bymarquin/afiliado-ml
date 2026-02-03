<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
import { Star } from 'lucide-vue-next'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

// Simular rating - em produção viria da API
const rating = props.product.rating || 4.5
const reviewCount = props.product.reviewCount || Math.floor(Math.random() * 100) + 20
</script>

<template>
  <article
    class="group flex flex-col h-full bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/5 hover:-translate-y-1">
    <!-- Image Container -->
    <RouterLink :to="{ name: 'ProductDetails', params: { id: product.id } }"
      class="relative aspect-square bg-gray-50 overflow-hidden cursor-pointer">

      <!-- Image -->
      <img v-if="product.image" :src="product.image" :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />

      <!-- Elegant Placeholder -->
      <div v-else class="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <div class="w-20 h-20 rounded-2xl bg-gray-200/50 flex items-center justify-center">
          <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <!-- Hover Overlay -->
      <div
        class="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
      </div>
    </RouterLink>

    <!-- Info -->
    <div class="p-4 flex flex-col flex-1">
      <!-- Category/Variant -->
      <p v-if="product.variant" class="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-1">
        {{ product.variant }}
      </p>

      <!-- Name -->
      <h3 class="text-sm font-semibold text-gray-900 mb-1.5 line-clamp-2 leading-snug">
        <RouterLink :to="{ name: 'ProductDetails', params: { id: product.id } }"
          class="hover:text-blue-600 transition-colors">
          {{ product.name }}
        </RouterLink>
      </h3>

      <!-- Rating -->
      <div class="flex items-center gap-1.5 mb-3">
        <div class="flex text-amber-400">
          <Star v-for="i in 5" :key="i" class="w-3.5 h-3.5"
            :class="i <= Math.floor(rating) ? 'fill-current' : 'fill-none opacity-40'" />
        </div>
        <span class="text-[11px] text-gray-400 font-medium">({{ reviewCount }})</span>
      </div>

      <!-- Price -->
      <div class="flex items-center gap-2 mt-auto">
        <span class="text-lg font-bold text-gray-950">
          ${{ product.price }}
        </span>
        <span v-if="product.originalPrice" class="text-sm text-gray-400 line-through">
          ${{ product.originalPrice }}
        </span>
      </div>
    </div>

    <!-- CTA -->
    <div class="px-4 pb-4">
      <BaseButton :to="{ name: 'ProductDetails', params: { id: product.id } }"
        class="w-full bg-gray-950! hover:bg-gray-800! text-white justify-center py-3 rounded-xl border-none font-medium"
        size="md">
        Ver Detalhes
      </BaseButton>
    </div>
  </article>
</template>
