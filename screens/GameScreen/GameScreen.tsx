import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Alert,
  ScrollView,
  Text,
  useWindowDimensions,
  SafeAreaView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { useTheme } from "@/utils/theme/ThemeProvider";

// Components
import Header from "@/components/Header/Header";
import SudokuBoard from "@/components/SudokuBoard/SudokuBoard";
import NumberPad from "@/components/NumberPad/NumberPad";
import Timer from "@/components/Timer/Timer";

// Game logic
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
} from "@/utils/sudoku";

import styles from "./GameScreen.styles";

interface GameScreenProps {
  initialDifficulty?: Difficulty;
  navigation?: any;
}

// Konstante für die maximale Anzahl an Hinweisen pro Spiel
const INITIAL_HINTS = 3;

const GameScreen: React.FC<GameScreenProps> = ({ initialDifficulty }) => {
  const theme = useTheme();
  const colors = theme.colors;
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Game state
  const [board, setBoard] = useState<SudokuBoardType>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(
    initialDifficulty || "medium"
  );
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [noteModeActive, setNoteModeActive] = useState(false);
  const [usedNumbers, setUsedNumbers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // NEU: State für verbleibende Hinweise
  const [hintsRemaining, setHintsRemaining] = useState(INITIAL_HINTS);

  // Animation values
  const headerOpacity = useSharedValue(1); // Start with header visible
  const controlsOpacity = useSharedValue(0);

  // Initialize game
  useEffect(() => {
    // Start with a slight delay to allow the screen transition
    setTimeout(() => {
      startNewGame();
    }, 300);
  }, []);

  // Check if game is complete
  useEffect(() => {
    if (board.length > 0 && isBoardComplete(board)) {
      handleGameComplete();
    }
  }, [board]);

  // Update used numbers for NumPad (benötigt für disabled numbers im NumPad)
  useEffect(() => {
    if (board.length > 0) {
      updateUsedNumbers();
    }
  }, [board]);

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
    };
  });

  const controlsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: controlsOpacity.value,
    };
  });

  // Start a new game
  const startNewGame = useCallback(() => {
    setIsLoading(true);

    // Generate a new game with current difficulty
    setTimeout(() => {
      const { board: newBoard, solution: newSolution } =
        generateGame(difficulty);

      setBoard(newBoard);
      setSolution(newSolution);
      setSelectedCell(null);
      setIsGameComplete(false);
      setGameTime(0);
      setIsGameRunning(true);
      setNoteModeActive(false);
      setIsLoading(false);
      // NEU: Setze Hinweise zurück
      setHintsRemaining(INITIAL_HINTS);

      // No need to animate opacity if starting at 1
      headerOpacity.value = 1;

      controlsOpacity.value = withTiming(1, {
        duration: 600,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });

      // Give haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 500);
  }, [difficulty]);

  // Select a cell
  const handleCellPress = (row: number, col: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCell({ row, col });
  };

  // Enter a number in a cell
  const handleNumberPress = (number: number) => {
    if (!selectedCell || isGameComplete) return;

    const { row, col } = selectedCell;

    // Check if cell is initial (preset numbers can't be changed)
    if (board[row][col].isInitial) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    // Either set a number or add a note
    if (noteModeActive) {
      // Add/remove note
      const updatedBoard = toggleCellNote(board, row, col, number);
      setBoard(updatedBoard);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      // Set number
      const previousValue = board[row][col].value;
      const updatedBoard = setCellValue(board, row, col, number);

      // If number was successfully set, remove it as a note in related cells
      if (updatedBoard[row][col].value === number && previousValue !== number) {
        const boardWithUpdatedNotes = removeNoteFromRelatedCells(
          updatedBoard,
          row,
          col,
          number
        );
        setBoard(boardWithUpdatedNotes);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (!updatedBoard[row][col].isValid) {
        // Invalid move
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  // Erase a cell
  const handleErasePress = () => {
    if (!selectedCell || isGameComplete) return;

    const { row, col } = selectedCell;

    // Check if cell is initial
    if (board[row][col].isInitial) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    // Clear the cell
    const updatedBoard = clearCellValue(board, row, col);
    setBoard(updatedBoard);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Toggle note mode
  const toggleNoteMode = () => {
    setNoteModeActive(!noteModeActive);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Provide a hint - NEU: Mit Begrenzung der Hinweise
  const handleHintPress = () => {
    // Prüfen, ob noch Hinweise verfügbar sind
    if (hintsRemaining <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Keine Hinweise mehr",
        "Du hast deine 3 Hinweise bereits aufgebraucht.",
        [{ text: "OK" }]
      );
      return;
    }

    if (!selectedCell || isGameComplete) {
      // If no cell is selected, find a cell that needs a hint
      const hintCell = getHint(board, solution);

      if (hintCell) {
        // Select the cell
        setSelectedCell(hintCell);

        // Show a message
        Alert.alert(
          "Hinweis",
          "Diese Zelle solltest du als nächstes ausfüllen. Drücke erneut auf den Hinweis-Button, um die richtige Zahl zu sehen.",
          [{ text: "OK" }]
        );
      } else {
        // No errors found
        Alert.alert(
          "Keine Fehler gefunden",
          "Dein Sudoku sieht gut aus! Fahre so fort.",
          [{ text: "OK" }]
        );
      }

      return;
    }

    // If a cell is selected, fill it with the correct number
    const { row, col } = selectedCell;

    if (board[row][col].isInitial) {
      Alert.alert("Hinweis", "Diese Zelle ist bereits korrekt ausgefüllt.", [
        { text: "OK" },
      ]);
      return;
    }

    // Reduziere die Anzahl der verbleibenden Hinweise
    setHintsRemaining((prev) => prev - 1);

    // Solve the cell
    const updatedBoard = solveCell(board, solution, row, col);
    setBoard(updatedBoard);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // Auto-update all notes
  const handleAutoNotesPress = () => {
    const updatedBoard = autoUpdateNotes(board);
    setBoard(updatedBoard);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // Game completion handler
  const handleGameComplete = () => {
    if (isGameComplete) return;

    setIsGameComplete(true);
    setIsGameRunning(false);

    // Give feedback to player
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Show success message
    setTimeout(() => {
      Alert.alert(
        "Glückwunsch!",
        `Du hast das Sudoku in ${formatTime(gameTime)} gelöst!`,
        [
          {
            text: "Neues Spiel",
            onPress: () => {
              // Navigiere zurück zur Startseite
              router.navigate("../");
            },
          },
        ]
      );
    }, 500);
  };

  // Update timer
  const handleTimeUpdate = (time: number) => {
    setGameTime(time);
  };

  // Update used numbers for the NumPad (benötigt für disabled numbers im NumPad)
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

  // Format time (MM:SS)
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle back navigation
  const handleBackPress = () => {
    if (isGameRunning && !isGameComplete) {
      Alert.alert(
        "Zurück zum Hauptmenü?",
        "Dein aktueller Spielfortschritt geht verloren.",
        [
          {
            text: "Abbrechen",
            style: "cancel",
          },
          {
            text: "Zum Menü",
            onPress: () => {
              // Navigiere zwei Ebenen zurück
              router.navigate("../");
            },
          },
        ]
      );
    } else {
      // Navigiere zwei Ebenen zurück
      router.navigate("../");
    }
  };

  // If board is not yet loaded
  if (board.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["top"]}
      >
        <StatusBar style={theme.isDark ? "light" : "dark"} hidden={true} />
        <View style={styles.loadingContainer}>
          <Animated.View
            entering={FadeIn.duration(500)}
            style={{ alignItems: "center" }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: colors.textPrimary,
                marginBottom: 16,
              }}
            >
              Sudoku vorbereiten...
            </Text>
            <Animated.View entering={FadeIn.delay(300).duration(500)}>
              <Feather name="loader" size={32} color={colors.primary} />
            </Animated.View>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} hidden={true} />

      {/* Background decoration */}
      <Animated.View
        style={[
          styles.topDecoration,
          { backgroundColor: colors.primary, opacity: 0.04 },
        ]}
        entering={FadeIn.duration(800)}
      />

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <Animated.View style={headerAnimatedStyle}>
          <Header
            title="Sudoku"
            onBackPress={handleBackPress}
            rightAction={{
              icon: "settings",
              onPress: () => {
                // Erweitertes Einstellungsmenü
                Alert.alert("Optionen", "Was möchtest du tun?", [
                  {
                    text: "Neues Spiel",
                    onPress: () => {
                      if (isGameRunning && !isGameComplete) {
                        Alert.alert(
                          "Neues Spiel starten?",
                          "Das aktuelle Spiel wird beendet.",
                          [
                            { text: "Abbrechen", style: "cancel" },
                            {
                              text: "Bestätigen",
                              onPress: () => router.navigate("../"),
                            },
                          ]
                        );
                      } else {
                        router.navigate("../");
                      }
                    },
                  },
                  {
                    text: "Automatische Notizen",
                    onPress: handleAutoNotesPress,
                  },
                  {
                    text: "Abbrechen",
                    style: "cancel",
                  },
                ]);
              },
            }}
          />
        </Animated.View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 20) },
          ]}
        >
          <View style={styles.gameContainer}>
            {/* Timer */}
            <Animated.View
              style={styles.timerContainer}
              entering={FadeInDown.delay(400).duration(500)}
            >
              <Timer
                isRunning={isGameRunning && !isGameComplete}
                initialTime={gameTime}
                onTimeUpdate={handleTimeUpdate}
              />
            </Animated.View>

            <View style={styles.boardContainer}>
              <SudokuBoard
                board={board}
                selectedCell={selectedCell}
                onCellPress={handleCellPress}
                isLoading={isLoading}
              />
            </View>

            <Animated.View
              style={[styles.controlsContainer, controlsAnimatedStyle]}
            >
              <Animated.View entering={FadeInUp.delay(900).duration(500)}>
                <NumberPad
                  onNumberPress={handleNumberPress}
                  onErasePress={handleErasePress}
                  onNoteToggle={toggleNoteMode}
                  onHintPress={handleHintPress}
                  noteModeActive={noteModeActive}
                  disabledNumbers={usedNumbers}
                  showHint={true}
                  hintsRemaining={hintsRemaining}
                />
              </Animated.View>

              {/* Untere Buttons wurden entfernt, da diese Funktionen
                  über die Einstellungen verfügbar sind */}
            </Animated.View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default GameScreen;
