import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MATCH_FILTERS, filterLabel, type MatchFilter } from '../hooks/useMatchFilter';

type Props = {
  value: MatchFilter;
  onChange: (filter: MatchFilter) => void;
};

// Переключатель вкладок: Все / Предстоящие / Завершённые.
export function FilterTabs({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {MATCH_FILTERS.map((filter) => {
        const active = filter === value;

        return (
          <Pressable
            key={filter}
            onPress={() => onChange(filter)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[styles.tab, active && styles.tabActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {filterLabel(filter)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    marginBottom: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#f3f4f6',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
  },
  labelActive: {
    color: '#111827',
  },
});
