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
import { updateStatsAfterGame, loadStats, GameStats, savePausedGame, loadPausedGame, clearPausedGame, PausedGameState, loadSettings, applyDifficultyBasedSettings, saveSettings } from "@/utils/storage";
import { triggerHaptic } from "@/utils/haptics";
import { updateDailyStreak, checkWeeklyShieldReset } from "@/utils/dailyStreak";
import { syncAfterGameCompletion } from "@/utils/cloudSync/syncService";

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

  // PERFORMANCE: Watch for game over condition
  useEffect(() => {
    if (errorsRemaining === 0 && !isGameComplete) {
      handleGameOver();
    }
  }, [errorsRemaining, isGameComplete, handleGameOver]);

  // Check if game is complete and update used numbers
  useEffect(() => {
    if (board.length > 0 && isBoardComplete(board)) {
      // Use async IIFE to properly handle async handleGameComplete
      (async () => {
        await handleGameComplete();
      })();
    }

    if (board.length > 0) {
      updateUsedNumbers();
    }
  }, [board, handleGameComplete, updateUsedNumbers]);

  // Start a new game
  const startNewGame = useCallback(async () => {
    setIsLoading(true);

    // Clear any paused game when starting new game
    await clearPausedGame();

    // Daily Streak System: Only check weekly reset on game start (not update streak)
    try {
      await checkWeeklyShieldReset(); // Check if Monday reset is due
    } catch (error) {
      console.error('[Game] Error checking weekly shield reset:', error);
    }

    // HINWEIS: Settings-Anpassung wurde nach Game.tsx verschoben
    // Settings werden jetzt SOFORT beim Mount angepasst, BEVOR useGameSettings das erste Mal lädt
    // Dadurch hat useGameSettings bereits die korrekten Settings beim Initial-Load

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

  // PERFORMANCE: Memoize handlers
  const handleCellPress = useCallback((row: number, col: number) => {
    triggerHaptic("light");
    setSelectedCell({ row, col });
  }, []);

  const handleError = useCallback((showMistakes: boolean) => {
    // If showMistakes is false, don't count errors
    if (!showMistakes) return;

    setErrorsRemaining(prev => {
      const newErrorsRemaining = prev - 1;
      triggerHaptic("error");

      if (newErrorsRemaining <= 0) {
        // Handle game over will be called via useEffect watching errorsRemaining
        return 0;
      }
      return newErrorsRemaining;
    });
  }, []);

  const handleNumberPress = useCallback((number: number, showMistakes: boolean = true) => {
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
  }, [selectedCell, isGameComplete, board, noteModeActive, solution, handleError]);

  const handleErasePress = useCallback(() => {
    if (!selectedCell || isGameComplete) return;

    const { row, col } = selectedCell;

    // Check if cell is initial
    if (board[row][col].isInitial) {
      triggerHaptic("error");
      return;
    }

    // Clear the cell value and notes
    let updatedBoard = clearCellValue(board, row, col);
    // Also clear notes
    updatedBoard[row][col].notes = [];
    setBoard(updatedBoard);
    triggerHaptic("light");
  }, [selectedCell, isGameComplete, board]);

  const toggleNoteMode = useCallback(() => {
    setNoteModeActive(prev => !prev);
    triggerHaptic("light");
  }, []);

  const handleHintPress = useCallback((): HintResult | null => {
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
  }, [hintsRemaining, selectedCell, board, solution]);

  const handleAutoNotesPress = useCallback((): boolean => {
    const updatedBoard = autoUpdateNotes(board);
    setBoard(updatedBoard);
    setAutoNotesUsed(true);
    triggerHaptic("medium");
    return true;
  }, [board]);

  const handleTimeUpdate = useCallback((time: number) => {
    setGameTime(time);
  }, []);

  const handleGameOver = useCallback(async () => {
    if (isGameComplete) return;

    setIsGameComplete(true);
    setIsGameLost(true);
    setIsUserQuit(false); // Not a user quit, but a game over due to errors
    setIsGameRunning(false);

    // Update stats
    await updateStatsAfterGame(false, difficulty, gameTime, autoNotesUsed);

    // Clear any paused game state when game is over
    await clearPausedGame();

    // Reload stats
    const updatedStats = await loadStats();
    setGameStats(updatedStats);

    triggerHaptic("error");
  }, [isGameComplete, difficulty, gameTime, autoNotesUsed]);

  const handleGameComplete = useCallback(async () => {
    if (isGameComplete) return;

    setIsGameComplete(true);
    setIsGameLost(false);
    setIsUserQuit(false);
    setIsGameRunning(false);

    // Update stats
    await updateStatsAfterGame(true, difficulty, gameTime, autoNotesUsed);

    // Daily Streak System: Update streak AFTER winning a game
    try {
      console.log('[Game] ========================================');
      console.log('[Game] === GAME COMPLETE - Updating Daily Streak ===');
      console.log('[Game] ========================================');
      await updateDailyStreak();       // Update daily streak (streak +1, shield usage, etc.)
      console.log('[Game] Daily Streak update completed!');
    } catch (error) {
      console.error('[Game] ❌ Error updating daily streak:', error);
    }

    // Clear any paused game state when game is completed
    await clearPausedGame();

    // Reload stats to show updated streak in GameCompletion
    const updatedStats = await loadStats();
    setGameStats(updatedStats);

    triggerHaptic("success");

    // Cloud Sync: Trigger sync after game completion (non-blocking)
    syncAfterGameCompletion().then(result => {
      if (result.success) {
        console.log('[Game] ✅ Auto-sync after game completion successful');
      } else {
        console.log('[Game] ⚠️ Auto-sync after game completion skipped/failed:', result.errors);
      }
    }).catch(error => {
      console.error('[Game] ❌ Auto-sync after game completion error:', error);
    });
  }, [isGameComplete, difficulty, gameTime, autoNotesUsed]);

  const handleQuitGame = useCallback(async () => {
    if (isGameComplete) return;

    setIsUserQuit(true); // Mark that this was a user-initiated quit
    setIsGameComplete(true);
    setIsGameLost(true);
    setIsGameRunning(false);

    // Update stats as a loss
    await updateStatsAfterGame(false, difficulty, gameTime, autoNotesUsed);

    // Clear any paused game state when user quits
    await clearPausedGame();

    // Reload stats
    const updatedStats = await loadStats();
    setGameStats(updatedStats);

    triggerHaptic("error");
  }, [isGameComplete, difficulty, gameTime, autoNotesUsed]);

  const updateUsedNumbers = useCallback(() => {
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
  }, [board]);

  const pauseGame = useCallback(async () => {
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
  }, [isGameRunning, isGameComplete, board, solution, difficulty, gameTime, hintsRemaining, errorsRemaining, autoNotesUsed]);

  const resumeGame = useCallback(async (): Promise<boolean> => {
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
  }, []);

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