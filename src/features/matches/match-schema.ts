import { z } from 'zod';
import type { MatchesResponse } from './match-types';

export const matchStatusSchema = z.enum(['scheduled', 'finished', 'live', 'postponed']);

const teamSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  city: z.string().min(1).optional(),
});

const scoreSchema = z.object({
  home: z.number().int().nonnegative(),
  away: z.number().int().nonnegative(),
});

export const matchSchema = z.object({
  id: z.string().min(1),
  startsAt: z.iso.datetime().nullable(),
  status: matchStatusSchema,
  minute: z.number().int().nonnegative().optional(),
  home: teamSchema,
  away: teamSchema,
  score: scoreSchema.nullable(),
});

export const matchesResponseSchema = z.object({
  round: z.number().int().positive(),
  matches: z.array(matchSchema),
});

export function parseMatchesResponse(value: unknown): MatchesResponse {
  return matchesResponseSchema.parse(value);
}
