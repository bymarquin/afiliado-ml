# ✅ Boas Práticas - Afiliado ML

> Regras de código, performance, acessibilidade e qualidade.

---

## 📋 Sumário

- [Vue 3 Composition API](#vue-3-composition-api)
- [Tailwind CSS](#tailwind-css)
- [Responsividade](#responsividade)
- [Acessibilidade](#acessibilidade)
- [Performance](#performance)
- [Programação Defensiva](#programação-defensiva)
- [SEO](#seo)

---

## Vue 3 Composition API

### ✅ Sempre Usar

```vue
<script setup>
// Composition API com <script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const double = computed(() => count.value * 2)
</script>
```

### ❌ Evitar

```vue
<script>
// Options API - NÃO USAR
export default {
  data() {
    return { count: 0 }
  },
  computed: {
    double() {
      return this.count * 2
    },
  },
}
</script>
```

### Ordem dos Elementos no Script

```vue
<script setup>
// 1. Imports (Vue, Router, Stores, Components)
// 2. Props com defineProps()
// 3. Emits com defineEmits()
// 4. Inject/Provide
// 5. Refs e Reactive
// 6. Computed
// 7. Watchers
// 8. Methods/Functions
// 9. Lifecycle Hooks (onMounted, etc.)
</script>
```

### Props e Emits

```vue
<script setup>
// ✅ Props tipadas com defaults
const props = withDefaults(defineProps<{
  title: string
  isActive?: boolean
  count?: number
}>(), {
  isActive: false,
  count: 0
})

// ✅ Emits tipados
const emit = defineEmits<{
  (e: 'update', value: number): void
  (e: 'close'): void
}>()
</script>
```

---

## Tailwind CSS

### Organização de Classes

Ordem recomendada (do layout ao visual):

```html
<div
  class="
  flex items-center justify-between    <!-- 1. Layout/Flexbox -->
  w-full max-w-md                       <!-- 2. Dimensões -->
  p-4 md:p-6                            <!-- 3. Espaçamento -->
  bg-white border border-gray-200      <!-- 4. Background/Border -->
  rounded-lg shadow-sm                  <!-- 5. Decoração -->
  transition-all duration-200          <!-- 6. Transições -->
  hover:shadow-md                       <!-- 7. Estados -->
"
></div>
```

### ✅ Boas Práticas

```html
<!-- Use classes utilitárias -->
<button class="px-4 py-2 bg-primary text-gray-950 rounded-lg">
  <!-- Use cores do design system -->
  <div class="bg-gray-50 text-gray-800">
    <!-- Use transições para feedback visual -->
    <a class="transition-colors hover:text-primary"></a>
  </div>
</button>
```

### ❌ Evitar

```html
<!-- Não use valores arbitrários se existir na escala -->
<div class="p-[15px]">
  <!-- Use p-4 (16px) -->

  <!-- Não hardcode cores -->
  <div class="bg-[#F9D52C]">
    <!-- Use bg-primary -->

    <!-- Não exagere em classes -->
    <div class="p-4 pt-4 pr-4 pb-4 pl-4"><!-- Só p-4 --></div>
  </div>
</div>
```

### Quando Usar `<style scoped>`

1. Animações complexas com `@keyframes`
2. Pseudo-elementos (`:before`, `:after`)
3. Overrides de bibliotecas terceiras
4. Media queries muito específicas

```vue
<style scoped>
/* Animação personalizada */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse-custom {
  animation: pulse 2s ease-in-out infinite;
}
</style>
```

---

## Responsividade

### Filosofia Mobile-First

```html
<!-- ✅ Mobile primeiro, depois breakpoints maiores -->
<div class="text-sm md:text-base lg:text-lg">
  <!-- ❌ Nunca inverta a ordem -->
  <div class="lg:text-lg md:text-base text-sm"></div>
</div>
```

### Breakpoints de Referência

| Breakpoint | Viewport | Exemplos de Dispositivos   |
| ---------- | -------- | -------------------------- |
| Default    | < 640px  | iPhone SE, Android         |
| `sm:`      | ≥ 640px  | iPhone Pro Max             |
| `md:`      | ≥ 768px  | Tablets em portrait        |
| `lg:`      | ≥ 1024px | Tablets landscape, laptops |
| `xl:`      | ≥ 1280px | Desktops                   |

### Regra dos 400px

> Sempre teste em viewports de **375px** e **400px** (iPhone SE/Mini)

```html
<!-- ✅ Larguras fluidas para telas pequenas -->
<div class="w-[90vw] max-w-md">
  <!-- ❌ Larguras fixas que podem quebrar -->
  <div class="w-[500px]"></div>
</div>
```

### Padrões Responsivos

```html
<!-- Grid responsivo -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  <!-- Stack → Row -->
  <div class="flex flex-col md:flex-row items-center gap-4">
    <!-- Esconder em mobile -->
    <span class="hidden sm:inline">Texto visível apenas acima de 640px</span>

    <!-- Padding adaptativo -->
    <section class="p-4 md:p-6 lg:p-8"></section>
  </div>
</div>
```

---

## Acessibilidade

### Semântica HTML

```html
<!-- ✅ Use tags semânticas -->
<header>...</header>
<nav>...</nav>
<main>...</main>
<article>...</article>
<section>...</section>
<footer>...</footer>

<!-- ❌ Evite "div soup" -->
<div class="header">
  <div class="nav">
    <div class="main"></div>
  </div>
</div>
```

### Aria Labels

```html
<!-- ✅ Botões com ícones precisam de aria-label -->
<button aria-label="Fechar menu">
  <XIcon />
</button>

<!-- ✅ Links que abrem em nova aba -->
<a href="..." target="_blank" aria-label="Link externo (abre em nova aba)"></a>
```

### Focus Visible

```html
<!-- ✅ Sempre tenha outline de foco visível -->
<button class="focus-visible:outline-2 focus-visible:outline-primary"></button>
```

### Contraste

- Texto normal: mínimo **4.5:1**
- Texto grande (18px+): mínimo **3:1**
- Use ferramentas como [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## Performance

### Imagens

```html
<!-- ✅ Hero/LCP: carregamento imediato -->
<img src="/hero.jpg" loading="eager" alt="Banner principal" />

<!-- ✅ Abaixo da dobra: lazy loading -->
<img src="/product.jpg" loading="lazy" alt="Produto X" />

<!-- ✅ Sempre tenha alt descritivo -->
<img src="/headphone.jpg" alt="Headphone Premium Bluetooth Preto" />
```

### CSS Performance

```html
<!-- ✅ Anime apenas propriedades performáticas -->
<div class="transition-transform duration-300 hover:scale-105">
  <!-- transform e opacity são GPU-accelerated -->
</div>

<!-- ❌ Evite animar left, top, width, height -->
<div class="transition-all duration-300 hover:left-10"></div>
```

### Code Splitting

```javascript
// ✅ Lazy load de rotas
{
  path: '/product/:id',
  component: () => import('../views/ProductView.vue'),
}

// ✅ Lazy load de componentes pesados
const HeavyChart = defineAsyncComponent(() =>
  import('./components/HeavyChart.vue')
)
```

---

## Programação Defensiva

### Optional Chaining

```javascript
// ✅ Acesso seguro a propriedades
const city = user?.address?.city ?? 'Não informado'

// ❌ Pode quebrar
const city = user.address.city
```

### Valores Default

```vue
<script setup>
// ✅ Props com defaults
const props = withDefaults(defineProps<{
  product: Product
  showPrice?: boolean
}>(), {
  showPrice: true
})
</script>
```

### Verificação no Template

```html
<!-- ✅ Verifique antes de renderizar -->
<div v-if="product">
  <h2>{{ product.name }}</h2>
  <p v-if="product.description">{{ product.description }}</p>
</div>
<div v-else>
  <p>Carregando...</p>
</div>
```

### Arrays e Loops

```javascript
// ✅ Verifique se é array antes de iterar
const items = Array.isArray(data) ? data : []

// ✅ Use optional chaining com métodos
const firstItem = items?.[0]
const itemName = items?.find((i) => i.id === id)?.name
```

---

## SEO

### Meta Tags Essenciais

```html
<!-- index.html -->
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="E-commerce de produtos afiliados com as melhores ofertas" />
  <title>Afiliado ML - Melhores Ofertas</title>
</head>
```

### Estrutura de Headings

```html
<!-- ✅ Um H1 por página, hierarquia correta -->
<h1>Título Principal da Página</h1>
<h2>Seção 1</h2>
<h3>Subseção 1.1</h3>
<h2>Seção 2</h2>

<!-- ❌ Pular níveis ou múltiplos H1 -->
<h1>Título 1</h1>
<h1>Título 2</h1>
<h4>Subseção</h4>
```

---

## 🎯 Definition of Done

Antes de considerar uma tarefa concluída:

- [ ] **Linting limpo** - sem erros no terminal

- [ ] **Mobile-first** - testado em 375px
- [ ] **Dark mode** - não aplicável a este projeto (light only)
- [ ] **Acessibilidade** - aria-labels, foco, contraste
- [ ] **Sem lixo** - removidos `console.log` e código morto
- [ ] **Performance** - imagens com lazy/eager corretos
- [ ] **Código legível** - auto-explicativo sem comentários óbvios
