import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/utils/theme/ThemeProvider";
import { useAlert } from "@/components/CustomAlert/AlertProvider";
import { quitGameAlert } from "@/components/CustomAlert/AlertHelpers";

// Game logic imports
import {
  SudokuBoard as SudokuBoardType,
  Difficulty,
  generateGame,
  setCellValue,
  isValidPlacement,
  isBoardComplete,
} from "@/utils/sudoku";

// Components
import Header from "@/components/Header/Header";
import GameStatusBar from "@/components/GameStatusBar/GameStatusBar";
import { DuoBoard, DuoControls } from "../DuoScreen/components";

// Utilities and styles
import { triggerHaptic } from "@/utils/haptics";
import styles from "./DuoGameScreen.styles";

// Define the player areas (rows)
const PLAYER1_ROWS = [0, 1, 2, 3, 4]; // Top half + middle row (0-indexed)
const PLAYER2_ROWS = [4, 5, 6, 7, 8]; // Bottom half + middle row (0-indexed)
const SHARED_ROW = 4; // The middle row that both players share

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

  // Game state
  const [board, setBoard] = useState<SudokuBoardType>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Player state
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1); // 1 or 2
  const [player1Complete, setPlayer1Complete] = useState(false);
  const [player2Complete, setPlayer2Complete] = useState(false);
  const [player1Errors, setPlayer1Errors] = useState(0);
  const [player2Errors, setPlayer2Errors] = useState(0);
  const MAX_ERRORS = 3;

  // Selected cells for each player
  const [player1Cell, setPlayer1Cell] = useState<{row: number, col: number} | null>(null);
  const [player2Cell, setPlayer2Cell] = useState<{row: number, col: number} | null>(null);

  // Calculate player areas (cells)
  const computePlayerAreas = () => {
    const player1Area: { row: number, col: number }[] = [];
    const player2Area: { row: number, col: number }[] = [];

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        // Special case for the middle row
        if (row === SHARED_ROW) {
          if (col < 4) {
            player1Area.push({ row, col });
          } else if (col > 4) {
            player2Area.push({ row, col });
          }
          // Skip the middle cell (row 4, col 4)
        } else if (PLAYER1_ROWS.includes(row) && row !== SHARED_ROW) {
          player1Area.push({ row, col });
        } else if (PLAYER2_ROWS.includes(row) && row !== SHARED_ROW) {
          player2Area.push({ row, col });
        }
      }
    }

    return { player1Area, player2Area };
  };

  const { player1Area, player2Area } = computePlayerAreas();

  // Initialize the game
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

  // Check player completion status
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
        const { board: newBoard, solution: newSolution } = generateGame(difficulty);

        // Force the middle cell (row 4, col 4) to be pre-filled
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
        setGameTime(0);
        setIsLoading(false);
        
        // Reset player state
        setCurrentPlayer(1);
        setPlayer1Complete(false);
        setPlayer2Complete(false);
        setPlayer1Errors(0);
        setPlayer2Errors(0);
        setPlayer1Cell(null);
        setPlayer2Cell(null);

        // Haptic feedback
        triggerHaptic("medium");
      } catch (error) {
        console.error("Error starting new game:", error);
        setIsLoading(false);
        Alert.alert("Error", "Failed to generate game");
      }
    }, 500);
  };

  // Handle back button press
  const handleBackPress = () => {
    if (isGameRunning) {
      showAlert(
        quitGameAlert(
          () => router.replace("/duo"), // Navigate back to duo screen
          undefined // Default cancel behavior
        )
      );
      return true;
    }
    return false;
  };

  // Handle cell press
  const handleCellPress = (player: 1 | 2, row: number, col: number) => {
    if (player !== currentPlayer || !isGameRunning) return;
    
    triggerHaptic("light");
    
    if (player === 1) {
      setPlayer1Cell({ row, col });
      setPlayer2Cell(null);
    } else {
      setPlayer2Cell({ row, col });
      setPlayer1Cell(null);
    }
  };

  // Handle number input
  const handleNumberInput = (player: 1 | 2, value: number) => {
    if (player !== currentPlayer || !isGameRunning) return;
    
    const selectedCell = player === 1 ? player1Cell : player2Cell;
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    
    // Check if cell is initial
    if (board[row][col].isInitial) {
      triggerHaptic("error");
      return;
    }
    
    // Check if the move is valid
    const isValid = isValidPlacement(
      board.map(row => row.map(cell => cell.value)),
      row,
      col,
      value
    );
    
    // Create a new board with the updated value
    const newBoard = [...board];
    newBoard[row][col] = {
      ...board[row][col],
      value: value,
      isValid: isValid,
    };
    
    setBoard(newBoard);
    
    // Handle validity
    if (!isValid) {
      triggerHaptic("error");
      if (player === 1) {
        setPlayer1Errors(prev => prev + 1);
        if (player1Errors + 1 >= MAX_ERRORS) {
          // Player 1 loses
          handlePlayerLose(1);
        }
      } else {
        setPlayer2Errors(prev => prev + 1);
        if (player2Errors + 1 >= MAX_ERRORS) {
          // Player 2 loses
          handlePlayerLose(2);
        }
      }
    } else {
      triggerHaptic("medium");
      
      // Switch to other player
      setCurrentPlayer(player === 1 ? 2 : 1);
      
      // Clear selected cell
      if (player === 1) {
        setPlayer1Cell(null);
      } else {
        setPlayer2Cell(null);
      }
    }
  };

  // Check if a player has completed their area
  const checkPlayerCompletion = () => {
    if (board.length === 0) return;
    
    // Check player 1 area
    let p1Complete = true;
    for (const { row, col } of player1Area) {
      if (board[row][col].value === 0 || !board[row][col].isValid) {
        p1Complete = false;
        break;
      }
    }
    
    // Check player 2 area
    let p2Complete = true;
    for (const { row, col } of player2Area) {
      if (board[row][col].value === 0 || !board[row][col].isValid) {
        p2Complete = false;
        break;
      }
    }
    
    // Update completion status
    if (p1Complete !== player1Complete) {
      setPlayer1Complete(p1Complete);
      if (p1Complete) {
        handlePlayerWin(1);
      }
    }
    
    if (p2Complete !== player2Complete) {
      setPlayer2Complete(p2Complete);
      if (p2Complete) {
        handlePlayerWin(2);
      }
    }
    
    // Check if both players are done
    if (p1Complete && p2Complete) {
      handleGameComplete();
    }
  };

  // Handle player win
  const handlePlayerWin = (player: 1 | 2) => {
    triggerHaptic("success");
    
    // Only show alert if the other player hasn't won yet
    if (player === 1 && !player2Complete) {
      Alert.alert(
        "Spieler 1 hat gewonnen!",
        "Spieler 1 hat seinen Bereich zuerst gelöst.",
        [{ text: "Weiter spielen" }]
      );
    } else if (player === 2 && !player1Complete) {
      Alert.alert(
        "Spieler 2 hat gewonnen!",
        "Spieler 2 hat seinen Bereich zuerst gelöst.",
        [{ text: "Weiter spielen" }]
      );
    }
  };

  // Handle player lose
  const handlePlayerLose = (player: 1 | 2) => {
    triggerHaptic("error");
    
    Alert.alert(
      `Spieler ${player} hat verloren!`,
      `Spieler ${player} hat zu viele Fehler gemacht.`,
      [
        {
          text: "Neues Spiel",
          onPress: startNewGame,
        },
        {
          text: "Zum Menü",
          onPress: () => router.replace("/duo"),
        },
      ]
    );
  };

  // Handle game completion
  const handleGameComplete = () => {
    setIsGameRunning(false);
    
    triggerHaptic("success");
    
    setTimeout(() => {
      Alert.alert(
        "Spiel beendet!",
        "Beide Spieler haben ihre Bereiche erfolgreich gelöst.",
        [
          {
            text: "Neues Spiel",
            onPress: startNewGame,
          },
          {
            text: "Zum Menü",
            onPress: () => router.replace("/duo"),
          },
        ]
      );
    }, 500);
  };

  // Update timer
  const handleTimeUpdate = (time: number) => {
    setGameTime(time);
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
              Duo Spiel wird geladen...
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
        <Header
          title="Sudoku Duo"
          subtitle={`Schwierigkeit: ${
            difficulty === "easy" ? "Leicht" :
            difficulty === "medium" ? "Mittel" :
            difficulty === "hard" ? "Schwer" : "Experte"
          }`}
          onBackPress={() => showAlert(
            quitGameAlert(
              () => router.replace("/duo"),
              undefined
            )
          )}
        />
        
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 20) },
          ]}
        >
          <View style={styles.gameContainer}>
            {/* Game status bar */}
            <GameStatusBar
              isRunning={isGameRunning}
              initialTime={gameTime}
              onTimeUpdate={handleTimeUpdate}
              errorsRemaining={MAX_ERRORS - Math.max(player1Errors, player2Errors)}
              maxErrors={MAX_ERRORS}
            />
            
            {/* Player turn indicator */}
            <View style={styles.turnIndicator}>
              <Text style={[styles.turnText, { color: colors.textPrimary }]}>
                {player1Complete && player2Complete
                  ? "Spiel beendet"
                  : `Spieler ${currentPlayer} ist am Zug`}
              </Text>
            </View>
            
            {/* Duo board */}
            <DuoBoard
              board={board}
              player1Area={player1Area}
              player2Area={player2Area}
              isLoading={isLoading}
              onCellPress={handleCellPress}
              player1Cell={player1Cell}
              player2Cell={player2Cell}
              currentPlayer={currentPlayer}
            />
            
            {/* Duo controls */}
            <DuoControls
              onPlayer1Input={(number: number) => handleNumberInput(1, number)}
              onPlayer2Input={(number: number) => handleNumberInput(2, number)}
              player1Complete={player1Complete}
              player2Complete={player2Complete}
              currentPlayer={currentPlayer}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default DuoGameScreen;