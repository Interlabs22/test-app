import { useQuery } from '@tanstack/react-query';

import { apiFetch } from '../api';
import type { IRoundData } from '../api/types';

export const matchesQueryKey = ['matches'] as const;

async function fetchMatches(): Promise<IRoundData> {
  return apiFetch<IRoundData>('/matches.json');
}

export function useMatchesQuery() {
  return useQuery({
    queryKey: matchesQueryKey,
    queryFn: fetchMatches,
  });
}
