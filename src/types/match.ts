import type { Nullable } from './basic';

export type MatchFilter = 'all' | 'upcoming' | 'finished';

export type Team = {
  id: string;
  name: string;
  city: string;
};

export type Score = {
  home: number;
  away: number;
};

export type MatchStatus = "scheduled" | "live" | "finished" | "postponed"

export type Match = {
  id: string;
  startsAt: Nullable<string>;
  status: MatchStatus;
  minute?: number;
  home: Team;
  away: Team;
  score: Nullable<Score>;
};

export type ApiResponse = {
  round: number;
  matches: Array<Match>;
};
