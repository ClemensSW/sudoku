/**
 * useEloCalculation Hook
 *
 * Provides client-side ELO calculation for preview/validation
 */

import { useMemo } from 'react';
import {
  calculateEloChanges,
  getRankTier,
  getRankTierName,
  getRankTierColor,
  getRankTierIcon,
  RankTier,
} from '@/utils/elo/eloCalculator';

interface EloCalculationResult {
  player1Change: number;
  player2Change: number;
  newPlayer1Elo: number;
  newPlayer2Elo: number;
  player1Tier: RankTier;
  player2Tier: RankTier;
  player1TierName: string;
  player2TierName: string;
  player1TierColor: string;
  player2TierColor: string;
  player1TierIcon: string;
  player2TierIcon: string;
}

/**
 * Calculate ELO changes and rank tiers for both players
 */
export function useEloCalculation(
  player1Elo: number,
  player2Elo: number,
  winner: 0 | 1 | 2
): EloCalculationResult {
  return useMemo(() => {
    const changes = calculateEloChanges(player1Elo, player2Elo, winner);

    const player1Tier = getRankTier(changes.newPlayer1Elo);
    const player2Tier = getRankTier(changes.newPlayer2Elo);

    return {
      ...changes,
      player1Tier,
      player2Tier,
      player1TierName: getRankTierName(player1Tier),
      player2TierName: getRankTierName(player2Tier),
      player1TierColor: getRankTierColor(player1Tier),
      player2TierColor: getRankTierColor(player2Tier),
      player1TierIcon: getRankTierIcon(player1Tier),
      player2TierIcon: getRankTierIcon(player2Tier),
    };
  }, [player1Elo, player2Elo, winner]);
}
