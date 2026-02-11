/**
 * useClickSpark - Composable para efeito de fagulhas ao clicar
 * Baseado no vue-bits ClickSpark component
 *
 * Uso:
 * const { containerRef, canvasRef, onClick } = useClickSpark()
 */

import { ref, onMounted, onUnmounted } from 'vue'

/**
 * @typedef {Object} ClickSparkOptions
 * @property {string} [sparkColor='#3b82f6'] - Cor das fagulhas
 * @property {number} [sparkSize=10] - Tamanho das linhas
 * @property {number} [sparkRadius=35] - Raio de expansão
 * @property {number} [sparkCount=8] - Número de fagulhas
 * @property {number} [duration=400] - Duração da animação em ms
 * @property {'linear'|'ease-in'|'ease-out'|'ease-in-out'} [easing='ease-out'] - Tipo de easing
 */

/**
 * Hook para criar efeito de fagulhas ao clicar
 * @param {ClickSparkOptions} options - Opções de configuração
 */
export function useClickSpark(options = {}) {
    const {
        sparkColor = '#3b82f6',
        sparkSize = 10,
        sparkRadius = 35,
        sparkCount = 8,
        duration = 400,
        easing = 'ease-out'
    } = options

    const containerRef = ref(null)
    const canvasRef = ref(null)
    const sparks = ref([])
    let animationId = null
    let resizeObserver = null
    let resizeTimeout = null

    // Função de easing
    const easeFn = (t) => {
        switch (easing) {
            case 'linear':
                return t
            case 'ease-in':
                return t * t
            case 'ease-in-out':
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
            default: // ease-out
                return t * (2 - t)
        }
    }

    const resizeCanvas = () => {
        const canvas = canvasRef.value
        if (!canvas) return

        const parent = canvas.parentElement
        if (!parent) return

        const { width, height } = parent.getBoundingClientRect()
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width
            canvas.height = height
        }
    }

    const handleResize = () => {
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(resizeCanvas, 100)
    }

    const draw = (timestamp) => {
        const canvas = canvasRef.value
        const ctx = canvas?.getContext('2d')
        if (!ctx || !canvas) {
            animationId = requestAnimationFrame(draw)
            return
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        sparks.value = sparks.value.filter((spark) => {
            const elapsed = timestamp - spark.startTime
            if (elapsed >= duration) {
                return false
            }

            const progress = elapsed / duration
            const eased = easeFn(progress)

            const distance = eased * sparkRadius
            const lineLength = sparkSize * (1 - eased)

            const x1 = spark.x + distance * Math.cos(spark.angle)
            const y1 = spark.y + distance * Math.sin(spark.angle)
            const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle)
            const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle)

            ctx.strokeStyle = sparkColor
            ctx.lineWidth = 2
            ctx.lineCap = 'round'
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.stroke()

            return true
        })

        animationId = requestAnimationFrame(draw)
    }

    const onClick = (e) => {
        const canvas = canvasRef.value
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const now = performance.now()
        const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
            x,
            y,
            angle: (2 * Math.PI * i) / sparkCount,
            startTime: now
        }))

        sparks.value.push(...newSparks)
    }

    onMounted(() => {
        const canvas = canvasRef.value
        if (!canvas) return

        const parent = canvas.parentElement
        if (parent) {
            resizeObserver = new ResizeObserver(handleResize)
            resizeObserver.observe(parent)
        }

        resizeCanvas()
        animationId = requestAnimationFrame(draw)
    })

    onUnmounted(() => {
        if (resizeObserver) {
            resizeObserver.disconnect()
        }
        clearTimeout(resizeTimeout)
        if (animationId) {
            cancelAnimationFrame(animationId)
        }
    })

    return {
        containerRef,
        canvasRef,
        onClick
    }
}
