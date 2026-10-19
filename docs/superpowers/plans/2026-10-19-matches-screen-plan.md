# Матчи тура: экран Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Собрать экран матчей с запросом, всеми состояниями, фильтрацией, обновлением и избранным.

**Architecture:** Хук загрузки изолирует запрос, валидацию и состояние обновления. Экран выбирает один из экранных состояний и передаёт готовые данные небольшой карточке матча.

**Tech Stack:** Expo SDK 57, React Native, TypeScript, Zod.

**Spec:** `docs/superpowers/specs/2026-10-19-matches-screen.md`

## Global Constraints

- Получать данные только по `MATCHES_URL`.
- Ошибка повторного обновления не удаляет ранее загруженные матчи.
- Использовать `FlatList`, `Pressable` и `StyleSheet.create`.
- Не превышать 200 строк в новом или изменённом файле.

## Review Focus

- Первая ошибка и ошибка повторного обновления имеют разные UI-состояния.
- Пустой успешный ответ не путается с ошибкой.
- Нажатие на звезду не инициирует обновление списка.
- Карточка перенесённого матча не ломается из-за отсутствующей даты и счёта.
- `UpdatedAgo` получает время только успешной загрузки.

### Task 1: Хук загрузки матчей

**Files:**
- Create: `src/hooks/useMatches.ts`

**Interfaces:**
- Consumes: `MATCHES_URL`, `parseMatchesResponse`.
- Produces: `matches`, `lastUpdatedAt`, `isInitialLoading`, `isRefreshing`, `errorMessage`, `refresh(): Promise<void>`.

- [ ] **Step 1: Реализовать запрос с проверкой `response.ok` и валидацией JSON как `unknown`.**
- [ ] **Step 2: Загружать данные при монтировании и предоставлять повторную загрузку.**
- [ ] **Step 3: Сохранять предыдущие матчи при ошибке повторного обновления; обновлять `lastUpdatedAt` только после успешного ответа.**
- [ ] **Step 4: Выполнить `npm run typecheck`.**

### Task 2: Карточка матча

**Files:**
- Create: `src/components/MatchCard.tsx`

**Interfaces:**
- Consumes: `match: Match`, `isFavorite: boolean`, `onToggleFavorite(): void`.
- Produces: карточку с командами, счётом, датой, статусом и `FavoriteButton`.

- [ ] **Step 1: Отобразить данные матча через функции из `match-utils.ts`.**
- [ ] **Step 2: Передать обработчик только в `FavoriteButton`.**
- [ ] **Step 3: Выполнить `npm run typecheck`.**

### Task 3: Собрать `MatchesScreen`

**Files:**
- Modify: `src/screens/MatchesScreen.tsx`

**Interfaces:**
- Consumes: `useMatches`, `useFavorites`, `filterMatches`, `MatchCard`, `UpdatedAgo`.
- Produces: полностью работоспособный экран задания.

- [ ] **Step 1: Добавить состояние выбранного фильтра и кнопки фильтров.**
- [ ] **Step 2: Отобразить первую загрузку, ошибку с «Повторить», пустой экран и список через `FlatList`.**
- [ ] **Step 3: Добавить кнопку «Обновить», сообщение о неудачном повторном обновлении и `UpdatedAgo` после первой успешной загрузки.**
- [ ] **Step 4: Проверить экран в браузере через `npm run web` и вручную пройти загрузку, фильтры, избранное, обновление, пустой ответ и ошибку.**
- [ ] **Step 5: Выполнить `npm run typecheck`.**
- [ ] **Step 6: Создать коммит `feat: implement matches screen`.**
