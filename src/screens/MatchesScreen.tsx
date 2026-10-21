import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { fetchMatches } from '../api';
import { MatchCard } from '../components/MatchCard';
import { UpdatedAgo } from '../components/UpdatedAgo';
import { useFavorites } from '../hooks/useFavorites';
import { filterMatches } from '../matches';
import type { Match, MatchFilter } from '../types';

const FILTERS: { id: MatchFilter; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'upcoming', label: 'Предстоящие' },
  { id: 'finished', label: 'Завершённые' },
];

const LOAD_ERROR = 'Не удалось загрузить матчи';

export function MatchesScreen() {
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<MatchFilter>('all');
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const requestId = useRef(0);
  const matchesRef = useRef(matches);
  matchesRef.current = matches;
  const { isFavorite, toggle } = useFavorites();

  const load = useCallback(async () => {
    const id = ++requestId.current;
    if (matchesRef.current === null) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const next = await fetchMatches();
      if (id !== requestId.current) {
        return;
      }
      setMatches(next);
      setUpdatedAt(new Date());
      setError(null);
    } catch (caught) {
      if (id !== requestId.current) {
        return;
      }
      const message = caught instanceof Error && caught.message ? caught.message : LOAD_ERROR;
      setError(message);
    } finally {
      if (id === requestId.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = matches === null ? [] : filterMatches(matches, filter);

  function renderBody() {
    if (loading && matches === null) {
      return <ActivityIndicator style={styles.spinner} />;
    }
    if (error && matches === null) {
      return (
        <View style={styles.status}>
          <Text style={styles.error}>{error}</Text>
          <Pressable style={styles.button} onPress={() => void load()}>
            <Text style={styles.buttonText}>Повторить</Text>
          </Pressable>
        </View>
      );
    }
    if (matches !== null && matches.length === 0) {
      return <Text style={styles.statusText}>Матчей тура пока нет</Text>;
    }
    if (visible.length === 0) {
      return <Text style={styles.statusText}>В этой группе матчей нет</Text>;
    }
    return (
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            favorite={isFavorite(item.id)}
            onToggleFavorite={() => toggle(item.id)}
          />
        )}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Матчи тура</Text>
      {updatedAt ? <UpdatedAgo since={updatedAt} /> : null}
      <Pressable style={styles.button} onPress={() => void load()}>
        <Text style={styles.buttonText}>{refreshing ? 'Обновление…' : 'Обновить'}</Text>
      </Pressable>
      <View style={styles.filters}>
        {FILTERS.map((item) => {
          const selected = item.id === filter;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setFilter(item.id)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {error && matches !== null ? (
        <View style={styles.banner}>
          <Text style={styles.error}>{error}</Text>
          <Pressable onPress={() => void load()}>
            <Text style={styles.link}>Повторить</Text>
          </Pressable>
        </View>
      ) : null}
      {renderBody()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    borderRadius: 8,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12,
  },
  chip: {
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipSelected: {
    backgroundColor: '#111827',
  },
  chipText: {
    color: '#111827',
  },
  chipTextSelected: {
    color: '#fff',
  },
  banner: {
    marginBottom: 8,
  },
  error: {
    color: '#b91c1c',
  },
  link: {
    color: '#1d4ed8',
    marginTop: 4,
  },
  spinner: {
    marginTop: 24,
  },
  status: {
    marginTop: 24,
  },
  statusText: {
    color: '#4b5563',
    marginTop: 8,
  },
  list: {
    flex: 1,
  },
});
