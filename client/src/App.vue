<script setup>
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useDark } from '@vueuse/core'

const route = useRoute()
const hideLayout = computed(() => route.meta?.hideLayout === true)

const isDark = useDark()
</script>

<template>
  <div
    :class="{ dark: isDark }"
    class="min-h-screen bg-white dark:bg-neutral-950 text-gray-950 dark:text-neutral-100 flex flex-col transition-colors duration-300"
  >
    <AppHeader v-if="!hideLayout" />
    <main class="flex-1">
      <RouterView />
    </main>
    <AppFooter v-if="!hideLayout" />
  </div>
</template>
