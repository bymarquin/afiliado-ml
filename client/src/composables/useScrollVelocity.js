/**
 * useScrollVelocity - Composable para animação de marquee com velocidade de scroll
 * Baseado no vue-bits ScrollVelocity component
 *
 * Uso:
 * const { start, stop, setVelocity } = useScrollVelocity(row1Ref, {
 *   baseVelocity: 50,
 *   direction: 'left'
 * })
 */

import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * @typedef {Object} ScrollVelocityOptions
 * @property {number} [baseVelocity=50] - Velocidade base em pixels por segundo
 * @property {'left'|'right'} [direction='left'] - Direção do movimento
 * @property {number} [damping=50] - Amortecimento (maior = desacelera mais rápido)
 * @property {number} [stiffness=400] - Rigidez (maior = responde mais rápido ao scroll)
 * @property {number} [maxVelocityFactor=3] - Multiplicador máximo de velocidade
 * @property {string} [triggerSelector=null] - Seletor CSS do trigger para o ScrollTrigger
 */

/**
 * Hook para criar animação de marquee com velocidade baseada no scroll
 * @param {import('vue').Ref<HTMLElement|null>} elementRef - Ref do elemento a ser animado
 * @param {ScrollVelocityOptions} options - Opções de configuração
 */
export function useScrollVelocity(elementRef, options = {}) {
    const {
        baseVelocity = 50,
        direction = 'left',
        damping = 50,
        stiffness = 400,
        maxVelocityFactor = 3,
        triggerSelector = null
    } = options

    // Estado interno
    let baseX = 0
    let scrollVelocity = 0
    let smoothVelocity = 0
    let lastScrollY = 0
    let lastTime = 0
    let rafId = null
    let scrollTriggerInstance = null
    let isRunning = false

    // Função wrap para loop infinito
    const wrap = (min, max, v) => {
        const range = max - min
        if (range === 0) return min
        const mod = (((v - min) % range) + range) % range
        return mod + min
    }

    // Atualiza suavização da velocidade
    const updateSmoothVelocity = () => {
        const dampingFactor = damping / 1000
        const stiffnessFactor = stiffness / 1000

        const velocityDiff = scrollVelocity - smoothVelocity
        smoothVelocity += velocityDiff * stiffnessFactor
        smoothVelocity *= 1 - dampingFactor
    }

    // Loop de animação
    const animate = (currentTime) => {
        if (!isRunning) return

        if (lastTime === 0) lastTime = currentTime
        const delta = currentTime - lastTime
        lastTime = currentTime

        updateSmoothVelocity()

        // Mapeia velocidade suavizada para fator de multiplicação
        const velocityFactor = Math.min(Math.abs(smoothVelocity) / 300, maxVelocityFactor)

        // Calcula movimento
        let moveBy = baseVelocity * (delta / 1000)
        moveBy += moveBy * velocityFactor

        // Aplica direção
        if (direction === 'left') {
            baseX -= moveBy
        } else {
            baseX += moveBy
        }

        // Aplica transform com wrap para loop infinito
        if (elementRef.value) {
            // Divide por 3 assumindo lista triplicada para efeito infinito
            const width = elementRef.value.scrollWidth / 3
            elementRef.value.style.transform = `translateX(${wrap(-width, 0, baseX)}px)`
        }

        rafId = requestAnimationFrame(animate)
    }

    // Callback do ScrollTrigger para capturar velocidade
    const updateScrollVelocity = () => {
        const currentScrollY = window.scrollY
        const currentTime = performance.now()
        const timeDelta = currentTime - lastTime

        if (timeDelta > 0) {
            const scrollDelta = currentScrollY - lastScrollY
            scrollVelocity = (scrollDelta / timeDelta) * 1000
        }

        lastScrollY = currentScrollY
    }

    // Inicia a animação
    const start = (trigger = null) => {
        if (isRunning) return

        isRunning = true
        lastTime = 0

        // ScrollTrigger para capturar velocidade do scroll
        const triggerElement = trigger || triggerSelector || elementRef.value
        if (triggerElement) {
            scrollTriggerInstance = ScrollTrigger.create({
                trigger: triggerElement,
                start: 'top bottom',
                end: 'bottom top',
                onUpdate: updateScrollVelocity
            })
        }

        rafId = requestAnimationFrame(animate)
    }

    // Para a animação
    const stop = () => {
        isRunning = false
        if (rafId) {
            cancelAnimationFrame(rafId)
            rafId = null
        }
        if (scrollTriggerInstance) {
            scrollTriggerInstance.kill()
            scrollTriggerInstance = null
        }
    }

    // Atualiza a velocidade base dinamicamente
    const setVelocity = (newVelocity) => {
        options.baseVelocity = newVelocity
    }

    // Lifecycle hooks
    onMounted(() => {
        start()
    })

    onUnmounted(() => {
        stop()
    })

    return {
        start,
        stop,
        setVelocity
    }
}
