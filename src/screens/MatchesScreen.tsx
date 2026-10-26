import type { ReactNode } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { MatchCard } from '../components/MatchCard';
import { useMatches } from '../hooks/useMatches';
import type { Match } from '../types/match';

const renderItem = ({ item }: { item: Match }) => <MatchCard match={item} />;

export function MatchesScreen() {
  const state = useMatches();

  let body: ReactNode;

  if (state.status === 'idle' || state.status === 'loading') {
    body = (
      <View style={[styles.statusBox, styles.centered]}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  } else if (state.status === 'error') {
    body = (
      <View style={[styles.statusBox, styles.centered]}>
        <Text style={styles.errorText}>{state.message}</Text>
        <Pressable style={styles.button} onPress={state.refresh}>
          <Text style={styles.buttonText}>Повторить</Text>
        </Pressable>
      </View>
    );
  } else if (state.matches.length === 0) {
    body = (
      <View style={[styles.statusBox, styles.centered]}>
        <Text style={styles.emptyText}>Матчей нет</Text>
      </View>
    );
  } else {
    body = (
      <FlatList
        data={state.matches}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Матчи</Text>
        {state.status === 'success' && (
          <Text style={styles.round}>Тур {state.round}</Text>
        )}
      </View>

      {body}
    </View>
  );
}

/* ---------- стили ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  // Занимает остаток высоты под шапкой и центрирует содержимое.
  statusBox: {
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  round: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 2,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 15,
    color: '#ef3124',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});
