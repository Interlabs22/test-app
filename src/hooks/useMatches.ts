import { useCallback, useEffect, useRef, useState } from 'react';

import { MATCHES_URL } from '../config';
import type { ApiResponse, Match } from '../types/match';

type LoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; matches: Array<Match>; round: number; since: Date };

export function useMatches() {
  const [state, setState] = useState<LoadState>({ status: 'idle' });
  const controllerRef = useRef<AbortController | null>(null);

  const refresh = useCallback(() => {
    controllerRef.current?.abort();

    setState({ status: 'loading' });

    const controller = new AbortController();

    controllerRef.current = controller;

    fetch(MATCHES_URL, { signal: controller.signal })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        return res.json();
      })
      .then((raw: unknown) => {
        const api = raw as ApiResponse;

        if (!api || !Array.isArray(api.matches)) {
          throw new Error('Неверный формат данных');
        }
        
        setState({
          status: 'success',
          matches: api.matches,
          round: api.round,
          since: new Date(),
        });
      })
      .catch((err: Error) => {
        if (err.name !== 'AbortError') {
          setState({ status: 'error', message: err.message });
        }
      });
  }, []);

  useEffect(() => {
    refresh();

    return () => controllerRef.current?.abort();
  }, [refresh]);

  return { ...state, refresh };
}
