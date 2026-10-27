import { useCallback, useEffect, useRef, useState } from 'react';

import { MATCHES_URL } from '../config';
import { isNullish } from '../helpers/typeGuards';
import type { Nullable } from '../types/basic';
import type { ApiResponse, Match } from '../types/match';

type LoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; matches: Array<Match>; round: number; since: Date };

export function useMatches() {
  const [state, setState] = useState<LoadState>({ status: 'idle' });
  const controllerRef = useRef<Nullable<AbortController>>(null);

  const refresh = useCallback(async () => {
    // Повторный запрос отменяет предыдущий, иначе поздний ответ
    // перезапишет более свежий.
    controllerRef.current?.abort();

    setState({ status: 'loading' });

    const controller = new AbortController();

    controllerRef.current = controller;

    try {
      const res = await fetch(MATCHES_URL, { signal: controller.signal });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const raw: unknown = await res.json();
      const api = raw as ApiResponse;

      if (isNullish(api) || !Array.isArray(api.matches)) {
        throw new Error('Неверный формат данных');
      }

      setState({
        status: 'success',
        matches: api.matches,
        round: api.round,
        since: new Date(),
      });
    } catch (err) {
      const error = err as Error;

      // Отменённый запрос — не ошибка: пользователь нажал «Обновить» снова.
      if (error.name !== 'AbortError') {
        setState({ status: 'error', message: error.message });
      }
    }
  }, []);

  useEffect(() => {
    refresh();

    return () => controllerRef.current?.abort();
  }, [refresh]);

  return { ...state, refresh };
}
