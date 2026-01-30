import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6366f1',
    secondary: '#8b5cf6',
    tertiary: '#ec4899',
    error: '#ef4444',
    background: '#f9fafb',
    surface: '#ffffff',
    surfaceVariant: '#f3f4f6',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onBackground: '#111827',
    onSurface: '#111827',
  },
};

export type AppTheme = typeof theme;
