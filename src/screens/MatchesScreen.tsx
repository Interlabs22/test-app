import { type ReactElement, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  type ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MatchCard } from '../components/MatchCard';
import { MatchesListHeader } from '../components/MatchesListHeader';
import { filterMatches } from '../features/matches/match-utils';
import type { Match, MatchFilter } from '../features/matches/match-types';
import { useFavorites } from '../hooks/useFavorites';
import { useMatches } from '../hooks/useMatches';

function getEmptyFilterMessage(filter: MatchFilter): string {
  switch (filter) {
    case 'all':
      return 'Матчей этого тура пока нет.';
    case 'upcoming':
      return 'Предстоящих матчей нет.';
    case 'finished':
      return 'Завершённых матчей нет.';
  }
}

export function MatchesScreen(): ReactElement {
  const [selectedFilter, setSelectedFilter] = useState<MatchFilter>('all');
  const { isReady: isFavoritesReady, isFavorite, toggle } = useFavorites();
  const {
    matches,
    round,
    lastUpdatedAt,
    isInitialLoading,
    isRefreshing,
    errorMessage,
    refresh,
  } = useMatches();
  const filteredMatches = filterMatches(matches, selectedFilter);

  const handleRefresh = (): void => {
    void refresh();
  };

  const handleFilterChange = (filter: MatchFilter): void => {
    setSelectedFilter(filter);
  };

  const renderMatch = ({ item }: ListRenderItemInfo<Match>): ReactElement => (
    <MatchCard
      match={item}
      isFavorite={isFavorite(item.id)}
      isFavoritesReady={isFavoritesReady}
      onToggleFavorite={toggle}
    />
  );

  if (isInitialLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Загружаем матчи…</Text>
      </View>
    );
  }

  if (errorMessage !== null && lastUpdatedAt === null) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.message}>{errorMessage}</Text>
        <Pressable style={styles.primaryButton} onPress={handleRefresh}>
          <Text style={styles.primaryButtonText}>Повторить</Text>
        </Pressable>
      </View>
    );
  }

  if (matches.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.message}>Матчей этого тура пока нет.</Text>
        <Pressable
          disabled={isRefreshing}
          style={[styles.primaryButton, isRefreshing ? styles.disabledButton : null]}
          onPress={handleRefresh}
        >
          <Text style={styles.primaryButtonText}>
            {isRefreshing ? 'Обновляем…' : 'Обновить'}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={filteredMatches}
        keyExtractor={(match): string => match.id}
        refreshing={isRefreshing}
        renderItem={renderMatch}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          <MatchesListHeader
            round={round}
            selectedFilter={selectedFilter}
            isRefreshing={isRefreshing}
            lastUpdatedAt={lastUpdatedAt}
            errorMessage={errorMessage}
            onFilterChange={handleFilterChange}
            onRefresh={handleRefresh}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyListText}>{getEmptyFilterMessage(selectedFilter)}</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
    backgroundColor: '#f9fafb',
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
  },
  listContent: {
    gap: 12,
    padding: 16,
  },
  primaryButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ef3124',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
  emptyListText: {
    paddingVertical: 24,
    textAlign: 'center',
    color: '#6b7280',
  },
});
