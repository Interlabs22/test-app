import { MATCHES_URL } from './config';
import type { Match } from './types';

const LOAD_ERROR = 'Не удалось загрузить матчи';

function matchesFrom(data: unknown): Match[] {
  if (typeof data !== 'object' || data === null || !('matches' in data)) {
    throw new Error(LOAD_ERROR);
  }
  const matches = data.matches;
  if (!Array.isArray(matches)) {
    throw new Error(LOAD_ERROR);
  }
  return matches as Match[];
}

export async function fetchMatches(): Promise<Match[]> {
  let response: Response;
  try {
    response = await fetch(MATCHES_URL);
  } catch {
    throw new Error(LOAD_ERROR);
  }
  if (!response.ok) {
    throw new Error(LOAD_ERROR);
  }
  try {
    return matchesFrom(await response.json());
  } catch (caught) {
    if (caught instanceof Error && caught.message === LOAD_ERROR) {
      throw caught;
    }
    throw new Error(LOAD_ERROR);
  }
}
