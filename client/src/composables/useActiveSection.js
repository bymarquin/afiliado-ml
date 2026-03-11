/**
 * useActiveSection - Composable para detectar a seção ativa na viewport
 * Usa scroll event + getBoundingClientRect para máxima confiabilidade,
 * inclusive com smooth scroll (Lenis).
 *
 * Usado em: AppHeader (destaque visual do link ativo)
 */

import { ref, onMounted, onUnmounted } from 'vue'

/** Altura do header sticky + margem de tolerância (px) */
const ACTIVATION_OFFSET = 120

/**
 * @param {string[]} sectionIds - IDs das seções a observar, na ordem do DOM
 * @returns {{ activeSection: import('vue').Ref<string> }}
 */
export function useActiveSection(sectionIds) {
    const activeSection = ref(sectionIds[0] ?? '')

    /** @type {number | null} */
    let rafId = null

    /**
     * Percorre as seções de baixo para cima:
     * a última seção cujo topo está acima do offset é a "ativa".
     */
    const updateActiveSection = () => {
        for (let i = sectionIds.length - 1; i >= 0; i--) {
            const el = document.getElementById(sectionIds[i])
            if (!el) continue

            const rect = el.getBoundingClientRect()
            if (rect.top <= ACTIVATION_OFFSET) {
                activeSection.value = sectionIds[i]
                return
            }
        }

        // Se nenhuma seção passou do offset, a primeira é a ativa (topo da página)
        activeSection.value = sectionIds[0]
    }

    /** Throttle via requestAnimationFrame para performance */
    const onScroll = () => {
        if (rafId) return
        rafId = requestAnimationFrame(() => {
            updateActiveSection()
            rafId = null
        })
    }

    onMounted(() => {
        window.addEventListener('scroll', onScroll, { passive: true })
        // Detecção inicial
        updateActiveSection()
    })

    onUnmounted(() => {
        window.removeEventListener('scroll', onScroll)
        if (rafId) {
            cancelAnimationFrame(rafId)
            rafId = null
        }
    })

    return { activeSection }
}
