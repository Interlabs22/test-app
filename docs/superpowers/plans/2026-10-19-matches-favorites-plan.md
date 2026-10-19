# Матчи тура: избранное Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Исправить хранение и переключение избранных матчей.

**Architecture:** Хук остаётся единственным владельцем состояния. Он проверяет наличие идентификатора через `includes` и заменяет массив функциональным обновлением состояния.

**Tech Stack:** TypeScript, React.

**Spec:** `docs/superpowers/specs/2026-10-19-matches-favorites.md`

## Global Constraints

- Хранить избранное только в памяти.
- Не мутировать массив состояния.
- Не менять API `FavoriteButton` без необходимости.

## Review Focus

- Матч с индексом `0` корректно определяется как избранный.
- Быстрые повторные нажатия используют актуальное состояние.
- Переключение одного матча не меняет другие идентификаторы.

### Task 1: Исправить `useFavorites`

**Files:**
- Modify: `src/hooks/useFavorites.ts`

**Interfaces:**
- Produces: `isFavorite(id: string): boolean` и `toggle(id: string): void` с прежними именами.

- [ ] **Step 1: Заменить индексную проверку на проверку наличия идентификатора.**
- [ ] **Step 2: Реализовать `toggle` через функциональный вызов `setFavorites`, возвращающий новый массив.**
- [ ] **Step 3: Убедиться, что первый добавленный идентификатор возвращает `true` из `isFavorite`.**
- [ ] **Step 4: Выполнить `npm run typecheck`.**
- [ ] **Step 5: Создать коммит `fix: update favorites immutably`.**
