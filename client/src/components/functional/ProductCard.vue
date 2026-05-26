<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
import ClickSparkWrapper from '@/components/ui/ClickSparkWrapper.vue'
import { Star } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

// Simular rating - em produção viria da API
const rating = props.product.rating || 4.5
const reviewCount = props.product.reviewCount || Math.floor(Math.random() * 100) + 20

const detailsRoute = computed(() => ({
  name: 'ProductDetails',
  params: {
    category: props.product.categorySlug || 'geral',
    id: props.product.uuid || props.product.id,
  },
}))
</script>

<template>
  <article
    class="group flex flex-col h-full bg-surface rounded-2xl overflow-hidden border border-border-sutil shadow-md hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
    <!-- Image Container -->
    <RouterLink :to="detailsRoute"
      class="relative aspect-square bg-surface-hover overflow-hidden cursor-pointer">

      <!-- Image -->
      <img v-if="product.image" :src="product.image" :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />

      <!-- Elegant Placeholder -->
      <div v-else class="w-full h-full flex items-center justify-center bg-linear-to-br from-surface-hover to-surface">
        <div class="w-20 h-20 rounded-2xl bg-border-sutil/50 flex items-center justify-center">
          <svg class="w-10 h-10 text-text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <p v-if="product.variant" class="text-[11px] text-text-muted uppercase tracking-wider font-medium mb-1">
        {{ product.variant }}
      </p>

      <!-- Name -->
      <h3 class="text-sm font-semibold text-text-main mb-1.5 line-clamp-2 leading-snug">
        <RouterLink :to="detailsRoute"
          class="hover:text-primary-text transition-colors">
          {{ product.name }}
        </RouterLink>
      </h3>

      <!-- Rating -->
      <div class="flex items-center gap-1.5 mb-3">
        <div class="flex text-amber-400">
          <Star v-for="i in 5" :key="i" class="w-3.5 h-3.5"
            :class="i <= Math.floor(rating) ? 'fill-current' : 'fill-none opacity-40'" />
        </div>
        <span class="text-[11px] text-text-muted font-medium">({{ reviewCount }})</span>
      </div>

      <!-- Price -->
      <div class="flex items-center gap-2 mt-auto">
        <span class="text-lg font-bold text-text-main">
          ${{ product.price }}
        </span>
        <span v-if="product.originalPrice" class="text-sm text-text-muted line-through">
          ${{ product.originalPrice }}
        </span>
      </div>
    </div>

    <!-- CTA with Click Spark -->
    <div class="px-4 pb-4">
      <ClickSparkWrapper sparkColor="#2563eb" :sparkRadius="45" :sparkCount="10">
        <BaseButton variant="secondary" :to="detailsRoute"
          class="w-full justify-center py-3"
          size="md">
          Ver Detalhes
        </BaseButton>
      </ClickSparkWrapper>
    </div>
  </article>
</template>
