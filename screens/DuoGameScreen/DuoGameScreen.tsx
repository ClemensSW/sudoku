// screens/DuoGameScreen/DuoGameScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import { View, BackHandler, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/utils/theme/ThemeProvider";
import { useAlert } from "@/components/CustomAlert/AlertProvider";
import { quitGameAlert } from "@/components/CustomAlert/AlertHelpers";

// Game logic
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

// Components
import Header from "@/components/Header/Header";
import DuoBoard from "../DuoScreen/components/DuoBoard";
import DuoControls from "../DuoScreen/components/DuoControls";

// Utilities
import { triggerHaptic } from "@/utils/haptics";
import styles from "./DuoGameScreen.styles";

// Define player areas
interface PlayerArea {
  player: 1 | 2;
  cells: { row: number; col: number }[];
}

interface DuoGameScreenProps {
  initialDifficulty?: Difficulty;
}

const DuoGameScreen: React.FC<DuoGameScreenProps> = ({
  initialDifficulty = "medium",
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();
  const params = useLocalSearchParams<{ difficulty?: string }>();

  // Get difficulty from route params if available
  const routeDifficulty = params.difficulty as Difficulty | undefined;
  const difficulty = routeDifficulty || initialDifficulty;

  // Constants
  const MAX_HINTS = 3;

  // Game state
  const [board, setBoard] = useState<SudokuBoardType>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Player states - now for simultaneous play
  const [player1Cell, setPlayer1Cell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [player2Cell, setPlayer2Cell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [player1Complete, setPlayer1Complete] = useState(false);
  const [player2Complete, setPlayer2Complete] = useState(false);
  const [player1NoteMode, setPlayer1NoteMode] = useState(false);
  const [player2NoteMode, setPlayer2NoteMode] = useState(false);

  // Add hint counters for both players
  const [player1Hints, setPlayer1Hints] = useState(MAX_HINTS);
  const [player2Hints, setPlayer2Hints] = useState(MAX_HINTS);

  // Calculate player areas - Player 2 gets top half, Player 1 gets bottom half
  const calculatePlayerAreas = useCallback((): [PlayerArea, PlayerArea] => {
    const player1Cells: { row: number; col: number }[] = [];
    const player2Cells: { row: number; col: number }[] = [];

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

  const [player1Area, player2Area] = calculatePlayerAreas();

  // Check if a cell belongs to a player
  const getCellOwner = useCallback(
    (row: number, col: number): 1 | 2 | 0 => {
      if (row === 4 && col === 4) return 0; // Neutral middle cell

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
    [player1Area, player2Area]
  );

  // Initialize game
  useEffect(() => {
    startNewGame();

    // Handle back button
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  // Check for game completion when board changes
  useEffect(() => {
    if (board.length > 0) {
      checkPlayerCompletion();
    }
  }, [board]);

  // Start a new game
  const startNewGame = () => {
    setIsLoading(true);

    setTimeout(() => {
      try {
        // Generate a new game
        const { board: newBoard, solution: newSolution } =
          generateGame(difficulty);

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

        setIsLoading(false);

        // Success feedback
        triggerHaptic("medium");
      } catch (error) {
        console.error("Error starting game:", error);
        setIsLoading(false);
        Alert.alert("Error", "Failed to generate game");
      }
    }, 500);
  };

  // Handle cell selection
  const handleCellPress = (player: 1 | 2, row: number, col: number) => {
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
  };

  // Handle number input
  const handleNumberPress = (player: 1 | 2, number: number) => {
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

    // NEUE PRÜFUNG: Prüfen, ob der Wert mit der Lösung übereinstimmt
    const isCorrectSolution = solution[row][col] === number;

    // Update the board
    const updatedBoard = [...board];
    updatedBoard[row][col] = {
      ...board[row][col],
      value: number,
      // Markiere als ungültig, wenn entweder gegen Regeln verstoßen wird
      // oder die Zahl nicht mit der Lösung übereinstimmt
      isValid: isValidByRules && isCorrectSolution,
    };

    setBoard(updatedBoard);

    // Handle result of the move
    if (!isValidByRules) {
      // Invalid move - provide feedback
      triggerHaptic("error");

      // Show feedback but don't reduce lives
      Alert.alert(
        "Ungültiger Zug",
        `Diese Zahl kann hier nicht platziert werden.`,
        [{ text: "OK" }]
      );
    } else if (!isCorrectSolution) {
      // NEUE LOGIK: Die Zahl ist nach Sudoku-Regeln gültig, aber nicht korrekt
      triggerHaptic("error");

      Alert.alert(
        "Falsche Zahl",
        `Diese Zahl ist leider nicht die Lösung für diese Zelle.`,
        [{ text: "OK" }]
      );
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
  };

  // Handle clear button
  const handleClear = (player: 1 | 2) => {
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
  };

  // Handle note toggle
  const handleNoteToggle = (player: 1 | 2) => {
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
  };

  // Handle hint request - with hint limits
  const handleHint = (player: 1 | 2) => {
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
  };

  // Check if a player has completed their area
  const checkPlayerCompletion = () => {
    if (board.length === 0) return;

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
  };

  // Handle player completion
  const handlePlayerCompleted = (player: 1 | 2) => {
    triggerHaptic("success");

    // Simple alert - removed player name mention
    Alert.alert(
      `Bereich ${player} fertig!`,
      `Bereich von Spieler ${player} wurde gelöst.`,
      [{ text: "OK" }]
    );
  };

  // Handle game completion
  const handleGameComplete = () => {
    setIsGameRunning(false);
    triggerHaptic("success");

    setTimeout(() => {
      Alert.alert(
        "Spiel beendet!",
        "Beide Bereiche wurden erfolgreich gelöst. Gut gemacht!",
        [
          { text: "Neues Spiel", onPress: startNewGame },
          { text: "Zum Menü", onPress: () => router.replace("/duo") },
        ]
      );
    }, 500);
  };

  // Handle back button press
  const handleBackPress = () => {
    if (isGameRunning) {
      showAlert(quitGameAlert(() => router.replace("/duo"), undefined));
      return true;
    }
    return false;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} hidden={true} />

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <Header title="Sudoku Duo" onBackPress={() => handleBackPress()} />

        <View style={styles.gameContainer}>
          {/* Player 2 Controls (Top) */}
          <DuoControls
            position="top"
            onNumberPress={handleNumberPress}
            onClear={handleClear}
            onNoteToggle={handleNoteToggle}
            onHint={handleHint}
            noteMode={player2NoteMode}
            disabled={player2Complete}
            hintsRemaining={player2Hints}
          />

          {/* Sudoku Board */}
          <DuoBoard
            board={board}
            player1Cell={player1Cell}
            player2Cell={player2Cell}
            onCellPress={handleCellPress}
            isLoading={isLoading}
          />

          {/* Player 1 Controls (Bottom) */}
          <DuoControls
            position="bottom"
            onNumberPress={handleNumberPress}
            onClear={handleClear}
            onNoteToggle={handleNoteToggle}
            onHint={handleHint}
            noteMode={player1NoteMode}
            disabled={player1Complete}
            hintsRemaining={player1Hints}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default DuoGameScreen;
