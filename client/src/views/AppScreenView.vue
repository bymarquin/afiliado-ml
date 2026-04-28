<script setup>
import { onMounted, ref, watch } from 'vue'
import { LineChart, Plus } from 'lucide-vue-next'
import http from '@/services/http'

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
const kpis = ref([
  {
    id: 'products',
    label: 'Total de produtos',
    value: '0',
    trend: '',
    trendUp: false,
  },
  {
    id: 'categories',
    label: 'Total de categorias',
    value: '0',
    trend: '',
    trendUp: false,
  },
  {
    id: 'clicks',
    label: 'Total de clicks',
    value: '0',
    trend: '',
    trendUp: false,
  },
])

const chartData = ref([
  { day: 'Seg', clicks: 0 },
  { day: 'Ter', clicks: 0 },
  { day: 'Qua', clicks: 0 },
  { day: 'Qui', clicks: 0 },
  { day: 'Sex', clicks: 0 },
  { day: 'Sáb', clicks: 0 },
  { day: 'Dom', clicks: 0 },
])

const topProducts = ref([])
const recentActivity = ref([])
const totalClicksFormatted = ref('0')

function formatInt(value) {
  return Number(value || 0).toLocaleString('pt-BR')
}

// Utilitário para formatar tempo relativo (Ex: "Há 2 horas")
function getRelativeTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return 'Agora mesmo'
  if (diffInSeconds < 3600) return `Há ${Math.floor(diffInSeconds / 60)} min`
  if (diffInSeconds < 86400) return `Há ${Math.floor(diffInSeconds / 3600)} horas`
  return `Há ${Math.floor(diffInSeconds / 86400)} dias`
}

async function loadDashboardData() {
  try {
    const { data } = await http.get('/dashboard', {
      params: { period: selectedPeriod.value },
    })

    if (!data?.data) {
      throw new Error('Resposta inválida do endpoint /dashboard')
    }

    const stats = data.data

    kpis.value = kpis.value.map((kpi) => {
      if (kpi.id === 'products') return { ...kpi, value: formatInt(stats.kpis?.products) }
      if (kpi.id === 'categories') return { ...kpi, value: formatInt(stats.kpis?.categories) }
      if (kpi.id === 'clicks') return { ...kpi, value: formatInt(stats.kpis?.clicks) }
      return kpi
    })

    topProducts.value = (stats.topProducts || []).map((product) => ({
      id: product.id,
      name: product.title,
      category: product.categories?.[0]?.name || 'Sem categoria',
      clicks: Number(product.click_count || 0),
      rating: Number(product.rating || 0),
    }))

    recentActivity.value = (stats.recentActivity || []).map((activity) => ({
      ...activity,
      time: getRelativeTime(activity.time),
    }))

    if (Array.isArray(stats.chartData) && stats.chartData.length > 0) {
      chartData.value = stats.chartData
    }

    totalClicksFormatted.value = formatInt(stats.kpis?.clicks)
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error?.message || error)
  }
}

watch(selectedPeriod, () => {
  loadDashboardData()
})

onMounted(loadDashboardData)
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
      <LineChart class="w-7 h-7 text-gray-950 dark:text-neutral-100" :stroke-width="2.25" />
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
      <ClicksChart :data="chartData" :totalClicks="totalClicksFormatted" />
    </section>

    <!-- ──── Top Produtos + Atividade Recente ──── -->
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
      <TopProductsTable :products="topProducts" />
      <RecentActivityList :activities="recentActivity" />
    </section>
  </AdminLayout>
</template>



