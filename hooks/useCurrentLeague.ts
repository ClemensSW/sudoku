/**
 * useCurrentLeague Hook
 *
 * Liefert die aktuelle Liga und deren Farbschema.
 * Berücksichtigt Theme-Mode (Light/Dark) und Dev-Override.
 */

import { useMemo } from 'react';
import { RankTier } from '@/utils/elo/eloCalculator';
import { getLeagueColors, LeagueModeColors } from '@/utils/elo/leagueColors';
import { useDevLeague } from '@/contexts/DevLeagueContext';
import { useTheme } from '@/utils/theme/ThemeProvider';

// Default Liga bis Online-System aktiv
const DEFAULT_LEAGUE: RankTier = 'silver';

interface UseCurrentLeagueResult {
  /** Aktuelle Liga (oder Override) */
  tier: RankTier;
  /** Farbschema der Liga (theme-aware) */
  colors: LeagueModeColors;
  /** Ist ein Dev-Override aktiv? */
  isOverride: boolean;
}

/**
 * Hook für die aktuelle Liga und deren Farben
 *
 * Automatisch Theme-aware: Liefert Light- oder Dark-Mode-Farben
 * basierend auf dem aktuellen Theme.
 *
 * @returns Objekt mit tier, colors und isOverride
 */
export function useCurrentLeague(): UseCurrentLeagueResult {
  const devLeague = useDevLeague();
  const theme = useTheme();

  return useMemo(() => {
    // Dev-Override hat Priorität, sonst Default (Silver)
    const tier = devLeague?.overrideLeague ?? DEFAULT_LEAGUE;
    const isOverride = devLeague?.overrideLeague !== null && devLeague?.overrideLeague !== undefined;

    return {
      tier,
      colors: getLeagueColors(tier, theme.isDark),
      isOverride,
    };
  }, [devLeague?.overrideLeague, theme.isDark]);
}

export { DEFAULT_LEAGUE };
