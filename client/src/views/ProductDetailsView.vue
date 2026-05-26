<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ProductHeroSection from '@/components/functional/product/ProductHeroSection.vue'
import ProductReviewCard from '@/components/functional/product/ProductReviewCard.vue'
import { ArrowLeft, MessageCircle } from 'lucide-vue-next'
import http from '@/services/http'

gsap.registerPlugin(ScrollTrigger)

const route = useRoute()
const product = ref(null)
const error = ref(null)

const isLoading = ref(true)
const reviewsSection = ref(null)

const toReviewItems = (reviewsData) => {
  if (!Array.isArray(reviewsData)) return []
  return reviewsData
    .map((review, index) => {
      if (typeof review === 'string') {
        return { id: index + 1, text: review, rate: 5 }
      }

      const score = Number(review?.rating ?? review?.rate ?? review?.score ?? 5)
      return {
        id: review?.id || index + 1,
        text: review?.text || review?.comment || review?.content || '',
        rate: Number.isFinite(score) ? score : 5,
      }
    })
    .filter((review) => review.text)
}

const normalizeProduct = (rawProduct) => {
  const price = Number(rawProduct?.price || 0)

  return {
    id: rawProduct?.meli_id || rawProduct?.id,
    title: rawProduct?.title || 'Produto sem título',
    image: rawProduct?.image_url || rawProduct?.images?.[0] || null,
    url: rawProduct?.affiliate_url || rawProduct?.product_url || '#',
    rate: Number(rawProduct?.rating || 0),
    rateCount: Number(rawProduct?.rating_count || 0),
    price: Number.isFinite(price) ? price : 0,
    description: rawProduct?.description || 'Sem descrição disponível.',
    reviews: toReviewItems(rawProduct?.reviews_data),
  }
}

const fetchProduct = async () => {
  const productId = route.params.id
  if (!productId) {
    error.value = 'Produto inválido.'
    isLoading.value = false
    return
  }

  isLoading.value = true
  error.value = null

  try {
    let response
    const looksLikeMlId = /^[A-Za-z]{3}\d+$/.test(String(productId))

    if (looksLikeMlId) {
      response = await http.get(`/produtos/mlb/${encodeURIComponent(productId)}`)
    } else {
      response = await http.get(`/produtos/${encodeURIComponent(productId)}`)
    }

    product.value = normalizeProduct(response?.data?.data)
  } catch (firstError) {
    try {
      const fallbackResponse = await http.get(`/produtos/mlb/${encodeURIComponent(productId)}`)
      product.value = normalizeProduct(fallbackResponse?.data?.data)
    } catch (fallbackError) {
      console.error('Erro ao carregar produto:', firstError)
      console.error('Erro fallback ao carregar produto:', fallbackError)
      error.value = 'Não foi possível carregar este produto.'
      product.value = null
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProduct()

  // Animate reviews section on scroll
  gsap.from('.reviews-section-content', {
    scrollTrigger: {
      trigger: '.reviews-section',
      start: 'top 85%',
      once: true
    },
    y: 40,
    autoAlpha: 0,
    duration: 0.8,
    ease: 'power2.out'
  })

  // Stagger reveal cards
  gsap.from('.review-card', {
    scrollTrigger: {
      trigger: '.reviews-section',
      start: 'top 80%',
      once: true
    },
    y: 30,
    autoAlpha: 0,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power2.out'
  })
})

watch(
  () => route.params.id,
  () => {
    fetchProduct()
  }
)
</script>

<template>
  <div class="bg-surface transition-colors duration-300">
    <section class="pt-6 md:pt-8">
      <BaseContainer>
        <BaseButton to="/produtos" variant="outline" size="sm" class="group">
          <ArrowLeft class="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Voltar para produtos
        </BaseButton>
      </BaseContainer>
    </section>

    <section v-if="error" class="py-16 md:py-24">
      <BaseContainer>
        <div class="rounded-2xl border border-border-main bg-surface-hover p-8 text-center">
          <p class="text-text-main font-semibold">{{ error }}</p>
        </div>
      </BaseContainer>
    </section>

    <!-- Product Hero Section -->
    <ProductHeroSection :product="product || {}" :isLoading="isLoading" />

    <!-- Reviews Section (Premium Style) -->
    <section v-if="!isLoading" ref="reviewsSection" class="reviews-section relative py-16 md:py-24 bg-surface-hover overflow-hidden transition-colors duration-300">
      <!-- Subtle Background Blobs -->
      <div class="absolute -top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-1/4 right-1/4 w-1/3 h-1/3 rounded-full bg-surface/30 blur-3xl pointer-events-none">
      </div>

      <BaseContainer class="reviews-section-content">
        <!-- Section Header -->
        <div class="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <MessageCircle class="w-4 h-4 text-primary" />
            <span class="text-xs font-bold text-primary uppercase tracking-wider">Avaliações</span>
          </span>
          <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-text-main tracking-tight mb-3">
            O que dizem os compradores
          </h2>
          <p class="text-sm md:text-base text-text-muted">
            Veja as experiências de quem já adquiriu este produto.
          </p>
        </div>

        <!-- Reviews Grid -->
        <div v-if="product?.reviews?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          <div v-for="review in product.reviews" :key="review.id" class="review-card">
            <ProductReviewCard :review="review" />
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <p class="text-text-muted">Nenhuma avaliação disponível ainda.</p>
        </div>
      </BaseContainer>
    </section>
  </div>
</template>
