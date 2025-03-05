import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Alert,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/utils/theme/ThemeProvider";

// Komponenten
import Header from "@/components/Header/Header";
import SudokuBoard from "@/components/SudokuBoard/SudokuBoard";
import NumberPad from "@/components/NumberPad/NumberPad";
import DifficultySelector from "@/components/DifficultySelector/DifficultySelector";
import Timer from "@/components/Timer/Timer";
import Button from "@/components/Button/Button";

// Spiellogik
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
  navigation?: any; // Optional, falls wir Navigation verwenden
}

const GameScreen: React.FC<GameScreenProps> = ({
  initialDifficulty,
  navigation,
}) => {
  const theme = useTheme();
  const { height } = useWindowDimensions();

  // Spielzustand
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

  // Spiel initialisieren
  useEffect(() => {
    startNewGame();
  }, []);

  // Prüfen, ob das Spiel abgeschlossen ist
  useEffect(() => {
    if (board.length > 0 && isBoardComplete(board)) {
      handleGameComplete();
    }
  }, [board]);

  // Aktualisiere die verwendeten Zahlen für die Anzeige im NumPad
  useEffect(() => {
    if (board.length > 0) {
      updateUsedNumbers();
    }
  }, [board]);

  // Neues Spiel starten
  const startNewGame = useCallback(() => {
    // Generiere ein neues Spiel mit dem aktuellen Schwierigkeitsgrad
    const { board: newBoard, solution: newSolution } = generateGame(difficulty);

    setBoard(newBoard);
    setSolution(newSolution);
    setSelectedCell(null);
    setIsGameComplete(false);
    setGameTime(0);
    setIsGameRunning(true);
    setNoteModeActive(false);

    // Vibriere als Feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [difficulty]);

  // Schwierigkeitsgrad ändern
  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    if (difficulty !== newDifficulty) {
      // Frage, ob ein neues Spiel gestartet werden soll
      Alert.alert(
        "Schwierigkeitsgrad ändern",
        "Möchtest du ein neues Spiel mit dem gewählten Schwierigkeitsgrad starten?",
        [
          {
            text: "Abbrechen",
            style: "cancel",
          },
          {
            text: "Neues Spiel",
            onPress: () => {
              setDifficulty(newDifficulty);
              // Starte nach State-Update ein neues Spiel
              setTimeout(() => startNewGame(), 0);
            },
          },
        ]
      );
    }
  };

  // Zelle auswählen
  const handleCellPress = (row: number, col: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCell({ row, col });
  };

  // Nummer in Zelle eintragen
  const handleNumberPress = (number: number) => {
    if (!selectedCell || isGameComplete) return;

    const { row, col } = selectedCell;

    // Prüfe, ob die Zelle initial ist (vorgegebene Zahlen können nicht geändert werden)
    if (board[row][col].isInitial) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    // Entweder setzen wir eine Zahl oder fügen eine Notiz hinzu
    if (noteModeActive) {
      // Notiz hinzufügen/entfernen
      const updatedBoard = toggleCellNote(board, row, col, number);
      setBoard(updatedBoard);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      // Zahl setzen
      const previousValue = board[row][col].value;
      const updatedBoard = setCellValue(board, row, col, number);

      // Wenn die Zahl erfolgreich gesetzt wurde, entferne sie als Notiz in verwandten Zellen
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
        // Ungültiger Zug
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  // Zelle löschen
  const handleErasePress = () => {
    if (!selectedCell || isGameComplete) return;

    const { row, col } = selectedCell;

    // Prüfe, ob die Zelle initial ist
    if (board[row][col].isInitial) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    // Lösche die Zelle
    const updatedBoard = clearCellValue(board, row, col);
    setBoard(updatedBoard);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Notiziermodus umschalten
  const toggleNoteMode = () => {
    setNoteModeActive(!noteModeActive);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Hinweis geben
  const handleHintPress = () => {
    if (!selectedCell || isGameComplete) {
      // Wenn keine Zelle ausgewählt ist, suche nach einer Zelle, die einen Hinweis benötigt
      const hintCell = getHint(board, solution);

      if (hintCell) {
        // Wähle die Zelle aus
        setSelectedCell(hintCell);

        // Zeige eine Nachricht
        Alert.alert(
          "Hinweis",
          "Diese Zelle solltest du als nächstes ausfüllen. Drücke erneut auf den Hinweis-Button, um die richtige Zahl zu sehen.",
          [{ text: "OK" }]
        );
      } else {
        // Keine Fehlerhaften Zellen gefunden
        Alert.alert(
          "Keine Fehler gefunden",
          "Dein Sudoku sieht gut aus! Fahre so fort.",
          [{ text: "OK" }]
        );
      }

      return;
    }

    // Wenn eine Zelle ausgewählt ist, fülle sie mit der korrekten Zahl
    const { row, col } = selectedCell;

    if (board[row][col].isInitial) {
      Alert.alert("Hinweis", "Diese Zelle ist bereits korrekt ausgefüllt.", [
        { text: "OK" },
      ]);
      return;
    }

    // Löse die Zelle
    const updatedBoard = solveCell(board, solution, row, col);
    setBoard(updatedBoard);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // Alle Notizen automatisch aktualisieren
  const handleAutoNotesPress = () => {
    const updatedBoard = autoUpdateNotes(board);
    setBoard(updatedBoard);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // Spielabschluss
  const handleGameComplete = () => {
    if (isGameComplete) return;

    setIsGameComplete(true);
    setIsGameRunning(false);

    // Gib dem Spieler Feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Zeige eine Erfolgsmeldung
    setTimeout(() => {
      Alert.alert(
        "Glückwunsch!",
        `Du hast das Sudoku in ${formatTime(gameTime)} gelöst!`,
        [
          {
            text: "Neues Spiel",
            onPress: startNewGame,
          },
        ]
      );
    }, 500);
  };

  // Aktualisiere Timer
  const handleTimeUpdate = (time: number) => {
    setGameTime(time);
  };

  // Aktualisiere verwendete Zahlen
  const updateUsedNumbers = () => {
    const counts: { [key: number]: number } = {};

    // Zähle jede Zahl im Board
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = board[row][col].value;
        if (value !== 0) {
          counts[value] = (counts[value] || 0) + 1;
        }
      }
    }

    // Zahlen, die 9 mal vorkommen, werden als "verwendet" markiert
    const used: number[] = [];
    for (let num = 1; num <= 9; num++) {
      if (counts[num] === 9) {
        used.push(num);
      }
    }

    setUsedNumbers(used);
  };

  // Zeit formatieren (MM:SS)
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Falls das Board noch nicht geladen ist
  if (board.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <StatusBar style="auto" />
        <View style={styles.loadingContainer}>
          {/* Hier könnte ein Ladeindikator sein */}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar style="auto" />

      <Header
        title="Sudoku"
        subtitle={`Schwierigkeit: ${
          difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
        }`}
        rightAction={{
          icon: "settings",
          onPress: () => {
            // Hier könnte ein Einstellungsmenü geöffnet werden
            Alert.alert("Optionen", "Was möchtest du tun?", [
              {
                text: "Neues Spiel",
                onPress: startNewGame,
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.gameContainer}>
          <View style={styles.timerContainer}>
            <Timer
              isRunning={isGameRunning && !isGameComplete}
              initialTime={gameTime}
              onTimeUpdate={handleTimeUpdate}
            />
          </View>

          <View style={styles.boardContainer}>
            <SudokuBoard
              board={board}
              selectedCell={selectedCell}
              onCellPress={handleCellPress}
            />
          </View>

          <View style={styles.controlsContainer}>
            <DifficultySelector
              currentDifficulty={difficulty}
              onSelectDifficulty={handleDifficultyChange}
              disabled={isGameRunning && !isGameComplete}
            />

            <NumberPad
              onNumberPress={handleNumberPress}
              onErasePress={handleErasePress}
              onNoteToggle={toggleNoteMode}
              onHintPress={handleHintPress}
              noteModeActive={noteModeActive}
              disabledNumbers={usedNumbers}
              showHint={true}
            />

            <View style={styles.buttonContainer}>
              <Button
                title="Neues Spiel"
                onPress={() => {
                  if (isGameRunning && !isGameComplete) {
                    Alert.alert(
                      "Neues Spiel starten?",
                      "Das aktuelle Spiel wird beendet.",
                      [
                        {
                          text: "Abbrechen",
                          style: "cancel",
                        },
                        {
                          text: "Neu starten",
                          onPress: startNewGame,
                        },
                      ]
                    );
                  } else {
                    startNewGame();
                  }
                }}
                variant="primary"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GameScreen;
