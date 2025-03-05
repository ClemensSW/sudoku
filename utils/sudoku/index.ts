/**
 * Sudoku Game Logic
 *
 * Zentraler Export aller Sudoku-bezogenen Funktionen und Typen.
 */

// Exportiere Typen
export * from "./types";

// Exportiere Hilfsfunktionen
export {
  createEmptyBoard,
  isValidPlacement,
  isValidMove,
  isBoardComplete,
  boardToNumberGrid,
  getRelatedCells,
  validateBoard,
  getHint,
  calculateAllNotes,
  getPossibleValues,
  cloneBoard,
} from "./helpers";

// Exportiere Generator-Funktionen
export {
  createInitialBoard,
  generateSolution,
  generatePuzzle,
  generateGame,
} from "./generator";

// Exportiere Board-Operationen
export {
  setCellValue,
  toggleCellNote,
  clearCellNotes,
  solveCell,
  clearCellValue,
  highlightErrors,
  autoUpdateNotes,
  removeNoteFromRelatedCells,
} from "./operations";
