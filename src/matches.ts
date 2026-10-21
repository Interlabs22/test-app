import type { Match, MatchFilter } from './types';

function hasKickoff(match: Match): boolean {
  return typeof match.startsAt === 'string' && match.startsAt.length > 0 && !Number.isNaN(new Date(match.startsAt).getTime());
}

export function filterMatches(matches: Match[], filter: MatchFilter): Match[] {
  if (filter === 'upcoming') {
    const upcoming = matches.filter((match) => match.status === 'scheduled' || match.status === 'postponed');
    return [...upcoming.filter(hasKickoff), ...upcoming.filter((match) => !hasKickoff(match))];
  }
  if (filter === 'finished') {
    return matches.filter((match) => match.status === 'finished');
  }
  return [...matches.filter((match) => match.status === 'live'), ...matches.filter((match) => match.status !== 'live')];
}

export function formatScore(match: Match): string | null {
  const score = match.score;
  if (score === null) {
    return null;
  }
  if (typeof score.home !== 'number' || typeof score.away !== 'number') {
    return null;
  }
  return `${score.home}:${score.away}`;
}

export function formatKickoff(startsAt: string | null): string {
  if (!startsAt) {
    return 'Дата не назначена';
  }
  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) {
    return 'Дата не назначена';
  }
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatStatus(match: Match): string {
  switch (match.status) {
    case 'finished':
      return 'Завершён';
    case 'scheduled':
      return 'Предстоящий';
    case 'postponed':
      return 'Перенесён';
    case 'live':
      return typeof match.minute === 'number' ? `Идёт, ${match.minute}′` : 'Идёт';
    default:
      return match.status;
  }
}
