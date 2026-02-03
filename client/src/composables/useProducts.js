/**
 * useProducts - Composable para dados e lógica de produtos
 * Usado em: ProductsSection
 */

import { ref } from 'vue'

// Dados de produtos - em produção viriam de uma API
const products = ref([
    {
        id: 1,
        name: 'Premium Wireless Headphones',
        price: 149,
        originalPrice: 199,
        variant: 'Audio',
        image: null,
        badge: 'Best Seller',
        rating: 4.8,
        reviewCount: 234
    },
    {
        id: 2,
        name: 'Smart Fitness Watch Pro',
        price: 299,
        variant: 'Wearables',
        image: null,
        badge: 'New',
        rating: 4.9,
        reviewCount: 89
    },
    {
        id: 3,
        name: 'Leather Messenger Bag',
        price: 189,
        originalPrice: 249,
        variant: 'Accessories',
        image: null,
        badge: 'Sale',
        rating: 4.7,
        reviewCount: 156
    },
    {
        id: 4,
        name: 'Minimalist Desk Lamp',
        price: 79,
        variant: 'Home Office',
        image: null,
        rating: 4.6,
        reviewCount: 98
    },
    {
        id: 5,
        name: 'Portable Power Station',
        price: 399,
        variant: 'Tech',
        image: null,
        badge: 'New',
        rating: 4.9,
        reviewCount: 45
    },
    {
        id: 6,
        name: 'Ergonomic Keyboard',
        price: 129,
        variant: 'Peripherals',
        image: null,
        rating: 4.5,
        reviewCount: 312
    }
])

export function useProducts() {
    return {
        products
    }
}

/**
 * useProductCarousel - Composable para lógica do carousel de produtos
 */
export function useProductCarousel() {
    const scrollContainer = ref(null)
    const scrollAmount = 320

    const scrollLeft = () => {
        if (scrollContainer.value) {
            scrollContainer.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
        }
    }

    const scrollRight = () => {
        if (scrollContainer.value) {
            scrollContainer.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
    }

    return {
        scrollContainer,
        scrollLeft,
        scrollRight
    }
}
