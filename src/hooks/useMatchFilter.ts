import { useEffect, useMemo, useRef, useState } from 'react';

import type { Nullable } from '../types/basic';
import type { Match, MatchFilter } from '../types/match';

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
        (match) =>
          match.home.name.toLowerCase().includes(needle) ||
          match.away.name.toLowerCase().includes(needle),
      )
    : matches;

  if (filter === 'upcoming') {
    return found.filter((match) => match.status === 'scheduled' || match.status === 'live');
  }

  if (filter === 'finished') {
    return found.filter((match) => match.status === 'finished');
  }

  return found;
}

// Пустой ответ сервера и пустая вкладка — разные сообщения:
// «Матчей нет» при работающем сервере вводило бы в заблуждение.
const EMPTY_LABELS: Record<MatchFilter, string> = {
  all: 'Матчей нет',
  upcoming: 'Нет предстоящих матчей',
  finished: 'Нет завершённых матчей',
};

export function useMatchFilter(all: Array<Match>) {
  const [filter, setFilter] = useState<MatchFilter>('all');
  const [query, setQuery] = useState('');

  // Debounce: поле ввода мгновенное, а список пересчитывается после паузы
  // 200 мс. Без этого filterMatches вызывался бы на каждый символ.
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const timerRef = useRef<Nullable<ReturnType<typeof setTimeout>>>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => setDebouncedQuery(query), 200);
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [query]);

  const visible = useMemo(
    () => filterMatches(all, filter, debouncedQuery),
    [all, filter, debouncedQuery],
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
