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

ENV NODE_ENV=production \
    PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    MERCADO_LIVRE_PUPPETEER_PROFILE_DIR=/app/.puppeteer/meli-profile \
    DISPLAY=:99 \
    VNC_PORT=5900 \
    NOVNC_PORT=6080

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    xvfb \
    x11vnc \
    novnc \
    websockify

COPY api/package*.json ./
RUN npm ci --omit=dev --prefer-offline

COPY api/ ./

# Copia o build do cliente para ser servido como arquivos estáticos
COPY --from=client-builder /build/client/dist ./public

RUN chmod +x ./scripts/docker-entrypoint.sh

VOLUME ["/app/.puppeteer"]

EXPOSE 3008 6080
ENV PORT=3008

CMD ["sh", "./scripts/docker-entrypoint.sh"]
