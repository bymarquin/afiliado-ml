<script setup>
import { onMounted, ref } from 'vue'
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

const chartData = ref([])
const chartTotalClicks = ref('0')

const topProducts = ref([])

const recentActivity = [
  { id: 1, action: 'Produto cadastrado', item: 'Fone Bluetooth QCY T13', time: 'Há 2 horas' },
  { id: 2, action: 'Categoria criada', item: 'Eletrônicos', time: 'Há 5 horas' },
  { id: 3, action: 'Produto editado', item: 'Camiseta Dry Fit Nike', time: 'Há 1 dia' },
  { id: 4, action: 'Produto cadastrado', item: 'Cadeira Gamer Thunder X3', time: 'Há 2 dias' },
  { id: 5, action: 'Categoria criada', item: 'Móveis', time: 'Há 3 dias' },
]

function formatInt(value) {
  return Number(value || 0).toLocaleString('pt-BR')
}

async function fetchTotalClicks() {
  let page = 1
  let totalPages = 1
  let totalClicks = 0
  const limit = 100
  let safeGuard = 0

  while (page <= totalPages && safeGuard < 100) {
    const { data } = await http.get('/produtos', {
      params: { page, limit, order: 'id', direction: 'ASC' },
    })

    const rows = data?.data || []
    totalPages = data?.pagination?.totalPages || 1
    totalClicks += rows.reduce((acc, product) => acc + Number(product.click_count || 0), 0)
    page += 1
    safeGuard += 1
  }

  return totalClicks
}

async function loadDashboardData() {
  try {
    const [productsResponse, categoriesResponse, topProductsResponse, clicksResponse] = await Promise.all([
      http.get('/produtos', { params: { page: 1, limit: 1 } }),
      http.get('/categorias'),
      http.get('/produtos', {
        params: { page: 1, limit: 5, order: 'click_count', direction: 'DESC' },
      }),
      http.get('/dashboard/clicks'),
    ])

    const totalProducts = productsResponse?.data?.pagination?.total || 0
    const totalCategories = Array.isArray(categoriesResponse?.data?.data)
      ? categoriesResponse.data.data.length
      : 0
    const totalClicks = await fetchTotalClicks()

    kpis.value = kpis.value.map((kpi) => {
      if (kpi.id === 'products') return { ...kpi, value: formatInt(totalProducts) }
      if (kpi.id === 'categories') return { ...kpi, value: formatInt(totalCategories) }
      if (kpi.id === 'clicks') return { ...kpi, value: formatInt(totalClicks) }
      return kpi
    })

    const rows = topProductsResponse?.data?.data || []
    topProducts.value = rows.map((product) => ({
      id: product.id,
      name: product.title,
      category: product.categories?.[0]?.name || 'Sem categoria',
      clicks: Number(product.click_count || 0),
      rating: Number(product.rating || 0),
    }))

    // Alimenta o gráfico com dados reais
    chartData.value = clicksResponse?.data?.data || []
    chartTotalClicks.value = formatInt(clicksResponse?.data?.totalClicks || 0)
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error?.message || error)
  }
}

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
      <ClicksChart :data="chartData" :totalClicks="chartTotalClicks" />
    </section>

    <!-- ──── Top Produtos + Atividade Recente ──── -->
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
      <TopProductsTable :products="topProducts" />
      <RecentActivityList :activities="recentActivity" />
    </section>
  </AdminLayout>
</template>
