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
 * Mappt Hex-Werte zu ColorIds (unterstützt Light und Dark Mode Farben)
 */
export const hexToColorId = (hex: string): PathColorId => {
  const normalized = hex.toUpperCase();

  // Blue (Light und Dark)
  if (normalized === '#4285F4' || normalized === '#5E9EFF') return 'blue';

  // Green (Light und Dark)
  if (normalized === '#34A853' || normalized === '#5FBF73') return 'green';

  // Yellow (Light und Dark, inkl. alte Werte)
  if (normalized === '#FBBC05' || normalized === '#F9AB00' || normalized === '#FFD666') return 'yellow';

  // Red (Light und Dark)
  if (normalized === '#EA4335' || normalized === '#FF6B6B') return 'red';

  // Purple (Light und Dark, inkl. alte Werte)
  if (normalized === '#673AB7' || normalized === '#7C4DFF' || normalized === '#A78BFA') return 'purple';

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

/**
 * Generiert einen schönen LinearGradient für jede Path-Farbe
 * Returns: [color1, color2, color3] für diagonalen Gradient (top-left to bottom-right)
 */
export const getPathGradient = (colorHex: string, isDark: boolean): [string, string, string] => {
  const colorId = hexToColorId(colorHex);

  // Gradient-Definitionen für Light Mode (hellere Variante → Basis → dunklere Variante)
  const lightGradients: Record<PathColorId, [string, string, string]> = {
    blue: ['#5A9DFF', '#4285F4', '#3367D6'],
    green: ['#4DBF6A', '#34A853', '#2D8E47'],
    yellow: ['#FFC133', '#F9AB00', '#E09600'],
    red: ['#FF5F4D', '#EA4335', '#D93025'],
    purple: ['#9366FF', '#7C4DFF', '#6536E6'],
  };

  // Gradient-Definitionen für Dark Mode (sanfter, pastelliger)
  const darkGradients: Record<PathColorId, [string, string, string]> = {
    blue: ['#7FB3FF', '#5E9EFF', '#4A8AE6'],
    green: ['#7DD88F', '#5FBF73', '#4DA660'],
    yellow: ['#FFE599', '#FFD666', '#F0C04D'],
    red: ['#FF8A7A', '#FF6B6B', '#F05252'],
    purple: ['#BBA4FA', '#A78BFA', '#9372E8'],
  };

  return isDark ? darkGradients[colorId] : lightGradients[colorId];
};
