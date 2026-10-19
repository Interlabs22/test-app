import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type FavoriteButtonProps = {
  active: boolean;
  disabled: boolean;
  onPress: () => void;
};

export function FavoriteButton({
  active,
  disabled,
  onPress,
}: FavoriteButtonProps): ReactElement {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={active ? 'Убрать из избранного' : 'Добавить в избранное'}
      accessibilityState={{ disabled, selected: active }}
    >
      <Text style={[styles.star, active ? styles.active : null]}>{active ? '★' : '☆'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  star: {
    fontSize: 22,
    color: '#9ca3af',
  },
  active: {
    color: '#ef3124',
  },
});
