import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Alert,
  ScrollView,
  Text,
  useWindowDimensions,
  SafeAreaView,
  StyleSheet,
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
import GameStatusBar from "@/components/GameStatusBar/GameStatusBar";
import SettingsScreen from "@/screens/SettingsScreen/SettingsScreen";

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

// Storage
import { updateStatsAfterGame, loadSettings } from "@/utils/storage";

import styles from "./GameScreen.styles";

interface GameScreenProps {
  initialDifficulty?: Difficulty;
  navigation?: any;
}

// Konstanten für das Spiel
const INITIAL_HINTS = 3;
const MAX_ERRORS = 3;

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
  // State für verbleibende Hinweise
  const [hintsRemaining, setHintsRemaining] = useState(INITIAL_HINTS);
  // State für Settings-Modal
  const [showSettings, setShowSettings] = useState(false);
  // State für Spieleinstellungen
  const [highlightRelatedCells, setHighlightRelatedCells] = useState(true);
  const [showMistakes, setShowMistakes] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  // NEU: State für Fehler-Tracking
  const [errorsRemaining, setErrorsRemaining] = useState(MAX_ERRORS);
  // NEU: State für Auto-Notizen-Tracking
  const [autoNotesUsed, setAutoNotesUsed] = useState(false);

  // Animation values
  const headerOpacity = useSharedValue(1); // Start with header visible
  const controlsOpacity = useSharedValue(0);

  // Lade Einstellungen
  useEffect(() => {
    const loadGameSettings = async () => {
      try {
        const settings = await loadSettings();
        if (settings) {
          setHighlightRelatedCells(settings.highlightRelatedCells);
          setShowMistakes(settings.showMistakes);
          setVibrationEnabled(settings.vibration);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    loadGameSettings();
  }, []);

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
      // Setze Hinweise zurück
      setHintsRemaining(INITIAL_HINTS);
      // NEU: Setze Fehler zurück
      setErrorsRemaining(MAX_ERRORS);
      // NEU: Zurücksetzen des autoNotesUsed Flags
      setAutoNotesUsed(false);

      // No need to animate opacity if starting at 1
      headerOpacity.value = 1;

      controlsOpacity.value = withTiming(1, {
        duration: 600,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });

      // Give haptic feedback
      if (vibrationEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 500);
  }, [difficulty, vibrationEnabled]);

  // Select a cell
  const handleCellPress = (row: number, col: number) => {
    if (vibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedCell({ row, col });
  };

  // NEU: Funktion zum Behandeln eines Fehlers
  const handleError = () => {
    // Reduziere die Anzahl der verbleibenden Fehler
    const newErrorsRemaining = errorsRemaining - 1;
    setErrorsRemaining(newErrorsRemaining);

    // Haptisches Feedback für Fehler
    if (vibrationEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    // Wenn keine Fehler mehr übrig sind, beende das Spiel
    if (newErrorsRemaining <= 0) {
      handleGameOver();
    }
  };

  // NEU: Game Over Handler
  const handleGameOver = async () => {
    if (isGameComplete) return;

    setIsGameComplete(true);
    setIsGameRunning(false);

    // Aktualisiere Statistiken (nicht gewonnen) nur wenn keine Auto-Notizen verwendet wurden
    await updateStatsAfterGame(false, difficulty, gameTime, autoNotesUsed);

    // Feedback für Game Over
    if (vibrationEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    // Zeige Game Over Nachricht
    setTimeout(() => {
      let message = "Du hast zu viele Fehler gemacht. Versuche es erneut!";

      // Wenn Auto-Notizen verwendet wurden, zeige einen Hinweis an
      if (autoNotesUsed) {
        message +=
          "\n\nDa automatische Notizen verwendet wurden, wird dieses Spiel nicht in den Statistiken gezählt.";
      }

      Alert.alert("Spiel beendet!", message, [
        {
          text: "Neues Spiel",
          onPress: () => {
            // Navigiere zurück zur Startseite
            router.navigate("../");
          },
        },
      ]);
    }, 500);
  };

  // Enter a number in a cell
  const handleNumberPress = (number: number) => {
    if (!selectedCell || isGameComplete) return;

    const { row, col } = selectedCell;

    // Check if cell is initial (preset numbers can't be changed)
    if (board[row][col].isInitial) {
      if (vibrationEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    // Either set a number or add a note
    if (noteModeActive) {
      // Add/remove note
      const updatedBoard = toggleCellNote(board, row, col, number);
      setBoard(updatedBoard);
      if (vibrationEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else {
      // Set number
      const previousValue = board[row][col].value;
      const updatedBoard = setCellValue(board, row, col, number);

      // NEU: Überprüfe, ob der Zug einen Fehler verursacht hat
      const isErrorMove =
        updatedBoard[row][col].value === number &&
        !updatedBoard[row][col].isValid;

      // If number was successfully set, remove it as a note in related cells
      if (updatedBoard[row][col].value === number && previousValue !== number) {
        const boardWithUpdatedNotes = removeNoteFromRelatedCells(
          updatedBoard,
          row,
          col,
          number
        );
        setBoard(boardWithUpdatedNotes);

        // NEU: Wenn die Zahl falsch ist und Fehleranzeige aktiviert ist
        if (isErrorMove && showMistakes) {
          handleError();
        } else if (vibrationEnabled) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      } else if (!updatedBoard[row][col].isValid && showMistakes) {
        // Invalid move
        if (vibrationEnabled) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      }
    }
  };

  // Erase a cell
  const handleErasePress = () => {
    if (!selectedCell || isGameComplete) return;

    const { row, col } = selectedCell;

    // Check if cell is initial
    if (board[row][col].isInitial) {
      if (vibrationEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    // Clear the cell
    const updatedBoard = clearCellValue(board, row, col);
    setBoard(updatedBoard);
    if (vibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Toggle note mode
  const toggleNoteMode = () => {
    setNoteModeActive(!noteModeActive);
    if (vibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Provide a hint - Mit Begrenzung der Hinweise
  const handleHintPress = () => {
    // Prüfen, ob noch Hinweise verfügbar sind
    if (hintsRemaining <= 0) {
      if (vibrationEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
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
    if (vibrationEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  // NEU: Aktualisierte Auto-Notizen Funktion
  const handleAutoNotesPress = () => {
    const updatedBoard = autoUpdateNotes(board);
    setBoard(updatedBoard);

    // Markieren, dass Auto-Notizen verwendet wurden
    setAutoNotesUsed(true);

    if (vibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Nur eine Benachrichtigung anzeigen
    Alert.alert(
      "Automatische Notizen",
      "Alle möglichen Notizen wurden in die leeren Zellen eingetragen.\nDieses Spiel wird nicht in den Statistiken gezählt.",
      [{ text: "OK" }]
    );
  };

  // NEU: Aktualisierte Game Completion Handler
  const handleGameComplete = async () => {
    if (isGameComplete) return;

    setIsGameComplete(true);
    setIsGameRunning(false);

    // Aktualisiere Statistiken mit dem autoNotesUsed Flag
    await updateStatsAfterGame(true, difficulty, gameTime, autoNotesUsed);

    // Give feedback to player
    if (vibrationEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Show success message
    setTimeout(() => {
      let message = `Du hast das Sudoku in ${formatTime(gameTime)} gelöst!`;

      // Wenn Auto-Notizen verwendet wurden, zeige einen Hinweis an
      if (autoNotesUsed) {
        message +=
          "\n\nDa automatische Notizen verwendet wurden, wird dieses Spiel nicht in den Statistiken gezählt.";
      }

      Alert.alert("Glückwunsch!", message, [
        {
          text: "Neues Spiel",
          onPress: () => {
            // Navigiere zurück zur Startseite
            router.navigate("../");
          },
        },
      ]);
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

  // Handle Settings Button Press
  const handleSettingsPress = () => {
    setShowSettings(true);
  };

  // Handle Settings Close
  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  // Handle Game Quit from Settings
  const handleQuitFromSettings = () => {
    setShowSettings(false);
    router.navigate("../");
  };

  // NEU: Aktualisierte Auto-Notizen-Funktion von Settings
  const handleAutoNotesFromSettings = () => {
    if (board.length === 0) return;

    const updatedBoard = autoUpdateNotes(board);
    setBoard(updatedBoard);

    // Markieren, dass Auto-Notizen verwendet wurden
    setAutoNotesUsed(true);

    setShowSettings(false);

    if (vibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Nur eine Benachrichtigung anzeigen
    // Verwende setTimeout, um die Meldung erst nach dem Schließen der Einstellungen anzuzeigen
    setTimeout(() => {
      Alert.alert(
        "Notizen aktualisiert",
        "Alle möglichen Notizen wurden in die leeren Zellen eingetragen.\nDieses Spiel wird nicht in den Statistiken gezählt.",
        [{ text: "OK" }]
      );
    }, 300);
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
              onPress: handleSettingsPress,
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
            {/* NEU: GameStatusBar anstelle von Timer */}
            <GameStatusBar
              isRunning={isGameRunning && !isGameComplete}
              initialTime={gameTime}
              onTimeUpdate={handleTimeUpdate}
              errorsRemaining={errorsRemaining}
              maxErrors={MAX_ERRORS}
            />

            <View style={styles.boardContainer}>
              <SudokuBoard
                board={board}
                selectedCell={selectedCell}
                onCellPress={handleCellPress}
                isLoading={isLoading}
                highlightRelated={highlightRelatedCells}
                showErrors={showMistakes}
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
            </Animated.View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Settings */}
      {showSettings && (
        <View style={StyleSheet.absoluteFill}>
          <SettingsScreen
            onBackToGame={handleSettingsClose}
            onQuitGame={handleQuitFromSettings}
            onAutoNotes={handleAutoNotesFromSettings}
          />
        </View>
      )}
    </View>
  );
};

export default GameScreen;
