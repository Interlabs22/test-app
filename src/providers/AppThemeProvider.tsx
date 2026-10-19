import { createContext, useContext, useMemo, type ReactNode } from 'react';

import type { AppThemeName } from '../hooks/useAppThemeName';
import { darkColors, lightColors, type AppColors } from '../theme/colors'

const AppThemeContext = createContext<AppColors>(lightColors);

type Props = {
  children: ReactNode;
  themeName: AppThemeName;
};

export function AppThemeProvider({ children, themeName }: Props) {
  const colors = useMemo(
    () => (themeName === 'dark' ? darkColors : lightColors),
    [themeName],
  );

  return (
    <AppThemeContext.Provider value={colors}>{children}</AppThemeContext.Provider>
  );
}

export function useAppColors(): AppColors {
  return useContext(AppThemeContext);
}
