/**
 * Sudoku data types and interfaces
 */

// Repräsentiert eine einzelne Zelle im Sudoku
export interface SudokuCell {
  value: number; // Aktueller Wert (0 = leer)
  isInitial: boolean; // Ist dies eine vorgegebene Zelle?
  isValid: boolean; // Ist der Wert gültig?
  notes: number[]; // Spieler-Notizen (1-9)
  highlight?: "error" | "success" | "hint" | null; // Optional für Farbmarkierungen
}

// Sudoku Board als 9x9 Grid von Zellen
export type SudokuBoard = SudokuCell[][];

// Verschiedene Schwierigkeitsgrade des Spiels
export type Difficulty = "easy" | "medium" | "hard" | "expert";

// Die Zahlenverteilung für verschiedene Schwierigkeitsstufen
export const DIFFICULTY_SETTINGS: Record<
  Difficulty,
  {
    minCells: number; // Minimale Anzahl an vorgegebenen Zellen
    maxCells: number; // Maximale Anzahl an vorgegebenen Zellen
    symmetric: boolean; // Symmetrische Anordnung der vorgegebenen Zellen?
    uniqueSolution?: boolean; // Einzigartige Lösung erforderlich?
  }
> = {
  easy: {
    minCells: 78, //45
    maxCells: 78, //48
    symmetric: true,
    uniqueSolution: true,
  },
  medium: {
    minCells: 35, //35
    maxCells: 39, //39
    symmetric: true,
    uniqueSolution: true,
  },
  hard: {
    minCells: 78, //27
    maxCells: 78, //31
    symmetric: true,
    uniqueSolution: true,
  },
  expert: {
    minCells: 78, //20
    maxCells: 78, //24
    symmetric: false,
    uniqueSolution: true,
  },
};

// Die Position einer Zelle im Board
export interface CellPosition {
  row: number;
  col: number;
}

// Game Save/Load Typen
export interface GameState {
  board: SudokuBoard;
  timer: number;
  difficulty: Difficulty;
  gameId?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// Hilfsfunktionen für häufig benötigte Konstanten
export const BOARD_SIZE = 9;
export const BOX_SIZE = 3;
export const VALID_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// Datenstruktur für die Statistik - Umbenannt, um Konflikte zu vermeiden
export interface SudokuGameStats {
  games: {
    total: number;
    completed: number;
    byDifficulty: Record<
      Difficulty,
      {
        total: number;
        completed: number;
        bestTime?: number;
      }
    >;
  };
  streaks: {
    current: number;
    best: number;
  };
  achievements: string[];
}
