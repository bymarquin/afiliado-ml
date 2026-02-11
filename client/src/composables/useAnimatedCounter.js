/**
 * useAnimatedCounter - Composable para animar contadores numéricos
 * Adaptado ao padrão vue-bits
 *
 * Uso:
 * const { count, elementRef } = useAnimatedCounter(1000, { duration: 2000, easing: 'ease-out' })
 */

import { ref, onMounted, onUnmounted } from 'vue'

/**
 * @typedef {Object} CounterOptions
 * @property {number} [duration=2000] - Duração da animação em ms
 * @property {number} [startValue=0] - Valor inicial
 * @property {'linear'|'ease-in'|'ease-out'|'ease-in-out'} [easing='ease-out'] - Tipo de easing
 * @property {number} [threshold=0.5] - Threshold do IntersectionObserver
 * @property {string} [prefix=''] - Prefixo (ex: 'R$')
 * @property {string} [suffix=''] - Sufixo (ex: '+', '%')
 * @property {number} [decimals=0] - Número de casas decimais
 * @property {string} [separator='.'] - Separador de milhares
 */

/**
 * Hook para animar contadores numéricos com trigger no scroll
 * @param {number} targetValue - Valor final do contador
 * @param {CounterOptions} options - Opções de configuração
 */
export function useAnimatedCounter(targetValue, options = {}) {
    const {
        duration = 2000,
        startValue = 0,
        easing = 'ease-out',
        threshold = 0.5,
        prefix = '',
        suffix = '',
        decimals = 0,
        separator = '.'
    } = options

    const count = ref(startValue)
    const formattedCount = ref(formatNumber(startValue))
    const elementRef = ref(null)
    const hasAnimated = ref(false)
    let observer = null
    let animationFrame = null

    // Funções de easing
    const easeFn = (t) => {
        switch (easing) {
            case 'linear':
                return t
            case 'ease-in':
                return t * t * t
            case 'ease-in-out':
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
            default: // ease-out
                return 1 - Math.pow(1 - t, 3)
        }
    }

    // Formatar número com separador de milhares
    function formatNumber(value) {
        const fixed = value.toFixed(decimals)
        const [intPart, decPart] = fixed.split('.')

        // Adicionar separador de milhares
        const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator)

        const result = decPart ? `${formatted},${decPart}` : formatted
        return `${prefix}${result}${suffix}`
    }

    const animateValue = () => {
        if (hasAnimated.value) return
        hasAnimated.value = true

        const startTime = performance.now()

        const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = easeFn(progress)

            const currentValue = startValue + (targetValue - startValue) * eased
            count.value = decimals > 0 ? currentValue : Math.floor(currentValue)
            formattedCount.value = formatNumber(count.value)

            if (progress < 1) {
                animationFrame = requestAnimationFrame(updateCount)
            } else {
                count.value = targetValue
                formattedCount.value = formatNumber(targetValue)
            }
        }

        animationFrame = requestAnimationFrame(updateCount)
    }

    // Reset para poder animar novamente
    const reset = () => {
        hasAnimated.value = false
        count.value = startValue
        formattedCount.value = formatNumber(startValue)
    }

    onMounted(() => {
        if (!elementRef.value) return

        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated.value) {
                        animateValue()
                    }
                })
            },
            { threshold }
        )

        observer.observe(elementRef.value)
    })

    onUnmounted(() => {
        observer?.disconnect()
        if (animationFrame) {
            cancelAnimationFrame(animationFrame)
        }
    })

    return {
        count,
        formattedCount,
        elementRef,
        reset,
        hasAnimated
    }
}
