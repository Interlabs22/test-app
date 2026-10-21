import { StyleSheet, Text, View } from 'react-native';
import { FavoriteButton } from './FavoriteButton';
import { formatKickoff, formatScore, formatStatus } from '../matches';
import type { Match } from '../types';

type Props = {
  match: Match;
  favorite: boolean;
  onToggleFavorite: () => void;
};

function clubName(name: string | undefined): string {
  return name ? name : '—';
}

export function MatchCard({ match, favorite, onToggleFavorite }: Props) {
  const score = formatScore(match);
  const title = score
    ? `${clubName(match.home?.name)} ${score} ${clubName(match.away?.name)}`
    : `${clubName(match.home?.name)} — ${clubName(match.away?.name)}`;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        <FavoriteButton active={favorite} onPress={onToggleFavorite} />
      </View>
      <Text style={styles.meta}>{formatKickoff(match.startsAt)}</Text>
      <Text style={styles.meta}>{formatStatus(match)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: '#e5e7eb',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    padding: 12,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    color: '#4b5563',
    fontSize: 14,
    marginTop: 4,
  },
});
