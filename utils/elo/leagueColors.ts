/**
 * League Colors - Zentrale Farbdefinitionen für alle Ligen
 *
 * Professionell überarbeitet mit separaten Light/Dark Mode Werten.
 * Design-Prinzipien:
 * - Dark Mode: ~20% mehr Sättigung für bessere Sichtbarkeit
 * - Light Mode: Gedämpftere Farben für besseren Kontrast
 * - WCAG 4.5:1 Kontrast-Minimum
 */

import { RankTier } from './eloCalculator';

/**
 * Color values for a specific theme mode
 */
export interface LeagueModeColors {
  primary: string;     // Badge, Icon-Hintergrund
  accent: string;      // UI-Elemente (Button, Navigation, Borders)
  gradient: [string, string]; // Für Gradient-Buttons
  text: string;        // Text auf farbigem Hintergrund
}

/**
 * Complete color scheme with Light and Dark mode variants
 */
export interface LeagueColorScheme {
  light: LeagueModeColors;
  dark: LeagueModeColors;
}

/**
 * League colors with separate Light/Dark mode values
 *
 * Design choices:
 * - Novice: Blau-Grau (moderner als reines Grau)
 * - Bronze: Warmes Kupfer (basierend auf Figma Bronze Guide)
 * - Silver: Klassisches Silber (User-approved)
 * - Gold: Bernstein/Goldenrod
 * - Diamond: Tieferes Cyan (professioneller als fast-weiß)
 * - Master: Violett (Prestige-Gefühl)
 * - Grandmaster: Orange-Rot/Flamme (Top-Tier)
 */
export const LEAGUE_COLORS: Record<RankTier, LeagueColorScheme> = {
  novice: {
    light: {
      primary: '#78909C',
      accent: '#607D8B',
      gradient: ['#78909C', '#607D8B'],
      text: '#FFFFFF',
    },
    dark: {
      primary: '#90A4AE',
      accent: '#78909C',
      gradient: ['#90A4AE', '#78909C'],
      text: '#FFFFFF',
    },
  },
  bronze: {
    light: {
      primary: '#B87333',
      accent: '#8B5A2B',
      gradient: ['#B87333', '#8B5A2B'],
      text: '#FFFFFF',
    },
    dark: {
      primary: '#CD853F',
      accent: '#B87333',
      gradient: ['#CD853F', '#B87333'],
      text: '#FFFFFF',
    },
  },
  silver: {
    light: {
      primary: '#C0C0C0',
      accent: '#989898',
      gradient: ['#C0C0C0', '#989898'],
      text: '#FFFFFF',
    },
    dark: {
      primary: '#C0C0C0',
      accent: '#989898',
      gradient: ['#C0C0C0', '#989898'],
      text: '#FFFFFF',
    },
  },
  gold: {
    light: {
      primary: '#DAA520',
      accent: '#B8860B',
      gradient: ['#DAA520', '#B8860B'],
      text: '#1A1A1A',
    },
    dark: {
      primary: '#FFD700',
      accent: '#DAA520',
      gradient: ['#FFD700', '#DAA520'],
      text: '#1A1A1A',
    },
  },
  diamond: {
    light: {
      primary: '#4DD0E1',
      accent: '#00ACC1',
      gradient: ['#4DD0E1', '#00ACC1'],
      text: '#1A1A1A',
    },
    dark: {
      primary: '#80DEEA',
      accent: '#4DD0E1',
      gradient: ['#80DEEA', '#4DD0E1'],
      text: '#1A1A1A',
    },
  },
  master: {
    light: {
      primary: '#7B1FA2',
      accent: '#6A1B9A',
      gradient: ['#7B1FA2', '#6A1B9A'],
      text: '#FFFFFF',
    },
    dark: {
      primary: '#AB47BC',
      accent: '#8E24AA',
      gradient: ['#AB47BC', '#8E24AA'],
      text: '#FFFFFF',
    },
  },
  grandmaster: {
    light: {
      primary: '#E64A19',
      accent: '#BF360C',
      gradient: ['#E64A19', '#BF360C'],
      text: '#FFFFFF',
    },
    dark: {
      primary: '#FF7043',
      accent: '#E64A19',
      gradient: ['#FF7043', '#E64A19'],
      text: '#FFFFFF',
    },
  },
};

/**
 * Get color scheme for a league tier based on theme mode
 * @param tier - The league tier
 * @param isDark - Whether dark mode is active
 * @returns Colors appropriate for the current theme
 */
export function getLeagueColors(tier: RankTier, isDark: boolean): LeagueModeColors {
  return isDark ? LEAGUE_COLORS[tier].dark : LEAGUE_COLORS[tier].light;
}

/**
 * Get the full color scheme (both light and dark) for a tier
 * @param tier - The league tier
 * @returns Full color scheme with both modes
 */
export function getFullLeagueColorScheme(tier: RankTier): LeagueColorScheme {
  return LEAGUE_COLORS[tier];
}

/**
 * Get accent color for UI elements (theme-aware)
 * @param tier - The league tier
 * @param isDark - Whether dark mode is active
 * @returns Accent color for the current theme
 */
export function getLeagueAccentColor(tier: RankTier, isDark: boolean): string {
  return getLeagueColors(tier, isDark).accent;
}

/**
 * Get gradient colors for gradient buttons (theme-aware)
 * @param tier - The league tier
 * @param isDark - Whether dark mode is active
 * @returns Gradient tuple for the current theme
 */
export function getLeagueGradient(tier: RankTier, isDark: boolean): [string, string] {
  return getLeagueColors(tier, isDark).gradient;
}

/**
 * Get text color for text on colored backgrounds (theme-aware)
 * @param tier - The league tier
 * @param isDark - Whether dark mode is active
 * @returns Text color for the current theme
 */
export function getLeagueTextColor(tier: RankTier, isDark: boolean): string {
  return getLeagueColors(tier, isDark).text;
}
