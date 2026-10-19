# Матчи тура: время обновления Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Исправить счётчик времени с последней успешной загрузки.

**Architecture:** Компонент хранит только текущую отметку для ререндера, а количество секунд вычисляет от `since` и текущего времени. Эффект зависит от `since` и очищает интервал.

**Tech Stack:** TypeScript, React Native.

**Spec:** `docs/superpowers/specs/2026-10-19-matches-updated-ago.md`

## Global Constraints

- Не хранить счётчик как единственный источник истины.
- Очищать каждый созданный интервал.
- Учитывать новое значение `since`.

## Review Focus

- Счётчик растёт больше одной секунды.
- После нового `since` значение пересчитывается без ожидания старого интервала.
- После размонтирования не остаётся активного таймера.

### Task 1: Исправить `UpdatedAgo`

**Files:**
- Modify: `src/components/UpdatedAgo.tsx`

**Interfaces:**
- Consumes: `since: Date`.
- Produces: отображение `Обновлено N сек назад`.

- [ ] **Step 1: Вычислить секунды как разницу между `Date.now()` и `since.getTime()` с нижней границей `0`.**
- [ ] **Step 2: Пересчитывать значение при монтировании и каждую секунду, используя функциональное обновление или отдельную отметку текущего времени.**
- [ ] **Step 3: Вернуть функцию очистки интервала и зависеть от `since`.**
- [ ] **Step 4: Выполнить `npm run typecheck`.**
- [ ] **Step 5: Создать коммит `fix: refresh updated time counter`.**
