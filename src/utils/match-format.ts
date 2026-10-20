import { EMatchStatus, type IMatch } from '../api/types';

const statusLabels: Record<EMatchStatus, string> = {
  [EMatchStatus.SCHEDULED]: 'Запланирован',
  [EMatchStatus.LIVE]: 'Идёт',
  [EMatchStatus.FINISHED]: 'Завершён',
  [EMatchStatus.POSTPONED]: 'Перенесён',
};

export function getMatchStatusLabel(match: IMatch): string {
  if (match.status === EMatchStatus.LIVE && match.minute != null) {
    return `${statusLabels[EMatchStatus.LIVE]}, ${match.minute}′`;
  }
  return statusLabels[match.status];
}

export function formatMatchStart(startsAt: string | null): string {
  if (!startsAt) {
    return 'Дата уточняется';
  }
  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatScore(match: IMatch): string | null {
  if (match.score == null) {
    return null;
  }
  return `${match.score.home} : ${match.score.away}`;
}
