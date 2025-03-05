import {
  SudokuBoard,
  SudokuCell,
  Difficulty,
  DIFFICULTY_SETTINGS,
  BOARD_SIZE,
  BOX_SIZE,
  VALID_VALUES,
} from "./types";
import { isValidPlacement, createEmptyBoard } from "./helpers";

/**
 * Generiert ein leeres Sudoku-Board mit der angegebenen Struktur
 */
export function createInitialBoard(): SudokuBoard {
  return createEmptyBoard();
}

/**
 * Generiert eine vollständig gelöste Sudoku-Matrix
 * @returns Ein 9x9 Array mit einer gültigen Sudoku-Lösung
 */
export function generateSolution(): number[][] {
  // Starte mit einer leeren Matrix
  const grid: number[][] = Array(BOARD_SIZE)
    .fill(0)
    .map(() => Array(BOARD_SIZE).fill(0));

  // Fülle die Matrix
  fillGrid(grid);

  return grid;
}

/**
 * Füllt eine leere Sudoku-Matrix rekursiv mit Zahlen
 * @param grid Die zu füllende Matrix
 * @returns true wenn erfolgreich, false wenn keine Lösung möglich
 */
function fillGrid(grid: number[][]): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      // Suche nach einer leeren Zelle
      if (grid[row][col] === 0) {
        // Verwende eine zufällige Reihenfolge für die Ziffern
        const values = [...VALID_VALUES];
        shuffleArray(values);

        // Versuche die Zahlen 1-9 in zufälliger Reihenfolge
        for (const num of values) {
          // Prüfe, ob die Zahl platziert werden kann
          if (isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num;

            // Rekursiver Aufruf für die nächste leere Zelle
            if (fillGrid(grid)) {
              return true;
            }

            // Wenn wir hier angekommen sind, war diese Zahl nicht Teil der Lösung
            grid[row][col] = 0;
          }
        }

        // Wenn keine Zahl funktioniert hat, müssen wir zurückgehen (Backtracking)
        return false;
      }
    }
  }

  // Wenn wir hier ankommen, ist das Grid vollständig gefüllt
  return true;
}

/**
 * Entfernt Zellen aus einem gelösten Sudoku, um ein Puzzle zu erstellen
 * @param solution Die vollständige Lösung
 * @param difficulty Der Schwierigkeitsgrad des Puzzles
 * @returns Ein Sudoku-Board mit dem angegebenen Schwierigkeitsgrad
 */
export function generatePuzzle(
  solution: number[][],
  difficulty: Difficulty
): SudokuBoard {
  const settings = DIFFICULTY_SETTINGS[difficulty];

  // Bestimme, wie viele Zahlen im Puzzle bleiben sollen
  const cluesCount = Math.floor(
    Math.random() * (settings.maxCells - settings.minCells + 1) +
      settings.minCells
  );

  // Erstelle eine Kopie der Lösung
  const puzzle = solution.map((row) => [...row]);

  // Liste aller Indizes für Zellen
  const positions: { row: number; col: number }[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      positions.push({ row, col });
    }
  }

  // Mische die Positionen
  shuffleArray(positions);

  // Anzahl der zu entfernenden Zellen
  const cellsToRemove = BOARD_SIZE * BOARD_SIZE - cluesCount;

  // Entferne Zellen unter Berücksichtigung von Symmetrie und Eindeutigkeit
  let removed = 0;
  for (const { row, col } of positions) {
    if (removed >= cellsToRemove) break;

    // Wenn Symmetrie gewünscht ist, finde symmetrische Position
    const cells = settings.symmetric
      ? [
          { row, col },
          { row: BOARD_SIZE - 1 - row, col: BOARD_SIZE - 1 - col },
        ]
      : [{ row, col }];

    // Originalpuzzle zur Wiederherstellung speichern
    const backup = cells.map((pos) => puzzle[pos.row][pos.col]);

    // Zellen leeren
    cells.forEach((pos) => {
      puzzle[pos.row][pos.col] = 0;
    });

    // Überprüfe, ob das Puzzle noch eindeutig lösbar ist (nur bei bestimmten Schwierigkeitsgraden)
    if (settings.uniqueSolution && !hasUniqueSolution(puzzle)) {
      // Wenn nicht, stelle die entfernten Zellen wieder her
      cells.forEach((pos, idx) => {
        puzzle[pos.row][pos.col] = backup[idx];
      });
    } else {
      // Zähle die tatsächlich entfernten Zellen
      removed += cells.length;
    }
  }

  // Konvertiere die zahlenbasierte Matrix in das SudokuBoard Format
  const board: SudokuBoard = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    const boardRow: SudokuCell[] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      const value = puzzle[row][col];
      boardRow.push({
        value,
        isInitial: value !== 0,
        isValid: true,
        notes: [],
      });
    }
    board.push(boardRow);
  }

  return board;
}

/**
 * Überprüft, ob ein Sudoku-Puzzle genau eine Lösung hat
 * @param puzzle Das zu überprüfende Puzzle
 * @returns true wenn das Puzzle genau eine Lösung hat
 */
function hasUniqueSolution(puzzle: number[][]): boolean {
  // Erstelle eine Kopie für die Arbeit
  const copy = puzzle.map((row) => [...row]);

  // Finde eine Lösung
  let solutionCount = 0;

  // Dies ist eine vereinfachte Version, die für die meisten Zwecke ausreicht
  // Eine vollständige Implementierung würde alle möglichen Lösungen zählen
  return countSolutions(copy, solutionCount, 0) === 1;
}

/**
 * Zählt die Anzahl der möglichen Lösungen für ein Sudoku-Puzzle
 * @param grid Das Puzzle
 * @param count Der aktuelle Zähler
 * @param limit Die maximale Anzahl zu findender Lösungen
 * @returns Die Anzahl der gefundenen Lösungen, begrenzt durch limit
 */
function countSolutions(
  grid: number[][],
  count: number,
  limit: number
): number {
  if (limit > 0 && count >= limit) {
    return count;
  }

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num;
            count = countSolutions(grid, count, limit);

            if (limit > 0 && count >= limit) {
              return count;
            }

            grid[row][col] = 0;
          }
        }
        return count;
      }
    }
  }

  // Wenn wir hier ankommen, haben wir eine Lösung gefunden
  return count + 1;
}

/**
 * Erzeugt ein komplettes Sudoku-Spiel mit Lösung
 * @param difficulty Der gewünschte Schwierigkeitsgrad
 * @returns Ein Objekt mit dem Board und der Lösung
 */
export function generateGame(difficulty: Difficulty): {
  board: SudokuBoard;
  solution: number[][];
} {
  // Erzeuge eine vollständige Lösung
  const solution = generateSolution();

  // Erzeuge ein Puzzle basierend auf dieser Lösung
  const board = generatePuzzle(solution, difficulty);

  return { board, solution };
}

/**
 * Mischt ein Array nach dem Fisher-Yates Algorithmus
 * @param array Das zu mischende Array
 */
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
