/**
 * useLenis - Composable para smooth scroll com efeito de inércia
 * Usa a biblioteca Lenis para criar um scroll suave e "pesado"
 *
 * Uso:
 * const { lenis } = useLenis({ lerp: 0.1 })
 */

import { ref, onMounted, onUnmounted } from 'vue'
import Lenis from 'lenis'

/**
 * @typedef {Object} LenisOptions
 * @property {number} [lerp=0.1] - Suavidade do scroll (0-1, menor = mais suave/pesado)
 * @property {number} [duration=1.2] - Duração da animação em segundos
 * @property {'vertical'|'horizontal'} [orientation='vertical'] - Orientação do scroll
 * @property {boolean} [smoothWheel=true] - Suavizar scroll do mouse
 * @property {boolean} [smoothTouch=false] - Suavizar scroll de toque (geralmente false para mobile)
 * @property {number} [wheelMultiplier=1] - Multiplicador de velocidade do mouse wheel
 * @property {number} [touchMultiplier=2] - Multiplicador de velocidade do touch
 */

/**
 * Hook para criar smooth scroll com Lenis
 * @param {LenisOptions} options - Opções de configuração do Lenis
 */
export function useLenis(options = {}) {
    const {
        lerp = 0.1,
        duration = 1.2,
        orientation = 'vertical',
        smoothWheel = true,
        smoothTouch = false,
        wheelMultiplier = 1,
        touchMultiplier = 2
    } = options

    const lenis = ref(null)
    let rafId = null

    // Loop de animação para o Lenis
    const raf = (time) => {
        if (lenis.value) {
            lenis.value.raf(time)
        }
        rafId = requestAnimationFrame(raf)
    }

    // Scroll para um elemento ou posição
    const scrollTo = (target, options = {}) => {
        if (lenis.value) {
            lenis.value.scrollTo(target, options)
        }
    }

    // Para o smooth scroll
    const stop = () => {
        if (lenis.value) {
            lenis.value.stop()
        }
    }

    // Retoma o smooth scroll
    const start = () => {
        if (lenis.value) {
            lenis.value.start()
        }
    }

    // Destrói a instância
    const destroy = () => {
        if (rafId) {
            cancelAnimationFrame(rafId)
            rafId = null
        }
        if (lenis.value) {
            lenis.value.destroy()
            lenis.value = null
        }
    }

    onMounted(() => {
        // Cria instância do Lenis
        lenis.value = new Lenis({
            lerp,
            duration,
            orientation,
            smoothWheel,
            smoothTouch,
            wheelMultiplier,
            touchMultiplier
        })

        // Expõe globalmente para acesso pelo scroll de navegação (AppHeader)
        window.__lenis = lenis.value

        // Inicia o loop de animação
        rafId = requestAnimationFrame(raf)
    })

    onUnmounted(() => {
        window.__lenis = null
        destroy()
    })

    return {
        lenis,
        scrollTo,
        stop,
        start,
        destroy
    }
}
