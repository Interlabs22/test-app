import { Text, XStack, YStack } from 'tamagui';

import type { IMatch } from '../../../api/types';
import { FavoriteButton } from '../../../components/FavoriteButton';
import {
  formatMatchStart,
  formatScore,
  getMatchStatusLabel,
} from "../../../utils/match-format"
import { useAppColors } from '../../../providers/AppThemeProvider'; 

type Props = {
  match: IMatch;
  favoriteActive: boolean;
  onToggleFavorite: () => void;
};

export function MatchCard({
  match,
  favoriteActive,
  onToggleFavorite,
}: Props) {
  const colors = useAppColors();
  const score = formatScore(match);

  return (
    <YStack
      padding={12}
      marginBottom={12}
      backgroundColor={colors.surface}
      borderWidth={1}
      borderColor={colors.border}
      borderRadius={12}
    >
      <XStack justifyContent="space-between" alignItems="flex-start" gap={8}>
        <YStack flex={1} gap={4}>
          <Text fontSize={18} fontWeight="600" color={colors.textPrimary}>
            {match.home.name}
          </Text>
          <Text fontSize={18} fontWeight="600" color={colors.textPrimary}>
            {match.away.name}
          </Text>
        </YStack>
        <XStack alignItems="flex-start" gap={8}>
          {score != null && (
            <Text fontSize={22} fontWeight="700" color={colors.score}>
              {score}
            </Text>
          )}
          {score == null && (
            <Text fontSize={16} color={colors.textMuted}>
              —
            </Text>
          )}
          <FavoriteButton active={favoriteActive} onPress={onToggleFavorite} />
        </XStack>
      </XStack>
      <XStack
        marginTop={12}
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={8}
      >
        <Text fontSize={14} color={colors.textSecondary}>
          {formatMatchStart(match.startsAt)}
        </Text>
        <Text fontSize={14} fontWeight="500" color={colors.textPrimary}>
          {getMatchStatusLabel(match)}
        </Text>
      </XStack>
    </YStack>
  );
}
