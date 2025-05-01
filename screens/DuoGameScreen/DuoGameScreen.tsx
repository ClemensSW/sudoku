// screens/DuoGameScreen/DuoGameScreen.tsx
import React, { useEffect, useState } from "react";
import { View, BackHandler, StyleSheet, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";

import { useTheme } from "@/utils/theme/ThemeProvider";
import { useAlert } from "@/components/CustomAlert/AlertProvider";
import { quitGameAlert } from "@/components/CustomAlert/AlertHelpers";
import { useNavigationControl } from "@/app/_layout";

// Duo Game Components
import DuoGameBoard from "./components/DuoGameBoard";
import DuoGameControls from "./components/DuoGameControls";
import DuoGameCompletionModal from "./components/DuoGameCompletionModal";
import Timer from "@/components/Timer/Timer"; // Import Timer directly

// Game Logic
import { useDuoGameState } from "./hooks/useDuoGameState";
import { Difficulty } from "@/utils/sudoku";

// Constants
const MAX_HINTS = 3;

interface DuoGameScreenProps {
  initialDifficulty?: Difficulty;
}

const DuoGameScreen: React.FC<DuoGameScreenProps> = ({
  initialDifficulty = "medium",
}) => {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  const { showAlert } = useAlert();
  const { setHideBottomNav } = useNavigationControl();

  // States für das Completion Modal
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [winnerInfo, setWinnerInfo] = useState<{
    winner: 0 | 1 | 2;
    reason: "completion" | "errors";
  }>({
    winner: 0,
    reason: "completion",
  });

  // Callback für Spielende
  const handleGameComplete = (
    winner: 0 | 1 | 2,
    reason: "completion" | "errors"
  ) => {
    setWinnerInfo({ winner, reason });
    setTimeout(() => {
      setShowCompletionModal(true);
    }, 800);
  };

  // Use the duo game state hook with completion callback
  const [gameState, gameActions] = useDuoGameState(
    initialDifficulty,
    () => {
      router.replace("/duo");
    },
    handleGameComplete
  );

  // Start a new game on mount
  useEffect(() => {
    gameActions.startNewGame();
  }, []);

  // Hide navigation when component mounts
  useEffect(() => {
    setHideBottomNav(true);
    
    // Clean up when component unmounts
    return () => {
      setHideBottomNav(false);
    };
  }, []);

  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (gameState.isGameRunning && !gameState.isGameComplete) {
          showAlert(
            quitGameAlert(() => {
              router.replace("/duo");
            })
          );
          return true; // Prevents default back action
        }
        return false; // Allow default back action
      }
    );

    return () => backHandler.remove();
  }, [gameState.isGameRunning, gameState.isGameComplete]);

  // Handle back navigation
  const handleBackPress = () => {
    if (gameState.isGameRunning && !gameState.isGameComplete) {
      showAlert(
        quitGameAlert(() => {
          router.replace("/duo");
        })
      );
    } else {
      router.replace("/duo");
    }
  };

  // NEU: Spezifische Handler für die Aktionen im Completion Modal
  const handleCloseCompletionModal = () => {
    setShowCompletionModal(false);
    router.replace("/duo");
  };

  // NEU: Handler für neues Spiel ohne Navigation
  const handleStartNewGame = () => {
    setShowCompletionModal(false);
    gameActions.startNewGame();
  };

  // NEU: Spezifischer Handler für Revanche
  const handleRevanche = () => {
    setShowCompletionModal(false);
    
    // Kleine Verzögerung für bessere Animation
    setTimeout(() => {
      router.replace({
        pathname: "/duo-game",
        params: { difficulty: initialDifficulty }
      });
    }, 200);
  };

  // Einheitliches Schatten-System
  const buttonShadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.isDark ? 0.3 : 0.15,
    shadowRadius: 3,
    elevation: 4,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} hidden={true} />

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        {/* Verbesserter Zurück-Button */}
        <TouchableOpacity 
          style={[
            styles.backButton, 
            { 
              backgroundColor: theme.isDark 
                ? "rgba(255,255,255,0.25)" 
                : colors.surface,
            },
            buttonShadow,
          ]}
          onPress={handleBackPress}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Feather 
            name="chevron-left" 
            size={24} 
            color={theme.isDark ? "#FFFFFF" : colors.primary}
          />
        </TouchableOpacity>

        {/* Hidden Timer component to track game time */}
        <View style={styles.hiddenTimer}>
          <Timer
            isRunning={gameState.isGameRunning}
            initialTime={gameState.gameTime}
            onTimeUpdate={gameActions.handleTimeUpdate}
          />
        </View>

        {/* Main content */}
        <Animated.View
          style={styles.content}
          entering={FadeIn.delay(200).duration(500)}
        >
          {/* Player 2 Controls (Top) */}
          <DuoGameControls
            position="top"
            onNumberPress={gameActions.handleNumberPress}
            onNoteToggle={gameActions.handleNoteToggle}
            onHint={gameActions.handleHint}
            noteMode={gameState.player2NoteMode}
            disabled={gameState.player2Complete || gameState.player2Errors >= gameState.maxErrors}
            hintsRemaining={gameState.player2Hints}
            errorsCount={gameState.player2Errors}
            maxErrors={gameState.maxErrors}
          />

          {/* Game Board */}
          <DuoGameBoard
            board={gameState.board}
            player1Cell={gameState.player1Cell}
            player2Cell={gameState.player2Cell}
            getCellOwner={gameActions.getCellOwner}
            onCellPress={gameActions.handleCellPress}
            isLoading={gameState.isLoading}
          />

          {/* Player 1 Controls (Bottom) */}
          <DuoGameControls
            position="bottom"
            onNumberPress={gameActions.handleNumberPress}
            onNoteToggle={gameActions.handleNoteToggle}
            onHint={gameActions.handleHint}
            noteMode={gameState.player1NoteMode}
            disabled={gameState.player1Complete || gameState.player1Errors >= gameState.maxErrors}
            hintsRemaining={gameState.player1Hints}
            errorsCount={gameState.player1Errors}
            maxErrors={gameState.maxErrors}
          />
        </Animated.View>

        {/* Game Completion Modal - KOMPLETT NEU: Übergebe eigene Funktionen für jede Aktion */}
        <DuoGameCompletionModal
          visible={showCompletionModal}
          onClose={handleCloseCompletionModal}
          onNewGame={handleStartNewGame}
          onRevanche={handleRevanche} // NEU: Spezielle Revanche-Funktion
          winner={winnerInfo.winner}
          winReason={winnerInfo.reason}
          gameTime={gameState.gameTime}
          player1Complete={gameState.player1Complete}
          player2Complete={gameState.player2Complete}
          player1Errors={gameState.player1Errors}
          player2Errors={gameState.player2Errors}
          player1Hints={MAX_HINTS - gameState.player1Hints}
          player2Hints={MAX_HINTS - gameState.player2Hints}
          maxHints={MAX_HINTS}
          maxErrors={gameState.maxErrors}
          currentDifficulty={initialDifficulty}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 8,
    paddingTop: 16,
    justifyContent: "space-between",
  },
  backButton: {
    position: "absolute",
    top: 8,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  hiddenTimer: {
    position: "absolute",
    top: -1000,
    opacity: 0,
    height: 1,
    width: 1,
  }
});

export default DuoGameScreen;