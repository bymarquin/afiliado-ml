/**
 * useNavigation - Composable para links de navegação
 * Usado em: AppHeader, AppFooter
 */

/** IDs das seções na ordem de exibição */
export const SECTION_IDS = ['hero', 'benefits', 'products', 'testimonials']

export function useNavigation() {
    const navLinks = [
        { label: 'Início', href: '#hero', sectionId: 'hero' },
        { label: 'Benefícios', href: '#benefits', sectionId: 'benefits' },
        { label: 'Produtos', href: '#products', sectionId: 'products' },
        { label: 'Depoimentos', href: '#testimonials', sectionId: 'testimonials' }
    ]

    const supportLinks = [
        { label: 'FAQ', href: '#' },
        { label: 'Envios & Devoluções', href: '#' },
        { label: 'Política de Privacidade', href: '#' },
        { label: 'Termos de Serviço', href: '#' }
    ]

    return {
        navLinks,
        supportLinks
    }
}
