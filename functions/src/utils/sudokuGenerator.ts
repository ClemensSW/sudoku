/**
 * Sudoku Generator for Cloud Functions
 *
 * Generates Sudoku puzzles with solution
 * Adapted from client-side generator
 */

import { Difficulty } from "../types/firestore";

const BOARD_SIZE = 9;
const BOX_SIZE = 3;

// Difficulty-based cell removal counts
const DIFFICULTY_SETTINGS: Record<Difficulty, { cellsToRemove: number }> = {
  easy: { cellsToRemove: 40 }, // ~49% filled
  medium: { cellsToRemove: 50 }, // ~38% filled
  hard: { cellsToRemove: 55 }, // ~32% filled
  expert: { cellsToRemove: 60 }, // ~26% filled
};

/**
 * Checks if a number can be placed at position
 */
function isSafe(
  grid: number[][],
  row: number,
  col: number,
  num: number
): boolean {
  // Check row
  for (let x = 0; x < BOARD_SIZE; x++) {
    if (grid[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < BOARD_SIZE; x++) {
    if (grid[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = row - (row % BOX_SIZE);
  const startCol = col - (col % BOX_SIZE);
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (grid[startRow + i][startCol + j] === num) return false;
    }
  }

  return true;
}

/**
 * Fills grid recursively with backtracking
 */
function fillGrid(grid: number[][]): boolean {
  // Find empty cell
  let row = -1;
  let col = -1;

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (grid[i][j] === 0) {
        row = i;
        col = j;
        break;
      }
    }
    if (row !== -1) break;
  }

  // If no empty cell, grid is complete
  if (row === -1) return true;

  // Try numbers 1-9 in random order
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  shuffleArray(numbers);

  for (const num of numbers) {
    if (isSafe(grid, row, col, num)) {
      grid[row][col] = num;

      if (fillGrid(grid)) {
        return true;
      }

      // Backtrack
      grid[row][col] = 0;
    }
  }

  return false;
}

/**
 * Fisher-Yates shuffle
 */
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Generates a complete Sudoku solution
 */
function generateSolution(): number[][] {
  const grid: number[][] = Array(BOARD_SIZE)
    .fill(0)
    .map(() => Array(BOARD_SIZE).fill(0));

  fillGrid(grid);
  return grid;
}

/**
 * Removes cells from complete grid to create puzzle
 */
function removeNumbers(
  grid: number[][],
  cellsToRemove: number
): number[][] {
  const puzzle = grid.map((row) => [...row]);

  // Create list of all cell positions
  const positions: [number, number][] = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      positions.push([i, j]);
    }
  }

  // Shuffle positions
  shuffleArray(positions);

  // Remove cells
  for (let i = 0; i < cellsToRemove && i < positions.length; i++) {
    const [row, col] = positions[i];
    puzzle[row][col] = 0;
  }

  return puzzle;
}

/**
 * Generates a Sudoku puzzle with solution
 *
 * @param difficulty The difficulty level
 * @returns Object with board (puzzle) and solution
 */
export function generateSudokuPuzzle(difficulty: Difficulty): {
  board: number[][];
  solution: number[][];
} {
  const solution = generateSolution();
  const cellsToRemove = DIFFICULTY_SETTINGS[difficulty].cellsToRemove;
  const board = removeNumbers(solution, cellsToRemove);

  return {
    board,
    solution,
  };
}

/**
 * Generates a random AI opponent name
 */
const AI_FIRST_NAMES = [
  "Alex",
  "Taylor",
  "Jordan",
  "Casey",
  "Morgan",
  "Riley",
  "Avery",
  "Quinn",
];
const AI_LAST_NAMES = [
  "Smith",
  "Chen",
  "Kumar",
  "Müller",
  "Garcia",
  "Johnson",
  "Lee",
  "Brown",
];

export function generateAIName(): string {
  const first = AI_FIRST_NAMES[Math.floor(Math.random() * AI_FIRST_NAMES.length)];
  const last = AI_LAST_NAMES[Math.floor(Math.random() * AI_LAST_NAMES.length)];
  return `${first} ${last}`;
}

/**
 * Generates a random 6-character invite code
 */
export function generateInviteCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
