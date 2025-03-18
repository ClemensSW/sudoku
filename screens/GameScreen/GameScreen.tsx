import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  useWindowDimensions,
  StyleSheet,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { useAlert } from "@/components/CustomAlert/AlertProvider";
import {
  hintCellAlert,
  noErrorsAlert,
  initialCellAlert,
  noHintsAlert,
  autoNotesAlert,
  quitGameAlert,
  gameOverAlert, // Hinzugefügt: fehlender Import
  // gameCompletionAlert wurde entfernt, da wir jetzt die Modal-Komponente verwenden
} from "@/components/CustomAlert/AlertHelpers";

// Components
import Header from "@/components/Header/Header";
import SudokuBoard from "@/components/SudokuBoard/SudokuBoard";
import NumberPad from "@/components/NumberPad/NumberPad";
import GameStatusBar from "@/components/GameStatusBar/GameStatusBar";
import SettingsScreen from "@/screens/SettingsScreen/SettingsScreen";
import GameCompletionModal from "@/components/GameCompletionModal";

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
import {
  updateStatsAfterGame,
  loadSettings,
  loadStats,
  GameSettings,
  GameStats,
} from "@/utils/storage";

import { triggerHaptic, setVibrationEnabledCache } from "@/utils/haptics";

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
  const { showAlert } = useAlert();

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
  const [highlightSameValues, setHighlightSameValues] = useState(true); // Neue Einstellung
  const [showMistakes, setShowMistakes] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  // State für Fehler-Tracking
  const [errorsRemaining, setErrorsRemaining] = useState(MAX_ERRORS);
  // State für Auto-Notizen-Tracking
  const [autoNotesUsed, setAutoNotesUsed] = useState(false);
  // State für Game Completion Modal
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  // State für Game Stats
  const [gameStats, setGameStats] = useState<GameStats | null>(null);

  // Animation values
  const headerOpacity = useSharedValue(1); // Start with header visible
  const controlsOpacity = useSharedValue(0);

  // Hilfsfunktion für Haptisches Feedback
  const triggerHapticFeedback = useCallback(
    (type: "light" | "medium" | "heavy" | "success" | "error" | "warning") => {
      triggerHaptic(type);
    },
    []
  );

  // Callback-Funktion für Settings-Änderungen
  const handleSettingsChanged = (
    key: keyof GameSettings,
    value: boolean | string
  ) => {
    if (key === "highlightRelatedCells") {
      setHighlightRelatedCells(value as boolean);
    } else if (key === "highlightSameValues") {
      setHighlightSameValues(value as boolean);
    } else if (key === "showMistakes") {
      setShowMistakes(value as boolean);
    } else if (key === "vibration") {
      setVibrationEnabled(value as boolean);
      // Cache aktualisieren, damit die Änderung sofort wirksam wird
      setVibrationEnabledCache(value as boolean);
    }
  };

  // Lade Einstellungen und Statistiken
  useEffect(() => {
    const loadGameData = async () => {
      try {
        const settings = await loadSettings();
        if (settings) {
          setHighlightRelatedCells(settings.highlightRelatedCells);
          setHighlightSameValues(settings.highlightSameValues);
          setShowMistakes(settings.showMistakes);
          setVibrationEnabled(settings.vibration);
          // Cache für Vibration aktualisieren
          setVibrationEnabledCache(settings.vibration);
        }

        const stats = await loadStats();
        setGameStats(stats);
      } catch (error) {
        console.error("Error loading game data:", error);
      }
    };

    loadGameData();
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

  // Überwache Änderungen am Modal-Status
  useEffect(() => {
    console.log("showCompletionModal geändert:", showCompletionModal);
  }, [showCompletionModal]);

  // BackHandler für Android-Zurück-Taste
  useEffect(() => {
    const backAction = () => {
      // Wenn das Spiel läuft und nicht abgeschlossen ist, zeige den Bestätigungsdialog
      if (isGameRunning && !isGameComplete) {
        handleBackPress();
        return true; // true zurückgeben um den Standard-Back-Verhalten zu verhindern
      }
      return false; // false zurückgeben um den Standard-Back-Verhalten zu erlauben
    };

    // BackHandler-Listener hinzufügen
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Listener entfernen beim Aufräumen
    return () => backHandler.remove();
  }, [isGameRunning, isGameComplete]);

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
    console.log("Starte neues Spiel (startNewGame)");

    // Verstecke das Modal zuerst, wenn es angezeigt wird
    if (showCompletionModal) {
      console.log(
        "Modal wird geschlossen, bevor ein neues Spiel gestartet wird"
      );
      setShowCompletionModal(false);
    }

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
      // Setze Fehler zurück
      setErrorsRemaining(MAX_ERRORS);
      // Zurücksetzen des autoNotesUsed Flags
      setAutoNotesUsed(false);

      // No need to animate opacity if starting at 1
      headerOpacity.value = 1;

      controlsOpacity.value = withTiming(1, {
        duration: 600,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });

      // Give haptic feedback
      triggerHapticFeedback("success");
    }, 500);
  }, [difficulty, triggerHapticFeedback, showCompletionModal]);

  // Select a cell
  const handleCellPress = (row: number, col: number) => {
    triggerHapticFeedback("light");
    setSelectedCell({ row, col });
  };

  // Funktion zum Behandeln eines Fehlers
  const handleError = () => {
    // Reduziere die Anzahl der verbleibenden Fehler
    const newErrorsRemaining = errorsRemaining - 1;
    setErrorsRemaining(newErrorsRemaining);

    // Haptisches Feedback für Fehler
    triggerHapticFeedback("error");

    // Wenn keine Fehler mehr übrig sind, beende das Spiel
    if (newErrorsRemaining <= 0) {
      handleGameOver();
    }
  };

  // Game Over Handler
  const handleGameOver = async () => {
    if (isGameComplete) return;

    setIsGameComplete(true);
    setIsGameRunning(false);

    // Aktualisiere Statistiken (nicht gewonnen) nur wenn keine Auto-Notizen verwendet wurden
    await updateStatsAfterGame(false, difficulty, gameTime, autoNotesUsed);

    // Feedback für Game Over
    triggerHapticFeedback("error");

    // Reload stats for the GameCompletionModal
    const updatedStats = await loadStats();
    setGameStats(updatedStats);

    // Zeige Game Over Nachricht mit CustomAlert
    setTimeout(() => {
      showAlert(gameOverAlert(autoNotesUsed, () => router.navigate("../")));
    }, 500);
  };

  // Enter a number in a cell
  const handleNumberPress = (number: number) => {
    if (!selectedCell || isGameComplete) return;

    const { row, col } = selectedCell;

    // Check if cell is initial (preset numbers can't be changed)
    if (board[row][col].isInitial) {
      triggerHapticFeedback("error");
      return;
    }

    // Either set a number or add a note
    if (noteModeActive) {
      // Add/remove note
      const updatedBoard = toggleCellNote(board, row, col, number);
      setBoard(updatedBoard);
      triggerHapticFeedback("light");
    } else {
      // Set number
      const previousValue = board[row][col].value;
      const updatedBoard = setCellValue(board, row, col, number);

      // Überprüfe, ob der Zug einen Fehler verursacht hat (nach Sudoku-Regeln)
      const isRuleViolation = 
        updatedBoard[row][col].value === number &&
        !updatedBoard[row][col].isValid;

      // NEUE PRÜFUNG: Überprüfe, ob der eingegebene Wert mit der Lösung übereinstimmt
      const isSolutionViolation = 
        number !== solution[row][col];

      // Kombinierte Fehlerprüfung: entweder Regelverstoß oder falsche Lösung
      const isErrorMove = isRuleViolation || isSolutionViolation;

      // If number was successfully set, remove it as a note in related cells
      if (updatedBoard[row][col].value === number && previousValue !== number) {
        // Notizen in verwandten Zellen aktualisieren
        let boardWithUpdatedNotes = removeNoteFromRelatedCells(
          updatedBoard,
          row,
          col,
          number
        );

        // NEUE LOGIK: Wenn die Zahl nicht der Lösung entspricht, markiere sie als ungültig
        if (isSolutionViolation) {
          boardWithUpdatedNotes = [...boardWithUpdatedNotes];
          boardWithUpdatedNotes[row][col].isValid = false;
        }

        setBoard(boardWithUpdatedNotes);

        // Wenn die Zahl falsch ist und Fehleranzeige aktiviert ist
        if (isErrorMove && showMistakes) {
          handleError();
        } else {
          triggerHapticFeedback("medium");
        }
      } else if (!updatedBoard[row][col].isValid && showMistakes) {
        // Invalid move
        triggerHapticFeedback("error");
      }
    }
  };

  // Erase a cell
  const handleErasePress = () => {
    if (!selectedCell || isGameComplete) return;

    const { row, col } = selectedCell;

    // Check if cell is initial
    if (board[row][col].isInitial) {
      triggerHapticFeedback("error");
      return;
    }

    // Clear the cell
    const updatedBoard = clearCellValue(board, row, col);
    setBoard(updatedBoard);
    triggerHapticFeedback("light");
  };

  // Toggle note mode
  const toggleNoteMode = () => {
    setNoteModeActive(!noteModeActive);
    triggerHapticFeedback("light");
  };

  // Provide a hint - Mit Begrenzung der Hinweise
  const handleHintPress = () => {
    // Prüfen, ob noch Hinweise verfügbar sind
    if (hintsRemaining <= 0) {
      triggerHapticFeedback("error");
      showAlert(noHintsAlert());
      return;
    }

    if (!selectedCell || isGameComplete) {
      // If no cell is selected, find a cell that needs a hint
      const hintCell = getHint(board, solution);

      if (hintCell) {
        // Select the cell
        setSelectedCell(hintCell);

        // Show a message
        showAlert(hintCellAlert());
      } else {
        // No errors found
        showAlert(noErrorsAlert());
      }

      return;
    }

    // If a cell is selected, fill it with the correct number
    const { row, col } = selectedCell;

    if (board[row][col].isInitial) {
      showAlert(initialCellAlert());
      return;
    }

    // Reduziere die Anzahl der verbleibenden Hinweise
    setHintsRemaining((prev) => prev - 1);

    // Solve the cell
    const updatedBoard = solveCell(board, solution, row, col);
    setBoard(updatedBoard);
    triggerHapticFeedback("success");
  };

  // Aktualisierte Auto-Notizen Funktion
  const handleAutoNotesPress = () => {
    const updatedBoard = autoUpdateNotes(board);
    setBoard(updatedBoard);

    // Markieren, dass Auto-Notizen verwendet wurden
    setAutoNotesUsed(true);

    triggerHapticFeedback("medium");

    // Nur eine Benachrichtigung anzeigen
    showAlert(autoNotesAlert());
  };

  // Format time (MM:SS)
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Aktualisierte Game Completion Handler
  const handleGameComplete = async () => {
    if (isGameComplete) {
      console.log("Spiel ist bereits abgeschlossen");
      return;
    }

    console.log("Spiel abgeschlossen, zeige Erfolgsbildschirm");
    setIsGameComplete(true);
    setIsGameRunning(false);

    // Aktualisiere Statistiken mit dem autoNotesUsed Flag
    await updateStatsAfterGame(true, difficulty, gameTime, autoNotesUsed);

    // Give feedback to player
    triggerHapticFeedback("success");

    try {
      // Reload stats for the GameCompletionModal
      const updatedStats = await loadStats();
      setGameStats(updatedStats);
      console.log("Statistiken geladen:", JSON.stringify(updatedStats));

      // Show success message with new completion modal - längere Verzögerung
      setTimeout(() => {
        console.log("Zeige Erfolgsmodal nach Verzögerung");
        setShowCompletionModal(true);
      }, 800); // Längere Verzögerung für bessere Stabilität
    } catch (error) {
      console.error("Fehler beim Anzeigen des Erfolgsbildschirms:", error);
    }
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

  // Handle back navigation
  const handleBackPress = () => {
    if (isGameRunning && !isGameComplete) {
      // Show custom confirmation alert
      showAlert(
        quitGameAlert(
          () => router.navigate("../"), // onConfirm
          undefined // onCancel (default behavior)
        )
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

  // Aktualisierte Auto-Notizen-Funktion von Settings
  const handleAutoNotesFromSettings = () => {
    if (board.length === 0) return;

    const updatedBoard = autoUpdateNotes(board);
    setBoard(updatedBoard);

    // Markieren, dass Auto-Notizen verwendet wurden
    setAutoNotesUsed(true);

    setShowSettings(false);

    triggerHapticFeedback("medium");

    // Verzögert die Anzeige der Benachrichtigung, um das Schließen der Einstellungen abzuwarten
    setTimeout(() => {
      showAlert(autoNotesAlert());
    }, 300);
  };

  // Handlers for GameCompletionModal mit zusätzlicher Verzögerung
  const handleCompletionModalClose = () => {
    console.log("Modal wird geschlossen (handleCompletionModalClose)");

    // Erst nach kurzer Verzögerung schließen, um Animationen zu ermöglichen
    setTimeout(() => {
      setShowCompletionModal(false);
    }, 100);
  };

  const handleNavigateToHome = () => {
    console.log("Zurück zum Hauptmenü (handleNavigateToHome)");

    // Erst nach kurzer Verzögerung schließen, um Animationen zu ermöglichen
    setTimeout(() => {
      setShowCompletionModal(false);

      // Kurze Verzögerung vor der Navigation
      setTimeout(() => {
        router.navigate("../");
      }, 100);
    }, 100);
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
              Sudoku generieren...
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
            {/* GameStatusBar */}
            <GameStatusBar
              isRunning={isGameRunning && !isGameComplete}
              initialTime={gameTime}
              onTimeUpdate={handleTimeUpdate}
              errorsRemaining={errorsRemaining}
              maxErrors={MAX_ERRORS}
              showErrors={showMistakes}
            />

            <View style={styles.boardContainer}>
              <SudokuBoard
                board={board}
                selectedCell={selectedCell}
                onCellPress={handleCellPress}
                isLoading={isLoading}
                highlightRelated={highlightRelatedCells}
                highlightSameValues={highlightSameValues}
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

      {/* Game Completion Modal */}
      <GameCompletionModal
        visible={showCompletionModal}
        onClose={handleCompletionModalClose}
        onNewGame={startNewGame}
        onContinue={handleNavigateToHome}
        timeElapsed={gameTime}
        difficulty={difficulty}
        autoNotesUsed={autoNotesUsed}
        stats={gameStats}
      />

      {/* Settings */}
      {showSettings && (
        <View style={StyleSheet.absoluteFill}>
          <SettingsScreen
            onBackToGame={handleSettingsClose}
            onQuitGame={handleQuitFromSettings}
            onAutoNotes={handleAutoNotesFromSettings}
            onSettingsChanged={handleSettingsChanged}
            fromGame={true}
          />
        </View>
      )}
    </View>
  );
};

export default GameScreen;