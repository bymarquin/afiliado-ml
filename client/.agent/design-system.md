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
- [Tokens Tailwind](#tokens-tailwind)

---

## Paleta de Cores

### Cores Principais

| Nome         | Variável               | HEX       | Uso                            |
| ------------ | ---------------------- | --------- | ------------------------------ |
| Primary      | `--color-primary`      | `#F9D52C` | CTAs, badges, links destacados |
| Primary Dark | `--color-primary-dark` | `#E6C324` | Hover do primary               |
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

### Semântica de Cores

```
Ação Principal      → primary (#F9D52C)
Ação Secundária     → gray-950 (#0F1113)
Ação Outline        → transparent + border-gray-200
Background Página   → white (#FFFFFF)
Background Cards    → gray-50 (#F4F6F8)
```

---

## Tipografia

### Font Family

```css
--font-sans: 'Inter', system-ui, sans-serif;
```

> **CDN:** Carregada via Google Fonts no `index.html`

### Escala Tipográfica

| Elemento   | Classe Tailwind | Desktop | Mobile            |
| ---------- | --------------- | ------- | ----------------- |
| H1 (Hero)  | `text-5xl`      | 48px    | 30px (`text-3xl`) |
| H2 (Seção) | `text-3xl`      | 30px    | 24px (`text-2xl`) |
| H3 (Card)  | `text-xl`       | 20px    | 18px (`text-lg`)  |
| Body       | `text-base`     | 16px    | 16px              |
| Small      | `text-sm`       | 14px    | 14px              |
| Caption    | `text-xs`       | 12px    | 12px              |

### Pesos

| Peso     | Classe          | Uso                |
| -------- | --------------- | ------------------ |
| Regular  | `font-normal`   | Corpo de texto     |
| Medium   | `font-medium`   | Links, labels      |
| Semibold | `font-semibold` | Subtítulos, badges |
| Bold     | `font-bold`     | Títulos, preços    |

---

## Espaçamentos

### Sistema de Grid

- **Max Width Container:** `1216px`
- **Padding Horizontal:**
  - Mobile: `16px` (px-4)
  - Tablet: `24px` (md:px-6)
  - Desktop: `32px` (lg:px-8)

### Espaçamentos Verticais

| Contexto             | Valor            | Classe            |
| -------------------- | ---------------- | ----------------- |
| Entre seções         | 48-80px          | `py-12` a `py-20` |
| Entre cards internos | 24-32px          | `gap-6` a `gap-8` |
| Entre elementos      | 16px             | `gap-4`           |
| Padding de botões    | 10-12px vertical | `py-2.5` a `py-3` |

---

## Bordas e Sombras

### Border Radius

| Elemento | Valor  | Classe         |
| -------- | ------ | -------------- |
| Botões   | 8px    | `rounded-lg`   |
| Cards    | 12px   | `rounded-xl`   |
| Banners  | 16px   | `rounded-2xl`  |
| Badges   | 9999px | `rounded-full` |

### Sombras

```css
/* Padrão - usado em cards elevados */
shadow-sm   → 0 1px 2px rgba(0,0,0,0.05)
shadow      → 0 1px 3px rgba(0,0,0,0.1)
shadow-lg   → 0 10px 15px rgba(0,0,0,0.1)
```

> **Nota:** Este projeto usa um estilo minimalista. Prefira bordas sutis (`border-gray-100`) ao invés de sombras pesadas.

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

```vue
<BaseButton variant="primary" size="md">
  Texto do Botão
</BaseButton>
```

| Variante  | Visual                      |
| --------- | --------------------------- |
| primary   | Fundo amarelo, texto escuro |
| secondary | Fundo escuro, texto branco  |
| outline   | Transparente, borda cinza   |

### BaseContainer

Container centralizado com max-width responsivo.

```vue
<BaseContainer>
  <!-- Conteúdo com largura máxima -->
</BaseContainer>
```

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
  --color-primary: #f9d52c;
  --color-primary-dark: #e6c324;

  /* Hero Background */
  --color-hero-bg: #545547;

  /* Font Family */
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

### Uso no Tailwind

```html
<!-- Cores -->
<div class="bg-primary text-gray-950">
  <div class="bg-gray-50 border-gray-200">
    <!-- Tipografia -->
    <p class="font-sans text-gray-800"></p>
  </div>
</div>
```

---

## 🎯 Checklist de Design

Antes de finalizar um componente, verifique:

- [ ] Usa cores do sistema (não hardcoded)
- [ ] Tipografia segue a escala definida
- [ ] Espaçamentos são múltiplos de 4px
- [ ] Bordas usam radius do sistema
- [ ] Responsivo (testado em 375px, 768px, 1440px)
- [ ] Estados hover/focus/active definidos
- [ ] Acessibilidade: contraste mínimo 4.5:1
