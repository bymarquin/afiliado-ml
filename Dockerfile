# ── Stage 1: Build Vue client ────────────────────────────────────────────────
FROM node:22-alpine AS client-builder
WORKDIR /build/client

COPY client/package*.json ./
RUN npm ci --prefer-offline

COPY client/ ./
RUN npm run build

# ── Stage 2: API runtime ──────────────────────────────────────────────────────
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production

COPY api/package*.json ./
RUN npm ci --omit=dev --prefer-offline

COPY api/ ./

# Copia o build do cliente para ser servido como arquivos estáticos
COPY --from=client-builder /build/client/dist ./public

EXPOSE 3008
ENV PORT=3008

CMD ["sh", "-c", "npx sequelize-cli db:migrate && node app.js"]
