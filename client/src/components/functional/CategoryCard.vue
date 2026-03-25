<script setup>
import { computed } from 'vue'
import { ArrowRight } from 'lucide-vue-next'

const props = defineProps({
  category: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  }
})

// Formatação do número editorial com zero à esquerda
const formattedNumber = computed(() => {
  return `0${props.index + 1}`
})
</script>

<template>
  <a 
    href="#produtos"
    :class="[
      'bento-card group relative flex flex-col justify-between overflow-hidden rounded-4xl bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(59,130,246,0.12)] hover:-translate-y-1 hover:border-blue-200/50 transition-all duration-500',
      featured ? 'md:col-span-2 md:row-span-1 p-8 md:p-12' : 'col-span-1 p-8',
    ]"
  >
    <!-- Top Header: Número Editorial na Esquerda & Seta na Direita -->
    <div class="relative z-10 flex justify-between items-start">
        <!-- Número Editorial (Premium Monocromático Transparente) -->
        <div class="text-slate-900/10 group-hover:text-slate-900/20 font-black text-6xl md:text-7xl tracking-tighter leading-none transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-1 origin-top-left flex items-baseline drop-shadow-[0_1px_10px_rgba(255,255,255,1)] select-none mix-blend-multiply">
          {{ formattedNumber }}<span class="font-bold text-4xl md:text-5xl ml-1 text-slate-900/5">.</span>
        </div>
        
        <!-- Indicador de Navegação (Seta) -->
        <div class="w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-200 bg-white/50 backdrop-blur-md flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:bg-slate-50 transition-all duration-500 shadow-sm group-hover:shadow-md">
          <ArrowRight class="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
        </div>
    </div>

    <!-- Informações -> Base -->
    <div class="relative z-10 mt-auto pointer-events-none">
        <span class="inline-block px-3 py-1 bg-white/80 backdrop-blur-sm border border-slate-100 max-w-fit rounded-full text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-3 shadow-sm">
          {{ category.count }}
        </span>
        <h3 :class="['font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors duration-300', featured ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl']">
          {{ category.name }}
        </h3>
        <p :class="['text-slate-500 mt-2 line-clamp-2 transition-colors', featured ? 'text-base md:text-lg max-w-lg' : 'text-sm max-w-[90%]']">
          {{ category.desc }}
        </p>
    </div>
  </a>
</template>
