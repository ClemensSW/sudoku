// screens/DuoGameScreen/hooks/useDuoGameState.ts
import { useState, useEffect, useCallback, useRef } from "react";
import {
  SudokuBoard as SudokuBoardType,
  Difficulty,
  generateGame,
  setCellValue,
  isValidPlacement,
  boardToNumberGrid,
  clearCellValue,
  toggleCellNote,
  getRelatedCells,
  cloneBoard,
} from "@/utils/sudoku";
import { triggerHaptic } from "@/utils/haptics";

// Constants
const MAX_HINTS = 3;
const MAX_ERRORS = 3;

// Types
export interface CellPosition {
  row: number;
  col: number;
}

export interface PlayerArea {
  player: 1 | 2;
  cells: CellPosition[];
}

export interface DuoGameState {
  board: SudokuBoardType;
  solution: number[][];
  player1Cell: CellPosition | null;
  player2Cell: CellPosition | null;
  player1Complete: boolean;
  player2Complete: boolean;
  player1NoteMode: boolean;
  player2NoteMode: boolean;
  player1Hints: number;
  player2Hints: number;
  player1Errors: number;
  player2Errors: number;
  maxErrors: number;
  isGameRunning: boolean;
  isGameComplete: boolean;
  isLoading: boolean;
  gameTime: number;
  // Fortschrittsfelder
  player1InitialEmptyCells: number;
  player1SolvedCells: number;
  player2InitialEmptyCells: number;
  player2SolvedCells: number;
}

export interface DuoGameActions {
  startNewGame: () => void;
  handleCellPress: (player: 1 | 2, row: number, col: number) => void;
  handleNumberPress: (player: 1 | 2, number: number) => void;
  handleClear: (player: 1 | 2) => void;
  handleNoteToggle: (player: 1 | 2) => void;
  handleHint: (player: 1 | 2) => void;
  handleTimeUpdate: (time: number) => void;
  calculatePlayerAreas: () => [PlayerArea, PlayerArea];
  getCellOwner: (row: number, col: number) => 0 | 1 | 2;
  handleBackPress: () => boolean;
}

// Type for the game completion callback
type GameCompletionCallback = (
  winner: 0 | 1 | 2, 
  reason: "completion" | "errors"
) => void;

// NEUE HILFSFUNKTION: Generiert initiale Spielerbereiche
function generateInitialPlayerAreas(): [PlayerArea, PlayerArea] {
  const player1Cells: CellPosition[] = [];
  const player2Cells: CellPosition[] = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      // Player 2 gets top half (rows 0-3 and half of row 4)
      if (row < 4 || (row === 4 && col < 4)) {
        player2Cells.push({ row, col });
      }
      // Player 1 gets bottom half (rows 5-8 and half of row 4)
      else if (row > 4 || (row === 4 && col > 4)) {
        player1Cells.push({ row, col });
      }
      // Middle cell (4,4) is shared/neutral and excluded from both areas
    }
  }
  
  console.log("Initial player areas generated:");
  console.log(`Player 1 area: ${player1Cells.length} cells`);
  console.log(`Player 2 area: ${player2Cells.length} cells`);

  return [
    { player: 1, cells: player1Cells },
    { player: 2, cells: player2Cells },
  ];
}

export const useDuoGameState = (
  initialDifficulty: Difficulty = "medium",
  onQuit?: () => void,
  onGameComplete?: GameCompletionCallback
): [DuoGameState, DuoGameActions] => {
  // Game state
  const [board, setBoard] = useState<SudokuBoardType>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [player1Cell, setPlayer1Cell] = useState<CellPosition | null>(null);
  const [player2Cell, setPlayer2Cell] = useState<CellPosition | null>(null);
  const [player1Complete, setPlayer1Complete] = useState(false);
  const [player2Complete, setPlayer2Complete] = useState(false);
  const [player1NoteMode, setPlayer1NoteMode] = useState(false);
  const [player2NoteMode, setPlayer2NoteMode] = useState(false);
  const [player1Hints, setPlayer1Hints] = useState(MAX_HINTS);
  const [player2Hints, setPlayer2Hints] = useState(MAX_HINTS);
  const [player1Errors, setPlayer1Errors] = useState(0);
  const [player2Errors, setPlayer2Errors] = useState(0);
  const [maxErrors] = useState(MAX_ERRORS);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gameTime, setGameTime] = useState(0);
  
  // Neue Fortschrittsfelder
  const [player1InitialEmptyCells, setPlayer1InitialEmptyCells] = useState(0);
  const [player1SolvedCells, setPlayer1SolvedCells] = useState(0);
  const [player2InitialEmptyCells, setPlayer2InitialEmptyCells] = useState(0);
  const [player2SolvedCells, setPlayer2SolvedCells] = useState(0);
  
  // Statisch initialisierte Spielerbereiche
  const [playerAreas] = useState<[PlayerArea, PlayerArea]>(generateInitialPlayerAreas());
  
  // Debug-Info-Objekt - WICHTIG: Nicht als Ref verwenden, sondern als normalen State
  const [debugInfo, setDebugInfo] = useState({
    player1InitialEmpty: 0,
    player2InitialEmpty: 0,
    player1Solved: 0,
    player2Solved: 0,
    areasInitialized: true
  });

  // Check if a cell belongs to a player
  const getCellOwner = useCallback(
    (row: number, col: number): 0 | 1 | 2 => {
      if (row === 4 && col === 4) return 0; // Neutral middle cell

      const [player1Area, player2Area] = playerAreas;

      // Check player 1 area
      if (
        player1Area.cells.some((cell) => cell.row === row && cell.col === col)
      ) {
        return 1;
      }

      // Check player 2 area
      if (
        player2Area.cells.some((cell) => cell.row === row && cell.col === col)
      ) {
        return 2;
      }

      return 0; // Should never get here
    },
    [playerAreas]
  );

  // ÜBERARBEITETE FUNKTION: Zähle die anfänglichen leeren Zellen für jeden Spieler
  const countInitialEmptyCells = useCallback(
    (newBoard: SudokuBoardType) => {
      if (!newBoard || newBoard.length === 0) {
        console.error("Board not initialized!");
        return;
      }
      
      if (playerAreas[0].cells.length === 0 || playerAreas[1].cells.length === 0) {
        console.error("Player areas not initialized properly!");
        return;
      }
      
      const [player1Area, player2Area] = playerAreas;
      
      // Zähle leere Zellen für Spieler 1
      let emptyCountP1 = 0;
      for (const cell of player1Area.cells) {
        if (!newBoard[cell.row][cell.col].isInitial) {
          emptyCountP1++;
        }
      }
      
      // Zähle leere Zellen für Spieler 2
      let emptyCountP2 = 0;
      for (const cell of player2Area.cells) {
        if (!newBoard[cell.row][cell.col].isInitial) {
          emptyCountP2++;
        }
      }
      
      // Debug-Logging
      console.log(`Initial empty cells - Player 1: ${emptyCountP1}, Player 2: ${emptyCountP2}`);
      
      // Setze die States
      setPlayer1InitialEmptyCells(emptyCountP1);
      setPlayer2InitialEmptyCells(emptyCountP2);
      
      // Setze die gelösten Zellen zurück
      setPlayer1SolvedCells(0);
      setPlayer2SolvedCells(0);
      
      // Aktualisiere Debug-Info
      setDebugInfo(prev => ({
        ...prev,
        player1InitialEmpty: emptyCountP1,
        player2InitialEmpty: emptyCountP2,
        player1Solved: 0,
        player2Solved: 0
      }));
    },
    [playerAreas]
  );

  // VERBESSERTE FUNKTION: Aktualisiere Fortschritts-Tracking wenn ein Spieler eine Zelle löst
  const updatePlayerProgress = useCallback(
    (player: 1 | 2) => {
      if (player === 1) {
        setPlayer1SolvedCells(prevSolved => {
          const newValue = prevSolved + 1;
          // Debug-Logging
          console.log(`Player 1 solved cells: ${prevSolved} -> ${newValue} (out of ${player1InitialEmptyCells})`);
          
          // Update Debug-Info
          setDebugInfo(prev => ({
            ...prev,
            player1Solved: newValue
          }));
          
          return newValue;
        });
      } else {
        setPlayer2SolvedCells(prevSolved => {
          const newValue = prevSolved + 1;
          // Debug-Logging
          console.log(`Player 2 solved cells: ${prevSolved} -> ${newValue} (out of ${player2InitialEmptyCells})`);
          
          // Update Debug-Info
          setDebugInfo(prev => ({
            ...prev,
            player2Solved: newValue
          }));
          
          return newValue;
        });
      }
    },
    [player1InitialEmptyCells, player2InitialEmptyCells]
  );

  // Calculate player areas - wird nur als Utility-Funktion verwendet
  const calculatePlayerAreas = useCallback((): [PlayerArea, PlayerArea] => {
    return playerAreas;
  }, [playerAreas]);

  // Check for game completion when board changes
  useEffect(() => {
    if (board.length > 0) {
      checkPlayerCompletion();
    }
  }, [board]);
  
  // Debug: Zeige aktuelle Fortschrittswerte in der Konsole
  useEffect(() => {
    if (isGameRunning) {
      console.log(`
        Fortschritt Status:
        Spieler 1: ${player1SolvedCells}/${player1InitialEmptyCells} (${Math.round((player1SolvedCells / player1InitialEmptyCells) * 100)}%)
        Spieler 2: ${player2SolvedCells}/${player2InitialEmptyCells} (${Math.round((player2SolvedCells / player2InitialEmptyCells) * 100)}%)
        Areas Initialized: ${playerAreas[0].cells.length > 0 && playerAreas[1].cells.length > 0}
      `);
    }
  }, [player1SolvedCells, player2SolvedCells, isGameRunning, player1InitialEmptyCells, player2InitialEmptyCells]);

  // NEUE FUNKTION: Entfernt Notizen in allen relevanten Zellen
  const removeNotesFromRelatedCells = useCallback(
    (
      board: SudokuBoardType, 
      row: number, 
      col: number, 
      value: number
    ): SudokuBoardType => {
      // Board klonen für Immutability
      const newBoard = cloneBoard(board);
      
      // Alle verwandten Zellen ermitteln (Zeile, Spalte, Block)
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
    },
    []
  );

  // Handle player lost due to too many errors
  const handlePlayerLost = useCallback((player: 1 | 2) => {
    // End the game
    setIsGameRunning(false);
    setIsGameComplete(true);
    
    // Give error feedback
    triggerHaptic("error");
    
    // Declare the other player as winner
    const winner = player === 1 ? 2 : 1;
    
    // Call the game completion callback if provided
    if (onGameComplete) {
      onGameComplete(winner, "errors");
    }
  }, [onGameComplete]);

  // Start a new game
  const startNewGame = useCallback(() => {
    setIsLoading(true);

    setTimeout(() => {
      try {
        console.log("Starting new game. Player areas initialized:", playerAreas[0].cells.length > 0);
        
        // Generate a new game
        const { board: newBoard, solution: newSolution } =
          generateGame(initialDifficulty);

        // Ensure middle cell is filled
        const middleValue = newSolution[4][4];
        newBoard[4][4] = {
          value: middleValue,
          isInitial: true,
          isValid: true,
          notes: [],
        };
        
        // Reset player states
        setPlayer1Cell(null);
        setPlayer2Cell(null);
        setPlayer1Complete(false);
        setPlayer2Complete(false);
        setPlayer1NoteMode(false);
        setPlayer2NoteMode(false);

        // Reset hint counters
        setPlayer1Hints(MAX_HINTS);
        setPlayer2Hints(MAX_HINTS);
        
        // Reset error counters
        setPlayer1Errors(0);
        setPlayer2Errors(0);
        
        // Reset game time
        setGameTime(0);
        
        // Reset game completion status
        setIsGameComplete(false);
        
        // Wichtig: ZUERST Zähle die anfänglichen leeren Zellen und setze die Fortschrittsvariablen zurück
        countInitialEmptyCells(newBoard);
        
        setBoard(newBoard);
        setSolution(newSolution);
        
        // Aktiviere das Spiel
        setIsGameRunning(true);
        setIsLoading(false);

        // Success feedback
        triggerHaptic("medium");
      } catch (error) {
        console.error("Error starting game:", error);
        setIsLoading(false);
      }
    }, 500);
  }, [initialDifficulty, countInitialEmptyCells, playerAreas]);

  // Handle cell selection
  const handleCellPress = useCallback(
    (player: 1 | 2, row: number, col: number) => {
      // Don't allow selecting initial cells
      if (board[row][col].isInitial) {
        triggerHaptic("error");
        return;
      }

      // Don't allow if player has completed their area
      if (
        (player === 1 && player1Complete) ||
        (player === 2 && player2Complete)
      ) {
        return;
      }

      // Don't allow if player has lost due to errors
      if ((player === 1 && player1Errors >= maxErrors) || 
          (player === 2 && player2Errors >= maxErrors)) {
        return;
      }

      triggerHaptic("light");

      // Update the selected cell for the appropriate player
      if (player === 1) {
        setPlayer1Cell({ row, col });
      } else {
        setPlayer2Cell({ row, col });
      }
    },
    [board, player1Complete, player2Complete, player1Errors, player2Errors, maxErrors]
  );

  // Handle number input
  const handleNumberPress = useCallback(
    (player: 1 | 2, number: number) => {
      // Get the selected cell for this player
      const selectedCell = player === 1 ? player1Cell : player2Cell;

      // If no cell is selected or player has completed their area, ignore
      if (
        !selectedCell ||
        (player === 1 && player1Complete) ||
        (player === 2 && player2Complete)
      ) {
        return;
      }

      // Don't allow if player has lost due to errors
      if ((player === 1 && player1Errors >= maxErrors) || 
          (player === 2 && player2Errors >= maxErrors)) {
        return;
      }

      const { row, col } = selectedCell;

      // Validate the cell belongs to this player
      const owner = getCellOwner(row, col);
      if (owner !== player && owner !== 0) {
        // Allow players to fill the middle cell
        return;
      }

      // If note mode is active, toggle the note
      if (
        (player === 1 && player1NoteMode) ||
        (player === 2 && player2NoteMode)
      ) {
        const updatedBoard = toggleCellNote(board, row, col, number);
        setBoard(updatedBoard);
        triggerHaptic("light");
        return;
      }

      // Check if this is a valid move according to Sudoku rules
      const isValidByRules = isValidPlacement(
        boardToNumberGrid(board),
        row,
        col,
        number
      );

      // Check if the value matches the solution
      const isCorrectSolution = solution[row][col] === number;
      
      // Prüfe, ob die Zelle bereits diesen Wert hat (um doppeltes Zählen zu verhindern)
      const isSameValue = board[row][col].value === number;

      // Create a copy of the board with new value
      let updatedBoard = [...board];
      updatedBoard[row][col] = {
        ...board[row][col],
        value: number,
        // Mark as invalid if either against rules or not matching solution
        isValid: isValidByRules && isCorrectSolution,
      };

      // NEUE LOGIK: Entferne Notizen in ALLEN relevanten Zellen, wenn die Antwort korrekt ist
      if (isCorrectSolution) {
        updatedBoard = removeNotesFromRelatedCells(
          updatedBoard,
          row,
          col,
          number
        );
      }

      setBoard(updatedBoard);

      // Handle result of the move
      if (!isValidByRules || !isCorrectSolution) {
        // Invalid or incorrect move - provide haptic feedback
        triggerHaptic("error");
        
        // Increment error counter for this player
        if (player === 1) {
          const newErrorCount = player1Errors + 1;
          setPlayer1Errors(newErrorCount);
          
          if (newErrorCount >= maxErrors) {
            // Player 1 has lost due to too many errors
            handlePlayerLost(1);
          }
        } else {
          const newErrorCount = player2Errors + 1;
          setPlayer2Errors(newErrorCount);
          
          if (newErrorCount >= maxErrors) {
            // Player 2 has lost due to too many errors
            handlePlayerLost(2);
          }
        }
        
        // Automatically clear the wrong entry after a short delay
        setTimeout(() => {
          const clearedBoard = [...board];
          clearedBoard[row][col] = {
            ...board[row][col],
            value: 0, // Clear the value
            isValid: true, // Reset valid state
          };
          setBoard(clearedBoard);
        }, 800); // Show error for 800ms
      } else {
        // Valid move and correct solution - good feedback
        triggerHaptic("medium");
        
        // WICHTIG: Aktualisiere den Fortschritt nur, wenn
        // 1. Der Zug korrekt ist
        // 2. Es nicht derselbe Wert ist (verhindert doppeltes Zählen)
        if (!isSameValue) {
          // Aktualisiere den Fortschritt des Spielers
          updatePlayerProgress(player);
        }

        // Clear the selection for this player
        if (player === 1) {
          setPlayer1Cell(null);
        } else {
          setPlayer2Cell(null);
        }
      }
    },
    [
      board, 
      player1Cell, 
      player2Cell, 
      player1Complete, 
      player2Complete, 
      player1NoteMode, 
      player2NoteMode, 
      solution, 
      getCellOwner, 
      player1Errors, 
      player2Errors, 
      maxErrors, 
      handlePlayerLost, 
      removeNotesFromRelatedCells,
      updatePlayerProgress
    ]
  );

  // Handle clear button
  const handleClear = useCallback(
    (player: 1 | 2) => {
      // Get the selected cell for this player
      const selectedCell = player === 1 ? player1Cell : player2Cell;

      // If no cell is selected or player has completed their area, ignore
      if (
        !selectedCell ||
        (player === 1 && player1Complete) ||
        (player === 2 && player2Complete)
      ) {
        return;
      }

      // Don't allow if player has lost due to errors
      if ((player === 1 && player1Errors >= maxErrors) || 
          (player === 2 && player2Errors >= maxErrors)) {
        return;
      }

      const { row, col } = selectedCell;

      // Validate the cell belongs to this player or is the neutral cell
      const owner = getCellOwner(row, col);
      if (owner !== player && owner !== 0) {
        return;
      }

      // Clear the cell
      const updatedBoard = clearCellValue(board, row, col);
      setBoard(updatedBoard);
      triggerHaptic("light");
    },
    [board, player1Cell, player2Cell, player1Complete, player2Complete, 
     player1Errors, player2Errors, maxErrors, getCellOwner]
  );

  // Handle note toggle
  const handleNoteToggle = useCallback(
    (player: 1 | 2) => {
      if (
        (player === 1 && player1Complete) ||
        (player === 2 && player2Complete)
      ) {
        return;
      }

      // Don't allow if player has lost due to errors
      if ((player === 1 && player1Errors >= maxErrors) || 
          (player === 2 && player2Errors >= maxErrors)) {
        return;
      }

      if (player === 1) {
        setPlayer1NoteMode(!player1NoteMode);
      } else {
        setPlayer2NoteMode(!player2NoteMode);
      }

      triggerHaptic("light");
    },
    [player1Complete, player2Complete, player1NoteMode, player2NoteMode, 
     player1Errors, player2Errors, maxErrors]
  );

  // Handle hint request
  const handleHint = useCallback(
    (player: 1 | 2) => {
      // Check if player has hints remaining
      const hintsRemaining = player === 1 ? player1Hints : player2Hints;

      if (hintsRemaining <= 0) {
        triggerHaptic("error");
        return;
      }

      // Don't allow if player has lost due to errors
      if ((player === 1 && player1Errors >= maxErrors) || 
          (player === 2 && player2Errors >= maxErrors)) {
        return;
      }

      // Get the selected cell for this player
      const selectedCell = player === 1 ? player1Cell : player2Cell;

      // If no cell is selected or player has completed their area, ignore
      if (
        !selectedCell ||
        (player === 1 && player1Complete) ||
        (player === 2 && player2Complete)
      ) {
        return;
      }

      const { row, col } = selectedCell;

      // Validate the cell belongs to this player or is the neutral cell
      const owner = getCellOwner(row, col);
      if (owner !== player && owner !== 0) {
        return;
      }
      
      // Prüfe, ob die Zelle bereits den richtigen Wert hat
      const correctValue = solution[row][col];
      const isSameValue = board[row][col].value === correctValue;

      // Decrement hint counter
      if (player === 1) {
        setPlayer1Hints(player1Hints - 1);
      } else {
        setPlayer2Hints(player2Hints - 1);
      }

      // Provide hint by filling with correct value
      let updatedBoard = [...board];
      updatedBoard[row][col] = {
        ...board[row][col],
        value: correctValue,
        isValid: true,
      };

      // NEUE LOGIK: Entferne Notizen in ALLEN relevanten Zellen, da Hinweise immer korrekt sind
      updatedBoard = removeNotesFromRelatedCells(
        updatedBoard,
        row,
        col,
        correctValue
      );

      setBoard(updatedBoard);
      
      // WICHTIG: Zähle die gelöste Zelle nur, wenn sie nicht bereits korrekt war
      if (!isSameValue) {
        updatePlayerProgress(player);
      }

      // Clear the selection for this player
      if (player === 1) {
        setPlayer1Cell(null);
      } else {
        setPlayer2Cell(null);
      }

      triggerHaptic("success");
    },
    [
      board, 
      player1Cell, 
      player2Cell, 
      player1Complete, 
      player2Complete, 
      player1Hints, 
      player2Hints, 
      solution, 
      getCellOwner,
      player1Errors, 
      player2Errors, 
      maxErrors, 
      removeNotesFromRelatedCells,
      updatePlayerProgress
    ]
  );

  // Handle time update
  const handleTimeUpdate = useCallback((time: number) => {
    setGameTime(time);
  }, []);

  // Check if a player has completed their area
  const checkPlayerCompletion = useCallback(() => {
    if (board.length === 0 || playerAreas[0].cells.length === 0) return;

    const [player1Area, player2Area] = playerAreas;

    // Check player 1 area
    let p1Complete = true;
    for (const { row, col } of player1Area.cells) {
      if (board[row][col].value === 0 || !board[row][col].isValid) {
        p1Complete = false;
        break;
      }
    }

    // Check player 2 area
    let p2Complete = true;
    for (const { row, col } of player2Area.cells) {
      if (board[row][col].value === 0 || !board[row][col].isValid) {
        p2Complete = false;
        break;
      }
    }

    // Check middle cell - both players need to agree on its value
    const middleCell = board[4][4];
    if (
      !middleCell.isInitial &&
      (middleCell.value === 0 || !middleCell.isValid)
    ) {
      p1Complete = false;
      p2Complete = false;
    }

    // Update completion status
    if (p1Complete !== player1Complete) {
      setPlayer1Complete(p1Complete);
      if (p1Complete && !player1Complete) {
        handlePlayerCompleted(1);
      }
    }

    if (p2Complete !== player2Complete) {
      setPlayer2Complete(p2Complete);
      if (p2Complete && !player2Complete) {
        handlePlayerCompleted(2);
      }
    }

    // Check if both players are complete
    if (p1Complete && p2Complete && isGameRunning) {
      handleGameComplete();
    }
  }, [board, playerAreas, player1Complete, player2Complete, isGameRunning]);

  // Handle player completion
  const handlePlayerCompleted = useCallback((player: 1 | 2) => {
    triggerHaptic("success");

    // If the other player's area is not complete, this player wins
    if (player === 1 && !player2Complete) {
      if (onGameComplete) {
        onGameComplete(1, "completion");
      }
      setIsGameRunning(false);
      setIsGameComplete(true);
    } else if (player === 2 && !player1Complete) {
      if (onGameComplete) {
        onGameComplete(2, "completion");
      }
      setIsGameRunning(false);
      setIsGameComplete(true);
    }
    // Otherwise, wait for handleGameComplete to be called when both are complete
  }, [player1Complete, player2Complete, onGameComplete]);

  // Handle game completion
  const handleGameComplete = useCallback(() => {
    setIsGameRunning(false);
    setIsGameComplete(true);
    triggerHaptic("success");

    // Both players completed their areas - it's a tie
    if (onGameComplete) {
      onGameComplete(0, "completion");
    }
  }, [onGameComplete]);

  // Handle back button press
  const handleBackPress = useCallback(() => {
    if (isGameRunning && !isGameComplete && onQuit) {
      return true; // Indicate that we'll handle the back press
    }
    return false;
  }, [isGameRunning, isGameComplete, onQuit]);

  return [
    {
      board,
      solution,
      player1Cell,
      player2Cell,
      player1Complete,
      player2Complete,
      player1NoteMode,
      player2NoteMode,
      player1Hints,
      player2Hints,
      player1Errors,
      player2Errors,
      maxErrors,
      isGameRunning,
      isGameComplete,
      isLoading,
      gameTime,
      // Fortschrittsdaten
      player1InitialEmptyCells,
      player1SolvedCells,
      player2InitialEmptyCells,
      player2SolvedCells,
    },
    {
      startNewGame,
      handleCellPress,
      handleNumberPress,
      handleClear,
      handleNoteToggle,
      handleHint,
      handleTimeUpdate,
      calculatePlayerAreas,
      getCellOwner,
      handleBackPress,
    },
  ];
};