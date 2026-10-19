import type { ReactElement } from 'react';
import { StyleSheet, Text, type TextStyle, View, type ViewStyle } from 'react-native';
import {
  formatMatchDate,
  formatMatchScore,
  getMatchStatusLabel,
} from '../features/matches/match-utils';
import type { Match } from '../features/matches/match-types';
import { FavoriteButton } from './FavoriteButton';

type MatchCardProps = {
  match: Match;
  isFavorite: boolean;
  isFavoritesReady: boolean;
  onToggleFavorite: (matchId: string) => void;
};

const cardStatusStyles: Record<Match['status'], ViewStyle> = {
  scheduled: { borderLeftColor: '#6b7280' },
  finished: { borderLeftColor: '#16a34a' },
  live: { borderLeftColor: '#ef3124' },
  postponed: { borderLeftColor: '#d97706' },
};

const textStatusStyles: Record<Match['status'], TextStyle> = {
  scheduled: { color: '#6b7280' },
  finished: { color: '#15803d' },
  live: { color: '#dc2626' },
  postponed: { color: '#b45309' },
};

export function MatchCard({
  match,
  isFavorite,
  isFavoritesReady,
  onToggleFavorite,
}: MatchCardProps): ReactElement {
  const score = formatMatchScore(match);
  const handleToggleFavorite = (): void => {
    onToggleFavorite(match.id);
  };

  return (
    <View style={[styles.card, cardStatusStyles[match.status]]}>
      <View style={styles.header}>
        <Text style={styles.teams}>
          {match.home.name} — {match.away.name}
        </Text>
        <FavoriteButton
          active={isFavorite}
          disabled={!isFavoritesReady}
          onPress={handleToggleFavorite}
        />
      </View>
      {score === null ? null : <Text style={styles.score}>{score}</Text>}
      <Text style={styles.cities}>
        {match.home.city ?? 'Город не указан'} — {match.away.city ?? 'Город не указан'}
      </Text>
      <Text style={styles.details}>{formatMatchDate(match.startsAt)}</Text>
      <Text style={[styles.status, textStatusStyles[match.status]]}>
        {getMatchStatusLabel(match)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
    padding: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  teams: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  score: {
    fontSize: 20,
    fontWeight: '700',
  },
  details: {
    color: '#4b5563',
  },
  cities: {
    color: '#6b7280',
  },
  status: {
    fontWeight: '700',
  },
});
