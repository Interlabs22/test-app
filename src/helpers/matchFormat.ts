import type { Match, MatchStatus } from '../types/match';

const STATUS_LABELS: Record<MatchStatus, string> = {
  scheduled: 'Скоро',
  live: 'Идёт матч',
  finished: 'Завершён',
  postponed: 'Перенесён',
};

export function statusLabel(m: Match): string {
  if (m.status === 'live' && m.minute != null) {
    return `Идёт матч · ${m.minute}′`;
  }
  
  return STATUS_LABELS[m.status] ?? 'Статус неизвестен';
}

export function formatDate(m: Match): string {
  if (!m.startsAt) {
    return 'Время уточняется';
  }

  const d = new Date(m.startsAt);

  if (Number.isNaN(d.getTime())) {
    return 'Время уточняется';
  }

  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatScore(m: Match): string | null {
  return m.score ? `${m.score.home}:${m.score.away}` : null;
}
