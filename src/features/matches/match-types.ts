import type { z } from 'zod';
import {
  matchSchema,
  matchesResponseSchema,
  matchStatusSchema,
} from './match-schema';

export type Match = z.infer<typeof matchSchema>;
export type MatchesResponse = z.infer<typeof matchesResponseSchema>;
export type MatchStatus = z.infer<typeof matchStatusSchema>;

export type MatchFilter = 'all' | 'upcoming' | 'finished';
