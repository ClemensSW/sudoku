/**
 * useAIOpponent Hook
 *
 * Manages AI opponent during online matches
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  generateAIMove,
  adjustAIProfile,
  AI_PROFILES,
  AIProfile,
  AIMoveResult,
} from '@/utils/ai/aiOpponent';

interface UseAIOpponentProps {
  board: number[][];
  solution: number[][];
  isActive: boolean; // Only make moves when active
  profileType?: 'methodical' | 'balanced' | 'speedster';
  onAIMove: (row: number, col: number, value: number) => void;
}

export function useAIOpponent({
  board,
  solution,
  isActive,
  profileType = 'balanced',
  onAIMove,
}: UseAIOpponentProps) {
  const [profile, setProfile] = useState<AIProfile>(() => ({ ...AI_PROFILES[profileType] }));
  const [aiMoveCount, setAIMoveCount] = useState(0);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const moveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Schedule next AI move
   */
  const scheduleAIMove = useCallback(() => {
    if (!isActive) return;

    // Clear any pending move
    if (moveTimeoutRef.current) {
      clearTimeout(moveTimeoutRef.current);
    }

    // Generate next move
    const nextMove = generateAIMove(board, solution, profile, aiMoveCount);

    if (!nextMove) {
      // AI finished
      console.log('[AI] Board complete!');
      setIsAIThinking(false);
      return;
    }

    console.log('[AI] Scheduling move:', {
      position: `[${nextMove.row}, ${nextMove.col}]`,
      value: nextMove.value,
      isError: nextMove.isError,
      delay: `${(nextMove.delay / 1000).toFixed(1)}s`,
    });

    setIsAIThinking(true);

    // Schedule move with delay
    moveTimeoutRef.current = setTimeout(() => {
      console.log('[AI] Making move:', nextMove.value, 'at', [nextMove.row, nextMove.col]);
      onAIMove(nextMove.row, nextMove.col, nextMove.value);
      setAIMoveCount(prev => prev + 1);
      setIsAIThinking(false);

      // Schedule next move
      scheduleAIMove();
    }, nextMove.delay);
  }, [board, solution, profile, aiMoveCount, isActive, onAIMove]);

  /**
   * Start AI when activated
   */
  useEffect(() => {
    if (isActive && !isAIThinking && aiMoveCount === 0) {
      console.log('[AI] Starting AI opponent with profile:', profileType);
      scheduleAIMove();
    }
  }, [isActive, isAIThinking, aiMoveCount, scheduleAIMove, profileType]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Update AI profile after match
   */
  const updateProfileAfterMatch = useCallback((userWon: boolean) => {
    const newProfile = adjustAIProfile(profile, userWon);
    setProfile(newProfile);
    console.log('[AI] Profile updated. New win rate:', newProfile.userWinRate);
    return newProfile;
  }, [profile]);

  /**
   * Reset AI for new game
   */
  const reset = useCallback(() => {
    if (moveTimeoutRef.current) {
      clearTimeout(moveTimeoutRef.current);
    }
    setAIMoveCount(0);
    setIsAIThinking(false);
  }, []);

  return {
    profile,
    isAIThinking,
    aiMoveCount,
    updateProfileAfterMatch,
    reset,
  };
}
