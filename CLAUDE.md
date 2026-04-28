# CLAUDE.md - Project Context & Collaboration

This document provides context for Claude when collaborating on the Afiliado ML project via Maestri.

## 🎯 Project Goals
- **Niche:** Affiliate marketing system for Mercado Livre (Brazilian marketplace).
- **Core Value:** Premium user experience for end-users, simple management for administrators.
- **Visual Standard:** High-end, modern UI (similar to Apple/Stripe aesthetics).

## 💻 Tech Stack (Core)
- **Frontend:** Vue 3 (Composition API), Vite, Tailwind CSS 4, GSAP (Animations), Pinia.
- **Backend:** Node.js (Express), Sequelize (ORM), PostgreSQL, Cheerio.

## 🏛️ Architecture Highlights
- **Front-end Structure:** `/client/src/components` is split into `ui/` (stateless), `functional/` (smart), and `layout/`.
- **API Structure:** `/api/` follows a classic Controller-Service-Model pattern.
- **Scraping:** Automated product data extraction from ML URLs.

## 🤝 Collaborative Guidelines
- **Multi-Agent Flow:** We are working alongside **Gemini** (orchestration/front-end) and **Codex** (complex logic/scraping).
- **Source of Truth:** Refer to files in `/client/.agent/` for detailed architectural and design rules.
- **UI/UX Reviews:** Focus on maintaining the "Premium" feel (spacing, shadows, micro-animations).
- **Code Consistency:** Follow the patterns defined in `architecture.md` (e.g., PascalCase for components, camelCase for variables).
- **Tailwind 4:** Be mindful of Tailwind CSS 4 features and breaking changes from v3.

## 📁 Key Files to Reference
- `client/.agent/design-system.md`: Color tokens and typography.
- `client/.agent/architecture.md`: Project conventions.
- `client/src/assets/main.css`: Global styles and Tailwind configuration.
- `api/app.js` & `api/models/index.js`: Backend entry points.
