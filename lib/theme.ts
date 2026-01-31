import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3A235A',
    secondary: '#B8A1D9',
    tertiary: '#F08A5D',
    error: '#ef4444',
    background: '#3A235A',
    surface: '#F6E6D8',
    surfaceVariant: '#F3D1C8',
    onPrimary: '#ffffff',
    onSecondary: '#3A235A',
    onBackground: '#F6E6D8',
    onSurface: '#2E1A47',
  },
  fonts: {
    ...DefaultTheme.fonts,
    titleLarge: {
      ...DefaultTheme.fonts.titleLarge,
      fontSize: 24,
      fontWeight: '700' as const,
    },
    titleMedium: {
      ...DefaultTheme.fonts.titleMedium,
      fontSize: 18,
      fontWeight: '600' as const,
    },
    bodyLarge: {
      ...DefaultTheme.fonts.bodyLarge,
      fontSize: 16,
      fontWeight: '400' as const,
    },
  },
};

export type AppTheme = typeof theme;
