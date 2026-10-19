import type { Match, MatchFilter } from './match-types';

const dateTimeFormatter = new Intl.DateTimeFormat('ru-RU', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function filterMatches(matches: readonly Match[], filter: MatchFilter): Match[] {
  if (filter === 'all') {
    return [...matches];
  }

  const status = filter === 'upcoming' ? 'scheduled' : 'finished';

  return matches.filter((match) => match.status === status);
}

export function formatMatchDate(startsAt: string | null): string {
  if (startsAt === null) {
    return 'Время не назначено';
  }

  const matchDate = new Date(startsAt);

  if (Number.isNaN(matchDate.getTime())) {
    return 'Дата неизвестна';
  }

  return dateTimeFormatter.format(matchDate);
}

export function formatMatchScore(match: Match): string | null {
  if (match.score === null) {
    return null;
  }

  return `${match.score.home} : ${match.score.away}`;
}

export function getMatchStatusLabel(match: Match): string {
  switch (match.status) {
    case 'scheduled':
      return 'Запланирован';
    case 'finished':
      return 'Завершён';
    case 'live':
      return match.minute === undefined ? 'Идёт' : `Идёт, ${match.minute}-я минута`;
    case 'postponed':
      return 'Перенесён';
  }
}
