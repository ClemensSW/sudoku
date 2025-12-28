/**
 * League Colors - Zentrale Farbdefinitionen für alle Ligen
 *
 * Jede Liga hat:
 * - primary: Hauptfarbe (Badge, Icon-Hintergrund)
 * - accent: UI-Farbe (Button, Navigation) - dunkler/sichtbarer
 * - gradient: Für Gradient-Buttons [hell, dunkel]
 * - text: Textfarbe auf farbigem Hintergrund
 */

import { RankTier } from './eloCalculator';

export interface LeagueColorScheme {
  primary: string;
  accent: string;
  gradient: [string, string];
  text: string;
}

export const LEAGUE_COLORS: Record<RankTier, LeagueColorScheme> = {
  novice: {
    primary: '#9E9E9E',
    accent: '#7A7A7A',
    gradient: ['#9E9E9E', '#7A7A7A'],
    text: '#FFFFFF',
  },
  bronze: {
    primary: '#CD7F32',
    accent: '#A66628',
    gradient: ['#CD7F32', '#A66628'],
    text: '#FFFFFF',
  },
  silver: {
    primary: '#C0C0C0',
    accent: '#989898',
    gradient: ['#C0C0C0', '#989898'],
    text: '#FFFFFF',
  },
  gold: {
    primary: '#FFD700',
    accent: '#D4B200',
    gradient: ['#FFD700', '#C9A800'],
    text: '#1A1A1A',
  },
  diamond: {
    primary: '#B9F2FF',
    accent: '#7DD4E8',
    gradient: ['#B9F2FF', '#7DD4E8'],
    text: '#1A1A1A',
  },
  master: {
    primary: '#9C27B0',
    accent: '#7B1F8C',
    gradient: ['#9C27B0', '#7B1F8C'],
    text: '#FFFFFF',
  },
  grandmaster: {
    primary: '#FF6B35',
    accent: '#D45A2D',
    gradient: ['#FF6B35', '#D45A2D'],
    text: '#FFFFFF',
  },
};

/**
 * Get complete color scheme for a league tier
 */
export function getLeagueColors(tier: RankTier): LeagueColorScheme {
  return LEAGUE_COLORS[tier];
}

/**
 * Get accent color (for UI elements like buttons, navigation)
 */
export function getLeagueAccentColor(tier: RankTier): string {
  return LEAGUE_COLORS[tier].accent;
}

/**
 * Get gradient colors for gradient buttons
 */
export function getLeagueGradient(tier: RankTier): [string, string] {
  return LEAGUE_COLORS[tier].gradient;
}

/**
 * Get text color for text on colored backgrounds
 */
export function getLeagueTextColor(tier: RankTier): string {
  return LEAGUE_COLORS[tier].text;
}
