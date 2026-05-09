/**
 * useNavigation - Composable para links de navegacao
 * Usado em: AppHeader, AppFooter
 */

/** IDs das secoes na ordem de exibicao */
export const SECTION_IDS = ['hero', 'benefits', 'categories', 'products', 'testimonials']

export function useNavigation() {
  const navLinks = [
    { label: 'Inicio', href: '#hero', sectionId: 'hero' },
    { label: 'Beneficios', href: '#benefits', sectionId: 'benefits' },
    { label: 'Categorias', href: '#categories', sectionId: 'categories' },
    { label: 'Produtos', href: '/produtos', sectionId: 'products' },
    { label: 'Depoimentos', href: '#testimonials', sectionId: 'testimonials' },
  ]

  const supportLinks = [
    { label: 'Perguntas Frequentes (FAQ)', href: '/faq' },
    { label: 'Politica de Privacidade', href: '/politica-de-privacidade' },
    { label: 'Termos de Servico', href: '/termos-de-servico' },
  ]

  return {
    navLinks,
    supportLinks,
  }
}
