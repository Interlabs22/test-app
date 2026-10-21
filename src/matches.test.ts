import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { filterMatches } from './matches';
import type { Match } from './types';

function match(id: string, status: string): Match {
  return {
    id,
    startsAt: '2026-10-18T11:30:00Z',
    status,
    home: { id: 'home', name: 'Home', city: 'City' },
    away: { id: 'away', name: 'Away', city: 'City' },
    score: null,
  };
}

const matches = [
  match('scheduled', 'scheduled'),
  match('finished', 'finished'),
  match('live', 'live'),
  match('postponed', 'postponed'),
  match('other', 'abandoned'),
];

describe('filterMatches', () => {
  it('keeps only scheduled matches in upcoming', () => {
    const ids = filterMatches(matches, 'upcoming').map((item) => item.id);
    assert.deepEqual(ids, ['scheduled']);
  });

  it('keeps only finished matches in finished', () => {
    const ids = filterMatches(matches, 'finished').map((item) => item.id);
    assert.deepEqual(ids, ['finished']);
  });

  it('hides live, postponed, and unknown statuses from both narrow filters', () => {
    for (const filter of ['upcoming', 'finished'] as const) {
      const ids = filterMatches(matches, filter).map((item) => item.id);
      assert.equal(ids.includes('live'), false);
      assert.equal(ids.includes('postponed'), false);
      assert.equal(ids.includes('other'), false);
    }
  });

  it('returns every match in the same order for all', () => {
    const ids = filterMatches(matches, 'all').map((item) => item.id);
    assert.deepEqual(ids, ['scheduled', 'finished', 'live', 'postponed', 'other']);
  });
});
