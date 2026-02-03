# 🧩 Catálogo de Componentes - Afiliado ML

> Documentação da API e uso dos componentes existentes.

---

## 📋 Índice

- [Componentes UI](#componentes-ui)
  - [BaseButton](#basebutton)
  - [BaseContainer](#basecontainer)
- [Componentes Layout](#componentes-layout)
  - [AppHeader](#appheader)
- [Componentes Functional](#componentes-functional)
  - [HeroSection](#herosection)
  - [BenefitsSection](#benefitssection)
  - [ProductsSection](#productssection)
  - [ProductCard](#productcard)
  - [TestimonialsSection](#testimonialssection)
  - [TestimonialCard](#testimonialcard)

---

## Componentes UI

Componentes genéricos e reutilizáveis sem lógica de negócio.

---

### BaseButton

Botão reutilizável com variantes de estilo e tamanho.

**Localização:** `src/components/ui/BaseButton.vue`

#### Props

| Prop       | Tipo      | Default     | Valores                                 |
| ---------- | --------- | ----------- | --------------------------------------- |
| `variant`  | `string`  | `'primary'` | `'primary'`, `'secondary'`, `'outline'` |
| `size`     | `string`  | `'md'`      | `'sm'`, `'md'`, `'lg'`                  |
| `disabled` | `boolean` | `false`     | `true`, `false`                         |

#### Estilos por Variante

| Variante    | Fundo         | Texto           | Hover                   |
| ----------- | ------------- | --------------- | ----------------------- |
| `primary`   | `bg-primary`  | `text-gray-950` | `hover:bg-primary-dark` |
| `secondary` | `bg-gray-950` | `text-white`    | `hover:bg-gray-800`     |
| `outline`   | Transparente  | `text-gray-950` | `hover:bg-gray-50`      |

#### Tamanhos

| Size | Classes               |
| ---- | --------------------- |
| `sm` | `px-4 py-2 text-sm`   |
| `md` | `px-6 py-2.5 text-sm` |
| `lg` | `px-8 py-3 text-base` |

#### Uso

```vue
<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
</script>

<template>
  <!-- Botão primário padrão -->
  <BaseButton>Click me</BaseButton>

  <!-- Variantes -->
  <BaseButton variant="primary">Comprar</BaseButton>
  <BaseButton variant="secondary">Saiba mais</BaseButton>
  <BaseButton variant="outline">Cancelar</BaseButton>

  <!-- Tamanhos -->
  <BaseButton size="sm">Pequeno</BaseButton>
  <BaseButton size="md">Médio</BaseButton>
  <BaseButton size="lg">Grande</BaseButton>

  <!-- Desabilitado -->
  <BaseButton disabled>Indisponível</BaseButton>
</template>
```

---

### BaseContainer

Container centralizado com largura máxima e padding responsivo.

**Localização:** `src/components/ui/BaseContainer.vue`

#### Props

| Prop | Tipo     | Default | Descrição                                                 |
| ---- | -------- | ------- | --------------------------------------------------------- |
| `as` | `string` | `'div'` | Tag HTML a renderizar (`div`, `section`, `article`, etc.) |

#### Estilos Aplicados

```
mx-auto          → Centraliza horizontalmente
w-full           → Largura 100% do pai
max-w-[1216px]   → Largura máxima
px-4             → Padding mobile (16px)
md:px-6          → Padding tablet (24px)
lg:px-8          → Padding desktop (32px)
```

#### Uso

```vue
<script setup>
import BaseContainer from '@/components/ui/BaseContainer.vue'
</script>

<template>
  <!-- Como div (padrão) -->
  <BaseContainer>
    <p>Conteúdo centralizado</p>
  </BaseContainer>

  <!-- Como section -->
  <BaseContainer as="section">
    <h2>Título da Seção</h2>
  </BaseContainer>

  <!-- Como nav -->
  <BaseContainer as="nav">
    <ul>
      ...
    </ul>
  </BaseContainer>
</template>
```

---

## Componentes Layout

Componentes estruturais para a página.

---

### AppHeader

Header principal da aplicação com logo, navegação e ações.

**Localização:** `src/components/layout/AppHeader.vue`

#### Features

- ✅ Logo com link para home
- ✅ Navegação desktop (links)
- ✅ Ícones de ação (busca, usuário, carrinho)
- ✅ Badge no carrinho (número de itens)
- ✅ Menu mobile com toggle
- ✅ Animação de abertura do menu

#### Props

Nenhuma prop externa (componente auto-contido).

#### Estado Interno

| Ref                | Tipo      | Descrição                            |
| ------------------ | --------- | ------------------------------------ |
| `isMobileMenuOpen` | `boolean` | Controla visibilidade do menu mobile |

#### Links de Navegação

Atualmente hardcoded:

- Shop
- Categories
- Sell
- Contact us

#### Uso

```vue
<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <AppHeader />
</template>
```

---

## Componentes Functional

Componentes com lógica de negócio e/ou dados.

---

### HeroSection

Banner principal com destaque de oferta, imagem e CTAs.

**Localização:** `src/components/functional/HeroSection.vue`

#### Features

- ✅ Badge "LIMITED OFFER"
- ✅ Título em destaque
- ✅ Área de imagem (placeholder atual)
- ✅ Info de desconto
- ✅ Botões de ação

#### Componentes Filhos

- `BaseContainer`
- `BaseButton`

#### Uso

```vue
<script setup>
import HeroSection from '@/components/functional/HeroSection.vue'
</script>

<template>
  <HeroSection />
</template>
```

---

### BenefitsSection

Seção exibindo os diferenciais/benefícios do serviço.

**Localização:** `src/components/functional/BenefitsSection.vue`

#### Features

- ✅ Grid de benefícios
- ✅ Ícones SVG
- ✅ Título e descrição por item
- ✅ Layout responsivo

---

### ProductsSection

Seção com grid de produtos em destaque.

**Localização:** `src/components/functional/ProductsSection.vue`

#### Features

- ✅ Título da seção
- ✅ Grid responsivo (1/2/4 colunas)
- ✅ Cards de produto

#### Componentes Filhos

- `BaseContainer`
- `ProductCard`

---

### ProductCard

Card individual de produto com imagem, info e CTA.

**Localização:** `src/components/functional/ProductCard.vue`

#### Props

| Prop      | Tipo     | Required | Descrição                   |
| --------- | -------- | -------- | --------------------------- |
| `product` | `Object` | ✅       | Objeto com dados do produto |

#### Estrutura do Product

```javascript
{
  id: "string",
  name: "string",
  price: "number",
  image: "string",
  variant: "string"
}
```

#### Features

- ✅ Imagem com placeholder fallback
- ✅ Nome do produto (truncado)
- ✅ Preço
- ✅ Variante (opcional)
- ✅ Hover effect (scale)
- ✅ Botão "Add to Cart"

#### Uso

```vue
<script setup>
import ProductCard from '@/components/functional/ProductCard.vue'

const product = {
  id: '1',
  name: 'Wireless Headphone',
  price: 199.99,
  image: '/images/headphone.jpg',
  variant: 'Black',
}
</script>

<template>
  <ProductCard :product="product" />
</template>
```

---

### TestimonialsSection

Seção com depoimentos/avaliações de clientes.

**Localização:** `src/components/functional/TestimonialsSection.vue`

#### Features

- ✅ Título da seção
- ✅ Grid de testimonials
- ✅ Cards de depoimento

#### Componentes Filhos

- `BaseContainer`
- `TestimonialCard`

---

### TestimonialCard

Card de depoimento individual.

**Localização:** `src/components/functional/TestimonialCard.vue`

#### Props

| Prop          | Tipo     | Required | Descrição           |
| ------------- | -------- | -------- | ------------------- |
| `testimonial` | `Object` | ✅       | Dados do depoimento |

#### Estrutura do Testimonial

```javascript
{
  id: "string",
  author: "string",
  role: "string",
  content: "string",
  avatar: "string",
  rating: "number"
}
```

---

## 📝 Criando Novos Componentes

### Template Base

```vue
<script setup>
/**
 * NomeDoComponente - Breve descrição
 * @prop {type} nomeProp - Descrição da prop
 */
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  exemplo: {
    type: String,
    default: 'valor',
  },
})

// Emits
const emit = defineEmits(['update', 'close'])

// State
const isActive = ref(false)

// Methods
function handleClick() {
  emit('update', props.exemplo)
}
</script>

<template>
  <div class="...">
    <slot />
  </div>
</template>
```

### Checklist de Novo Componente

- [ ] Criado na pasta correta (`ui/`, `functional/`, `layout/`)
- [ ] Segue convenção PascalCase
- [ ] Props documentadas com JSDoc
- [ ] Usa componentes base quando aplicável
- [ ] Classes Tailwind organizadas
- [ ] Responsivo e acessível
- [ ] Adicionado a este catálogo
