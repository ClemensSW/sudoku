import { useState, useCallback, useRef, useEffect } from 'react';
import { SudokuBoard as SudokuBoardType, CellPosition, detectCompletions, cloneBoard } from '@/utils/sudoku';
import { triggerHaptic } from '@/utils/haptics';

export interface AnimatingCell {
  row: number;
  col: number;
  type: 'row' | 'column' | 'box';
  delay: number; // milliseconds - used by SudokuCell for withDelay
}

const ANIMATION_DURATION = 600; // Total animation duration in ms

export function useCompletionAnimation() {
  const [animatingCells, setAnimatingCells] = useState<Map<string, AnimatingCell>>(new Map());
  const previousBoardRef = useRef<SudokuBoardType | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clear all pending timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Check for completions after board update
  const checkForCompletions = useCallback((
    board: SudokuBoardType,
    changedCell: CellPosition | null
  ) => {
    // Don't check if no cell changed or board is empty
    if (!changedCell || !board || board.length === 0) {
      // Store current board for next comparison
      if (board && board.length > 0) {
        previousBoardRef.current = cloneBoard(board);
      }
      return;
    }

    // If we don't have a previous board, store and return
    if (!previousBoardRef.current) {
      previousBoardRef.current = cloneBoard(board);
      return;
    }

    const completions = detectCompletions(
      previousBoardRef.current,
      board,
      changedCell.row,
      changedCell.col
    );

    if (completions.length > 0) {
      // Trigger light haptic feedback for completion
      triggerHaptic('success');

      // Clear any existing timeouts
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current = [];

      // Set ALL animating cells at once (1 state update instead of 9)
      // Each cell carries its own delay for withDelay on UI thread
      const newAnimatingCells = new Map<string, AnimatingCell>();
      completions.forEach((completion) => {
        const key = `${completion.row}-${completion.col}`;
        newAnimatingCells.set(key, {
          row: completion.row,
          col: completion.col,
          type: completion.type,
          delay: completion.delay,
        });
      });
      setAnimatingCells(newAnimatingCells);

      // Single cleanup timeout after max delay + animation duration
      const maxDelay = Math.max(...completions.map(c => c.delay));
      const cleanupTimeout = setTimeout(() => {
        setAnimatingCells(new Map());
      }, maxDelay + ANIMATION_DURATION);

      timeoutsRef.current.push(cleanupTimeout);
    }

    // Store current board for next comparison
    previousBoardRef.current = cloneBoard(board);
  }, []);

  // Get animation state for a specific cell
  const getCellAnimation = useCallback((row: number, col: number): AnimatingCell | null => {
    const key = `${row}-${col}`;
    return animatingCells.get(key) || null;
  }, [animatingCells]);

  // Check if a cell is currently animating
  const isCellAnimating = useCallback((row: number, col: number): boolean => {
    const key = `${row}-${col}`;
    return animatingCells.has(key);
  }, [animatingCells]);

  // Reset the hook state (useful for new games)
  const reset = useCallback(() => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
    setAnimatingCells(new Map());
    previousBoardRef.current = null;
  }, []);

  return {
    checkForCompletions,
    getCellAnimation,
    isCellAnimating,
    animatingCells,
    reset,
  };
}
