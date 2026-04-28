# GEMINI.md - Contexto Operacional

Este arquivo serve como guia de referência rápida para o agente Gemini CLI.

## 🚀 Visão Geral do Projeto
- **Nome:** Afiliado ML (Mercado Livre)
- **Objetivo:** Sistema de afiliados para gerenciamento e exibição de produtos do Mercado Livre com UI "Premium".
- **Backend:** Node.js, Express, Sequelize, PostgreSQL, Cheerio (Scraping).
- **Frontend:** Vue 3, Vite, Tailwind 4, Pinia, Vue Router, GSAP (Animações).

## 📂 Estrutura Crítica
- `api/`: Backend e lógica de scraping.
- `client/`: Frontend Vue.js.
- `client/.agent/`: **Fonte da Verdade** para Design, Arquitetura e Regras de Negócio.

## 🛠️ Mandatos de Desenvolvimento
1. **Consultar Sempre:** Antes de qualquer alteração no frontend, ler `client/.agent/architecture.md` e `client/.agent/design-system.md`.
2. **Estética Premium:** Manter o padrão visual elevado (glassmorphism, animações GSAP, sombras suaves, tipografia refinada).
3. **Componentização:** Seguir a divisão entre `ui/` (dumb), `functional/` (smart), `layout/` e `views/`.
4. **Surgical Updates:** Realizar edições precisas e evitar refatorações desnecessárias fora do escopo.
5. **Comunicação e Colaboração:** Utilizar a skill `maestri` para colaborar com **Claude** (arquitetura/UX) e **Codex** (lógica complexa/scraping) conforme necessário.

## 🧪 Comandos Úteis
- **Client:** `npm run dev`, `npm run build`, `npm run lint`.
- **API:** `node app.js` (ou conforme configurado no ambiente).

## 📝 Notas de Memória
- O projeto usa **Tailwind 4**, que tem sintaxe e comportamentos ligeiramente diferentes das versões anteriores.
- O sistema de scraping reside em `api/services/scraping.js`.
- O banco de dados é PostgreSQL via Sequelize.
