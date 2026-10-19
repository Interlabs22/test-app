import { useCallback } from 'react';
import { RefreshControl } from 'react-native';
import {
  Button,
  H2,
  ScrollView,
  Spinner,
  Text,
  XStack,
  YStack,
} from 'tamagui';

import { UpdatedAgo } from '../../components/UpdatedAgo';
import {
  getMatchFilterLabel,
  matchFilterOptions,
  useFilteredMatches,
} from '../../hooks/useFilteredMatches';
import { useFavorites } from '../../hooks/useFavorites';
import { useMatchesQuery } from '../../hooks/useMatchesQuery';
import { useAppColors } from '../../providers/AppThemeProvider';
import { MatchCard } from './components/MatchCard';

export function Matches() {
  const colors = useAppColors();

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
    dataUpdatedAt,
    isRefetching,
  } = useMatchesQuery();

  const {
    filter,
    setFilter,
    liveOnly,
    toggleLiveOnly,
    filteredMatches,
    isEmptySource,
    isEmptyFiltered,
  } = useFilteredMatches(data?.matches);

  const { isFavorite, toggle } = useFavorites();

  const onRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  if (isPending) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" gap={12}>
        <Spinner size="large" color={colors.spinner} />
        <Text color={colors.textSecondary}>Загрузка матчей…</Text>
      </YStack>
    );
  }

  if (isError) {
    const message =
      error instanceof Error ? error.message : 'Не удалось загрузить матчи';
    return (
      <YStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        padding={16}
        gap={16}
      >
        <Text textAlign="center" fontSize={18} color={colors.error}>
          {message}
        </Text>
        <Button
          onPress={() => void refetch()}
          backgroundColor={colors.accent}
          color={colors.onAccent}
        >
          Повторить
        </Button>
      </YStack>
    );
  }

  return (
    <YStack flex={1} padding={16} gap={12}>
      <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={8}>
        <H2 fontSize={28} fontWeight="700" color={colors.textPrimary}>
          Матчи тура {data.round}
        </H2>
        <Button
          onPress={() => void refetch()}
          disabled={isRefetching}
          backgroundColor={colors.surface}
          borderWidth={1}
          borderColor={colors.border}
          color={colors.textPrimary}
        >
          {isRefetching && 'Обновление…'}
          {!isRefetching && 'Обновить'}
        </Button>
      </XStack>

      <UpdatedAgo since={new Date(dataUpdatedAt)} />

      <XStack
        width="100%"
        gap={8}
        flexWrap="wrap"
        alignItems="center"
        justifyContent={liveOnly ? 'flex-end' : 'space-between'}
      >
        {!liveOnly && (
          <XStack gap={8} flexWrap="wrap" flex={1}>
            {matchFilterOptions.map((option) => {
              const active = filter === option;
              return (
                <Button
                  key={option}
                  backgroundColor={
                    active ? colors.accent : colors.filterInactiveBg
                  }
                  color={active ? colors.onAccent : colors.filterInactiveText}
                  onPress={() => setFilter(option)}
                >
                  {getMatchFilterLabel(option)}
                </Button>
              );
            })}
          </XStack>
        )}
        <Button
          backgroundColor={liveOnly ? colors.live : colors.liveInactiveBg}
          borderWidth={liveOnly ? 0 : 1}
          borderColor={colors.live}
          color={liveOnly ? colors.onLive : colors.live}
          onPress={toggleLiveOnly}
        >
          Live
        </Button>
      </XStack>

      {isEmptySource && (
        <YStack flex={1} alignItems="center" justifyContent="center" padding={16}>
          <Text fontSize={18} color={colors.textSecondary} textAlign="center">
            В этом туре пока нет матчей
          </Text>
        </YStack>
      )}

      {!isEmptySource && isEmptyFiltered && (
        <YStack flex={1} alignItems="center" justifyContent="center" padding={16}>
          <Text fontSize={18} color={colors.textSecondary} textAlign="center">
            Нет матчей для выбранного фильтра
          </Text>
        </YStack>
      )}

      {!isEmptySource && !isEmptyFiltered && (
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isPending}
              onRefresh={onRefresh}
              tintColor={colors.refreshIndicator}
              colors={[colors.refreshIndicator]}
            />
          }
        >
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              favoriteActive={isFavorite(match.id)}
              onToggleFavorite={() => toggle(match.id)}
            />
          ))}
        </ScrollView>
      )}
    </YStack>
  );
}
