import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { filterMatches } from './matches';
import type { Match } from './types';

function match(id: string, status: string, startsAt: string | null = '2026-10-18T11:30:00Z'): Match {
  return {
    id,
    startsAt,
    status,
    home: { id: 'home', name: 'Home', city: 'City' },
    away: { id: 'away', name: 'Away', city: 'City' },
    score: null,
  };
}

const matches = [
  match('scheduled-a', 'scheduled'),
  match('finished', 'finished'),
  match('live', 'live'),
  match('postponed', 'postponed', null),
  match('scheduled-b', 'scheduled'),
  match('other', 'abandoned'),
];

describe('filterMatches', () => {
  it('lists dated upcoming matches before postponed ones', () => {
    const ids = filterMatches(matches, 'upcoming').map((item) => item.id);
    assert.deepEqual(ids, ['scheduled-a', 'scheduled-b', 'postponed']);
  });

  it('keeps only finished matches in finished', () => {
    const ids = filterMatches(matches, 'finished').map((item) => item.id);
    assert.deepEqual(ids, ['finished']);
  });

  it('hides live and unknown statuses from both narrow filters', () => {
    for (const filter of ['upcoming', 'finished'] as const) {
      const ids = filterMatches(matches, filter).map((item) => item.id);
      assert.equal(ids.includes('live'), false);
      assert.equal(ids.includes('other'), false);
    }
    assert.equal(filterMatches(matches, 'finished').some((item) => item.id === 'postponed'), false);
  });

  it('pins live matches to the top of all and keeps the other order', () => {
    const ids = filterMatches(matches, 'all').map((item) => item.id);
    assert.deepEqual(ids, ['live', 'scheduled-a', 'finished', 'postponed', 'scheduled-b', 'other']);
  });
});
