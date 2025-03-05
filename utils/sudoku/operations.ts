import {
    SudokuBoard,
    CellPosition,
    BOARD_SIZE,
    BOX_SIZE,
    VALID_VALUES,
  } from "./types";
  import {
    isValidMove,
    getRelatedCells,
    cloneBoard,
    validateBoard,
    getPossibleValues,
  } from "./helpers";
  
  /**
   * Setzt einen Wert in einer Zelle, falls der Zug gültig ist
   * @param board Das aktuelle Board
   * @param row Die Zeile
   * @param col Die Spalte
   * @param value Der neue Wert
   * @returns Ein aktualisiertes Board
   */
  export function setCellValue(
    board: SudokuBoard,
    row: number,
    col: number,
    value: number
  ): SudokuBoard {
    // Kopie des Boards erstellen, um Immutability zu gewährleisten
    const newBoard = cloneBoard(board);
  
    // Wenn die Zelle initial ist, kann sie nicht verändert werden
    if (board[row][col].isInitial) {
      return newBoard;
    }
  
    // Wenn derselbe Wert schon in der Zelle steht, lösche ihn
    if (board[row][col].value === value) {
      newBoard[row][col].value = 0;
      newBoard[row][col].isValid = true;
      return validateBoard(newBoard);
    }
  
    // Prüfe, ob der Zug gültig ist
    const isValid = isValidMove(board, row, col, value);
  
    // Setze den neuen Wert
    newBoard[row][col].value = value;
    newBoard[row][col].isValid = isValid;
  
    // Lösche Notizen für diese Zelle
    newBoard[row][col].notes = [];
  
    // Validiere das gesamte Board, da der neue Wert andere Zellen beeinflussen kann
    return validateBoard(newBoard);
  }
  
  /**
   * Fügt eine Notiz zu einer Zelle hinzu oder entfernt sie
   * @param board Das aktuelle Board
   * @param row Die Zeile
   * @param col Die Spalte
   * @param note Die Notiz (1-9)
   * @returns Ein aktualisiertes Board
   */
  export function toggleCellNote(
    board: SudokuBoard,
    row: number,
    col: number,
    note: number
  ): SudokuBoard {
    // Prüfen ob der Wert gültig ist
    if (note < 1 || note > 9) {
      return board;
    }
  
    // Kopie des Boards erstellen
    const newBoard = cloneBoard(board);
  
    // Wenn die Zelle bereits einen Wert hat oder initial ist, keine Notizen erlauben
    if (board[row][col].value !== 0 || board[row][col].isInitial) {
      return newBoard;
    }
  
    // Notizen aktualisieren
    const noteIndex = newBoard[row][col].notes.indexOf(note);
    if (noteIndex >= 0) {
      // Entferne die Notiz, wenn sie bereits existiert
      newBoard[row][col].notes.splice(noteIndex, 1);
    } else {
      // Füge die Notiz hinzu, wenn sie noch nicht existiert
      newBoard[row][col].notes.push(note);
      newBoard[row][col].notes.sort((a, b) => a - b); // Sortiere die Notizen
    }
  
    return newBoard;
  }
  
  /**
   * Lösche alle Notizen in einer Zelle
   * @param board Das aktuelle Board
   * @param row Die Zeile
   * @param col Die Spalte
   * @returns Ein aktualisiertes Board
   */
  export function clearCellNotes(
    board: SudokuBoard,
    row: number,
    col: number
  ): SudokuBoard {
    // Kopie des Boards erstellen
    const newBoard = cloneBoard(board);
  
    // Notizen löschen
    newBoard[row][col].notes = [];
  
    return newBoard;
  }
  
  /**
   * Lösche den Wert in einer Zelle
   * @param board Das aktuelle Board
   * @param row Die Zeile
   * @param col Die Spalte
   * @returns Ein aktualisiertes Board
   */
  export function clearCellValue(
    board: SudokuBoard,
    row: number,
    col: number
  ): SudokuBoard {
    // Kopie des Boards erstellen
    const newBoard = cloneBoard(board);
  
    // Wenn die Zelle initial ist, kann sie nicht verändert werden
    if (board[row][col].isInitial) {
      return newBoard;
    }
  
    // Wert auf 0 setzen und als gültig markieren
    newBoard[row][col].value = 0;
    newBoard[row][col].isValid = true;
  
    return validateBoard(newBoard);
  }
  
  /**
   * Löse eine Zelle mit dem korrekten Wert aus der Lösung
   * @param board Das aktuelle Board
   * @param solution Die Lösung
   * @param row Die Zeile
   * @param col Die Spalte
   * @returns Ein aktualisiertes Board
   */
  export function solveCell(
    board: SudokuBoard,
    solution: number[][],
    row: number,
    col: number
  ): SudokuBoard {
    // Kopie des Boards erstellen
    const newBoard = cloneBoard(board);
  
    // Wenn die Zelle initial ist, kann sie nicht verändert werden
    if (board[row][col].isInitial) {
      return newBoard;
    }
  
    // Setze den Wert aus der Lösung
    const correctValue = solution[row][col];
    newBoard[row][col].value = correctValue;
    newBoard[row][col].isValid = true;
    newBoard[row][col].notes = [];
    newBoard[row][col].highlight = "hint";
  
    // Markiere den Wert als "hint" für visuelle Rückmeldung
    setTimeout(() => {
      newBoard[row][col].highlight = null;
    }, 2000);
  
    return validateBoard(newBoard);
  }
  
  /**
   * Markiert alle fehlerhaften Zellen im Board
   * @param board Das aktuelle Board
   * @returns Ein aktualisiertes Board mit Fehlermarkierungen
   */
  export function highlightErrors(board: SudokuBoard): SudokuBoard {
    const newBoard = validateBoard(cloneBoard(board));
  
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (newBoard[row][col].value !== 0 && !newBoard[row][col].isValid) {
          newBoard[row][col].highlight = "error";
        }
      }
    }
  
    return newBoard;
  }
  
  /**
   * Aktualisiert automatisch alle Notizen im Board
   * @param board Das aktuelle Board
   * @returns Ein aktualisiertes Board mit aktualisierten Notizen
   */
  export function autoUpdateNotes(board: SudokuBoard): SudokuBoard {
    const newBoard = cloneBoard(board);
  
    // Für jede leere Zelle
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (newBoard[row][col].value === 0 && !newBoard[row][col].isInitial) {
          // Berechne alle möglichen Werte für diese Zelle
          const possibleValues = getPossibleValues(newBoard, row, col);
          newBoard[row][col].notes = possibleValues;
        }
      }
    }
  
    return newBoard;
  }
  
  /**
   * Entfernt eine Notiz aus allen verwandten Zellen
   * @param board Das aktuelle Board
   * @param row Die Zeile der Ausgangs-Zelle
   * @param col Die Spalte der Ausgangs-Zelle
   * @param value Der Wert, der aus den Notizen entfernt werden soll
   * @returns Ein aktualisiertes Board
   */
  export function removeNoteFromRelatedCells(
    board: SudokuBoard,
    row: number,
    col: number,
    value: number
  ): SudokuBoard {
    const newBoard = cloneBoard(board);
    const relatedCells = getRelatedCells(row, col);
  
    // Für jede verwandte Zelle
    for (const cell of relatedCells) {
      const { row: r, col: c } = cell;
      
      // Wenn die Zelle leer ist und Notizen hat
      if (newBoard[r][c].value === 0 && newBoard[r][c].notes.length > 0) {
        // Entferne den Wert aus den Notizen
        const noteIndex = newBoard[r][c].notes.indexOf(value);
        if (noteIndex >= 0) {
          newBoard[r][c].notes.splice(noteIndex, 1);
        }
      }
    }
  
    return newBoard;
  }