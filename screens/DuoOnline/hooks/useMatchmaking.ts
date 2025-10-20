/**
 * useMatchmaking Hook
 *
 * Handles matchmaking flow: search for opponent → 5 sec timeout → AI fallback
 */

import { useState, useCallback } from 'react';
import functions from '@react-native-firebase/functions';

interface Opponent {
  displayName: string;
  elo: number;
  isAI: boolean;
}

export function useMatchmaking() {
  const [isSearching, setIsSearching] = useState(false);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [opponent, setOpponent] = useState<Opponent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchForMatch = useCallback(
    async (
      difficulty: 'easy' | 'medium' | 'hard' | 'expert',
      elo: number,
      displayName: string
    ) => {
      setIsSearching(true);
      setError(null);
      setMatchId(null);
      setOpponent(null);

      try {
        console.log('[useMatchmaking] Searching for match...');

        const result = await functions().httpsCallable('matchmaking')({
          difficulty,
          elo,
          displayName,
        });

        const { matchId: newMatchId, opponent: foundOpponent } = result.data;

        console.log('[useMatchmaking] Match found:', newMatchId);

        setMatchId(newMatchId);
        setOpponent(foundOpponent);
        setIsSearching(false);
      } catch (err: any) {
        console.error('[useMatchmaking] Error:', err);
        setError(err.message || 'Failed to find match');
        setIsSearching(false);
      }
    },
    []
  );

  const cancelSearch = useCallback(() => {
    setIsSearching(false);
    setMatchId(null);
    setOpponent(null);
    setError(null);
  }, []);

  return {
    isSearching,
    matchId,
    opponent,
    error,
    searchForMatch,
    cancelSearch,
  };
}
