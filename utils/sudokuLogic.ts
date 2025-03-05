// Vordefinierte Sudoku-Rätsel für verschiedene Schwierigkeitsgrade
const SAMPLE_PUZZLES = {
  easy: [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ],
  medium: [
    [0, 0, 0, 2, 6, 0, 7, 0, 1],
    [6, 8, 0, 0, 7, 0, 0, 9, 0],
    [1, 9, 0, 0, 0, 4, 5, 0, 0],
    [8, 2, 0, 1, 0, 0, 0, 4, 0],
    [0, 0, 4, 6, 0, 2, 9, 0, 0],
    [0, 5, 0, 0, 0, 3, 0, 2, 8],
    [0, 0, 9, 3, 0, 0, 0, 7, 4],
    [0, 4, 0, 0, 5, 0, 0, 3, 6],
    [7, 0, 3, 0, 1, 8, 0, 0, 0],
  ],
  hard: [
    [0, 2, 0, 6, 0, 8, 0, 0, 0],
    [5, 8, 0, 0, 0, 9, 7, 0, 0],
    [0, 0, 0, 0, 4, 0, 0, 0, 0],
    [3, 7, 0, 0, 0, 0, 5, 0, 0],
    [6, 0, 0, 0, 0, 0, 0, 0, 4],
    [0, 0, 8, 0, 0, 0, 0, 1, 3],
    [0, 0, 0, 0, 2, 0, 0, 0, 0],
    [0, 0, 9, 8, 0, 0, 0, 3, 6],
    [0, 0, 0, 3, 0, 6, 0, 9, 0],
  ],
};

// Generiere ein Sudoku Puzzle
export function generateSudoku(
  difficulty: "easy" | "medium" | "hard" = "easy"
): { puzzle: number[][]; solution: number[][] } {
  const puzzleTemplate = SAMPLE_PUZZLES[difficulty];

  // Erstelle eine Kopie der Vorlage
  const puzzle = puzzleTemplate.map((row) => [...row]);

  // Erstelle eine Lösung durch Lösen des Puzzles
  const solution = puzzle.map((row) => [...row]);
  solveSudoku(solution);

  return { puzzle, solution };
}

// Prüfe, ob das Platzieren einer Zahl gültig ist
export function isMoveValid(
  board: number[][],
  row: number,
  col: number,
  num: number
): boolean {
  // Prüfe Zeile
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
  }

  // Prüfe Spalte
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num) return false;
  }

  // Prüfe 3x3 Box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === num) return false;
    }
  }

  return true;
}

// Prüfe, ob das Sudoku gelöst ist
export function isSudokuSolved(board: number[][]): boolean {
  // Prüfe, ob es leere Zellen gibt
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) return false;
    }
  }

  // Das Board ist vollständig ausgefüllt, wir nehmen an, dass es gültig ist
  // (da wir die Gültigkeit jedes Zuges bereits überprüfen)
  return true;
}

// Löse das Sudoku mit Backtracking
function solveSudoku(board: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      // Finde eine leere Zelle
      if (board[row][col] === 0) {
        // Versuche Zahlen 1-9 zu platzieren
        for (let num = 1; num <= 9; num++) {
          if (isMoveValid(board, row, col, num)) {
            board[row][col] = num;

            // Löse den Rest des Boards rekursiv
            if (solveSudoku(board)) {
              return true;
            }

            // Wenn diese Zahl nicht zur Lösung führt, gehe zurück
            board[row][col] = 0;
          }
        }
        // Wenn keine Zahl hier platziert werden kann, ist das Board unlösbar
        return false;
      }
    }
  }
  // Wenn wir das gesamte Board gefüllt haben, haben wir es gelöst
  return true;
}
