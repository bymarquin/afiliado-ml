<script setup>
import { Clock, Package, Tag, AlertTriangle } from 'lucide-vue-next'

defineProps({
  activities: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <article class="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] hover:shadow-sm transition-shadow duration-300">
    <div class="flex items-center justify-between mb-5">
      <div>
        <h3 class="text-base font-semibold text-gray-950">Atividade Recente</h3>
        <p class="text-xs text-gray-400 mt-0.5">Últimas ações no sistema</p>
      </div>
      <Clock class="w-4 h-4 text-gray-300" />
    </div>

    <div class="space-y-0">
      <div v-for="(activity, index) in activities" :key="activity.id" class="flex gap-3 py-3"
        :class="{ 'border-b border-gray-50': index < activities.length - 1 }">
        <!-- Ícone do tipo de ação -->
        <div class="shrink-0 mt-0.5">
          <div :class="[
            'w-8 h-8 rounded-lg flex items-center justify-center',
            activity.action.includes('cadastrado') ? 'bg-emerald-50' :
              activity.action.includes('criada') ? 'bg-blue-50' :
                'bg-amber-50'
          ]">
            <component :is="activity.action.includes('cadastrado') ? Package :
              activity.action.includes('criada') ? Tag :
                AlertTriangle" :class="[
                      'w-4 h-4',
                      activity.action.includes('cadastrado') ? 'text-emerald-600' :
                        activity.action.includes('criada') ? 'text-blue-600' :
                          'text-amber-600'
                    ]" />
          </div>
        </div>
        <!-- Info -->
        <div class="min-w-0 flex-1">
          <p class="text-sm text-gray-950 font-medium truncate">{{ activity.action }}</p>
          <p class="text-xs text-gray-400 truncate">{{ activity.item }}</p>
        </div>
        <span class="text-xs text-gray-300 whitespace-nowrap shrink-0">{{ activity.time }}</span>
      </div>
    </div>
  </article>
</template>
