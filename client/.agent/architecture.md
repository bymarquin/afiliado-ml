# 🏗️ Arquitetura do Projeto - Afiliado ML

> Estrutura, padrões e convenções de código do projeto.

---

## 📋 Sumário

- [Stack Tecnológico](#stack-tecnológico)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Convenções de Nomenclatura](#convenções-de-nomenclatura)
- [Padrões de Componentes](#padrões-de-componentes)
- [Organização de Imports](#organização-de-imports)
- [Gerenciamento de Estado](#gerenciamento-de-estado)
- [Roteamento](#roteamento)

---

## Stack Tecnológico

| Tecnologia       | Versão | Propósito                 |
| ---------------- | ------ | ------------------------- |
| **Vue 3**        | ^3.5.x | Framework principal       |
| **Vite**         | ^7.x   | Build tool e dev server   |
| **Tailwind CSS** | v4.x   | Estilização utility-first |
| **Vue Router**   | ^4.6.x | Roteamento SPA            |
| **Pinia**        | ^3.0.x | Gerenciamento de estado   |
| **ESLint**       | v9.x   | Linting de código         |
| **Prettier**     | 3.x    | Formatação de código      |

### Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Build de produção
npm run preview  # Preview do build de produção
npm run lint     # Executa ESLint com auto-fix
npm run format   # Formata código com Prettier
```

---

## Estrutura de Pastas

```
client/
├── .agent/                  # 📁 Contexto do projeto (este diretório)
│   ├── README.md
│   ├── design-system.md
│   ├── architecture.md
│   ├── best-practices.md
│   ├── business-rules.md
│   └── components.md
│
├── .vscode/                 # Configurações do VS Code
├── public/                  # Assets estáticos (copiados direto)
│
├── src/
│   ├── assets/              # CSS global, imagens, fontes
│   │   ├── main.css         # Design tokens + Tailwind imports
│   │   └── logo.svg
│   │
│   ├── components/
│   │   ├── ui/              # Componentes de UI genéricos
│   │   │   ├── BaseButton.vue
│   │   │   └── BaseContainer.vue
│   │   │
│   │   ├── functional/      # Componentes de negócio/seções
│   │   │   ├── HeroSection.vue
│   │   │   ├── BenefitsSection.vue
│   │   │   ├── ProductsSection.vue
│   │   │   ├── ProductCard.vue
│   │   │   ├── TestimonialsSection.vue
│   │   │   └── TestimonialCard.vue
│   │   │
│   │   └── layout/          # Componentes de layout
│   │       └── AppHeader.vue
│   │
│   ├── composables/         # Lógica reutilizável (hooks Vue)
│   │   └── (a ser criado)
│   │
│   ├── services/            # Integração com APIs
│   │   └── (a ser criado)
│   │
│   ├── stores/              # Pinia stores
│   │   └── (store.js)
│   │

│   │
│   ├── views/               # Páginas/Telas
│   │   └── HomePageView.vue
│   │
│   ├── router/              # Configuração de rotas
│   │   └── index.js
│   │
│   ├── App.vue              # Componente raiz
│   └── main.js              # Entry point
│
├── index.html               # Template HTML
├── package.json
├── vite.config.js
└── eslint.config.js
```

---

## Convenções de Nomenclatura

### Arquivos e Pastas

| Tipo             | Convenção             | Exemplo            |
| ---------------- | --------------------- | ------------------ |
| Componentes Vue  | PascalCase            | `ProductCard.vue`  |
| Composables      | camelCase com `use`   | `useMobileMenu.js` |
| Stores (Pinia)   | camelCase com `Store` | `cartStore.js`     |
| Services         | camelCase             | `productsApi.js`   |

| Views (páginas)  | PascalCase + View     | `HomePageView.vue` |

### Dentro do Código

| Contexto    | Convenção            | Exemplo                           |
| ----------- | -------------------- | --------------------------------- |
| Variáveis   | camelCase            | `isMenuOpen`, `productList`       |
| Constantes  | SCREAMING_SNAKE_CASE | `MAX_PRODUCTS`, `API_URL`         |
| Funções     | camelCase + verbo    | `fetchProducts()`, `toggleMenu()` |
| Props       | camelCase            | `productData`, `isDisabled`       |
| Emits       | kebab-case           | `@update:model-value`             |
| CSS Classes | kebab-case           | `.hero-section`, `.product-grid`  |

---

## Padrões de Componentes

### Estrutura de um SFC

Ordem obrigatória dos blocos:

```vue
<script setup>
// 1. Imports
// 2. Props & Emits
// 3. Refs & Reactive
// 4. Computed
// 5. Watchers
// 6. Functions
// 7. Lifecycle hooks
</script>

<template>
  <!-- HTML semântico -->
</template>

<style scoped>
/* Apenas quando necessário overrides complexos */
</style>
```

### Categorias de Componentes

#### 1. UI (Dumb/Presentational)

- Sem lógica de negócio
- Recebem dados via props
- Emitem eventos para comunicação
- Exemplos: `BaseButton`, `BaseContainer`, `BaseInput`

#### 2. Functional (Smart/Business)

- Contêm lógica de negócio
- Podem ter estado interno
- Podem fazer chamadas à API
- Exemplos: `ProductsSection`, `HeroSection`

#### 3. Layout

- Estrutura geral da página
- Navegação, header, footer, sidebar
- Exemplos: `AppHeader`, `AppFooter`

#### 4. Views (Pages)

- Representam rotas/páginas
- Orquestram componentes
- Gerenciam estado da página
- Exemplos: `HomePageView`, `ProductPageView`

---

## Organização de Imports

Ordem recomendada:

```vue
<script setup>
// 1. Vue core
import { ref, computed, onMounted } from 'vue'

// 2. Vue Router
import { useRoute, useRouter } from 'vue-router'

// 3. Pinia stores
import { useCartStore } from '@/stores/cartStore'

// 4. Composables
import { useMobileMenu } from '@/composables/useMobileMenu'

// 5. Components - UI primeiro
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'

// 6. Components - Functional
import ProductCard from '@/components/functional/ProductCard.vue'



// 8. Constantes/Utils
import { PRODUCTS_PER_PAGE } from '@/constants'
</script>
```

### Alias de Paths

Configurado no `vite.config.js`:

```javascript
resolve: {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url))
  }
}
```

Uso:

```javascript
// ✅ Com alias
import BaseButton from '@/components/ui/BaseButton.vue'

// ❌ Evite caminhos relativos longos
import BaseButton from '../../../components/ui/BaseButton.vue'
```

---

## Gerenciamento de Estado

### Quando Usar Cada Abordagem

| Tipo de Estado                                | Onde Armazenar          |
| --------------------------------------------- | ----------------------- |
| Estado local do componente                    | `ref()` / `reactive()`  |
| Estado compartilhado entre componentes irmãos | Props + Emits (via pai) |
| Estado global da aplicação                    | Pinia Store             |
| Dados do servidor                             | Pinia + Service Layer   |

### Estrutura de uma Store (Pinia)

```javascript
// stores/cartStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([])

  // Getters
  const totalItems = computed(() => items.value.length)
  const totalPrice = computed(() => items.value.reduce((sum, item) => sum + item.price, 0))

  // Actions
  function addItem(product) {
    items.value.push(product)
  }

  function removeItem(productId) {
    const index = items.value.findIndex((item) => item.id === productId)
    if (index > -1) items.value.splice(index, 1)
  }

  return { items, totalItems, totalPrice, addItem, removeItem }
})
```

---

## Roteamento

### Estrutura de Rotas

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: () => import('../views/HomePageView.vue'),
    },
    // Futuras rotas...
    // {
    //   path: '/product/:id',
    //   name: 'ProductDetail',
    //   component: () => import('../views/ProductDetailView.vue'),
    // }
  ],
})

export default router
```

### Convenções de Rotas

- **Lazy loading:** Sempre use `() => import()` para code-splitting
- **Nomes:** Use `name` para navegação programática
- **Params:** Use `:param` para rotas dinâmicas
- **Query:** Use para filtros e paginação

---

## 🎯 Checklist de Arquitetura

Antes de criar um novo arquivo:

- [ ] Está na pasta correta?
- [ ] Segue a convenção de nomenclatura?
- [ ] Imports estão organizados?
- [ ] Componente está na categoria certa (ui/functional/layout)?
- [ ] Se for estado global, usar Pinia Store
- [ ] Se for lógica reutilizável, extrair para composable
