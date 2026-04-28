/**
 * useNavigation - Composable para links de navegação
 * Usado em: AppHeader, AppFooter
 */

/** IDs das seções na ordem de exibição */
export const SECTION_IDS = ['hero', 'benefits', 'categories', 'products', 'testimonials']

export function useNavigation() {
    const navLinks = [
        { label: 'Início', href: '#hero', sectionId: 'hero' },
        { label: 'Benefícios', href: '#benefits', sectionId: 'benefits' },
        { label: 'Categorias', href: '#categories', sectionId: 'categories' },
        { label: 'Produtos', href: '/produtos', sectionId: 'products' },
        { label: 'Depoimentos', href: '#testimonials', sectionId: 'testimonials' }
    ]

    const supportLinks = [
        { label: 'Perguntas Frequentes (FAQ)', href: '#' },
        { label: 'Envios & Devoluções', href: '#' },
        { label: 'Política de Privacidade', href: '#' },
        { label: 'Termos de Serviço', href: '#' }
    ]

    return {
        navLinks,
        supportLinks
    }
}

