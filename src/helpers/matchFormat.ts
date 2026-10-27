import { STATUS_LABELS } from '../constants';
import type { Nullable } from '../types/basic';
import type { Match } from '../types/match';
import { isNullish } from './typeGuards';

export function statusLabel({ status, minute }: Match): string {
  if (status === 'live' && !isNullish(minute)) {
    return `Идёт матч · ${minute}′`;
  }

  return STATUS_LABELS[status] ?? 'Статус неизвестен';
}

export function formatDate({ startsAt }: Match): string {
  if (isNullish(startsAt)) {
    return 'Время уточняется';
  }

  const date = new Date(startsAt);

  // Пустая строка и мусор в поле даты попадают сюда:
  // new Date("") даёт Invalid Date без исключения.
  if (Number.isNaN(date.getTime())) {
    return 'Время уточняется';
  }

  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatScore({ score }: Match): Nullable<string> {
  if (isNullish(score)) {
    return null;
  }

  return `${score.home}:${score.away}`;
}
