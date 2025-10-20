/**
 * AI Opponent for Online Multiplayer
 *
 * Implements a realistic AI opponent that:
 * - Solves Sudoku puzzles using logical techniques
 * - Makes moves at human-like speeds
 * - Occasionally makes errors for realism
 * - Adapts difficulty based on user performance
 */

export interface AIProfile {
  // Difficulty Settings
  speedMultiplier: number; // 1.0 = normal, 0.5 = slow, 2.0 = fast
  errorProbability: number; // 0.0-0.15 (0% to 15% chance of error)
  thinkingPauseChance: number; // 0.0-0.3 chance of occasional pause

  // Personality
  personality: 'methodical' | 'balanced' | 'speedster';

  // Adaptive Data
  userWinRate: number; // Track user's win rate against this AI
  totalMatches: number;
  lastAdjustment: number; // Timestamp of last difficulty adjustment
}

export interface AIMoveResult {
  row: number;
  col: number;
  value: number;
  isError: boolean; // True if this is an intentional error
  delay: number; // Milliseconds to wait before making this move
}

export interface CellDifficulty {
  row: number;
  col: number;
  difficulty: number; // 0-1, where 0 = easiest
  possibleValues: number[];
}

/**
 * Default AI Profiles
 */
export const AI_PROFILES: Record<string, AIProfile> = {
  methodical: {
    speedMultiplier: 0.7,
    errorProbability: 0.05,
    thinkingPauseChance: 0.2,
    personality: 'methodical',
    userWinRate: 0.5,
    totalMatches: 0,
    lastAdjustment: Date.now(),
  },
  balanced: {
    speedMultiplier: 1.0,
    errorProbability: 0.08,
    thinkingPauseChance: 0.15,
    personality: 'balanced',
    userWinRate: 0.5,
    totalMatches: 0,
    lastAdjustment: Date.now(),
  },
  speedster: {
    speedMultiplier: 1.4,
    errorProbability: 0.12,
    thinkingPauseChance: 0.08,
    personality: 'speedster',
    userWinRate: 0.5,
    totalMatches: 0,
    lastAdjustment: Date.now(),
  },
};

/**
 * Find all empty cells and calculate their difficulty
 */
export function analyzeBoard(
  board: number[][],
  solution: number[][]
): CellDifficulty[] {
  const emptyCells: CellDifficulty[] = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const possibleValues = getPossibleValues(board, row, col);
        const difficulty = calculateCellDifficulty(board, row, col, possibleValues);

        emptyCells.push({
          row,
          col,
          difficulty,
          possibleValues,
        });
      }
    }
  }

  // Sort by difficulty (easiest first)
  return emptyCells.sort((a, b) => a.difficulty - b.difficulty);
}

/**
 * Get possible values for a cell based on Sudoku rules
 */
function getPossibleValues(board: number[][], row: number, col: number): number[] {
  const possible = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  // Remove values in same row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] !== 0) {
      possible.delete(board[row][c]);
    }
  }

  // Remove values in same column
  for (let r = 0; r < 9; r++) {
    if (board[r][col] !== 0) {
      possible.delete(board[r][col]);
    }
  }

  // Remove values in same 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] !== 0) {
        possible.delete(board[r][c]);
      }
    }
  }

  return Array.from(possible);
}

/**
 * Calculate difficulty of solving a specific cell
 * 0 = easiest (only 1-2 possibilities)
 * 1 = hardest (many possibilities, requires advanced techniques)
 */
function calculateCellDifficulty(
  board: number[][],
  row: number,
  col: number,
  possibleValues: number[]
): number {
  // Fewer possible values = easier
  const possibilityFactor = (possibleValues.length - 1) / 8; // 0-1

  // Cells with more filled neighbors are easier
  const filledNeighbors = countFilledNeighbors(board, row, col);
  const neighborFactor = 1 - (filledNeighbors / 20); // 0-1

  // Combine factors
  return (possibilityFactor * 0.7 + neighborFactor * 0.3);
}

/**
 * Count filled cells in same row, column, and box
 */
function countFilledNeighbors(board: number[][], row: number, col: number): number {
  let count = 0;

  // Row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] !== 0) count++;
  }

  // Column
  for (let r = 0; r < 9; r++) {
    if (board[r][col] !== 0) count++;
  }

  // Box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] !== 0) count++;
    }
  }

  // Subtract double-counted cells
  return count;
}

/**
 * Generate next AI move with realistic behavior
 */
export function generateAIMove(
  board: number[][],
  solution: number[][],
  profile: AIProfile,
  moveNumber: number
): AIMoveResult | null {
  const emptyCells = analyzeBoard(board, solution);

  if (emptyCells.length === 0) {
    return null; // Board complete
  }

  // Select cell to fill (prioritize easier cells early on)
  const progressRatio = 1 - (emptyCells.length / 81);
  const easyBias = Math.max(0, 0.8 - progressRatio); // Start with easy cells

  let selectedCell: CellDifficulty;

  if (Math.random() < easyBias) {
    // Pick from easiest 30%
    const easyIndex = Math.floor(Math.random() * Math.min(emptyCells.length * 0.3, emptyCells.length));
    selectedCell = emptyCells[easyIndex];
  } else {
    // Pick randomly from all cells (weighted toward easier)
    const weights = emptyCells.map((cell, idx) => 1 / (idx + 1));
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < emptyCells.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        selectedCell = emptyCells[i];
        break;
      }
    }

    if (!selectedCell!) {
      selectedCell = emptyCells[0];
    }
  }

  // Determine if this should be an error
  const shouldMakeError = Math.random() < profile.errorProbability;

  let value: number;
  if (shouldMakeError && selectedCell.possibleValues.length > 1) {
    // Make a realistic error (wrong but valid value)
    const wrongValues = selectedCell.possibleValues.filter(
      v => v !== solution[selectedCell.row][selectedCell.col]
    );
    value = wrongValues[Math.floor(Math.random() * wrongValues.length)] || selectedCell.possibleValues[0];
  } else {
    // Make correct move
    value = solution[selectedCell.row][selectedCell.col];
  }

  // Calculate move delay (realistic human timing)
  const baseDelay = 2000; // 2 seconds base
  const difficultyDelay = selectedCell.difficulty * 3000; // 0-3 seconds based on difficulty
  const jitter = (Math.random() - 0.5) * 1000; // ±500ms jitter
  const thinkingPause = Math.random() < profile.thinkingPauseChance ? 3000 : 0;

  const delay = (baseDelay + difficultyDelay + jitter + thinkingPause) / profile.speedMultiplier;

  return {
    row: selectedCell.row,
    col: selectedCell.col,
    value,
    isError: shouldMakeError && value !== solution[selectedCell.row][selectedCell.col],
    delay: Math.max(1000, delay), // Minimum 1 second
  };
}

/**
 * Adjust AI profile based on user win rate
 * Target: User wins 55-60% of matches
 */
export function adjustAIProfile(profile: AIProfile, userWon: boolean): AIProfile {
  const newProfile = { ...profile };
  newProfile.totalMatches++;
  newProfile.userWinRate = (
    (profile.userWinRate * profile.totalMatches + (userWon ? 1 : 0)) /
    newProfile.totalMatches
  );

  // Only adjust every 3 matches minimum
  const matchesSinceAdjustment = newProfile.totalMatches - (profile.totalMatches || 0);
  if (matchesSinceAdjustment < 3) {
    return newProfile;
  }

  // Adjust if win rate is outside target range (55-60%)
  if (newProfile.userWinRate < 0.50) {
    // User losing too much - make AI easier
    newProfile.speedMultiplier = Math.max(0.5, newProfile.speedMultiplier * 0.9);
    newProfile.errorProbability = Math.min(0.15, newProfile.errorProbability * 1.15);
    console.log('[AI] Adjusting difficulty DOWN - User win rate:', newProfile.userWinRate);
  } else if (newProfile.userWinRate > 0.65) {
    // User winning too much - make AI harder
    newProfile.speedMultiplier = Math.min(2.0, newProfile.speedMultiplier * 1.1);
    newProfile.errorProbability = Math.max(0.02, newProfile.errorProbability * 0.85);
    console.log('[AI] Adjusting difficulty UP - User win rate:', newProfile.userWinRate);
  }

  newProfile.lastAdjustment = Date.now();
  return newProfile;
}
