import { useCallback, useEffect, useRef, useState } from 'react';
import localMatchesResponse from '../../data/matches.json';
import { MATCHES_URL, USE_LOCAL_MATCHES_DATA } from '../config';
import { parseMatchesResponse } from '../features/matches/match-schema';
import type { Match } from '../features/matches/match-types';

type UseMatchesResult = {
  matches: readonly Match[];
  round: number | null;
  lastUpdatedAt: Date | null;
  isInitialLoading: boolean;
  isRefreshing: boolean;
  errorMessage: string | null;
  refresh: () => Promise<void>;
};

const loadErrorMessage = 'Не удалось загрузить матчи. Попробуйте ещё раз.';

async function fetchMatchesResponse(): Promise<unknown> {
  const response = await fetch(MATCHES_URL);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

export function useMatches(): UseMatchesResult {
  const [matches, setMatches] = useState<Match[]>([]);
  const [round, setRound] = useState<number | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasLoadedSuccessfullyRef = useRef(false);

  const refresh = useCallback(async (): Promise<void> => {
    const isInitialRequest = !hasLoadedSuccessfullyRef.current;

    if (isInitialRequest) {
      setIsInitialLoading(true);
    } else {
      setIsRefreshing(true);
    }

    setErrorMessage(null);

    try {
      const responseData: unknown = USE_LOCAL_MATCHES_DATA
        ? localMatchesResponse
        : await fetchMatchesResponse();
      const parsedResponse = parseMatchesResponse(responseData);

      setMatches(parsedResponse.matches);
      setRound(parsedResponse.round);
      setLastUpdatedAt(new Date());
      hasLoadedSuccessfullyRef.current = true;
    } catch {
      setErrorMessage(loadErrorMessage);
    } finally {
      if (isInitialRequest) {
        setIsInitialLoading(false);
      } else {
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    matches,
    round,
    lastUpdatedAt,
    isInitialLoading,
    isRefreshing,
    errorMessage,
    refresh,
  };
}
