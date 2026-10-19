# Матчи тура: данные и фильтрация Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Валидировать ответ API и подготовить типизированные функции отображения и фильтрации матчей.

**Architecture:** Отделить сетевой формат от UI-логики. Схема Zod проверяет неизвестный JSON, а чистые функции форматируют статус, счёт, дату и применяют фильтр.

**Tech Stack:** TypeScript, Zod, React Native.

**Spec:** `docs/superpowers/specs/2026-10-19-matches-data-and-filters.md`

## Global Constraints

- Не использовать `any` или type assertion.
- Обрабатывать `score: null` и `startsAt: null`.
- Отображать дату только через локаль и часовой пояс устройства.

## Review Focus

- Ничья `0:0` не должна превращаться в отсутствие счёта.
- Перенесённый матч без даты не должен создавать `Invalid Date`.
- Первый элемент фильтра не должен зависеть от порядка массива.
- Неизвестный формат API не должен попадать в UI.

### Task 1: Схема и типы матчей

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/features/matches/match-schema.ts`
- Create: `src/features/matches/match-types.ts`

**Interfaces:**
- Produces: `parseMatchesResponse(value: unknown): MatchesResponse`.
- Produces: `Match`, `MatchStatus`, `MatchFilter`.

- [ ] **Step 1: Добавить `zod` совместимой с Expo командой `npx expo install zod`.**
- [ ] **Step 2: Описать схему команды, счёта, матча и ответа API в `match-schema.ts`; экспортировать `parseMatchesResponse`.**
- [ ] **Step 3: Вывести типы из схемы в `match-types.ts`, не дублируя структуру данных вручную.**
- [ ] **Step 4: Выполнить `npm run typecheck`.**
- [ ] **Step 5: Создать коммит `feat: add validated match data model`.**

### Task 2: Форматирование и фильтрация

**Files:**
- Create: `src/features/matches/match-utils.ts`

**Interfaces:**
- Consumes: `Match`, `MatchFilter`, `MatchStatus`.
- Produces: `filterMatches(matches: readonly Match[], filter: MatchFilter): Match[]`.
- Produces: `formatMatchDate(startsAt: string | null): string`, `formatMatchScore(match: Match): string | null`, `getMatchStatusLabel(match: Match): string`.

- [ ] **Step 1: Реализовать фильтрацию: `scheduled` только в предстоящих, `finished` только в завершённых, остальные статусы только во «Все».**
- [ ] **Step 2: Реализовать форматирование счёта с сохранением нулевых значений.**
- [ ] **Step 3: Реализовать форматирование даты через `Intl.DateTimeFormat` и текст для отсутствующей даты.**
- [ ] **Step 4: Выполнить `npm run typecheck`.**
- [ ] **Step 5: Создать коммит `feat: add match formatting and filters`.**
