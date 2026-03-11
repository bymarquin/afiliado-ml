<script setup>
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const route = useRoute()
const hideLayout = computed(() => route.meta?.hideLayout === true)
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <AppHeader v-if="!hideLayout" />
    <main class="flex-1">
      <RouterView />
    </main>
    <AppFooter v-if="!hideLayout" />
  </div>
</template>
