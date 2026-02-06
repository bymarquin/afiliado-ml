<script setup>
/**
 * ClickSparkWrapper - Componente wrapper para aplicar efeito de fagulhas
 * Envolva qualquer elemento com este componente para adicionar o efeito
 *
 * Uso:
 * <ClickSparkWrapper sparkColor="#3b82f6">
 *   <button>Clique aqui</button>
 * </ClickSparkWrapper>
 */

import { useClickSpark } from '@/composables/useClickSpark'

const props = defineProps({
    sparkColor: {
        type: String,
        default: '#3b82f6'
    },
    sparkSize: {
        type: Number,
        default: 10
    },
    sparkRadius: {
        type: Number,
        default: 35
    },
    sparkCount: {
        type: Number,
        default: 8
    },
    duration: {
        type: Number,
        default: 400
    }
})

const { containerRef, canvasRef, onClick } = useClickSpark({
    sparkColor: props.sparkColor,
    sparkSize: props.sparkSize,
    sparkRadius: props.sparkRadius,
    sparkCount: props.sparkCount,
    duration: props.duration
})
</script>

<template>
    <div ref="containerRef" class="relative w-full h-full" @click="onClick">
        <canvas ref="canvasRef" class="absolute inset-0 pointer-events-none z-50" />
        <slot />
    </div>
</template>
