<script setup>
import { ArrowUpRight } from 'lucide-vue-next'

defineProps({
  kpi: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <article
    class="bg-[#F8F9FA] rounded-2xl p-4 sm:p-5 hover:bg-gray-100 transition-colors duration-300">
    <div class="flex flex-col gap-1.5">
      <div class="flex items-center justify-between">
        <span class="text-[13px] font-medium text-gray-400">{{ kpi.label }}</span>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-2xl md:text-[28px] font-semibold text-gray-900 tracking-tight leading-none">{{ kpi.value }}</p>
        <span v-if="kpi.trendUp"
          class="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50/80 px-1.5 py-0.5 rounded">
          <ArrowUpRight class="w-3 h-3" />
          {{ kpi.trend }}
        </span>
      </div>
    </div>
  </article>
</template>
