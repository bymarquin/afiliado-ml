/**
 * useSocialLinks - Composable para links de redes sociais
 * Usado em: AppFooter
 */

export function useSocialLinks() {
    const socialLinks = [
        {
            name: 'Instagram',
            href: 'https://instagram.com',
            icon: 'instagram'
        },
        {
            name: 'Twitter',
            href: 'https://twitter.com',
            icon: 'twitter'
        },
        {
            name: 'Facebook',
            href: 'https://facebook.com',
            icon: 'facebook'
        },
        {
            name: 'LinkedIn',
            href: 'https://linkedin.com',
            icon: 'linkedin'
        }
    ]

    return {
        socialLinks
    }
}
