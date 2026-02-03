/**
 * useMobileMenu - Composable para controle do menu mobile
 * Usado em: AppHeader
 */

import { ref } from 'vue'

export function useMobileMenu() {
    const isOpen = ref(false)

    const toggle = () => {
        isOpen.value = !isOpen.value
    }

    const open = () => {
        isOpen.value = true
    }

    const close = () => {
        isOpen.value = false
    }

    return {
        isOpen,
        toggle,
        open,
        close
    }
}
