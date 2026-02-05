<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMouseInElement } from '@vueuse/core'
import gsap from 'gsap'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import {
    Star,
    Truck,
    ExternalLink,
    BadgeCheck,
    RefreshCw,
    Shield,
    ShoppingCart,
    Lock,
    CreditCard,
    Quote,
    MessageCircle
} from 'lucide-vue-next'

// Props
const props = defineProps({
    product: {
        type: Object,
        required: true
    },
    isLoading: {
        type: Boolean,
        default: false
    }
})

// Computed para imagem (single image do ML)
const productImage = computed(() => props.product?.image || null)

// Computed para reviews
const reviews = computed(() => props.product?.reviews || [])
const hasReviews = computed(() => reviews.value.length > 0)

// Refs for animations and parallax
const heroContainer = ref(null)
const gallerySection = ref(null)
const infoSection = ref(null)

// Parallax Logic (desktop only)
const { elementX, elementY, isOutside, elementHeight, elementWidth } = useMouseInElement(heroContainer)

const parallaxStyle = computed(() => {
    // Disable on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return {}

    if (isOutside.value) return {
        transform: 'rotateX(0deg) rotateY(0deg)',
        transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
    }

    const x = elementX.value - elementWidth.value / 2
    const y = elementY.value - elementHeight.value / 2

    const rotateX = (y / elementHeight.value) * -2
    const rotateY = (x / elementWidth.value) * 2

    return {
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.1s ease-out'
    }
})

// GSAP Animations
onMounted(() => {
    if (props.isLoading) return

    const tl = gsap.timeline()

    if (gallerySection.value) {
        gsap.set(gallerySection.value, { autoAlpha: 0 })
        tl.fromTo(gallerySection.value,
            { x: -30, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.out' }
        )
    }
})

// Fallback image handler
const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/600x600?text=Imagem+Indisponível'
}

// Format price as BRL
const formatPrice = (price) => {
    if (!price) return 'R$ 0,00'
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Generate star rating
const getStarRating = (rating) => {
    const fullStars = Math.floor(rating || 0)
    return fullStars
}
</script>

<template>
    <section ref="heroContainer" class="relative bg-white overflow-hidden py-8 md:py-12">
        <!-- Background Blobs Premium -->
        <div class="absolute -top-1/5 -left-1/10 w-3/5 h-3/5 rounded-full bg-blue-50/30 blur-3xl pointer-events-none">
        </div>
        <div
            class="absolute -bottom-1/4 -right-1/10 w-1/2 h-1/2 rounded-full bg-primary/5 blur-3xl pointer-events-none">
        </div>

        <BaseContainer>
            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center justify-center min-h-100">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>

            <!-- Content Grid -->
            <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

                <!-- Left Column: Image (Scrollable) -->
                <div ref="gallerySection" class="space-y-4 perspective-container">
                    <!-- Main Image Container -->
                    <div class="relative" :style="parallaxStyle">
                        <div class="aspect-square bg-gray-50 rounded-3xl overflow-hidden relative group shadow-lg">
                            <!-- Main Image -->
                            <img v-if="productImage" :src="productImage" :alt="product.title" @error="handleImageError"
                                class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
                            <!-- Placeholder -->
                            <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                                <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>

                        <!-- Floating Badge: Free Shipping -->
                        <div
                            class="absolute -bottom-3 -left-3 lg:-bottom-4 lg:-left-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-gray-100 z-20 animate-float-delayed">
                            <div class="flex items-center gap-2">
                                <Truck class="w-5 h-5 text-blue-600" />
                                <div>
                                    <p class="text-[10px] text-gray-400 uppercase font-medium">Frete</p>
                                    <p class="text-sm font-bold text-gray-950">Grátis</p>
                                </div>
                            </div>
                        </div>

                        <!-- Floating Badge: Rating -->
                        <div v-if="product.rate"
                            class="absolute -top-3 -right-3 lg:-top-4 lg:-right-4 bg-yellow-400 text-gray-950 px-4 py-2 rounded-2xl shadow-lg z-20 animate-float-slow">
                            <div class="flex items-center gap-1.5">
                                <Star class="w-4 h-4 fill-current" />
                                <span class="text-lg font-bold">{{ product.rate }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Product Info (Sticky) -->
                <div ref="infoSection" class="flex flex-col lg:sticky lg:top-24 lg:self-start">

                    <!-- Brand & Seller Badge -->
                    <div class="flex items-center gap-3 mb-4">
                        <span
                            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                            <BadgeCheck class="w-3.5 h-3.5" />
                            Vendedor Verificado
                        </span>
                        <span class="text-xs text-gray-400 font-medium">{{ product.id }}</span>
                    </div>

                    <!-- Title -->
                    <h1 class="text-xl md:text-2xl lg:text-3xl font-bold text-gray-950 mb-3 leading-tight">
                        {{ product.title }}
                    </h1>

                    <!-- Rating Row -->
                    <div class="flex items-center gap-3 mb-6 flex-wrap">
                        <div class="flex items-center gap-1">
                            <div class="flex text-yellow-400">
                                <Star v-for="i in getStarRating(product.rate)" :key="i" class="w-4 h-4 fill-current" />
                                <Star v-for="i in (5 - getStarRating(product.rate))" :key="'empty-' + i"
                                    class="w-4 h-4 text-gray-200" />
                            </div>
                            <span class="text-sm font-bold text-gray-950 ml-1">{{ product.rate }}</span>
                        </div>
                        <span class="text-gray-300">|</span>
                        <span class="text-sm text-gray-500">{{ product.rateCount }} avaliações</span>
                    </div>

                    <!-- Price Card -->
                    <div class="bg-linear-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100 mb-6">
                        <div class="flex items-end gap-3 mb-2">
                            <span class="text-4xl font-extrabold text-gray-950">{{ formatPrice(product.price) }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-500">
                                em até <span class="font-semibold text-gray-700">12x sem juros</span>
                            </span>
                        </div>
                    </div>

                    <!-- Trust Badges Inline -->
                    <div class="grid grid-cols-3 gap-3 mb-6">
                        <div
                            class="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <Truck class="w-5 h-5 text-blue-600 mb-1.5" />
                            <span class="text-xs font-semibold text-gray-950">Frete Grátis</span>
                        </div>
                        <div
                            class="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <RefreshCw class="w-5 h-5 text-green-600 mb-1.5" />
                            <span class="text-xs font-semibold text-gray-950">30 dias</span>
                        </div>
                        <div
                            class="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <Shield class="w-5 h-5 text-amber-500 mb-1.5" />
                            <span class="text-xs font-semibold text-gray-950">Garantia</span>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="mb-6">
                        <h3 class="text-sm font-bold text-gray-950 uppercase tracking-wide mb-3">Descrição</h3>
                        <p class="text-gray-600 leading-relaxed text-sm md:text-base">
                            {{ product.description }}
                        </p>
                    </div>

                    <!-- Reviews Section (if has reviews) -->
                    <div v-if="hasReviews" class="border-t border-gray-100 pt-6 mb-6">
                        <h3
                            class="text-sm font-bold text-gray-950 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <MessageCircle class="w-4 h-4 text-primary" />
                            O que dizem os compradores
                        </h3>
                        <div class="space-y-3">
                            <div v-for="review in reviews" :key="review.id"
                                class="p-4 rounded-xl bg-gray-50/80 border border-gray-100">
                                <div class="flex items-center gap-2 mb-2">
                                    <div class="flex text-yellow-400">
                                        <Star v-for="i in review.rating" :key="i" class="w-3 h-3 fill-current" />
                                        <Star v-for="i in (5 - review.rating)" :key="'e-' + i"
                                            class="w-3 h-3 text-gray-200" />
                                    </div>
                                </div>
                                <p class="text-gray-600 text-sm leading-relaxed">
                                    <Quote class="w-3 h-3 inline text-gray-300 mr-1" />
                                    {{ review.text }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- CTA Section -->
                    <div class="mt-auto space-y-4">
                        <BaseButton :href="product.url" target="_blank" variant="primary" size="lg"
                            class="w-full shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-200">
                            <ShoppingCart class="w-5 h-5 mr-2" />
                            Comprar no Mercado Livre
                            <ExternalLink class="w-4 h-4 ml-2 opacity-70" />
                        </BaseButton>

                        <div class="flex items-center justify-center gap-4 text-xs text-gray-400">
                            <span class="flex items-center gap-1">
                                <Lock class="w-3.5 h-3.5" />
                                Compra Segura
                            </span>
                            <span class="flex items-center gap-1">
                                <CreditCard class="w-3.5 h-3.5" />
                                Parcelamento
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </BaseContainer>
    </section>
</template>

<style scoped>
.perspective-container {
    perspective: 1000px;
}

/* Custom Float Animations */
@keyframes float {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-10px);
    }
}

@keyframes float-delayed {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-8px);
    }
}

.animate-float-slow {
    animation: float 5s ease-in-out infinite;
}

.animate-float-delayed {
    animation: float-delayed 6s ease-in-out infinite 1s;
}
</style>
