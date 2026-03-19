<script setup>
defineProps({
  modelValue: {
    type: String,
    default: 'hoje'
  }
})

const emit = defineEmits(['update:modelValue'])

const periods = [
  { id: 'hoje', label: 'Hoje' },
  { id: 'este-mes', label: 'Esse mês' },
  { id: 'ultimos-30', label: 'Últimos 30 dias' },
  { id: 'ultimos-90', label: 'Últimos 90 dias' },
  { id: 'todo-periodo', label: 'Todo o período' },
  { id: 'personalizado', label: 'Personalizado' },
]

function selectPeriod(id) {
  emit('update:modelValue', id)
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <button
      v-for="period in periods"
      :key="period.id"
      @click="selectPeriod(period.id)"
      :class="[
        'px-4 py-1.5 rounded-xl text-[13px] font-semibold transition-all duration-200',
        modelValue === period.id 
          ? 'bg-primary text-white shadow-sm shadow-primary/20' 
          : 'bg-white dark:bg-neutral-900 text-gray-600 dark:text-neutral-300 border border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-neutral-100'
      ]"
    >
      {{ period.label }}
    </button>
  </div>
</template>
