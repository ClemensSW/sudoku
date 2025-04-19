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
 * Zählt die Anzahl der gefüllten Zellen in einem bestimmten Bereich des Puzzles
 */
function countFilledCells(puzzle: number[][], cells: { row: number; col: number }[]): number {
  let count = 0;
  for (const { row, col } of cells) {
    if (puzzle[row][col] !== 0) {
      count++;
    }
  }
  return count;
}

/**
 * Entfernt Zellen aus einem gelösten Sudoku, um ein Puzzle zu erstellen
 * Verbesserte Version mit garantierter Balance zwischen den Spielern
 * @param solution Die vollständige Lösung
 * @param difficulty Der Schwierigkeitsgrad des Puzzles
 * @returns Ein Sudoku-Board mit dem angegebenen Schwierigkeitsgrad und ausgewogener Zellenverteilung
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

  // Spielerbereiche definieren
  const player1Cells: { row: number; col: number }[] = [];
  const player2Cells: { row: number; col: number }[] = [];
  
  // Zellen nach Spielerbereichen aufteilen
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      // Die mittlere Zelle (4,4) überspringen, da sie immer gefüllt bleiben soll
      if (row === 4 && col === 4) continue;
      
      // Spieler 2 bekommt die obere Hälfte (Zeilen 0-3 und die Hälfte von Zeile 4)
      if (row < 4 || (row === 4 && col < 4)) {
        player2Cells.push({ row, col });
      }
      // Spieler 1 bekommt die untere Hälfte (Zeilen 5-8 und die Hälfte von Zeile 4)
      else if (row > 4 || (row === 4 && col > 4)) {
        player1Cells.push({ row, col });
      }
    }
  }

  // Berechne, wie viele Zellen pro Spielerbereich entfernt werden sollen
  // -1 für die mittlere Zelle, die immer gefüllt bleibt
  const totalCellsToRemove = BOARD_SIZE * BOARD_SIZE - cluesCount - 1;
  const cellsToRemovePerPlayer = Math.floor(totalCellsToRemove / 2);
  
  // Hilfsfunktion: Entferne Zellen aus einem bestimmten Bereich
  const removeCellsFromArea = (
    cells: { row: number; col: number }[],
    targetRemovalCount: number,
    uniquenessCheck: boolean
  ): number => {
    let removed = 0;
    // Mische die Zellen für zufällige Entfernung
    shuffleArray(cells);
    
    for (const { row, col } of cells) {
      if (removed >= targetRemovalCount) break;
      
      // Original-Wert sichern
      const backup = puzzle[row][col];
      
      // Zelle entfernen
      puzzle[row][col] = 0;
      
      // Prüfen, ob die Lösung immer noch eindeutig ist - falls erforderlich
      if (uniquenessCheck && !hasUniqueSolution(puzzle)) {
        // Wiederherstellen, wenn keine eindeutige Lösung
        puzzle[row][col] = backup;
      } else {
        // Zelle wurde erfolgreich entfernt
        removed++;
      }
    }
    
    return removed;
  };
  
  // Hilfsfunktion: Fülle Zellen in einem bestimmten Bereich wieder
  const restoreCellsInArea = (
    cells: { row: number; col: number }[],
    solution: number[][],
    count: number
  ): number => {
    let restored = 0;
    // Mische die Zellen für zufällige Wiederherstellung
    shuffleArray([...cells]);
    
    for (const { row, col } of cells) {
      if (restored >= count) break;
      
      // Nur leere Zellen wiederherstellen
      if (puzzle[row][col] === 0) {
        puzzle[row][col] = solution[row][col];
        restored++;
      }
    }
    
    return restored;
  };

  // Phase 1: Erste Runde der Zellenentfernung - für beide Spielerbereiche
  // Bestimme ob Eindeutigkeit geprüft werden soll (je nach Schwierigkeitsgrad)
  const shouldCheckUniqueness = settings.uniqueSolution && 
    difficulty !== 'expert';  // Bei Expert verzichten wir auf die Eindeutigkeitsprüfung für Geschwindigkeit
    
  // Für Expert-Schwierigkeitsgrad selektive Prüfung (nicht immer)
  const expertRandomCheck = difficulty === 'expert' && Math.random() < 0.5;
  
  // Führe die Eindeutigkeitsprüfung durch, wenn erforderlich
  const checkUniqueness = shouldCheckUniqueness || expertRandomCheck;
  
  console.log(`Starte Zellenentfernung mit Eindeutigkeitsprüfung: ${checkUniqueness}`);
  
  // Erster Durchlauf: Entferne Zellen in beiden Bereichen
  const removedPlayer1 = removeCellsFromArea(player1Cells, cellsToRemovePerPlayer, checkUniqueness);
  const removedPlayer2 = removeCellsFromArea(player2Cells, cellsToRemovePerPlayer, checkUniqueness);
  
  console.log(`Erste Phase: Spieler 1: ${removedPlayer1}/${cellsToRemovePerPlayer} Zellen entfernt`);
  console.log(`Erste Phase: Spieler 2: ${removedPlayer2}/${cellsToRemovePerPlayer} Zellen entfernt`);
  
  // Phase 2: Balancierung - Sorge für Gleichgewicht zwischen den Spielerbereichen
  
  // Zähle die aktuell gefüllten Zellen pro Spieler
  const filledPlayer1 = player1Cells.length - removedPlayer1;
  const filledPlayer2 = player2Cells.length - removedPlayer2;
  
  console.log(`Nach erster Phase: Spieler 1 hat ${filledPlayer1} gefüllte Zellen`);
  console.log(`Nach erster Phase: Spieler 2 hat ${filledPlayer2} gefüllte Zellen`);
  
  // Berechne das Ungleichgewicht
  const imbalance = filledPlayer1 - filledPlayer2;
  
  // Wenn ein Ungleichgewicht besteht, versuche es auszugleichen
  if (imbalance !== 0) {
    console.log(`Ungleichgewicht erkannt: ${imbalance} (Positiv = Spieler 1 hat mehr gefüllte Zellen)`);
    
    // SICHERE OPTION: Wir stellen nur Zellen wieder her, anstatt zusätzliche zu entfernen
    // Damit gewährleisten wir, dass das Sudoku definitiv lösbar bleibt
    
    if (imbalance > 0) {
      // Spieler 1 hat mehr gefüllte Zellen - stelle bei Spieler 2 Zellen wieder her
      console.log(`Stelle ${imbalance} Zellen bei Spieler 2 wieder her, um Balance zu erreichen...`);
      
      const restored = restoreCellsInArea(
        player2Cells.filter(cell => puzzle[cell.row][cell.col] === 0), // Nur leere Zellen
        solution,
        imbalance
      );
      
      console.log(`${restored}/${imbalance} Zellen bei Spieler 2 wiederhergestellt`);
      
      // Wenn nicht alle Zellen wiederhergestellt werden konnten (z.B. nicht genug leere Zellen vorhanden),
      // geben wir eine Warnung aus, aber das Sudoku bleibt lösbar
      if (restored < imbalance) {
        console.log(`WARNUNG: Konnte nur ${restored}/${imbalance} Zellen wiederherstellen. Perfekte Balance nicht möglich.`);
      }
    } else {
      // Spieler 2 hat mehr gefüllte Zellen - stelle bei Spieler 1 Zellen wieder her
      const absImbalance = Math.abs(imbalance);
      console.log(`Stelle ${absImbalance} Zellen bei Spieler 1 wieder her, um Balance zu erreichen...`);
      
      const restored = restoreCellsInArea(
        player1Cells.filter(cell => puzzle[cell.row][cell.col] === 0), // Nur leere Zellen
        solution,
        absImbalance
      );
      
      console.log(`${restored}/${absImbalance} Zellen bei Spieler 1 wiederhergestellt`);
      
      // Wenn nicht alle Zellen wiederhergestellt werden konnten, geben wir eine Warnung aus
      if (restored < absImbalance) {
        console.log(`WARNUNG: Konnte nur ${restored}/${absImbalance} Zellen wiederherstellen. Perfekte Balance nicht möglich.`);
      }
    }
    
    // Finale Prüfung
    const finalFilledPlayer1 = countFilledCells(puzzle, player1Cells);
    const finalFilledPlayer2 = countFilledCells(puzzle, player2Cells);
    console.log(`Nach Balancierung: Spieler 1 hat ${finalFilledPlayer1} gefüllte Zellen`);
    console.log(`Nach Balancierung: Spieler 2 hat ${finalFilledPlayer2} gefüllte Zellen`);
    
    if (finalFilledPlayer1 !== finalFilledPlayer2) {
      console.log(`WARNUNG: Konnte keine perfekte Balance erreichen! ` +
                  `Differenz: ${finalFilledPlayer1 - finalFilledPlayer2}`);
    } else {
      console.log("Perfekte Balance erreicht!");
    }
  } else {
    console.log("Spielerbereiche bereits ausgeglichen, keine Balancierung erforderlich.");
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

  // Sicherstellen, dass die mittlere Zelle immer gefüllt ist
  board[4][4].value = solution[4][4];
  board[4][4].isInitial = true;

  return board;
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