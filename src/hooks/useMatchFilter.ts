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
export function filterMatches(matches: Array<Match>, filter: MatchFilter): Array<Match> {
  if (filter === 'upcoming') {
    return matches.filter((m) => m.status === 'scheduled' || m.status === 'live');
  }

  if (filter === 'finished') {
    return matches.filter((m) => m.status === 'finished');
  }
  
  return matches;
}

export function filterLabel(filter: MatchFilter): string {
  return FILTER_LABELS[filter];
}

export function useMatchFilter(all: Array<Match>) {
  const [filter, setFilter] = useState<MatchFilter>('all');

  const visible = useMemo(() => filterMatches(all, filter), [all, filter]);

  const emptyText = all.length === 0 ? EMPTY_LABELS.all : EMPTY_LABELS[filter];

  return { filter, setFilter, visible, emptyText };
}
