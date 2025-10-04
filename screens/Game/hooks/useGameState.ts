// screens/GameScreen/hooks/useGameState.ts
import { useState, useEffect, useCallback } from "react";
import {
  SudokuBoard as SudokuBoardType,
  CellPosition,
  Difficulty,
  generateGame,
  setCellValue,
  toggleCellNote,
  clearCellValue,
  isBoardComplete,
  solveCell,
  getHint,
  autoUpdateNotes,
  removeNoteFromRelatedCells,
  boardToNumberGrid,
} from "@/utils/sudoku";
import { updateStatsAfterGame, loadStats, GameStats, savePausedGame, loadPausedGame, clearPausedGame, PausedGameState } from "@/utils/storage";
import { triggerHaptic } from "@/utils/haptics";

// Constants for game
const INITIAL_HINTS = 3;
const MAX_ERRORS = 3;

// Define result types for better type checking
export interface HintResult {
  type: 'cell-hint' | 'no-errors' | 'initial-cell' | 'no-hints' | 'success';
  cell?: CellPosition;
}

export interface GameState {
  board: SudokuBoardType;
  solution: number[][];
  selectedCell: CellPosition | null;
  difficulty: Difficulty;
  isGameRunning: boolean;
  isGameComplete: boolean;
  isGameLost: boolean;
  isUserQuit: boolean; // New property to track user-initiated quits
  gameTime: number;
  noteModeActive: boolean;
  usedNumbers: number[];
  hintsRemaining: number;
  errorsRemaining: number;
  autoNotesUsed: boolean;
  isLoading: boolean;
  gameStats: GameStats | null;
}

interface GameStateActions {
  startNewGame: () => void;
  handleCellPress: (row: number, col: number) => void;
  handleNumberPress: (number: number, showMistakes?: boolean) => void;
  handleErasePress: () => void;
  toggleNoteMode: () => void;
  handleHintPress: () => HintResult | null;
  handleAutoNotesPress: () => boolean;
  handleTimeUpdate: (time: number) => void;
  handleGameComplete: () => Promise<void>;
  handleError: (showMistakes: boolean) => void;
  updateUsedNumbers: () => void;
  handleQuitGame: () => Promise<void>;
  pauseGame: () => Promise<void>;
  resumeGame: () => Promise<boolean>;
}

export const useGameState = (initialDifficulty?: Difficulty): [GameState, GameStateActions] => {
  // Game state
  const [board, setBoard] = useState<SudokuBoardType>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(
    initialDifficulty || "medium"
  );
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const [isUserQuit, setIsUserQuit] = useState(false); // New state to track user quits
  const [gameTime, setGameTime] = useState(0);
  const [noteModeActive, setNoteModeActive] = useState(false);
  const [usedNumbers, setUsedNumbers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hintsRemaining, setHintsRemaining] = useState(INITIAL_HINTS);
  const [errorsRemaining, setErrorsRemaining] = useState(MAX_ERRORS);
  const [autoNotesUsed, setAutoNotesUsed] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);

  // Load initial stats
  useEffect(() => {
    const loadGameStats = async () => {
      try {
        const stats = await loadStats();
        setGameStats(stats);
      } catch (error) {
        console.error("Error loading game stats:", error);
      }
    };
    loadGameStats();
  }, []);

  // Check if game is complete and update used numbers
  useEffect(() => {
    if (board.length > 0 && isBoardComplete(board)) {
      handleGameComplete();
    }
    
    if (board.length > 0) {
      updateUsedNumbers();
    }
  }, [board]);

  // Start a new game
  const startNewGame = useCallback(async () => {
    setIsLoading(true);

    // Clear any paused game when starting new game
    await clearPausedGame();

    // Generate a new game with current difficulty
    setTimeout(() => {
      const { board: newBoard, solution: newSolution } =
        generateGame(difficulty);

      setBoard(newBoard);
      setSolution(newSolution);
      setSelectedCell(null);
      setIsGameComplete(false);
      setIsGameLost(false);
      setIsUserQuit(false); // Reset user quit flag
      setGameTime(0);
      setIsGameRunning(true);
      setNoteModeActive(false);
      setIsLoading(false);
      setHintsRemaining(INITIAL_HINTS);
      setErrorsRemaining(MAX_ERRORS);
      setAutoNotesUsed(false);

      // Give haptic feedback
      triggerHaptic("success");
    }, 500);
  }, [difficulty]);

  // Select a cell
  const handleCellPress = (row: number, col: number) => {
    triggerHaptic("light");
    setSelectedCell({ row, col });
  };

  // Enter a number in a cell
  const handleNumberPress = (number: number, showMistakes: boolean = true) => {
    if (!selectedCell || isGameComplete) return;

    const { row, col } = selectedCell;

    // Check if cell is initial (preset numbers can't be changed)
    if (board[row][col].isInitial) {
      triggerHaptic("error");
      return;
    }

    // Either set a number or add a note
    if (noteModeActive) {
      // Add/remove note
      const updatedBoard = toggleCellNote(board, row, col, number);
      setBoard(updatedBoard);
      triggerHaptic("light");
    } else {
      // Set number
      const previousValue = board[row][col].value;
      const updatedBoard = setCellValue(board, row, col, number);

      // Check if the move violates Sudoku rules
      const isRuleViolation = 
        updatedBoard[row][col].value === number &&
        !updatedBoard[row][col].isValid;

      // Check if the entered value matches the solution
      const isSolutionViolation = number !== solution[row][col];

      // Combined error check: either rule violation or wrong solution
      const isErrorMove = isRuleViolation || isSolutionViolation;

      // If number was successfully set
      if (updatedBoard[row][col].value === number && previousValue !== number) {
        let boardWithUpdatedNotes = updatedBoard;
        
        // Nur Notizen entfernen, wenn die Zahl richtig ist ODER wenn "Fehler anzeigen" deaktiviert ist
        if (!isErrorMove || !showMistakes) {
          // Update notes in related cells
          boardWithUpdatedNotes = removeNoteFromRelatedCells(
            updatedBoard,
            row,
            col,
            number
          );
        }

        // If the number doesn't match the solution, mark it as invalid
        if (isSolutionViolation) {
          boardWithUpdatedNotes = [...boardWithUpdatedNotes];
          boardWithUpdatedNotes[row][col].isValid = false;
        }

        setBoard(boardWithUpdatedNotes);

        if (isErrorMove) {
          handleError(showMistakes);
        } else {
          triggerHaptic("medium");
        }
      } else if (!updatedBoard[row][col].isValid) {
        // Invalid move
        triggerHaptic("error");
      }
    }
  };

  // Erase a cell
  const handleErasePress = () => {
    if (!selectedCell || isGameComplete) return;

    const { row, col } = selectedCell;

    // Check if cell is initial
    if (board[row][col].isInitial) {
      triggerHaptic("error");
      return;
    }

    // Clear the cell
    const updatedBoard = clearCellValue(board, row, col);
    setBoard(updatedBoard);
    triggerHaptic("light");
  };

  // Toggle note mode
  const toggleNoteMode = () => {
    setNoteModeActive(!noteModeActive);
    triggerHaptic("light");
  };

  // Provide a hint with proper return type
  const handleHintPress = (): HintResult | null => {
    // Check if hints are available
    if (hintsRemaining <= 0) {
      triggerHaptic("error");
      return { type: "no-hints" };
    }

    if (!selectedCell) {
      // If no cell is selected, find a cell that needs a hint
      const hintCell = getHint(board, solution);
      if (hintCell) {
        // Select the cell
        setSelectedCell(hintCell);
        return { type: "cell-hint", cell: hintCell };
      } else {
        // No errors found
        return { type: "no-errors" };
      }
    }

    // If a cell is selected, fill it with the correct number
    const { row, col } = selectedCell;

    if (board[row][col].isInitial) {
      return { type: "initial-cell" };
    }

    // Reduce hints
    setHintsRemaining(prev => prev - 1);

    // Solve the cell
    const updatedBoard = solveCell(board, solution, row, col);
    setBoard(updatedBoard);
    triggerHaptic("success");
    
    return { type: "success" };
  };

  // Handle auto notes with proper return type
  const handleAutoNotesPress = (): boolean => {
    const updatedBoard = autoUpdateNotes(board);
    setBoard(updatedBoard);
    setAutoNotesUsed(true);
    triggerHaptic("medium");
    return true;
  };

  // Update timer
  const handleTimeUpdate = (time: number) => {
    setGameTime(time);
  };

  // Handle error
  const handleError = (showMistakes: boolean) => {
    // If showMistakes is false, don't count errors
    if (!showMistakes) return;
    
    const newErrorsRemaining = errorsRemaining - 1;
    setErrorsRemaining(newErrorsRemaining);
    triggerHaptic("error");
    
    if (newErrorsRemaining <= 0) {
      handleGameOver();
    }
  };

  // Game over handler
  const handleGameOver = async () => {
    if (isGameComplete) return;

    setIsGameComplete(true);
    setIsGameLost(true);
    setIsUserQuit(false); // Not a user quit, but a game over due to errors
    setIsGameRunning(false);

    // Update stats
    await updateStatsAfterGame(false, difficulty, gameTime, autoNotesUsed);

    // Reload stats
    const updatedStats = await loadStats();
    setGameStats(updatedStats);

    triggerHaptic("error");
  };

  // Game completion handler
  const handleGameComplete = async () => {
    if (isGameComplete) return;
    
    setIsGameComplete(true);
    setIsGameLost(false);
    setIsUserQuit(false);
    setIsGameRunning(false);

    // Update stats
    await updateStatsAfterGame(true, difficulty, gameTime, autoNotesUsed);

    // Reload stats
    const updatedStats = await loadStats();
    setGameStats(updatedStats);

    triggerHaptic("success");
  };

  // Handle game quit - counts as a loss for statistics but with user quit flag
  const handleQuitGame = async () => {
    if (isGameComplete) return;
    
    setIsUserQuit(true); // Mark that this was a user-initiated quit
    setIsGameComplete(true);
    setIsGameLost(true);
    setIsGameRunning(false);
    
    // Update stats as a loss
    await updateStatsAfterGame(false, difficulty, gameTime, autoNotesUsed);
    
    // Reload stats
    const updatedStats = await loadStats();
    setGameStats(updatedStats);
    
    triggerHaptic("error");
  };

  // Update used numbers for NumPad
  const updateUsedNumbers = () => {
    const counts: { [key: number]: number } = {};

    // Count each number in the board
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = board[row][col].value;
        if (value !== 0) {
          counts[value] = (counts[value] || 0) + 1;
        }
      }
    }

    // Numbers that appear 9 times are "used"
    const used: number[] = [];
    for (let num = 1; num <= 9; num++) {
      if (counts[num] === 9) {
        used.push(num);
      }
    }

    setUsedNumbers(used);
  };

  // Pause the game and save state
  const pauseGame = async () => {
    if (!isGameRunning || isGameComplete) return;

    const pausedState: PausedGameState = {
      board,
      solution,
      difficulty,
      gameTime,
      hintsRemaining,
      errorsRemaining,
      autoNotesUsed,
      pausedAt: new Date().toISOString(),
    };

    await savePausedGame(pausedState);
    triggerHaptic("light");
  };

  // Resume a paused game
  const resumeGame = async (): Promise<boolean> => {
    try {
      const pausedState = await loadPausedGame();

      if (!pausedState) {
        return false;
      }

      // Restore game state
      setBoard(pausedState.board);
      setSolution(pausedState.solution);
      setDifficulty(pausedState.difficulty);
      setGameTime(pausedState.gameTime);
      setHintsRemaining(pausedState.hintsRemaining);
      setErrorsRemaining(pausedState.errorsRemaining);
      setAutoNotesUsed(pausedState.autoNotesUsed);

      // Reset other states
      setSelectedCell(null);
      setIsGameComplete(false);
      setIsGameLost(false);
      setIsUserQuit(false);
      setIsGameRunning(true);
      setNoteModeActive(false);
      setIsLoading(false);

      triggerHaptic("success");
      return true;
    } catch (error) {
      console.error("Error resuming game:", error);
      return false;
    }
  };

  return [
    {
      board,
      solution,
      selectedCell,
      difficulty,
      isGameRunning,
      isGameComplete,
      isGameLost,
      isUserQuit, // Add to returned state
      gameTime,
      noteModeActive,
      usedNumbers,
      hintsRemaining,
      errorsRemaining,
      autoNotesUsed,
      isLoading,
      gameStats,
    },
    {
      startNewGame,
      handleCellPress,
      handleNumberPress,
      handleErasePress,
      toggleNoteMode,
      handleHintPress,
      handleAutoNotesPress,
      handleTimeUpdate,
      handleGameComplete,
      handleError,
      updateUsedNumbers,
      handleQuitGame,
      pauseGame,
      resumeGame,
    },
  ];
};