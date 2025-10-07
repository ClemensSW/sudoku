// utils/pathColors.ts
// Zentrales Farbsystem für die 5 Pfadfarben
// Optimiert für Light und Dark Mode

export type PathColorId = 'blue' | 'green' | 'yellow' | 'red' | 'purple';

export interface PathColor {
  light: string;
  dark: string;
}

/**
 * Professionell optimierte Farbpalette für alle Pfade
 *
 * Light Mode: Satte, klare Farben mit guter Lesbarkeit
 * Dark Mode: Reduzierte Sättigung, erhöhte Helligkeit für sanftere Darstellung
 */
export const PATH_COLORS: Record<PathColorId, PathColor> = {
  // Fundamentals - Blau (Basis und Vertrauen)
  blue: {
    light: '#4285F4', // Google Blue - ausgewogen, vertrauenswürdig
    dark: '#5E9EFF',  // Softer Pastellblau - weniger aggressiv
  },

  // Insight - Grün (Wachstum und Erkenntnis)
  green: {
    light: '#34A853', // Google Green - natürlich, wachstumsorientiert
    dark: '#5FBF73',  // Mintiger Grünton - sanfter, angenehm
  },

  // Mastery - Gelb (Optimismus und Meisterschaft)
  yellow: {
    light: '#F9AB00', // Warmes Gold - weniger grell als Original
    dark: '#FFD666',  // Goldgelb - weicher, nicht blendend
  },

  // Wisdom - Rot (Kraft und Weisheit)
  red: {
    light: '#EA4335', // Google Red - kraftvoll, klar
    dark: '#FF6B6B',  // Korallrot - weniger aggressiv, freundlich
  },

  // Transcendence - Lila (Spiritualität und Transzendenz)
  purple: {
    light: '#7C4DFF', // Lebendigeres Lila - besserer Kontrast
    dark: '#A78BFA',  // Lavendel - sanft, spirituell
  },
};

/**
 * Gibt die passende Farbe für einen Path zurück, abhängig vom Theme-Modus
 */
export const getPathColor = (colorId: PathColorId, isDark: boolean): string => {
  return isDark ? PATH_COLORS[colorId].dark : PATH_COLORS[colorId].light;
};

/**
 * Legacy Hex-Werte für Backward Compatibility
 * Diese werden in storage.ts verwendet
 */
export const PATH_COLOR_HEX = {
  BLUE: '#4285F4',
  GREEN: '#34A853',
  YELLOW: '#F9AB00',
  RED: '#EA4335',
  PURPLE: '#7C4DFF',
} as const;

/**
 * Mappt Legacy Hex-Werte zu ColorIds
 */
export const hexToColorId = (hex: string): PathColorId => {
  const normalized = hex.toUpperCase();

  // Alte Werte auch supporten
  if (normalized === '#4285F4') return 'blue';
  if (normalized === '#34A853') return 'green';
  if (normalized === '#FBBC05' || normalized === '#F9AB00') return 'yellow';
  if (normalized === '#EA4335') return 'red';
  if (normalized === '#673AB7' || normalized === '#7C4DFF') return 'purple';

  // Default fallback
  return 'blue';
};

/**
 * Gibt die richtige Farbe für einen Hex-Wert zurück (Theme-aware)
 */
export const getColorFromHex = (hex: string, isDark: boolean): string => {
  const colorId = hexToColorId(hex);
  return getPathColor(colorId, isDark);
};
