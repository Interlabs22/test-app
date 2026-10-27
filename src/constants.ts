import type { MatchFilter, MatchStatus } from './types/match';

// Переключатель вкладок: Все / Предстоящие / Завершённые.
export const MATCH_FILTERS: Array<MatchFilter> = ['all', 'upcoming', 'finished']

// Подписи фильтров для UI.
export const FILTER_LABELS: Record<MatchFilter, string> = {
  all: 'Все',
  upcoming: 'Предстоящие',
  finished: 'Завершённые',
};

// Подписи статусов для UI.
export const STATUS_LABELS: Record<MatchStatus, string> = {
  scheduled: 'Скоро',
  live: 'Идёт матч',
  finished: 'Завершён',
  postponed: 'Перенесён',
};
