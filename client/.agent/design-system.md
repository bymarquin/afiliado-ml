# 🎨 Design System - Afiliado ML

> Sistema de design baseado no Figma do projeto E-commerce Afiliado.

---

## 📋 Sumário

- [Paleta de Cores](#paleta-de-cores)
- [Tipografia](#tipografia)
- [Espaçamentos](#espaçamentos)
- [Bordas e Sombras](#bordas-e-sombras)
- [Breakpoints](#breakpoints)
- [Componentes Base](#componentes-base)
- [Componentes Funcionais](#componentes-funcionais)
- [Padrões de UI](#padrões-de-ui)
- [Animações e Interações](#animações-e-interações)
- [Ícones](#ícones)
- [Tokens Tailwind](#tokens-tailwind)
---

## Paleta de Cores

### Cores Principais

| Nome         | Variável               | HEX       | Uso                            |
| ------------ | ---------------------- | --------- | ------------------------------ |
| Primary      | `--color-primary`      | `#2563EB` | CTAs, badges, links destacados |
| Primary Dark | `--color-primary-dark` | `#1D4ED8` | Hover do primary               |
| Hero BG      | `--color-hero-bg`      | `#545547` | Background do hero banner      |

### Escala de Cinzas

| Nome     | Variável           | HEX       | Uso                           |
| -------- | ------------------ | --------- | ----------------------------- |
| Gray 950 | `--color-gray-950` | `#0F1113` | Texto principal, títulos      |
| Gray 800 | `--color-gray-800` | `#313F49` | Texto secundário, navegação   |
| Gray 400 | `--color-gray-400` | `#AEB7BE` | Texto terciário, placeholders |
| Gray 200 | `--color-gray-200` | `#DADDE2` | Bordas, divisores             |
| Gray 100 | `--color-gray-100` | `#EAEDEE` | Bordas sutis                  |
| Gray 50  | `--color-gray-50`  | `#F4F6F8` | Backgrounds, cards hover      |

### Cores de Apoio (usadas contextualmente via Tailwind)

| Nome       | Classe Tailwind   | Uso                                        |
| ---------- | ----------------- | ------------------------------------------ |
| Blue 50    | `bg-blue-50`      | Badges, section tags, hover de ícones (bg) |
| Blue 100   | `border-blue-100` | Borda de badges e section tags             |
| Blue 600   | `text-blue-600`   | Texto de badges, ícones em hover           |
| Yellow 400 | `text-yellow-400` | Estrelas de rating                         |
| Amber 400  | `text-amber-400`  | Estrelas de rating (ReviewCard)            |
| Gray 500   | `text-gray-500`   | Texto descritivo, parágrafos de seção      |

### Semântica de Cores

```
Ação Principal      → primary (#2563EB) - Azul
Ação Secundária     → gray-950 (#0F1113) - Escuro
Ação Outline        → transparent + border-gray-200
Background Página   → white (#FFFFFF)
Background Seções   → gray-50/50 (#F4F6F8 semi-transparente)
Background Cards    → white (#FFFFFF) com border-gray-100
Background Blobs    → blue-50/30..50, primary/5 (decorativos blur-3xl)
```

---

## Tipografia

### Font Family

```css
--font-sans: 'Inter', system-ui, sans-serif;
```

> **CDN:** Carregada via Google Fonts no `index.html`

### Escala Tipográfica

| Elemento     | Classe Tailwind | Desktop | Mobile            |
| ------------ | --------------- | ------- | ----------------- |
| H1 (Hero)    | `text-7xl`      | 72px    | 36px (`text-4xl`) |
| H2 (Seção)   | `text-5xl`      | 48px    | 30px (`text-3xl`) |
| H3 (Card)    | `text-xl`       | 20px    | 18px (`text-lg`)  |
| H3 (Produto) | `text-3xl`      | 30px    | 20px (`text-xl`)  |
| Body         | `text-base`     | 16px    | 16px              |
| Small        | `text-sm`       | 14px    | 14px              |
| Caption      | `text-xs`       | 12px    | 12px              |

> **Nota:** O Hero na HomePage usa `text-4xl md:text-5xl lg:text-7xl` com `tracking-[-3px]` e `leading-[0.95]`. O Hero de Produto usa `text-xl md:text-2xl lg:text-3xl`.

### Pesos

| Peso      | Classe           | Uso                              |
| --------- | ---------------- | -------------------------------- |
| Regular   | `font-normal`    | Corpo de texto                   |
| Medium    | `font-medium`    | Links, labels, social proof      |
| Semibold  | `font-semibold`  | Subtítulos, badges, parcelamento |
| Bold      | `font-bold`      | Títulos, preços, seção headers   |
| Extrabold | `font-extrabold` | Preço principal (ProductHero)    |

---

## Espaçamentos

### Sistema de Grid

- **Max Width Container:** `1216px`
- **Padding Horizontal:**
  - Mobile: `16px` (px-4)
  - Tablet: `24px` (md:px-6)
  - Desktop: `32px` (lg:px-8)

### Espaçamentos Verticais

| Contexto               | Valor            | Classe            |
| ---------------------- | ---------------- | ----------------- |
| Entre seções (Padding) | 80-112px         | `py-20 md:py-28`  |
| Seção Reviews          | 64-96px          | `py-16 md:py-24`  |
| Section Header → Grid  | 40-56px          | `mb-10 md:mb-14`  |
| Entre cards internos   | 20-32px          | `gap-5` a `gap-8` |
| Entre elementos        | 16px             | `gap-4`           |
| Padding de botões      | 10-16px vertical | `py-2.5` a `py-4` |

---

## Bordas e Sombras

### Border Radius

| Elemento     | Valor  | Classe         |
| ------------ | ------ | -------------- |
| Botões       | 12px   | `rounded-xl`   |
| Cards        | 16px   | `rounded-2xl`  |
| Banners/Hero | 24px   | `rounded-3xl`  |
| Badges       | 9999px | `rounded-full` |
| Icon circles | 12px   | `rounded-xl`   |

### Sombras

```css
/* Padrão - usado em cards elevados */
shadow-sm   → 0 1px 2px rgba(0,0,0,0.05)
shadow      → 0 1px 3px rgba(0,0,0,0.1)
shadow-lg   → 0 10px 15px rgba(0,0,0,0.1)
shadow-xl   → Cards em hover, CTA principal
shadow-2xl  → Imagem do hero

/* Sombras Coloridas (usadas nos CTAs e hover) */
shadow-primary/25      → Botão primary CTA
shadow-blue-500/25     → Ícone de benefício em hover
shadow-blue-600/25     → Quote icon em hover (ReviewCard)
shadow-gray-950/10     → CTA secundário no Hero
shadow-gray-900/5      → Card de review em hover
```

> **Nota:** Este projeto usa sombras coloridas do Tailwind para dar profundidade semântica. Bordas sutis (`border-gray-100`) são o padrão, com sombras aplicadas em interações hover.

---

## Breakpoints

| Nome   | Min Width | Classe Tailwind |
| ------ | --------- | --------------- |
| Mobile | 0px       | (default)       |
| SM     | 640px     | `sm:`           |
| MD     | 768px     | `md:`           |
| LG     | 1024px    | `lg:`           |
| XL     | 1280px    | `xl:`           |

### Mobile-First

Sempre comece pelo mobile e adicione modificadores para telas maiores:

```html
<!-- ✅ Correto -->
<div class="text-sm md:text-base lg:text-lg">
  <!-- ❌ Evite -->
  <div class="lg:text-lg md:text-base text-sm"></div>
</div>
```

---

## Componentes Base

### BaseButton

Variantes: `primary`, `secondary`, `outline`
Tamanhos: `sm`, `md`, `lg`
Suporta: `href` (link externo), `to` (RouterLink), `disabled`

```vue
<BaseButton variant="primary" size="lg">
  Texto do Botão
</BaseButton>
```

| Variante  | Visual                     | Classes chave                                     |
| --------- | -------------------------- | ------------------------------------------------- |
| primary   | Fundo azul, texto branco   | `bg-primary text-white hover:bg-primary-dark`     |
| secondary | Fundo escuro, texto branco | `bg-gray-950 text-white hover:bg-gray-800`        |
| outline   | Transparente, borda cinza  | `bg-transparent border-gray-200 hover:bg-gray-50` |

| Tamanho | Padding       |
| ------- | ------------- |
| sm      | `px-6 py-2.5` |
| md      | `px-8 py-3`   |
| lg      | `px-10 py-4`  |

> Todos os botões usam `rounded-xl`, `transition-all duration-300`, `hover:scale-102`, `active:scale-95` e `focus-visible:outline-primary`.

### BaseContainer

Container centralizado com max-width responsivo.

```vue
<BaseContainer>
  <!-- Conteúdo com largura máxima -->
</BaseContainer>
```

### ClickSparkWrapper

Wrapper que adiciona efeito de faíscas (sparks) ao clicar. Usado nos CTAs do Hero.

```vue
<ClickSparkWrapper sparkColor="#3b82f6" :sparkRadius="50" :sparkCount="12">
  <BaseButton variant="primary" size="lg">CTA</BaseButton>
</ClickSparkWrapper>
```

---

## Componentes Funcionais

### Homepage (`HomePageView.vue`)

| Componente            | Arquivo                              | Descrição                                    |
| --------------------- | ------------------------------------ | -------------------------------------------- |
| `HeroSection`         | `functional/HeroSection.vue`         | Banner principal com parallax e social proof |
| `BenefitsSection`     | `functional/BenefitsSection.vue`     | Grid 4 colunas com ícones e tilt cards       |
| `ProductsSection`     | `functional/ProductsSection.vue`     | Carrossel horizontal de produtos             |
| `TestimonialsSection` | `functional/TestimonialsSection.vue` | Marquee duplo com scroll velocity            |

### Produto (`ProductDetailsView.vue`)

| Componente           | Arquivo                                     | Descrição                                |
| -------------------- | ------------------------------------------- | ---------------------------------------- |
| `ProductHeroSection` | `functional/product/ProductHeroSection.vue` | Hero com imagem + info sticky do produto |
| `ProductReviewCard`  | `functional/product/ProductReviewCard.vue`  | Card de avaliação anônima com estrelas   |

### Componentes Compartilhados

| Componente        | Arquivo                          | Descrição                    |
| ----------------- | -------------------------------- | ---------------------------- |
| `ProductCard`     | `functional/ProductCard.vue`     | Card de produto no carrossel |
| `TestimonialCard` | `functional/TestimonialCard.vue` | Card de depoimento           |

---

## Padrões de UI

### Section Badge (Tag de Seção)

Pílula usada como pretítulo em todas as seções. Padrão consistente no projeto inteiro:

```html
<span
  class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4"
>
  <IconComponent class="w-4 h-4 text-blue-600" />
  <!-- Opcional -->
  <span class="text-xs font-bold text-blue-600 uppercase tracking-wider">Texto</span>
</span>
```

> Pode ter ou não ícone. Quando tem, a variante animada inclui `animate-ping` (dot pulsante no Hero).

### Section Header

Padrão para cabeçalhos de seção:

```html
<div class="text-center max-w-2xl mx-auto mb-10 md:mb-14">
  <!-- Section Badge -->
  <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-950 tracking-tight mb-4">
    Título da Seção
  </h2>
  <p class="text-base md:text-lg text-gray-500">Subtítulo descritivo.</p>
</div>
```

### Background Blobs Decorativos

Padrão de blobs suaves para profundidade visual em seções:

```html
<!-- Posicionados com absolute, tamanhos fracionários, cores semi-transparentes -->
<div
  class="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-blue-50/50 blur-3xl pointer-events-none"
></div>
<div
  class="absolute -bottom-1/4 -right-1/4 w-1/3 h-1/3 rounded-full bg-amber-50/30 blur-3xl pointer-events-none"
></div>
```

> Sempre `pointer-events-none` e `blur-3xl`. Cores variam: `blue-50/30..50`, `primary/5`, `blue-400/5`, `gray-100/50`, `amber-50/30`.

### Card Pattern

Padrão base para cards interativos:

```
bg-white rounded-2xl border border-gray-100
hover:shadow-xl hover:border-gray-200 hover:-translate-y-1
transition-all duration-300
```

### Price Card

Card de destaque para preço no produto:

```html
<div class="bg-linear-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100">
  <span class="text-4xl font-extrabold text-gray-950">R$ 124,90</span>
</div>
```

### Trust Badges

Badges de confiança no rodapé do CTA:

```html
<div class="flex items-center justify-center gap-4 text-xs text-gray-400">
  <span class="flex items-center gap-1"> <Lock class="w-3.5 h-3.5" /> Compra Segura </span>
</div>
```

---

## Animações e Interações

### Stack de Animação

| Ferramenta        | Uso                                            |
| ----------------- | ---------------------------------------------- |
| **GSAP**          | Animações de entrada, timelines, ScrollTrigger |
| **ScrollTrigger** | Reveal on scroll (todas as seções)             |
| **Lenis**         | Smooth scroll com inércia premium              |
| **CSS Keyframes** | Micro-animações (shine, float, star-pulse)     |

### GSAP - Padrão de Entrada (Reveal on Scroll)

Usado em todas as seções. Elementos iniciam invisíveis e animam ao entrar no viewport:

```js
// Config padrão do GSAP
gsap.from('.element', {
  scrollTrigger: {
    trigger: '.section',
    start: 'top 80-85%',
    once: true,
  },
  y: 30 - 50,
  autoAlpha: 0,
  filter: 'blur(6-8px)',
  duration: 0.6 - 1.0,
  stagger: 0.1 - 0.15,
  ease: 'power2.out' | 'power3.out',
})
```

### Lenis (Smooth Scroll)

Ativado na `HomePageView` via composable `useLenis`:

```js
useLenis({
  lerp: 0.08,
  duration: 1.4,
  smoothWheel: true,
  smoothTouch: false, // Desativado em mobile
})
```

### Parallax (Mouse)

Usado no Hero (home e produto). Baseado em `useMouseInElement` do VueUse:

- **Desktop:** `rotateX/Y` sutil (±2deg) + `translate3d`
- **Mobile:** Desativado (`window.innerWidth < 1024`)
- Container usa `perspective: 1000px`

### Tilt Card

Usado nos BenefitsSection cards via composable `useTiltCard`:

```js
useTiltCard({
  rotateAmplitude: 10,
  scaleOnHover: 1.03,
  transitionDuration: 0.3,
})
```

### Scroll Velocity (Marquee)

Usado na `TestimonialsSection` via composable `useScrollVelocity`:

```js
useScrollVelocity(rowRef, {
  baseVelocity: 50,
  direction: 'left' | 'right',
  triggerSelector: '.testimonial-section',
})
```

### Micro-Animações CSS

| Nome           | Uso                           | Propriedade         |
| -------------- | ----------------------------- | ------------------- |
| `animate-ping` | Dot pulsante no badge         | `scale` + `opacity` |
| `shine`        | Efeito brilho em cards hover  | `translateX`        |
| `float`        | Flutuação sutil (5s loop)     | `translateY`        |
| `star-appear`  | Stars surgindo (rotate+scale) | `scale` + `rotate`  |
| `star-pulse`   | Stars pulsando no hover       | `scale`             |

---

## Ícones

**Biblioteca:** `lucide-vue-next`

### Ícones Usados

| Ícone           | Componente                           | Contexto                    |
| --------------- | ------------------------------------ | --------------------------- |
| `ArrowRight`    | HeroSection                          | CTA primário                |
| `Play`          | HeroSection                          | CTA secundário              |
| `Star`          | HeroSection, ProductHero, ReviewCard | Ratings                     |
| `ChevronLeft`   | ProductsSection                      | Navegação carrossel         |
| `ChevronRight`  | ProductsSection                      | Navegação carrossel         |
| `MessageCircle` | ProductDetailsView                   | Badge seção de reviews      |
| `BadgeCheck`    | ProductHeroSection                   | Vendedor verificado         |
| `ShoppingCart`  | ProductHeroSection                   | CTA "Comprar Agora"         |
| `ExternalLink`  | ProductHeroSection                   | Indicador de link externo   |
| `Lock`          | ProductHeroSection                   | Trust badge "Compra Segura" |
| `CreditCard`    | ProductHeroSection                   | Trust badge "Parcelamento"  |
| `Quote`         | ProductReviewCard                    | Ícone decorativo de citação |

---

## Composables

| Nome                 | Arquivo                          | Uso                                      |
| -------------------- | -------------------------------- | ---------------------------------------- |
| `useLenis`           | `composables/useLenis`           | Smooth scroll com inércia                |
| `useAnimatedCounter` | `composables/useAnimatedCounter` | Contagem animada (social proof no Hero)  |
| `useBenefits`        | `composables/useBenefits`        | Dados e ícones dos cards de benefícios   |
| `useTiltCard`        | `composables/useTiltCard`        | Efeito tilt 3D nos cards em hover        |
| `useProducts`        | `composables/useProducts`        | Dados de produtos + lógica do carrossel  |
| `useProductCarousel` | `composables/useProducts`        | Scroll do carrossel de produtos          |
| `useTestimonials`    | `composables/useTestimonials`    | Dados de depoimentos + lista infinita    |
| `useScrollVelocity`  | `composables/useScrollVelocity`  | Marquee com velocidade baseada em scroll |

---

## Tokens Tailwind

Arquivo: `src/assets/main.css`

```css
@theme {
  /* Cores do Design (Figma) */
  --color-gray-950: #0f1113;
  --color-gray-800: #313f49;
  --color-gray-400: #aeb7be;
  --color-gray-200: #dadde2;
  --color-gray-100: #eaedee;
  --color-gray-50: #f4f6f8;

  /* Cores de Ação */
  --color-primary: #2563eb;
  --color-primary-dark: #1d4ed8;

  /* Hero Background */
  --color-hero-bg: #545547;

  /* Font Family */
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

### Estilos Base Globais

```css
/* Anti-aliasing */
body {
  -webkit-font-smoothing: antialiased;
}

/* Focus visible para acessibilidade */
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Custom scrollbar com gradiente + hover primary */
::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--color-gray-400), var(--color-gray-800));
}
::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, var(--color-primary), var(--color-primary-dark));
}
```

### Uso no Tailwind

```html
<!-- Cores -->
<div class="bg-primary text-white">
  <div class="bg-gray-50 border-gray-100">
    <!-- Tipografia -->
    <p class="font-sans text-gray-800"></p>
  </div>
</div>
```

---

## Admin Pages Pattern

### Estrutura Base

- Use `AdminLayout` para todas as abas internas do Admin.
- `title` e `mobileTitle` devem ser passados via props.
- `title-icon` e `header-actions` devem ser passados por slot.
- Conteúdo da aba deve ser renderizado no slot default.

```vue
<AdminLayout title="Título da Aba" mobileTitle="Painel Admin">
  <template #title-icon>
    <Icon class="w-7 h-7 text-gray-950" />
  </template>

  <template #header-actions>
    <BaseButton variant="primary" size="sm">Ação</BaseButton>
  </template>

  <!-- Conteúdo da aba -->
</AdminLayout>
```

### Regras Visuais Admin

- Background do shell: `bg-gray-50`
- Card principal: `bg-white rounded-2xl border border-gray-100 shadow-sm`
- Header da aba: `text-2xl md:text-3xl font-semibold text-gray-950`
- Ações principais: usar `BaseButton` (evitar botão hardcoded)
- Sidebar itens: `rounded-xl`, `duration-300`, foco visível e `group-hover` funcional

### Responsividade (obrigatório para cada nova aba)

- Mobile (`<640px`): 1 coluna, sem overflow horizontal.
- Tablet (`>=768px`): ajustes de padding e grids com 2 colunas quando aplicável.
- Desktop (`>=1024px`): sidebar fixa + conteúdo com `lg:ml-64`.
- Pontos de verificação mínimos: `375px`, `768px`, `1440px`.

## 🎯 Checklist de Design

Antes de finalizar um componente, verifique:

- [ ] Usa cores do sistema (não hardcoded)
- [ ] Tipografia segue a escala definida
- [ ] Espaçamentos são múltiplos de 4px
- [ ] Bordas usam radius do sistema (`rounded-xl` ou `rounded-2xl`)
- [ ] Responsivo (testado em 375px, 768px, 1440px)
- [ ] Estados hover/focus/active definidos
- [ ] Acessibilidade: contraste mínimo 4.5:1
- [ ] Section Badge com padrão consistente (blue-50 pill)
- [ ] GSAP reveal on scroll com `once: true`
- [ ] Parallax desativado em mobile (`< 1024px`)
- [ ] `aria-label` em botões com apenas ícone
- [ ] Background blobs com `pointer-events-none` e `blur-3xl`
