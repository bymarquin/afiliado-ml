/**
 * useNavigation - Composable para links de navegação
 * Usado em: AppHeader, AppFooter
 */

export function useNavigation() {
    const navLinks = [
        { label: 'Shop', href: '#' },
        { label: 'Categories', href: '#' },
        { label: 'Sell', href: '#' },
        { label: 'Contact us', href: '#' }
    ]

    const supportLinks = [
        { label: 'FAQ', href: '#' },
        { label: 'Shipping & Returns', href: '#' },
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' }
    ]

    return {
        navLinks,
        supportLinks
    }
}
