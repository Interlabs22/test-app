import { useMemo, useState } from 'react';

import { EMatchStatus, type IMatch } from '../api/types';

export type MatchFilter = 'all' | 'upcoming' | 'finished';

const filterLabels: Record<MatchFilter, string> = {
  all: 'Все',
  upcoming: 'Предстоящие',
  finished: 'Завершённые',
};

export const matchFilterOptions: MatchFilter[] = ['all', 'upcoming', 'finished'];

export function getMatchFilterLabel(filter: MatchFilter): string {
  return filterLabels[filter];
}

function isUpcomingMatch(match: IMatch): boolean {
  return (
    match.status === EMatchStatus.SCHEDULED ||
    match.status === EMatchStatus.POSTPONED
  );
}

function filterMatches(
  matches: IMatch[],
  filter: MatchFilter,
  liveOnly: boolean,
): IMatch[] {
  if (liveOnly) {
    return matches.filter((m) => m.status === EMatchStatus.LIVE);
  }

  switch (filter) {
    case 'upcoming':
      return matches.filter(isUpcomingMatch);
    case 'finished':
      return matches.filter((m) => m.status === EMatchStatus.FINISHED);
    case 'all':
    default:
      return matches;
  }
}

export function useFilteredMatches(matches: IMatch[] | undefined) {
  const [filter, setFilter] = useState<MatchFilter>('all');
  const [liveOnly, setLiveOnly] = useState(false);

  const filteredMatches = useMemo(() => {
    if (!matches?.length) {
      return [];
    }
    return filterMatches(matches, filter, liveOnly);
  }, [matches, filter, liveOnly]);

  const toggleLiveOnly = () => {
    setLiveOnly((prev) => !prev);
  };

  return {
    filter,
    setFilter,
    liveOnly,
    toggleLiveOnly,
    filteredMatches,
    isEmptySource: (matches?.length ?? 0) === 0,
    isEmptyFiltered: (matches?.length ?? 0) > 0 && filteredMatches.length === 0,
  };
}
