/**
 * useTiltCard - Composable para efeito 3D tilt em cards
 * Baseado no vue-bits TiltedCard component
 *
 * Uso:
 * const { elementRef, style, onMouseMove, onMouseEnter, onMouseLeave } = useTiltCard()
 */

import { ref, computed, onUnmounted } from 'vue'

/**
 * @typedef {Object} TiltCardOptions
 * @property {number} [rotateAmplitude=14] - Amplitude da rotação em graus
 * @property {number} [scaleOnHover=1.05] - Escala ao hover
 * @property {number} [perspective=800] - Perspectiva 3D em pixels
 * @property {boolean} [glare=false] - Ativar efeito de brilho
 * @property {number} [transitionDuration=0.3] - Duração da transição em segundos
 */

/**
 * Hook para criar efeito de tilt 3D em cards
 * @param {TiltCardOptions} options - Opções de configuração
 */
export function useTiltCard(options = {}) {
    const {
        rotateAmplitude = 14,
        scaleOnHover = 1.05,
        perspective = 800,
        glare = false,
        transitionDuration = 0.3
    } = options

    const elementRef = ref(null)
    const rotateX = ref(0)
    const rotateY = ref(0)
    const scale = ref(1)
    const glarePosition = ref({ x: 50, y: 50 })
    const isHovering = ref(false)

    // Estilos computados para aplicar no elemento
    const style = computed(() => ({
        transform: `perspective(${perspective}px) rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg) scale(${scale.value})`,
        transition: isHovering.value ? 'none' : `transform ${transitionDuration}s ease-out`,
        transformStyle: 'preserve-3d',
        willChange: 'transform'
    }))

    // Estilo do efeito glare (opcional)
    const glareStyle = computed(() => ({
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        background: `radial-gradient(circle at ${glarePosition.value.x}% ${glarePosition.value.y}%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
        opacity: isHovering.value && glare ? 1 : 0,
        transition: `opacity ${transitionDuration}s ease-out`,
        borderRadius: 'inherit'
    }))

    const onMouseMove = (e) => {
        if (!elementRef.value) return

        const rect = elementRef.value.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const offsetX = e.clientX - centerX
        const offsetY = e.clientY - centerY

        // Calcular rotação baseada na posição do mouse
        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude

        rotateX.value = rotationX
        rotateY.value = rotationY

        // Atualizar posição do glare
        const percentX = ((e.clientX - rect.left) / rect.width) * 100
        const percentY = ((e.clientY - rect.top) / rect.height) * 100
        glarePosition.value = { x: percentX, y: percentY }
    }

    const onMouseEnter = () => {
        isHovering.value = true
        scale.value = scaleOnHover
    }

    const onMouseLeave = () => {
        isHovering.value = false
        rotateX.value = 0
        rotateY.value = 0
        scale.value = 1
    }

    onUnmounted(() => {
        // Cleanup se necessário
    })

    return {
        elementRef,
        style,
        glareStyle,
        isHovering,
        onMouseMove,
        onMouseEnter,
        onMouseLeave
    }
}
