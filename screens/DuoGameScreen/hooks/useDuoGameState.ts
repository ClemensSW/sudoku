// screens/DuoGameScreen/hooks/useDuoGameState.ts
import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import {
  SudokuBoard as SudokuBoardType,
  Difficulty,
  generateGame,
  setCellValue,
  isValidPlacement,
  boardToNumberGrid,
  clearCellValue,
  toggleCellNote,
} from "@/utils/sudoku";
import { triggerHaptic } from "@/utils/haptics";

// Constants
const MAX_HINTS = 3;

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
  isGameRunning: boolean;
  isGameComplete: boolean;
  isLoading: boolean;
  gameTime: number;
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

export const useDuoGameState = (
  initialDifficulty: Difficulty = "medium",
  onQuit?: () => void
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
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gameTime, setGameTime] = useState(0);
  const [playerAreas, setPlayerAreas] = useState<[PlayerArea, PlayerArea]>([
    { player: 1, cells: [] },
    { player: 2, cells: [] },
  ]);

  // Calculate player areas - Player 2 gets top half, Player 1 gets bottom half
  const calculatePlayerAreas = useCallback((): [PlayerArea, PlayerArea] => {
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
        // Middle cell is shared/neutral
      }
    }

    return [
      { player: 1, cells: player1Cells },
      { player: 2, cells: player2Cells },
    ];
  }, []);

  // Initialize player areas
  useEffect(() => {
    const areas = calculatePlayerAreas();
    setPlayerAreas(areas);
  }, []);

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

  // Check for game completion when board changes
  useEffect(() => {
    if (board.length > 0) {
      checkPlayerCompletion();
    }
  }, [board]);

  // Start a new game
  const startNewGame = useCallback(() => {
    setIsLoading(true);

    setTimeout(() => {
      try {
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

        setBoard(newBoard);
        setSolution(newSolution);
        setIsGameRunning(true);

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
        
        // Reset game time
        setGameTime(0);
        
        // Reset game completion status
        setIsGameComplete(false);

        setIsLoading(false);

        // Success feedback
        triggerHaptic("medium");
      } catch (error) {
        console.error("Error starting game:", error);
        setIsLoading(false);
        Alert.alert("Error", "Failed to generate game");
      }
    }, 500);
  }, [initialDifficulty]);

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

      triggerHaptic("light");

      // Update the selected cell for the appropriate player
      if (player === 1) {
        setPlayer1Cell({ row, col });
      } else {
        setPlayer2Cell({ row, col });
      }
    },
    [board, player1Complete, player2Complete]
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

      // Update the board with the entered number
      const updatedBoard = [...board];
      updatedBoard[row][col] = {
        ...board[row][col],
        value: number,
        // Mark as invalid if either against rules or not matching solution
        isValid: isValidByRules && isCorrectSolution,
      };

      setBoard(updatedBoard);

      // Handle result of the move
      if (!isValidByRules || !isCorrectSolution) {
        // Invalid or incorrect move - provide haptic feedback
        triggerHaptic("error");
        
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

        // Clear the selection for this player
        if (player === 1) {
          setPlayer1Cell(null);
        } else {
          setPlayer2Cell(null);
        }
      }
    },
    [board, player1Cell, player2Cell, player1Complete, player2Complete, player1NoteMode, player2NoteMode, solution, getCellOwner]
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
    [board, player1Cell, player2Cell, player1Complete, player2Complete, getCellOwner]
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

      if (player === 1) {
        setPlayer1NoteMode(!player1NoteMode);
      } else {
        setPlayer2NoteMode(!player2NoteMode);
      }

      triggerHaptic("light");
    },
    [player1Complete, player2Complete, player1NoteMode, player2NoteMode]
  );

  // Handle hint request
  const handleHint = useCallback(
    (player: 1 | 2) => {
      // Check if player has hints remaining
      const hintsRemaining = player === 1 ? player1Hints : player2Hints;

      if (hintsRemaining <= 0) {
        triggerHaptic("error");
        Alert.alert(
          "Keine Hinweise mehr",
          `Spieler ${player} hat keine Hinweise mehr übrig.`
        );
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

      // Decrement hint counter
      if (player === 1) {
        setPlayer1Hints(player1Hints - 1);
      } else {
        setPlayer2Hints(player2Hints - 1);
      }

      // Provide hint by filling with correct value
      const correctValue = solution[row][col];

      const updatedBoard = [...board];
      updatedBoard[row][col] = {
        ...board[row][col],
        value: correctValue,
        isValid: true,
      };

      setBoard(updatedBoard);

      // Clear the selection for this player
      if (player === 1) {
        setPlayer1Cell(null);
      } else {
        setPlayer2Cell(null);
      }

      triggerHaptic("success");
    },
    [board, player1Cell, player2Cell, player1Complete, player2Complete, player1Hints, player2Hints, solution, getCellOwner]
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

    Alert.alert(
      `Bereich ${player} fertig!`,
      `Bereich von Spieler ${player} wurde gelöst.`,
      [{ text: "OK" }]
    );
  }, []);

  // Handle game completion
  const handleGameComplete = useCallback(() => {
    setIsGameRunning(false);
    setIsGameComplete(true);
    triggerHaptic("success");

    setTimeout(() => {
      Alert.alert(
        "Spiel beendet!",
        "Beide Bereiche wurden erfolgreich gelöst. Gut gemacht!",
        [
          { text: "Neues Spiel", onPress: startNewGame },
          { text: "Zum Menü", onPress: onQuit },
        ]
      );
    }, 500);
  }, [startNewGame, onQuit]);

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
      isGameRunning,
      isGameComplete,
      isLoading,
      gameTime,
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