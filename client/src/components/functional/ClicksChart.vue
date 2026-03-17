<script setup>
import { computed } from 'vue'
import { MousePointerClick } from 'lucide-vue-next'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  totalClicks: {
    type: String,
    default: '0'
  }
})

const maxClicks = computed(() => {
  if (!props.data || props.data.length === 0) return 1
  return Math.max(...props.data.map(d => d.clicks))
})

function barHeight(clicks) {
  return `${(clicks / maxClicks.value) * 100}%`
}
</script>

<template>
  <article class="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h3 class="text-base font-semibold text-gray-950">Cliques nos Links</h3>
        <p class="text-xs text-gray-400 mt-0.5">Últimos 7 dias</p>
      </div>
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
        <MousePointerClick class="w-3.5 h-3.5 text-blue-600" />
        <span class="text-xs font-bold text-blue-600">{{ totalClicks }} total</span>
      </span>
    </div>

    <!-- Bar Chart CSS -->
    <div class="flex items-end justify-between gap-2 sm:gap-3 h-44 md:h-52 group/chart">
      <div v-for="bar in data" :key="bar.day" class="flex-1 flex flex-col items-center gap-2 group/bar relative">
        <!-- Tooltip hover -->
        <div
          class="absolute -top-10 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-gray-900 text-white text-xs font-semibold py-1 px-2.5 rounded-lg pointer-events-none z-10 whitespace-nowrap hidden sm:block">
          {{ bar.clicks }} cliques
        </div>
        <!-- Valor no mobile / Fallback -->
        <span class="text-xs font-semibold text-gray-950 sm:invisible group-hover/bar:visible">{{ bar.clicks }}</span>

        <div
          class="w-full relative rounded-t-lg overflow-hidden transition-all duration-300 group-hover/chart:opacity-50 group-hover/bar:opacity-100! group-hover/bar:-translate-y-1"
          :style="{ height: barHeight(bar.clicks) }">
          <div class="absolute inset-0 bg-linear-to-t from-primary to-blue-400" />
        </div>
        <span class="text-xs font-medium text-gray-400 group-hover/bar:text-gray-950 transition-colors">{{ bar.day }}</span>
      </div>
    </div>
  </article>
</template>
