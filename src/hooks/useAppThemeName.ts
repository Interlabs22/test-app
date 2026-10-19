import { useColorScheme } from 'react-native';

export type AppThemeName = 'light' | 'dark';

export function useAppThemeName(): AppThemeName {
  return useColorScheme() === 'dark' ? 'dark' : 'light';
}
