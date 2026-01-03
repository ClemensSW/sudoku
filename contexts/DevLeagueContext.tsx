/**
 * Dev League Context - Nur für Entwicklungs-Tests
 *
 * Ermöglicht das Überschreiben der aktuellen Liga zum Testen
 * verschiedener Farben und UI-Elemente.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { RankTier } from '@/utils/elo/eloCalculator';

interface DevLeagueContextType {
  /** Überschriebene Liga (null = keine Überschreibung) */
  overrideLeague: RankTier | null;
  /** Liga setzen */
  setOverrideLeague: (tier: RankTier | null) => void;
  /** Zur nächsten Liga wechseln (zyklisch) */
  cycleLeague: () => void;
  /** Überschreibung zurücksetzen */
  resetLeague: () => void;
  /** Online Features aktiviert (nur für Dev) */
  onlineFeaturesEnabled: boolean;
  /** Online Features umschalten */
  toggleOnlineFeatures: () => void;
}

const DevLeagueContext = createContext<DevLeagueContextType | null>(null);

const LEAGUE_ORDER: RankTier[] = [
  'novice',
  'bronze',
  'silver',
  'gold',
  'diamond',
  'master',
  'grandmaster',
];

interface DevLeagueProviderProps {
  children: React.ReactNode;
}

export const DevLeagueProvider: React.FC<DevLeagueProviderProps> = ({ children }) => {
  const [overrideLeague, setOverrideLeague] = useState<RankTier | null>(null);
  const [onlineFeaturesEnabled, setOnlineFeaturesEnabled] = useState(false);

  const toggleOnlineFeatures = useCallback(() => {
    setOnlineFeaturesEnabled((prev) => !prev);
  }, []);

  const cycleLeague = useCallback(() => {
    setOverrideLeague((current) => {
      if (!current) {
        return LEAGUE_ORDER[0]; // Start mit Novice
      }
      const currentIndex = LEAGUE_ORDER.indexOf(current);
      const nextIndex = (currentIndex + 1) % LEAGUE_ORDER.length;
      return LEAGUE_ORDER[nextIndex];
    });
  }, []);

  const resetLeague = useCallback(() => {
    setOverrideLeague(null);
  }, []);

  return (
    <DevLeagueContext.Provider
      value={{
        overrideLeague,
        setOverrideLeague,
        cycleLeague,
        resetLeague,
        onlineFeaturesEnabled,
        toggleOnlineFeatures,
      }}
    >
      {children}
    </DevLeagueContext.Provider>
  );
};

/**
 * Hook zum Zugriff auf den Dev League Context
 * Gibt null zurück wenn nicht in __DEV__ oder nicht im Provider
 */
export const useDevLeague = (): DevLeagueContextType | null => {
  const context = useContext(DevLeagueContext);
  return context;
};

export { LEAGUE_ORDER };
