<script setup>
/**
 * BaseContainer - Container centralizado com max-width
 * Usado para manter o conteúdo dentro de uma largura máxima consistente
 */

defineProps({
  as: {
    type: String,
    default: 'div'
  }
})
</script>

<template>
  <component :is="as" class="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
    <slot />
  </component>
</template>
