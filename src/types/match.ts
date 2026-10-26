export type Team = {
  id: string;
  name: string;
  city: string;
};

export type Score = {
  home: number;
  away: number;
};

export const MATCH_STATUSES = ['scheduled', 'live', 'finished', 'postponed'] as const;
export type MatchStatus = (typeof MATCH_STATUSES)[number];

export type Match = {
  id: string;
  startsAt: string | null;
  status: MatchStatus;
  minute?: number;
  home: Team;
  away: Team;
  score: Score | null;
};

export type ApiResponse = {
  round: number;
  matches: Array<Match>;
};
