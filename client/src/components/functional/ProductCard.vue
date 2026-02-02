<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'

defineProps({
  product: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <article class="group flex flex-col h-full">
    <!-- Image Container -->
    <RouterLink :to="{ name: 'ProductDetails', params: { id: product.id } }"
      class="relative aspect-4/5 bg-gray-50 rounded-2xl overflow-hidden mb-4 p-6 flex items-center justify-center cursor-pointer">
      <img v-if="product.image" :src="product.image" :alt="product.name"
        class="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
        loading="lazy" />
      <div v-else class="w-full h-full flex items-center justify-center">
        <!-- Placeholder Icon -->
        <svg class="w-16 h-16 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </RouterLink>

    <!-- Info -->
    <div class="flex items-start justify-between gap-2 mb-1">
      <h3 class="text-base font-bold text-gray-950 line-clamp-1">
        <RouterLink :to="{ name: 'ProductDetails', params: { id: product.id } }"
          class="hover:text-primary transition-colors">
          {{ product.name }}
        </RouterLink>
      </h3>
      <span class="text-base font-bold text-gray-950 whitespace-nowrap">
        ${{ product.price }}
      </span>
    </div>

    <p v-if="product.variant" class="text-xs text-gray-500 mb-4 font-medium">
      {{ product.variant }}
    </p>
    <div v-else class="mb-4"></div>

    <!-- CTA -->
    <BaseButton :to="{ name: 'ProductDetails', params: { id: product.id } }"
      class="w-full mt-auto bg-black! hover:bg-gray-900! text-white justify-center py-3 rounded-xl border-none"
      size="md">
      Ver Detalhes
    </BaseButton>
  </article>
</template>
