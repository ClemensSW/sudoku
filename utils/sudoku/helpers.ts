import {
  SudokuBoard,
  SudokuCell,
  CellPosition,
  BOARD_SIZE,
  BOX_SIZE,
  VALID_VALUES,
} from "./types";

/**
 * Erstellt ein leeres Sudoku-Board
 * @returns Ein leeres SudokuBoard
 */
export function createEmptyBoard(): SudokuBoard {
  const board: SudokuBoard = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    const boardRow: SudokuCell[] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      boardRow.push({
        value: 0,
        isInitial: false,
        isValid: true,
        notes: [],
      });
    }
    board.push(boardRow);
  }

  return board;
}

/**
 * Prüft, ob eine Zahl an einer Position im Sudoku-Grid platziert werden kann
 * @param grid Das Sudoku-Grid (mit Zahlen)
 * @param row Die Zeile
 * @param col Die Spalte
 * @param num Die zu prüfende Zahl
 * @returns true wenn die Platzierung gültig ist
 */
export function isValidPlacement(
  grid: number[][],
  row: number,
  col: number,
  num: number
): boolean {
  // Wenn die Zelle bereits besetzt ist, ist die Platzierung ungültig
  if (grid[row][col] !== 0) {
    return grid[row][col] === num;
  }

  // Prüfe Zeile
  for (let c = 0; c < BOARD_SIZE; c++) {
    if (grid[row][c] === num) {
      return false;
    }
  }

  // Prüfe Spalte
  for (let r = 0; r < BOARD_SIZE; r++) {
    if (grid[r][col] === num) {
      return false;
    }
  }

  // Prüfe 3x3 Box
  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;

  for (let r = 0; r < BOX_SIZE; r++) {
    for (let c = 0; c < BOX_SIZE; c++) {
      if (grid[boxRow + r][boxCol + c] === num) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Prüft, ob ein Zug im Board valide ist
 * @param board Das aktuelle Board
 * @param row Die Zeile
 * @param col Die Spalte
 * @param value Der neue Wert
 * @returns true wenn der Zug gültig ist
 */
export function isValidMove(
  board: SudokuBoard,
  row: number,
  col: number,
  value: number
): boolean {
  if (value === 0) return true; // 0 (leere Zelle) ist immer gültig

  // Konvertiere SudokuBoard zu number[][]
  const grid = boardToNumberGrid(board);

  return isValidPlacement(grid, row, col, value);
}

/**
 * Prüft, ob das Board vollständig und korrekt gelöst ist
 * @param board Das zu prüfende Board
 * @returns true wenn das Board vollständig und korrekt gelöst ist
 */
export function isBoardComplete(board: SudokuBoard): boolean {
  // Prüfe, ob alle Zellen ausgefüllt sind
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col].value === 0 || !board[row][col].isValid) {
        return false;
      }
    }
  }

  // Wenn alle Zellen ausgefüllt und gültig sind, ist das Board komplett
  return true;
}

/**
 * Konvertiert ein SudokuBoard zu einem einfachen number[][]
 * @param board Das zu konvertierende Board
 * @returns Eine number[][] Matrix des Boards
 */
export function boardToNumberGrid(board: SudokuBoard): number[][] {
  return board.map((row) => row.map((cell) => cell.value));
}

/**
 * Gibt alle Zellen in derselben Zeile, Spalte und Box zurück
 * @param row Die Zeile der Referenzzelle
 * @param col Die Spalte der Referenzzelle
 * @returns Ein Array von Positionen der verwandten Zellen
 */
export function getRelatedCells(row: number, col: number): CellPosition[] {
  const relatedCells: CellPosition[] = [];

  // Zellen in derselben Zeile
  for (let c = 0; c < BOARD_SIZE; c++) {
    if (c !== col) {
      relatedCells.push({ row, col: c });
    }
  }

  // Zellen in derselben Spalte
  for (let r = 0; r < BOARD_SIZE; r++) {
    if (r !== row) {
      relatedCells.push({ row: r, col });
    }
  }

  // Zellen im selben 3x3 Block
  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;

  for (let r = 0; r < BOX_SIZE; r++) {
    for (let c = 0; c < BOX_SIZE; c++) {
      const newRow = boxRow + r;
      const newCol = boxCol + c;
      if (newRow !== row || newCol !== col) {
        relatedCells.push({ row: newRow, col: newCol });
      }
    }
  }

  return relatedCells;
}

/**
 * Überprüft und aktualisiert die Validität aller Zellen im Board
 * @param board Das zu überprüfende Board
 * @returns Das aktualisierte Board
 */
export function validateBoard(board: SudokuBoard): SudokuBoard {
  const updatedBoard = JSON.parse(JSON.stringify(board)) as SudokuBoard;
  const grid = boardToNumberGrid(board);

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const value = board[row][col].value;

      if (value !== 0) {
        // Temporär den Wert entfernen
        grid[row][col] = 0;

        // Prüfen, ob der Wert hier gültig ist
        const isValid = isValidPlacement(grid, row, col, value);

        // Wert wiederherstellen
        grid[row][col] = value;

        // Gültigkeit aktualisieren
        updatedBoard[row][col].isValid = isValid;
      }
    }
  }

  return updatedBoard;
}

/**
 * Findet einen Hinweis für den nächsten Zug
 * @param board Das aktuelle Board
 * @param solution Die komplette Lösung
 * @returns Die Position des nächsten Hinweises oder null
 */
export function getHint(
  board: SudokuBoard,
  solution: number[][]
): CellPosition | null {
  // Suche nach einer leeren oder falschen Zelle
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = board[row][col];

      if (
        !cell.isInitial &&
        (cell.value === 0 || cell.value !== solution[row][col])
      ) {
        return { row, col };
      }
    }
  }

  return null;
}

/**
 * Berechnet mögliche Notizen für alle Zellen
 * @param board Das aktuelle Board
 * @returns Eine Map mit Positionen und möglichen Werten
 */
export function calculateAllNotes(board: SudokuBoard): Map<string, number[]> {
  const notes = new Map<string, number[]>();

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col].value === 0) {
        const possibleValues = getPossibleValues(board, row, col);
        notes.set(`${row}-${col}`, possibleValues);
      }
    }
  }

  return notes;
}

/**
 * Ermittelt alle möglichen Werte für eine Zelle
 * @param board Das aktuelle Board
 * @param row Die Zeile der Zelle
 * @param col Die Spalte der Zelle
 * @returns Ein Array der möglichen Werte
 */
export function getPossibleValues(
  board: SudokuBoard,
  row: number,
  col: number
): number[] {
  if (board[row][col].value !== 0) {
    return [];
  }

  const grid = boardToNumberGrid(board);
  const possibleValues: number[] = [];

  for (const num of VALID_VALUES) {
    if (isValidPlacement(grid, row, col, num)) {
      possibleValues.push(num);
    }
  }

  return possibleValues;
}

/**
 * Klon des Boards für immutable operations
 * @param board Das zu klonende Board
 * @returns Ein tiefer Klon des Boards
 */
export function cloneBoard(board: SudokuBoard): SudokuBoard {
  return JSON.parse(JSON.stringify(board)) as SudokuBoard;
}
