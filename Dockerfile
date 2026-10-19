# =========================================================
# Этап 1: Базовая среда разработки
# =========================================================
FROM node:20 AS base

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    curl \
    wget \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Expo не должен открывать браузер внутри контейнера
RUN ln -sf /bin/true /usr/local/bin/xdg-open

RUN npm install -g npm@10.9.2

# Кэши npm/Expo/Cursor — монтируется томом dev-home в compose, не на хост
RUN mkdir -p /home/dev && chmod 777 /home/dev

ENV EXPO_NO_BROWSER=1 \
    HOME=/home/dev \
    npm_config_cache=/home/dev/.npm

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .

EXPOSE 8081 19000 19001 19002

CMD ["npm", "run", "start"]


# =========================================================
# Этап 2: Сборка веб-версии
# =========================================================
FROM base AS web-builder

ENV NODE_OPTIONS="--openssl-legacy-provider" \
    EXPO_DEBUG=true \
    CI=true

RUN npm run typecheck
RUN npx expo export --platform web


# =========================================================
# Этап 3: Продакшен Nginx
# =========================================================
FROM nginx:1.25-alpine AS production
COPY --from=web-builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
