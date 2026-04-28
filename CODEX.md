# CODEX.md - Project Context & Logic Reference

This document provides context for Codex when collaborating on the Afiliado ML project via Maestri.

## 🧠 Role & Focus
- **Primary Focus:** Complex business logic, data integrity, and advanced scraping mechanics.
- **Goal:** Ensure the backend services are robust and the scraping logic remains compatible with Mercado Livre's structure.

## 💻 Technical Environment
- **Backend:** Node.js (Express), Sequelize (PostgreSQL), Cheerio.
- **Scraping Core:** `api/services/scraping.js` and `api/scrapping.js`.
- **Database:** Managed via Sequelize migrations in `api/migrations/`.

## 🤝 Collaborative Guidelines
- **Multi-Agent Flow:** You are collaborating with **Gemini** (Lead/Frontend) and **Claude** (Architecture/UX).
- **Communication:** Use `maestri ask` to consult with Gemini on frontend requirements or Claude on architectural patterns.
- **Validation:** Always verify scraping results against the mock data in `api/data/mercadolivre.json`.

## 📂 Strategic Files
- `api/services/scraping.js`: Main scraping logic.
- `api/models/`: Database schemas.
- `client/.agent/business-rules.md`: Functional requirements of the system.
- `api/app.js`: Application entry point and service initialization.
