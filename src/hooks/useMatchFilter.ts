import { useMemo, useState } from 'react';

import type { Match } from '../types/match';

export const MATCH_FILTERS = ['all', 'upcoming', 'finished'] as const;

export type MatchFilter = (typeof MATCH_FILTERS)[number];

const FILTER_LABELS: Record<MatchFilter, string> = {
  all: 'Все',
  upcoming: 'Предстоящие',
  finished: 'Завершённые',
};

// Пустой ответ сервера и пустая вкладка — разные сообщения: 
// «Матчей нет» при работающем сервере вводило бы в заблуждение.
const EMPTY_LABELS: Record<MatchFilter, string> = {
  all: 'Матчей нет',
  upcoming: 'Нет предстоящих матчей',
  finished: 'Нет завершённых матчей',
};

// Фильтр строится по status
// live попадает в предстоящие: матч ещё не завершён.
// postponed остаётся только во «Все»: даты нет, результата тоже нет.
// Поиск идёт по названиям обоих клубов и применяется вместе с фильтром.
export function filterMatches(
  matches: Array<Match>,
  filter: MatchFilter,
  query = '',
): Array<Match> {
  const needle = query.trim().toLowerCase();

  const found = needle
    ? matches.filter(
        (m) =>
          m.home.name.toLowerCase().includes(needle) ||
          m.away.name.toLowerCase().includes(needle),
      )
    : matches;

  if (filter === 'upcoming') {
    return found.filter((m) => m.status === 'scheduled' || m.status === 'live');
  }

  if (filter === 'finished') {
    return found.filter((m) => m.status === 'finished');
  }

  return found;
}

export function filterLabel(filter: MatchFilter): string {
  return FILTER_LABELS[filter];
}

export function useMatchFilter(all: Array<Match>) {
  const [filter, setFilter] = useState<MatchFilter>('all');
  const [query, setQuery] = useState('');

  const visible = useMemo(
    () => filterMatches(all, filter, query),
    [all, filter, query],
  );

  // Пустой сервер, пустая вкладка и пустой поиск — три разные причины.
  let emptyText = EMPTY_LABELS[filter];

  if (all.length === 0) {
    emptyText = EMPTY_LABELS.all;
  } else if (query.trim()) {
    emptyText = `Ничего не найдено по запросу «${query.trim()}»`;
  }

  return { filter, setFilter, query, setQuery, visible, emptyText };
}
