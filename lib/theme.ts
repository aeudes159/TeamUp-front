import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { colors as customColors } from '@/constants/theme';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: customColors.coral,
    secondary: customColors.lilac,
    tertiary: customColors.yellow,
    error: '#ef4444', // Keep a standard error color
    background: customColors.primary,
    surface: customColors.card,
    surfaceVariant: customColors.cardLight,
    onPrimary: customColors.white,
    onSecondary: customColors.white,
    onBackground: customColors.white,
    onSurface: customColors.text,
    onSurfaceVariant: customColors.textSecondary,
    outline: customColors.lilac,
    text: customColors.text,
  },
};

export type AppTheme = typeof theme;
