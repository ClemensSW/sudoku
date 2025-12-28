/**
 * useCurrentLeague Hook
 *
 * Liefert die aktuelle Liga und deren Farbschema.
 * Berücksichtigt Dev-Override wenn vorhanden.
 */

import { useMemo } from 'react';
import { RankTier } from '@/utils/elo/eloCalculator';
import { getLeagueColors, LeagueColorScheme } from '@/utils/elo/leagueColors';
import { useDevLeague } from '@/contexts/DevLeagueContext';

// Default Liga bis Online-System aktiv
const DEFAULT_LEAGUE: RankTier = 'silver';

interface UseCurrentLeagueResult {
  /** Aktuelle Liga (oder Override) */
  tier: RankTier;
  /** Farbschema der Liga */
  colors: LeagueColorScheme;
  /** Ist ein Dev-Override aktiv? */
  isOverride: boolean;
}

/**
 * Hook für die aktuelle Liga und deren Farben
 *
 * @returns Objekt mit tier, colors und isOverride
 */
export function useCurrentLeague(): UseCurrentLeagueResult {
  const devLeague = useDevLeague();

  return useMemo(() => {
    // Dev-Override hat Priorität, sonst Default (Silver)
    const tier = devLeague?.overrideLeague ?? DEFAULT_LEAGUE;
    const isOverride = devLeague?.overrideLeague !== null && devLeague?.overrideLeague !== undefined;

    return {
      tier,
      colors: getLeagueColors(tier),
      isOverride,
    };
  }, [devLeague?.overrideLeague]);
}

export { DEFAULT_LEAGUE };
