import {
  SudokuBoard,
  SudokuCell,
  Difficulty,
  DIFFICULTY_SETTINGS,
  BOARD_SIZE,
  BOX_SIZE,
  VALID_VALUES,
} from "./types";
import { createEmptyBoard } from "./helpers";

/**
 * Generiert ein leeres Sudoku-Board mit der angegebenen Struktur
 */
export function createInitialBoard(): SudokuBoard {
  return createEmptyBoard();
}

/**
 * Generiert eine vollständig gelöste Sudoku-Matrix mit optimierter Geschwindigkeit
 * @returns Ein 9x9 Array mit einer gültigen Sudoku-Lösung
 */
export function generateSolution(): number[][] {
  // Starte mit einer leeren Matrix
  const grid: number[][] = Array(BOARD_SIZE)
    .fill(0)
    .map(() => Array(BOARD_SIZE).fill(0));

  // Fülle die Matrix mit einer vollständigen Lösung
  fillGrid(grid);
  return grid;
}

/**
 * Prüft, ob eine Zahl an einer Position im Sudoku-Grid platziert werden kann
 * @param grid Das aktuelle Grid
 * @param row Die Zeile
 * @param col Die Spalte
 * @param num Die zu prüfende Zahl
 * @returns true wenn die Platzierung gültig ist
 */
function isSafe(grid: number[][], row: number, col: number, num: number): boolean {
  // Zeile prüfen
  for (let x = 0; x < BOARD_SIZE; x++) {
    if (grid[row][x] === num) {
      return false;
    }
  }

  // Spalte prüfen
  for (let x = 0; x < BOARD_SIZE; x++) {
    if (grid[x][col] === num) {
      return false;
    }
  }

  // 3x3 Block prüfen
  const startRow = row - (row % BOX_SIZE);
  const startCol = col - (col % BOX_SIZE);
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (grid[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Füllt eine leere Sudoku-Matrix rekursiv mit Zahlen
 * @param grid Die zu füllende Matrix
 * @returns true wenn erfolgreich, false wenn keine Lösung möglich
 */
function fillGrid(grid: number[][]): boolean {
  // Finde eine leere Zelle
  let row = -1;
  let col = -1;
  let isEmpty = false;

  // Suche die nächste leere Zelle
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (grid[i][j] === 0) {
        row = i;
        col = j;
        isEmpty = true;
        break;
      }
    }
    if (isEmpty) {
      break;
    }
  }

  // Wenn keine leere Zelle mehr vorhanden ist, ist das Grid vollständig
  if (!isEmpty) {
    return true;
  }

  // Verwende eine zufällige Reihenfolge der Zahlen für mehr Variation
  const numbers = [...VALID_VALUES];
  shuffleArray(numbers);

  // Versuche die Zahlen in der zufälligen Reihenfolge
  for (const num of numbers) {
    if (isSafe(grid, row, col, num)) {
      grid[row][col] = num;

      if (fillGrid(grid)) {
        return true;
      }

      grid[row][col] = 0; // Backtracking
    }
  }

  // Keine der Zahlen funktioniert, Backtrack
  return false;
}

/**
 * Effiziente Methode zur Prüfung, ob ein Sudoku genau eine Lösung hat
 * Stoppt sofort, wenn eine zweite Lösung gefunden wird
 */
function hasUniqueSolution(board: number[][]): boolean {
  const temp = JSON.parse(JSON.stringify(board)); // Kopie erstellen
  let solutionCount = 0;
  
  function countSolutions(grid: number[][]): boolean {
    // Finde eine leere Zelle
    let row = -1;
    let col = -1;
    let isEmpty = false;

    // Suche die nächste leere Zelle
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (grid[i][j] === 0) {
          row = i;
          col = j;
          isEmpty = true;
          break;
        }
      }
      if (isEmpty) {
        break;
      }
    }

    // Wenn keine leere Zelle mehr vorhanden ist, haben wir eine Lösung gefunden
    if (!isEmpty) {
      solutionCount++;
      // Wenn wir bereits 2 Lösungen gefunden haben, können wir direkt abbrechen
      return solutionCount >= 2;
    }

    // Versuche alle Zahlen von 1-9
    for (let num = 1; num <= 9; num++) {
      if (isSafe(grid, row, col, num)) {
        grid[row][col] = num;

        // Rekursiver Aufruf. Abbruch, wenn eine zweite Lösung gefunden wurde
        if (countSolutions(grid)) {
          return true;
        }

        grid[row][col] = 0; // Backtracking
      }
    }

    return false; // Kein Weg hat zu einer zweiten Lösung geführt
  }

  // Starte die rekursive Suche
  countSolutions(temp);
  
  // Genau eine Lösung?
  return solutionCount === 1;
}

/**
 * Entfernt Zellen aus einem gelösten Sudoku, um ein Puzzle zu erstellen
 * Optimierte Version für bessere Performance
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
  const puzzle = JSON.parse(JSON.stringify(solution));

  // Liste aller Indizes für Zellen
  const positions: { row: number; col: number }[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      positions.push({ row, col });
    }
  }

  // Mische die Positionen für mehr Variation
  shuffleArray(positions);

  // Anzahl der zu entfernenden Zellen
  const cellsToRemove = BOARD_SIZE * BOARD_SIZE - cluesCount;
  let removed = 0;
  
  // Cache für Symmetrie-Paare
  const symmetricPairs = new Map<string, {row: number, col: number}>();
  
  // Berechnete symmetrische Positionen im Voraus
  if (settings.symmetric) {
    for (const { row, col } of positions) {
      const symRow = BOARD_SIZE - 1 - row;
      const symCol = BOARD_SIZE - 1 - col;
      const key = `${row}-${col}`;
      const symKey = `${symRow}-${symCol}`;
      
      if (!symmetricPairs.has(symKey)) {
        symmetricPairs.set(key, { row: symRow, col: symCol });
      }
    }
  }

  // Optimierte Funktion zum schnellen Entfernen von Zellen
  for (const { row, col } of positions) {
    if (removed >= cellsToRemove) break;
    
    // Überspringe, wenn die Zelle bereits entfernt wurde
    if (puzzle[row][col] === 0) continue;
    
    // Ermittle zu entfernende Zellen (einschließlich symmetrischer Zelle, falls erforderlich)
    const cellsToTest = [{ row, col }];
    
    if (settings.symmetric) {
      const key = `${row}-${col}`;
      const symPosition = symmetricPairs.get(key);
      
      // Nur hinzufügen, wenn die symmetrische Zelle existiert und nicht die gleiche ist
      if (symPosition && (symPosition.row !== row || symPosition.col !== col)) {
        if (puzzle[symPosition.row][symPosition.col] !== 0) {
          cellsToTest.push(symPosition);
        }
      }
    }
    
    // Original-Werte sichern
    const backups = cellsToTest.map(pos => puzzle[pos.row][pos.col]);
    
    // Zellen entfernen
    cellsToTest.forEach(pos => {
      puzzle[pos.row][pos.col] = 0;
    });
    
    // Bei Expert-Level können wir nicht immer auf Eindeutigkeit prüfen (zu zeitintensiv)
    const shouldCheckUniqueness = settings.uniqueSolution && 
      (difficulty !== 'expert' || Math.random() < 0.5);
    
    if (shouldCheckUniqueness && !hasUniqueSolution(puzzle)) {
      // Wiederherstellen, wenn keine eindeutige Lösung
      cellsToTest.forEach((pos, idx) => {
        puzzle[pos.row][pos.col] = backups[idx];
      });
    } else {
      // Zähle tatsächlich entfernte Zellen
      removed += cellsToTest.length;
    }
  }

  // Konvertiere in SudokuBoard Format
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
 * Mischt ein Array nach dem Fisher-Yates Algorithmus
 * @param array Das zu mischende Array
 */
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Erzeugt ein komplettes Sudoku-Spiel mit Lösung
 * Optimierte Version für schnellere Generierung
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