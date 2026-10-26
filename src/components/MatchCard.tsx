import { StyleSheet, Text, View } from 'react-native';

import { formatDate, formatScore, statusLabel } from '../helpers/matchFormat';
import type { Match } from '../types/match';

type Props = {
  match: Match;
};

// Карточка матча: команды, счёт (если он есть), дата в поясе устройства и статус.
export function MatchCard({ match }: Props) {
  const score = formatScore(match);

  return (
    <View style={styles.card}>
      <Text style={styles.teams} numberOfLines={2}>
        {match.home.name} — {match.away.name}
      </Text>

      {score != null && <Text style={styles.score}>{score}</Text>}

      <View style={styles.footer}>
        <Text style={styles.date}>{formatDate(match)}</Text>
        <Text style={styles.status}>{statusLabel(match)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    marginBottom: 8,
  },
  teams: {
    fontSize: 15,
    fontWeight: '500',
    flexShrink: 1,
  },
  score: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  date: {
    fontSize: 13,
    color: '#6b7280',
  },
  status: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
