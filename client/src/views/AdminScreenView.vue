<script setup>
import { ref } from 'vue'
import { LineChart, Plus } from 'lucide-vue-next'

// Componentes extraídos
import AdminLayout from '@/components/layout/AdminLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import PeriodFilter from '@/components/functional/PeriodFilter.vue'
import KPICard from '@/components/ui/KPICard.vue'
import ClicksChart from '@/components/functional/ClicksChart.vue'
import TopProductsTable from '@/components/functional/TopProductsTable.vue'
import RecentActivityList from '@/components/functional/RecentActivityList.vue'

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
  <AdminLayout
    title="Dashboard"
    mobileTitle="Painel Admin"
    :isMobileMenuOpen="isMobileMenuOpen"
    :activeItem="activeItem"
    @update:isMobileMenuOpen="isMobileMenuOpen = $event"
    @select-item="handleSidebarSelect"
  >
    <template #title-icon>
      <LineChart class="w-7 h-7 text-gray-950" :stroke-width="2.25" />
    </template>

    <template #header-actions>
      <div class="hidden min-[601px]:block">
        <BaseButton variant="primary" size="sm" class="gap-2">
          <Plus class="w-4 h-4" />
          Novo Produto
        </BaseButton>
      </div>
    </template>

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
  </AdminLayout>
</template>
