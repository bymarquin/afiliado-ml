# 💼 Regras de Negócio - Afiliado ML

> Funcionalidades específicas e regras do e-commerce afiliado.

---

## 📋 Sumário

- [Visão Geral do Produto](#visão-geral-do-produto)
- [Modelo de Negócio](#modelo-de-negócio)
- [Entidades Principais](#entidades-principais)
- [Fluxos de Usuário](#fluxos-de-usuário)
- [Regras Específicas](#regras-específicas)
- [Integrações](#integrações)

---

## Visão Geral do Produto

### O que é?

**Afiliado ML** é um e-commerce de marketing de afiliados que exibe produtos de terceiros (principalmente Mercado Livre) e redireciona usuários para compra, ganhando comissão por cada venda.

### Proposta de Valor

- Curadoria de produtos com bons descontos
- Interface premium e intuitiva
- Confiança ao mostrar avaliações reais
- Comparação de preços facilitada

---

## Modelo de Negócio

### Fluxo de Monetização

```
[Usuário visita site]
    → [Navega produtos]
    → [Clica em "Add to Cart" / CTA]
    → [Redirecionado para loja afiliada (ex: ML)]
    → [Compra realizada]
    → [Afiliado recebe comissão (3-10%)]
```

### KPIs Principais

| Métrica       | Descrição                           |
| ------------- | ----------------------------------- |
| **CTR**       | Taxa de cliques nos produtos        |
| **Conversão** | % de cliques que viram vendas       |
| **RPV**       | Revenue per visitor                 |
| **LTV**       | Valor de tempo de vida do visitante |

---

## Entidades Principais

### Product

```javascript
const Product = {
  id: 'string',
  name: 'string',
  price: 'number',
  originalPrice: 'number', // Para calcular desconto
  discount: 'number', // % de desconto
  image: 'string',
  variant: 'string', // "Preto", "128GB", etc.
  category: 'string',
  affiliateUrl: 'string', // Link com tracking
  inStock: 'boolean',
  rating: 'number', // 0-5
  reviewCount: 'number',
}
```

### Category

```javascript
const Category = {
  id: 'string',
  name: 'string',
  slug: 'string', // Para URL
  icon: 'string',
  productCount: 'number',
}
```

### Testimonial

```javascript
const Testimonial = {
  id: 'string',
  author: 'string',
  role: 'string', // "Cliente verificado"
  content: 'string',
  avatar: 'string',
  rating: 'number', // 1-5
  productId: 'string', // Opcional: produto relacionado
  createdAt: 'Date',
}
```

### Benefit

```javascript
const Benefit = {
  id: 'string',
  icon: 'string',
  title: 'string',
  description: 'string',
}
```

---

## Fluxos de Usuário

### 1. Navegação e Descoberta

```
Landing Page
├── Hero Section → Destaque de oferta principal
├── Benefits → Diferenciais do serviço
├── Products Section → Grid de produtos em destaque
│   └── Cada card → [Nome, Preço, Imagem, CTA]
└── Testimonials → Prova social
```

### 2. Jornada de Clique

```
[Usuário vê produto]
    ↓
[Hover: visualiza preview]
    ↓
[Click "Add to Cart"]
    ↓
[Redirecionamento com tracking]
    ↓
[Página do produto no site afiliado]
```

> **Nota:** O botão "Add to Cart" atualmente funciona como redirecionamento direto. Não há carrinho interno.

### 3. Busca (Futuro)

```
[Usuário digita no campo de busca]
    ↓
[Debounce de 300ms]
    ↓
[Chamada à API de produtos]
    ↓
[Exibe resultados filtrados]
```

---

## Regras Específicas

### Preços e Descontos

| Regra              | Descrição                                          |
| ------------------ | -------------------------------------------------- |
| **Formato**        | Sempre em USD com símbolo `$` (ou R$ para BRL)     |
| **Desconto**       | Calculado: `((original - price) / original) * 100` |
| **Badge**          | Exibir "X% OFF" se desconto > 5%                   |
| **Arredondamento** | Preços exibidos com 2 casas decimais               |

```javascript
// Exemplo de cálculo
const discount = Math.round(((originalPrice - price) / originalPrice) * 100)
const showBadge = discount >= 5
```

### Imagens de Produtos

| Regra            | Valor                              |
| ---------------- | ---------------------------------- |
| **Aspect Ratio** | 1:1 (square)                       |
| **Fallback**     | Ícone placeholder se imagem falhar |
| **Loading**      | Lazy loading para performance      |
| **Hover**        | Scale 1.05 com transição           |

### CTAs e Links

| Contexto           | Texto do Botão          |
| ------------------ | ----------------------- |
| Card de produto    | "Add to Cart"           |
| Hero principal     | "Button" (personalizar) |
| Banner promocional | "Shop Now"              |

> **Importante:** Todos os links de afiliado devem incluir parâmetros de tracking.

### Avaliações e Reviews

| Regra        | Descrição                                     |
| ------------ | --------------------------------------------- |
| **Escala**   | 0 a 5 estrelas                                |
| **Exibição** | Estrelas visuais + número de reviews          |
| **Filtro**   | Produtos com < 3 estrelas podem ser ocultados |

---

## Integrações

### Mercado Livre API (Futuro)

```
Base URL: https://api.mercadolibre.com
Endpoints planejados:
- GET /sites/MLB/search → Busca de produtos
- GET /items/{id} → Detalhes do produto
- GET /items/{id}/reviews → Avaliações
```

### Tracking de Afiliados

Parâmetros de URL obrigatórios:

```
?utm_source=afiliado-ml
&utm_medium=website
&utm_campaign={campaign_name}
&utm_content={product_id}
&ref={affiliate_id}
```

### Analytics (Futuro)

Eventos a serem trackeados:

| Evento           | Trigger                  |
| ---------------- | ------------------------ |
| `page_view`      | Visita a qualquer página |
| `product_view`   | Visualização de produto  |
| `product_click`  | Clique em CTA            |
| `search`         | Busca realizada          |
| `filter_applied` | Filtro de categoria      |

---

## Roadmap de Features

### MVP (Atual)

- [x] Landing page responsiva
- [x] Hero section com destaque
- [x] Grid de produtos
- [x] Seção de benefícios
- [x] Testimonials
- [x] Header com navegação

### Fase 2 (Planejado)

- [ ] Busca de produtos
- [ ] Filtro por categoria
- [ ] Página de detalhes do produto
- [ ] Carousel de imagens
- [ ] Favoritos (localStorage)

### Fase 3 (Futuro)

- [ ] Integração com Mercado Livre API
- [ ] Sistema de notificações de ofertas
- [ ] Comparador de preços
- [ ] Newsletter
- [ ] PWA

---

## 🎯 Validações Importantes

Ao adicionar novos produtos ou features:

- [ ] Link de afiliado está funcionando?
- [ ] Parâmetros de tracking presentes?
- [ ] Preço está atualizado?
- [ ] Imagem carrega corretamente?
- [ ] Produto está em estoque?
- [ ] Desconto é real (não inflado)?
