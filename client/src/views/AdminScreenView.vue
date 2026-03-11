<script setup>
import { ref, computed } from 'vue'
import {
  Home, Package, Tag, Menu, X, LogOut,
  MousePointerClick, TrendingUp, AlertTriangle,
  Plus, Clock, Star, ExternalLink, ArrowUpRight
} from 'lucide-vue-next'

// ── Sidebar ──
const isMobileMenuOpen = ref(false)

const menuItems = [
  { id: 'home', label: 'Área de Início', icon: Home },
  { id: 'products', label: 'Cadastro de Produtos', icon: Package },
  { id: 'categories', label: 'Cadastro de Categorias', icon: Tag },
]

const activeItem = ref('home')

function selectItem(id) {
  activeItem.value = id
  isMobileMenuOpen.value = false
}

// ── Mock Data: KPIs ──
const kpis = [
  {
    id: 'products',
    label: 'Produtos',
    description: 'Cadastrados no sistema',
    value: 24,
    icon: Package,
    trend: '+3 esta semana',
    trendUp: true,
  },
  {
    id: 'categories',
    label: 'Categorias',
    description: 'Cadastradas no sistema',
    value: 6,
    icon: Tag,
    trend: '+1 esta semana',
    trendUp: true,
  },
  {
    id: 'clicks',
    label: 'Cliques',
    description: 'Links de afiliado',
    value: 1847,
    icon: MousePointerClick,
    trend: '+12% vs semana anterior',
    trendUp: true,
  },
  {
    id: 'conversion',
    label: 'Taxa de Conversão',
    description: 'Cliques / Visitas',
    value: '3.2%',
    icon: TrendingUp,
    trend: '+0.4% vs semana anterior',
    trendUp: true,
  },
]

// ── Mock Data: Gráfico de Cliques (últimos 7 dias) ──
const chartData = [
  { day: 'Seg', clicks: 210 },
  { day: 'Ter', clicks: 285 },
  { day: 'Qua', clicks: 340 },
  { day: 'Qui', clicks: 195 },
  { day: 'Sex', clicks: 410 },
  { day: 'Sáb', clicks: 280 },
  { day: 'Dom', clicks: 127 },
]

const maxClicks = computed(() => Math.max(...chartData.map(d => d.clicks)))

function barHeight(clicks) {
  return `${(clicks / maxClicks.value) * 100}%`
}

// ── Mock Data: Top 5 Produtos ──
const topProducts = [
  { id: 1, name: 'Fone Bluetooth QCY T13', category: 'Eletrônicos', clicks: 342, rating: 4.8 },
  { id: 2, name: 'Camiseta Dry Fit Nike', category: 'Moda', clicks: 289, rating: 4.6 },
  { id: 3, name: 'Relógio Smartwatch Xiaomi', category: 'Eletrônicos', clicks: 256, rating: 4.7 },
  { id: 4, name: 'Cadeira Gamer Thunder X3', category: 'Móveis', clicks: 198, rating: 4.5 },
  { id: 5, name: 'Kit Skincare Simple', category: 'Beleza', clicks: 165, rating: 4.3 },
]


// ── Mock Data: Atividade Recente ──
const recentActivity = [
  { id: 1, action: 'Produto cadastrado', item: 'Fone Bluetooth QCY T13', time: 'Há 2 horas' },
  { id: 2, action: 'Categoria criada', item: 'Eletrônicos', time: 'Há 5 horas' },
  { id: 3, action: 'Produto editado', item: 'Camiseta Dry Fit Nike', time: 'Há 1 dia' },
  { id: 4, action: 'Produto cadastrado', item: 'Cadeira Gamer Thunder X3', time: 'Há 2 dias' },
  { id: 5, action: 'Categoria criada', item: 'Móveis', time: 'Há 3 dias' },
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Overlay mobile -->
    <Transition name="fade">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden"
        @click="isMobileMenuOpen = false"
      />
    </Transition>

    <!-- ═══════════ SIDEBAR ═══════════ -->
    <aside
      :class="[
        'fixed top-0 left-0 z-50 h-screen w-64 bg-gray-950 flex flex-col transition-transform duration-300 ease-in-out',
        'lg:translate-x-0',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Logo / Branding -->
      <div class="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div class="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
          <span class="text-white font-bold text-sm">AF</span>
        </div>
        <div>
          <h2 class="text-white font-semibold text-sm tracking-tight">Afiliado ML</h2>
          <span class="text-gray-400 text-xs">Painel Admin</span>
        </div>
        <button
          class="ml-auto lg:hidden text-gray-400 hover:text-white transition-colors"
          aria-label="Fechar menu"
          @click="isMobileMenuOpen = false"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Navegação -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <button
          v-for="item in menuItems"
          :key="item.id"
          :class="[
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
            activeItem === item.id
              ? 'bg-primary text-white shadow-lg shadow-primary/25'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          ]"
          @click="selectItem(item.id)"
        >
          <component
            :is="item.icon"
            :class="[
              'w-5 h-5 shrink-0 transition-colors duration-200',
              activeItem === item.id ? 'text-white' : 'text-gray-500'
            ]"
          />
          {{ item.label }}
        </button>
      </nav>

      <!-- Footer sidebar -->
      <div class="px-3 py-4 border-t border-white/10">
        <button
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200"
          aria-label="Sair do painel"
        >
          <LogOut class="w-5 h-5 shrink-0" />
          Sair
        </button>
      </div>
    </aside>

    <!-- ═══════════ CONTEÚDO PRINCIPAL ═══════════ -->
    <div class="flex-1 lg:ml-64 min-h-screen flex flex-col">
      <!-- Top bar mobile -->
      <header class="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div class="flex items-center justify-between px-4 py-3">
          <button
            class="p-2 -ml-2 rounded-xl text-gray-800 hover:bg-gray-50 transition-colors"
            aria-label="Abrir menu"
            @click="isMobileMenuOpen = true"
          >
            <Menu class="w-5 h-5" />
          </button>
          <span class="text-sm font-semibold text-gray-950">Painel Admin</span>
          <div class="w-9" />
        </div>
      </header>

      <!-- Área de conteúdo -->
      <main class="flex-1 p-4 md:p-6 lg:p-8">

        <!-- ──── Header + Ações Rápidas ──── -->
        <section class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-gray-950 tracking-tight">
              Bem-vindo ao Painel 👋
            </h1>
            <p class="mt-1 text-sm md:text-base text-gray-400">
              Gerencie seus produtos, categorias e acompanhe o desempenho.
            </p>
          </div>
          <div class="flex gap-2 shrink-0">
            <button class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark shadow-lg shadow-primary/25 transition-all duration-200 hover:scale-[1.02] active:scale-95">
              <Plus class="w-4 h-4" />
              Novo Produto
            </button>
            <button class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-gray-800 text-sm font-medium border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-[1.02] active:scale-95">
              <Plus class="w-4 h-4" />
              Nova Categoria
            </button>
          </div>
        </section>

        <!-- ──── KPI Cards ──── -->
        <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 mb-8">
          <article
            v-for="kpi in kpis"
            :key="kpi.id"
            class="group bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl hover:border-gray-200 hover:-translate-y-1 transition-all duration-300"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-shadow duration-300">
                <component :is="kpi.icon" class="w-5 h-5 text-blue-600" />
              </div>
              <span
                v-if="kpi.trendUp"
                class="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"
              >
                <ArrowUpRight class="w-3 h-3" />
                {{ kpi.trend }}
              </span>
            </div>
            <p class="text-2xl md:text-3xl font-bold text-gray-950 mb-0.5">{{ kpi.value }}</p>
            <p class="text-xs text-gray-400">{{ kpi.description }}</p>
          </article>
        </section>

        <!-- ──── Gráfico de Cliques ──── -->
        <section class="mb-8">

          <!-- Gráfico -->
          <article class="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-base font-semibold text-gray-950">Cliques nos Links</h3>
                <p class="text-xs text-gray-400 mt-0.5">Últimos 7 dias</p>
              </div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
                <MousePointerClick class="w-3.5 h-3.5 text-blue-600" />
                <span class="text-xs font-bold text-blue-600">1.847 total</span>
              </span>
            </div>

            <!-- Bar Chart CSS -->
            <div class="flex items-end justify-between gap-2 sm:gap-3 h-44 md:h-52">
              <div
                v-for="bar in chartData"
                :key="bar.day"
                class="flex-1 flex flex-col items-center gap-2"
              >
                <span class="text-xs font-semibold text-gray-950">{{ bar.clicks }}</span>
                <div class="w-full relative rounded-t-lg overflow-hidden" :style="{ height: barHeight(bar.clicks) }">
                  <div class="absolute inset-0 bg-linear-to-t from-primary to-blue-400 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div class="absolute inset-0 bg-linear-to-t from-primary to-blue-400 opacity-90 rounded-t-lg" />
                </div>
                <span class="text-xs font-medium text-gray-400">{{ bar.day }}</span>
              </div>
            </div>
          </article>
        </section>

        <!-- ──── Top Produtos + Atividade Recente ──── -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">

          <!-- Top 5 Produtos -->
          <article class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
            <div class="flex items-center justify-between mb-5">
              <div>
                <h3 class="text-base font-semibold text-gray-950">Produtos Mais Clicados</h3>
                <p class="text-xs text-gray-400 mt-0.5">Top 5 por cliques em links de afiliado</p>
              </div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
                <TrendingUp class="w-3.5 h-3.5 text-blue-600" />
                <span class="text-xs font-bold text-blue-600">Ranking</span>
              </span>
            </div>

            <!-- Tabela -->
            <div class="overflow-x-auto -mx-5 md:-mx-6">
              <table class="w-full min-w-[480px]">
                <thead>
                  <tr class="border-b border-gray-100">
                    <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pl-5 md:pl-6">#</th>
                    <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">Produto</th>
                    <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">Categoria</th>
                    <th class="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">Rating</th>
                    <th class="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-5 md:pr-6">Cliques</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(product, index) in topProducts"
                    :key="product.id"
                    class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td class="py-3.5 pl-5 md:pl-6">
                      <span
                        :class="[
                          'inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold',
                          index === 0 ? 'bg-amber-100 text-amber-700' :
                          index === 1 ? 'bg-gray-200 text-gray-600' :
                          index === 2 ? 'bg-orange-100 text-orange-600' :
                          'bg-gray-100 text-gray-400'
                        ]"
                      >
                        {{ index + 1 }}
                      </span>
                    </td>
                    <td class="py-3.5">
                      <div class="flex items-center gap-2">
                        <span class="text-sm font-medium text-gray-950">{{ product.name }}</span>
                        <ExternalLink class="w-3.5 h-3.5 text-gray-300" />
                      </div>
                    </td>
                    <td class="py-3.5">
                      <span class="inline-flex px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                        {{ product.category }}
                      </span>
                    </td>
                    <td class="py-3.5 text-right">
                      <span class="inline-flex items-center gap-1 text-sm text-gray-800">
                        <Star class="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        {{ product.rating }}
                      </span>
                    </td>
                    <td class="py-3.5 pr-5 md:pr-6 text-right">
                      <span class="text-sm font-bold text-gray-950">{{ product.clicks }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          <!-- Atividade Recente -->
          <article class="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
            <div class="flex items-center justify-between mb-5">
              <div>
                <h3 class="text-base font-semibold text-gray-950">Atividade Recente</h3>
                <p class="text-xs text-gray-400 mt-0.5">Últimas ações no sistema</p>
              </div>
              <Clock class="w-4 h-4 text-gray-300" />
            </div>

            <div class="space-y-0">
              <div
                v-for="(activity, index) in recentActivity"
                :key="activity.id"
                class="flex gap-3 py-3"
                :class="{ 'border-b border-gray-50': index < recentActivity.length - 1 }"
              >
                <!-- Ícone do tipo de ação -->
                <div class="shrink-0 mt-0.5">
                  <div
                    :class="[
                      'w-8 h-8 rounded-lg flex items-center justify-center',
                      activity.action.includes('cadastrado') ? 'bg-emerald-50' :
                      activity.action.includes('criada') ? 'bg-blue-50' :
                      'bg-amber-50'
                    ]"
                  >
                    <component
                      :is="activity.action.includes('cadastrado') ? Package :
                            activity.action.includes('criada') ? Tag :
                            AlertTriangle"
                      :class="[
                        'w-4 h-4',
                        activity.action.includes('cadastrado') ? 'text-emerald-600' :
                        activity.action.includes('criada') ? 'text-blue-600' :
                        'text-amber-600'
                      ]"
                    />
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
        </section>

      </main>
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
