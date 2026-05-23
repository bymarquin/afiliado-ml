/**
 * useProducts - Composable para dados e lógica de produtos
 * Usado em: ProductsSection, ProductDetails, TopClickedProducts
 */

import { ref, onMounted } from 'vue'
import http from '@/services/http'

export function useProducts(options = {}) {
    const { featured = false, limit = null } = options
    const products = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    const fetchProducts = async () => {
        isLoading.value = true
        error.value = null
        try {
            // Escolhe o endpoint baseado na necessidade
            const url = featured ? '/produtos/destaque' : '/produtos'
            const params = {}
            if (limit) params.limit = limit

            const { data } = await http.get(url, { params })
            
            // Mapeia os dados da API (snake_case) para o formato esperado pela UI (camelCase)
            products.value = (data?.data || []).map(p => ({
                id: p.id,
                uuid: p.uuid || p.meli_id || String(p.id),
                name: p.title,
                price: Number(p.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
                originalPrice: p.original_price ? Number(p.original_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : null,
                image: p.image_url,
                variant: p.categories?.[0]?.name || 'Geral',
                categorySlug: p.categories?.[0]?.slug || 'geral',
                rating: Number(p.rating || 0),
                reviewCount: p.rating_count || 0,
                clickCount: p.click_count || 0
            }))
        } catch (err) {
            console.error('Erro ao buscar produtos:', err)
            error.value = 'Não foi possível carregar os produtos.'
        } finally {
            isLoading.value = false
        }
    }

    onMounted(() => {
        // Só busca automaticamente se o array estiver vazio
        if (products.value.length === 0) {
            fetchProducts()
        }
    })

    return {
        products,
        isLoading,
        error,
        fetchProducts
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
