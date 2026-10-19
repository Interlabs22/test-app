import matchesResponse from '../../../../data/matches.json';
import { parseMatchesResponse } from '../match-schema';
import {
  filterMatches,
  formatMatchDate,
  formatMatchScore,
  getMatchStatusLabel,
} from '../match-utils';

const matches = parseMatchesResponse(matchesResponse).matches;

describe('match utilities', () => {
  it('фильтрует предстоящие и завершённые матчи', () => {
    expect(filterMatches(matches, 'all')).toHaveLength(8);
    expect(filterMatches(matches, 'upcoming').map((match) => match.id)).toEqual([
      'm5',
      'm6',
      'm8',
    ]);
    expect(filterMatches(matches, 'finished').map((match) => match.id)).toEqual([
      'm1',
      'm2',
      'm3',
    ]);
  });

  it('не относит текущие и перенесённые матчи к фильтрам', () => {
    expect(filterMatches(matches, 'upcoming').map((match) => match.id)).not.toContain('m4');
    expect(filterMatches(matches, 'finished').map((match) => match.id)).not.toContain('m7');
  });

  it('сохраняет нулевой счёт', () => {
    const drawMatch = matches.find((match) => match.id === 'm2');

    expect(drawMatch).toBeDefined();

    if (drawMatch !== undefined) {
      expect(formatMatchScore(drawMatch)).toBe('0 : 0');
    }
  });

  it('обрабатывает отсутствующее время и особые статусы', () => {
    const liveMatch = matches.find((match) => match.id === 'm4');
    const postponedMatch = matches.find((match) => match.id === 'm7');

    expect(formatMatchDate(null)).toBe('Время не назначено');
    expect(liveMatch).toBeDefined();
    expect(postponedMatch).toBeDefined();

    if (liveMatch !== undefined) {
      expect(getMatchStatusLabel(liveMatch)).toBe('Идёт, 67-я минута');
    }

    if (postponedMatch !== undefined) {
      expect(getMatchStatusLabel(postponedMatch)).toBe('Перенесён');
    }
  });
});
