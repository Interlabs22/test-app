import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider, YStack } from 'tamagui';

import { useAppThemeName } from './src/hooks/useAppThemeName';
import { QueryProvider } from './src/providers/QueryProvider';
import { Matches } from './src/screens/matches';
import { tamaguiConfig } from './tamagui.config';
import { AppThemeProvider, useAppColors } from './src/providers/AppThemeProvider';

function AppShell() {
  const colors = useAppColors();
  const themeName = useAppThemeName();

  return (
    <YStack flex={1} paddingTop={48} backgroundColor={colors.background}>
      <Matches />
      <StatusBar style={themeName === 'dark' ? 'light' : 'dark'} />
    </YStack>
  );
}

export default function App() {
  const themeName = useAppThemeName();

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={themeName}>
      <AppThemeProvider themeName={themeName}>
        <QueryProvider>
          <AppShell />
        </QueryProvider>
      </AppThemeProvider>
    </TamaguiProvider>
  );
}
