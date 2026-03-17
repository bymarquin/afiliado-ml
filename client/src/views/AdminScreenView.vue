<script setup>
import { ref, computed } from 'vue'
import { Menu, Plus } from 'lucide-vue-next'

// Componentes extraídos
import AdminSidebar from '@/components/layout/AdminSidebar.vue'
import PeriodFilter from '@/components/functional/PeriodFilter.vue'
import KPICard from '@/components/ui/KPICard.vue'
import ClicksChart from '@/components/functional/ClicksChart.vue'
import TopProductsTable from '@/components/functional/TopProductsTable.vue'
import RecentActivityList from '@/components/functional/RecentActivityList.vue'

// ── Saudação e Data ──
const currentHour = new Date().getHours()
const greeting = computed(() => {
  if (currentHour >= 5 && currentHour < 12) return 'Bom dia'
  if (currentHour >= 12 && currentHour < 18) return 'Boa tarde'
  return 'Boa noite'
})

const currentDate = computed(() => {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date())
})

// ── Estado do Layout ──
const isMobileMenuOpen = ref(false)
const activeItem = ref('home')
const selectedPeriod = ref('hoje')

function handleSidebarSelect(id) {
  activeItem.value = id
}

// ── Mock Data ──
const kpis = [
  {
    id: 'sales',
    label: 'Total em vendas',
    value: 'R$ 0,00',
    trend: '',
    trendUp: false
  },
  {
    id: 'transactions',
    label: 'Total de transações',
    value: '0',
    trend: '',
    trendUp: false
  },
  {
    id: 'ticket',
    label: 'Ticket Médio',
    value: 'R$ 0,00',
    trend: '',
    trendUp: false
  },
]

const chartData = [
  { day: 'Seg', clicks: 210 },
  { day: 'Ter', clicks: 285 },
  { day: 'Qua', clicks: 340 },
  { day: 'Qui', clicks: 195 },
  { day: 'Sex', clicks: 410 },
  { day: 'Sáb', clicks: 280 },
  { day: 'Dom', clicks: 127 },
]

const topProducts = [
  { id: 1, name: 'Fone Bluetooth QCY T13', category: 'Eletrônicos', clicks: 342, rating: 4.8 },
  { id: 2, name: 'Camiseta Dry Fit Nike', category: 'Moda', clicks: 289, rating: 4.6 },
  { id: 3, name: 'Relógio Smartwatch Xiaomi', category: 'Eletrônicos', clicks: 256, rating: 4.7 },
  { id: 4, name: 'Cadeira Gamer Thunder X3', category: 'Móveis', clicks: 198, rating: 4.5 },
  { id: 5, name: 'Kit Skincare Simple', category: 'Beleza', clicks: 165, rating: 4.3 },
]

const recentActivity = [
  { id: 1, action: 'Produto cadastrado', item: 'Fone Bluetooth QCY T13', time: 'Há 2 horas' },
  { id: 2, action: 'Categoria criada', item: 'Eletrônicos', time: 'Há 5 horas' },
  { id: 3, action: 'Produto editado', item: 'Camiseta Dry Fit Nike', time: 'Há 1 dia' },
  { id: 4, action: 'Produto cadastrado', item: 'Cadeira Gamer Thunder X3', time: 'Há 2 dias' },
  { id: 5, action: 'Categoria criada', item: 'Móveis', time: 'Há 3 dias' },
]
</script>

<template>
  <div class="h-screen bg-[#F4F5F7] flex overflow-hidden">
    <!-- Overlay mobile -->
    <Transition name="fade">
      <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-black/50 z-40 lg:hidden" @click="isMobileMenuOpen = false" />
    </Transition>

    <!-- ═══════════ SIDEBAR COMPONENT ═══════════ -->
    <AdminSidebar
      v-model:isMobileMenuOpen="isMobileMenuOpen"
      :activeItem="activeItem"
      @select-item="handleSidebarSelect"
    />

    <!-- ═══════════ CONTEÚDO PRINCIPAL ═══════════ -->
    <div class="flex-1 lg:ml-64 flex flex-col lg:py-6 lg:pr-6 h-screen">
      
      <!-- top bar mobile header wrapper (opcional) -->
      <header class="lg:hidden sticky top-0 z-30 bg-[#F4F5F7] border-b border-gray-200">
        <div class="flex items-center justify-between px-4 py-3">
          <button class="p-2 -ml-2 rounded-xl text-gray-800 hover:bg-gray-200 transition-colors" aria-label="Abrir menu"
            @click="isMobileMenuOpen = true">
            <Menu class="w-5 h-5" />
          </button>
          <span class="text-sm font-semibold text-gray-950">Painel Admin</span>
          <div class="w-9" />
        </div>
      </header>

      <!-- ──── Header Extracard (Fora da Aba) ──── -->
      <section class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 md:px-8 lg:px-10 py-6 lg:pt-0 lg:pb-6 shrink-0">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-950 tracking-tight flex items-center gap-2">
            {{ greeting }}, Sávio 👋
          </h1>
          <p class="mt-1 text-sm md:text-base text-gray-500 font-medium">
            {{ currentDate }}
          </p>
        </div>
        <div class="flex items-center gap-4 shrink-0">
          <button
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark shadow-md shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 active:scale-95">
            <Plus class="w-4 h-4" />
            Novo Produto
          </button>
        </div>
      </section>

      <!-- Aba Aberta (Cartão Principal Branco) -->
      <div class="flex-1 bg-white lg:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:ring-1 ring-gray-100/50 flex flex-col overflow-hidden">
        <!-- Área de conteúdo interna da Aba Branca -->
        <main class="flex-1 p-5 md:p-8 lg:p-10 w-full overflow-y-auto">

        <!-- ──── Filtros de Período ──── -->
        <section class="mb-5">
           <PeriodFilter v-model="selectedPeriod" />
        </section>

        <!-- ──── KPI Cards ──── -->
        <section class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
          <KPICard v-for="kpi in kpis" :key="kpi.id" :kpi="kpi" />
        </section>

        <!-- ──── Clicks Chart ──── -->
        <section class="mb-8">
          <ClicksChart :data="chartData" totalClicks="1.847" />
        </section>

        <!-- ──── Top Produtos + Atividade Recente ──── -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
          <TopProductsTable :products="topProducts" />
          <RecentActivityList :activities="recentActivity" />
        </section>

        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
