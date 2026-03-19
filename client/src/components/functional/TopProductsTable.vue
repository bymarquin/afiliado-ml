<script setup>
import { TrendingUp, ExternalLink, Star } from 'lucide-vue-next'

 defineProps({
  products: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <article class="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 p-5 md:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] hover:shadow-sm transition-shadow duration-300">
    <div class="flex items-center justify-between mb-5">
      <div>
        <h3 class="text-base font-semibold text-gray-950 dark:text-neutral-100">Produtos Mais Clicados</h3>
        <p class="text-xs text-gray-400 dark:text-neutral-400 mt-0.5">Top 5 por cliques em links de afiliado</p>
      </div>
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/15 border border-blue-100 dark:border-blue-500/30">
        <TrendingUp class="w-3.5 h-3.5 text-blue-600 dark:text-blue-300" />
        <span class="text-xs font-bold text-blue-600 dark:text-blue-300">Ranking</span>
      </span>
    </div>

    <!-- Tabela -->
    <div class="overflow-x-auto -mx-5 md:-mx-6">
      <table class="w-full min-w-480px">
        <thead>
          <tr class="border-b border-gray-100 dark:border-neutral-800">
            <th class="text-left text-xs font-semibold text-gray-400 dark:text-neutral-400 uppercase tracking-wider pb-3 pl-5 md:pl-6">#</th>
            <th class="text-left text-xs font-semibold text-gray-400 dark:text-neutral-400 uppercase tracking-wider pb-3">Produto</th>
            <th class="text-left text-xs font-semibold text-gray-400 dark:text-neutral-400 uppercase tracking-wider pb-3">Categoria</th>
            <th class="text-right text-xs font-semibold text-gray-400 dark:text-neutral-400 uppercase tracking-wider pb-3">Rating</th>
            <th class="text-right text-xs font-semibold text-gray-400 dark:text-neutral-400 uppercase tracking-wider pb-3 pr-5 md:pr-6">Cliques</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="product.id"
            class="border-b border-gray-50 dark:border-neutral-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-neutral-800/60 transition-colors group">
            <td class="py-3.5 pl-5 md:pl-6">
              <span :class="[
                'inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold',
                index === 0 ? 'bg-linear-to-br from-yellow-300 to-yellow-500 text-white shadow-sm' :
                  index === 1 ? 'bg-linear-to-br from-gray-300 to-gray-400 text-white shadow-sm' :
                    index === 2 ? 'bg-linear-to-br from-amber-600 to-amber-700 text-white shadow-sm' :
                      'bg-gray-100 text-gray-400'
              ]">
                {{ index + 1 }}
              </span>
            </td>
            <td class="py-3.5">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-gray-950 dark:text-neutral-100 group-hover:text-primary transition-colors">{{ product.name }}</span>
                <ExternalLink class="w-3.5 h-3.5 text-gray-300 dark:text-neutral-500 group-hover:text-primary transition-colors" />
              </div>
            </td>
            <td class="py-3.5">
              <span class="inline-flex px-2 py-0.5 rounded-md bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 text-xs font-medium text-gray-700 dark:text-neutral-200">
                {{ product.category }}
              </span>
            </td>
            <td class="py-3.5 text-right">
              <span class="inline-flex items-center gap-1 text-sm text-gray-800 dark:text-neutral-200">
                <Star class="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 drop-shadow-sm" />
                {{ product.rating }}
              </span>
            </td>
            <td class="py-3.5 pr-5 md:pr-6 text-right">
              <span class="text-sm font-bold text-gray-950 dark:text-neutral-100">{{ product.clicks }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
</template>
