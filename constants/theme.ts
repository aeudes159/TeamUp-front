export const colors = {
  // Violet prune foncé pour fonds
  primary: '#3A235A',
  primaryDark: '#2E1A47',
  
  // Beige/crème rosé pour cartes et surfaces
  card: '#F6E6D8',
  cardLight: '#F3D1C8',
  
  // Accents doux
  coral: '#F08A5D',
  lilac: '#B8A1D9',
  yellow: '#F6D186',
  
  // Textes et neutres
  text: '#2E1A47',
  textSecondary: '#6B5B7F',
  textLight: '#8A7A9F',
  
  // Fond principal
  background: '#3A235A',
  
  // Whites and shadows
  white: '#FFFFFF',
  shadow: 'rgba(58, 35, 90, 0.15)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 9999,
};

export const shadows = {
  soft: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 25,
    elevation: 6,
  },
  warm: {
    shadowColor: colors.coral,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 8,
  },
  artistic: {
    shadowColor: colors.lilac,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 35,
    elevation: 10,
  },
};

export const typography = {
  // Titres arrondis et expressifs
  titleLarge: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    lineHeight: 32,
  },
  titleMedium: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    lineHeight: 24,
  },
  titleSmall: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    lineHeight: 22,
  },
  
  // Texte sans-serif simple et lisible
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.text,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.text,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  
  // Styles artistiques
  artistic: {
    fontSize: 20,
    fontWeight: '500' as const,
    color: colors.text,
    lineHeight: 28,
    fontStyle: 'italic' as const,
  },
};