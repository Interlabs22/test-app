# =========================================================
# Этап 1: Базовая среда разработки (Ubuntu/Debian full)
# =========================================================
FROM node:20 AS base

WORKDIR /app

# Обновляем систему и ставим всё, что нужно Cursor и Expo
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    curl \
    wget \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Глушим xdg-open, чтобы Expo не искал браузер в контейнере
RUN ln -s /bin/true /usr/local/bin/xdg-open

# Обновляем npm до ПОСЛЕДНЕЙ стабильной версии внутри 10-й ветки
RUN npm install -g npm@10.9.2

# Создаем единую общую папку для ВСЕХ кэшей инструментов (NPM, Expo, Cursor)
RUN mkdir -p /home/dev && chmod 777 /home/dev

# Копируем ТОЛЬКО package.json
COPY package.json ./

# Чистая установка пакетов с флагом peer-зависимостей
RUN npm install --legacy-peer-deps

# Копируем остальной код
COPY . .

EXPOSE 8081 19000 19001 19002

CMD ["npm", "run", "start"]


# =========================================================
# Этап 2: Сборка веб-версии
# =========================================================
FROM base AS web-builder

ENV NODE_OPTIONS="--openssl-legacy-provider"
ENV EXPO_DEBUG=true

RUN npm run typecheck
RUN npx expo export --platform web


# =========================================================
# Этап 3: Продакшен Nginx
# =========================================================
FROM nginx:1.25-alpine AS production
COPY --from=web-builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

