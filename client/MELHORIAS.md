# 📋 Sugestões de Melhorias para o Projeto

Este documento contém sugestões de melhorias para as Views do projeto, focando principalmente na **ProductDetailsView** para elevar seu padrão visual ao nível premium implementado na homepage.

---

## 🏠 HomePageView - Melhorias Pontuais

A homepage já segue um padrão premium excelente. Apenas sugestões menores:

### 1. Adicionar Header/Footer como Layout Global

Mover `AppHeader` e `AppFooter` para um **layout wrapper** (ex: `DefaultLayout.vue`) para evitar repetição em cada view.

```vue
<!-- src/layouts/DefaultLayout.vue -->
<template>
  <div class="min-h-screen bg-white">
    <AppHeader />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
```

### 2. Esqueleto de Loading para Produtos

Adicionar skeleton loaders nos cards de produtos enquanto carregam.

### 3. Seção CTA Final

Uma seção Call-to-Action antes do footer com newsletter ou convite para explorar categorias.

---

## 🛍️ ProductDetailsView - Melhorias Principais

Esta view precisa de uma atualização significativa para acompanhar o padrão premium da homepage.

### 🏗️ Problemas Atuais

| Problema                 | Descrição                                                       |
| ------------------------ | --------------------------------------------------------------- |
| **Falta de componentes** | A view está monolítica, sem separação em componentes funcionais |
| **Sem animações GSAP**   | Diferente da homepage, não há animações de entrada              |
| **Layout simples**       | Falta os elementos visuais (blobs, badges flutuantes, parallax) |
| **Sem Header/Footer**    | A página fica "nua" sem a identidade visual do site             |
| **Mock data interna**    | Os dados deveriam vir de uma API/composable                     |

---

### ✨ Sugestões de Melhoria Visual

#### 1. Adicionar Elementos de Background Premium

Seguindo o padrão da homepage:

```vue
<!-- Adicionar ao início da section principal -->
<div
  class="absolute -top-1/5 -left-1/10 w-3/5 h-3/5 rounded-full bg-blue-50/30 blur-3xl pointer-events-none"
></div>
<div
  class="absolute -bottom-1/4 -right-1/10 w-1/2 h-1/2 rounded-full bg-primary/5 blur-3xl pointer-events-none"
></div>
```

#### 2. Animações GSAP de Entrada

Implementar animações consistentes com a homepage:

```javascript
import gsap from 'gsap'

onMounted(() => {
  const tl = gsap.timeline()

  tl.from('.product-image', {
    autoAlpha: 0,
    x: -30,
    duration: 0.8,
    ease: 'power2.out',
  }).from(
    '.product-info > *',
    {
      autoAlpha: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out',
    },
    '-=0.4',
  )
})
```

#### 3. Badges Flutuantes (como no Hero)

Adicionar badges similares aos da HeroSection:

```vue
<!-- Badge de Desconto Flutuante -->
<div
  class="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-2xl shadow-lg animate-float-slow"
>
  <p class="text-xs uppercase font-bold">Desconto</p>
  <p class="text-lg font-bold">20% OFF</p>
</div>

<!-- Badge de Frete Grátis -->
<div
  class="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-gray-100 animate-float-delayed"
>
  <p class="text-xs text-gray-500">Frete</p>
  <p class="text-sm font-bold text-gray-950">Grátis</p>
</div>
```

#### 4. Galeria de Imagens com Thumbnails

Substituir a imagem única por uma galeria interativa:

```vue
<script setup>
const selectedImage = ref(0)
const images = computed(() => product.value.images || [])
</script>

<template>
  <!-- Main Image -->
  <div class="aspect-square bg-gray-50 rounded-3xl overflow-hidden relative">
    <img :src="images[selectedImage]" class="w-full h-full object-cover" />
  </div>

  <!-- Thumbnails -->
  <div class="flex gap-3 mt-4">
    <button
      v-for="(img, i) in images"
      :key="i"
      @click="selectedImage = i"
      :class="[
        'w-20 h-20 rounded-xl overflow-hidden border-2 transition-all',
        selectedImage === i
          ? 'border-blue-600 ring-2 ring-blue-600/20'
          : 'border-transparent hover:border-gray-200',
      ]"
    >
      <img :src="img" class="w-full h-full object-cover" />
    </button>
  </div>
</template>
```

---

### 📦 Novas Seções Sugeridas

Seguindo o modelo da homepage que tem múltiplas seções (Hero, Benefits, Products, Testimonials), sugiro as seguintes seções para a página de produto:

---

#### 1. 🖼️ **ProductHeroSection** - Topo da Página

**O que contém:**

- Imagem principal grande com galeria de thumbnails
- Título, preço, desconto e badge de avaliação
- Botão CTA principal "Comprar Agora"
- Badges flutuantes animados

**Referência:** Similar ao grid atual, mas componentizado

---

#### 2. ⭐ **ProductFeaturesSection** - Destaques do Produto

**O que contém:**

- Grid de ícones com as features/benefícios do produto
- Design similar ao `BenefitsSection` da homepage
- Cards com hover effects premium

```vue
<!-- Estrutura sugerida -->
<section class="py-20 bg-white">
  <BaseContainer>
    <h2>Por que escolher este produto?</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <FeatureCard 
        v-for="feature in features" 
        :key="feature.id"
        :icon="feature.icon"
        :title="feature.title"
        :description="feature.description"
      />
    </div>
  </BaseContainer>
</section>
```

---

#### 3. 📝 **ProductDescriptionSection** - Descrição Detalhada

**O que contém:**

- Descrição completa com formatação rica
- Especificações técnicas em tabela
- Tabs ou accordion para organizar conteúdo

```vue
<section class="py-20 bg-gray-50">
  <BaseContainer>
    <div class="grid md:grid-cols-2 gap-12">
      <!-- Descrição -->
      <div>
        <h2>Sobre o Produto</h2>
        <p v-html="product.fullDescription"></p>
      </div>
      
      <!-- Especificações -->
      <div class="bg-white p-8 rounded-3xl border border-gray-100">
        <h3>Especificações</h3>
        <dl>
          <div v-for="spec in product.specs" class="flex justify-between py-3 border-b">
            <dt>{{ spec.label }}</dt>
            <dd class="font-medium">{{ spec.value }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </BaseContainer>
</section>
```

---

#### 4. 💬 **ProductReviewsSection** - Avaliações

**O que contém:**

- Resumo de avaliações (média, distribuição por estrelas)
- Cards de reviews individuais (estilo `TestimonialCard`)
- Carousel ou grid com animação

```vue
<section class="py-20 bg-white overflow-hidden">
  <BaseContainer>
    <!-- Header com média -->
    <div class="flex items-center gap-8 mb-12">
      <div class="text-center">
        <span class="text-5xl font-bold">4.8</span>
        <div class="flex text-yellow-400">★★★★★</div>
        <span class="text-gray-500">124 avaliações</span>
      </div>
      
      <!-- Barra de distribuição -->
      <div class="flex-1">
        <RatingBar v-for="i in 5" :star="6-i" :percentage="distribution[6-i]" />
      </div>
    </div>
    
    <!-- Reviews Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ReviewCard v-for="review in reviews" :review="review" />
    </div>
  </BaseContainer>
</section>
```

---

#### 5. 🛒 **RelatedProductsSection** - Produtos Relacionados

**O que contém:**

- Carousel horizontal como `ProductsSection` da homepage
- Mesma estrutura de cards
- Navegação com setas

```vue
<section class="py-20 bg-gray-50">
  <BaseContainer>
    <SectionHeader 
      badge="Você também pode gostar"
      title="Produtos Relacionados"
    />
    
    <!-- Reutilizar estrutura do ProductsSection -->
    <ProductCarousel :products="relatedProducts" />
  </BaseContainer>
</section>
```

---

#### 6. 🔒 **TrustBadgesSection** - Garantias e Confiança

**O que contém:**

- Ícones de segurança (compra segura, devolução, garantia)
- Similar ao `BenefitsSection` mas focado em trust signals
- Pode ser uma faixa compacta antes do footer

```vue
<section class="py-12 bg-gray-950 text-white">
  <BaseContainer>
    <div class="flex flex-wrap justify-center gap-8 md:gap-16">
      <div class="flex items-center gap-3">
        <Lock class="w-6 h-6 text-green-400" />
        <span>Compra 100% Segura</span>
      </div>
      <div class="flex items-center gap-3">
        <RefreshCw class="w-6 h-6 text-blue-400" />
        <span>30 dias para devolução</span>
      </div>
      <div class="flex items-center gap-3">
        <Shield class="w-6 h-6 text-amber-400" />
        <span>Garantia de 1 ano</span>
      </div>
    </div>
  </BaseContainer>
</section>
```

---

#### 7. ❓ **ProductFAQSection** - Perguntas Frequentes

**O que contém:**

- Accordion com perguntas comuns sobre o produto
- Animação suave de abertura/fechamento
- Design clean e moderno

---

### 📁 Estrutura de Componentes Sugerida

```
src/components/functional/
├── product/
│   ├── ProductHeroSection.vue        # Imagem + Info principal
│   ├── ProductGallery.vue            # Galeria de imagens
│   ├── ProductFeaturesSection.vue    # Grid de features
│   ├── ProductDescriptionSection.vue # Descrição + Specs
│   ├── ProductReviewsSection.vue     # Avaliações
│   ├── RelatedProductsSection.vue    # Produtos relacionados
│   ├── TrustBadgesSection.vue        # Badges de confiança
│   └── ProductFAQSection.vue         # FAQ
```

---

### 🎯 Implementação Recomendada

**Ordem de prioridade:**

1. **[ALTA]** Adicionar Header/Footer
2. **[ALTA]** Componentizar em `ProductHeroSection`
3. **[ALTA]** Adicionar animações GSAP
4. **[MÉDIA]** Criar galeria de imagens
5. **[MÉDIA]** Adicionar `ProductFeaturesSection`
6. **[MÉDIA]** Adicionar `ProductReviewsSection`
7. **[BAIXA]** Adicionar `RelatedProductsSection`
8. **[BAIXA]** Adicionar `TrustBadgesSection`
9. **[BAIXA]** Adicionar `ProductFAQSection`

---

### 🔧 Composable Sugerido

Criar `useProduct.ts` para gerenciar dados do produto:

```typescript
// src/composables/useProduct.ts
import { ref, computed } from 'vue'

export function useProduct(productId: string) {
  const product = ref(null)
  const isLoading = ref(true)
  const error = ref(null)

  const discountPercentage = computed(() => {
    if (!product.value) return 0
    const { price, originalPrice } = product.value
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  })

  const fetchProduct = async () => {
    // API call aqui
  }

  return {
    product,
    isLoading,
    error,
    discountPercentage,
    fetchProduct,
  }
}
```

---

## 📊 Resumo das Melhorias

| View                   | Prioridade | Melhorias                                                |
| ---------------------- | ---------- | -------------------------------------------------------- |
| **HomePageView**       | Baixa      | Layout global, skeleton loaders, CTA final               |
| **ProductDetailsView** | **Alta**   | Componentização, animações, novas seções, design premium |

---

> [!TIP]
> **Próximo passo:** Comece pela componentização do `ProductHeroSection` e adicione as animações GSAP. Isso já trará uma melhoria visual significativa e alinhará a página com o padrão da homepage.
