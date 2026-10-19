import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { UpdatedAgo } from './UpdatedAgo';
import type { MatchFilter } from '../features/matches/match-types';

type FilterOption = {
  value: MatchFilter;
  label: string;
};

type MatchesListHeaderProps = {
  round: number | null;
  selectedFilter: MatchFilter;
  isRefreshing: boolean;
  lastUpdatedAt: Date | null;
  errorMessage: string | null;
  onFilterChange: (filter: MatchFilter) => void;
  onRefresh: () => void;
};

const filterOptions: readonly FilterOption[] = [
  { value: 'all', label: 'Все' },
  { value: 'upcoming', label: 'Предстоящие' },
  { value: 'finished', label: 'Завершённые' },
];

export function MatchesListHeader({
  round,
  selectedFilter,
  isRefreshing,
  lastUpdatedAt,
  errorMessage,
  onFilterChange,
  onRefresh,
}: MatchesListHeaderProps): ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{round === null ? 'Матчи тура' : `Матчи ${round}-го тура`}</Text>
      <View style={styles.filters}>
        {filterOptions.map((filterOption) => {
          const isSelected = filterOption.value === selectedFilter;

          return (
            <Pressable
              key={filterOption.value}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              style={[styles.filterButton, isSelected ? styles.selectedFilterButton : null]}
              onPress={(): void => onFilterChange(filterOption.value)}
            >
              <Text style={isSelected ? styles.selectedFilterText : styles.filterText}>
                {filterOption.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.updateRow}>
        <Pressable
          disabled={isRefreshing}
          style={[styles.updateButton, isRefreshing ? styles.disabledButton : null]}
          onPress={onRefresh}
        >
          <Text style={styles.updateButtonText}>{isRefreshing ? 'Обновляем…' : 'Обновить'}</Text>
        </Pressable>
        {lastUpdatedAt === null ? null : <UpdatedAgo since={lastUpdatedAt} />}
      </View>
      {errorMessage === null ? null : <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  selectedFilterButton: {
    borderColor: '#ef3124',
    backgroundColor: '#ef3124',
  },
  filterText: {
    color: '#374151',
  },
  selectedFilterText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  updateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  updateButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  updateButtonText: {
    color: '#ef3124',
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
  errorText: {
    color: '#b91c1c',
  },
});
